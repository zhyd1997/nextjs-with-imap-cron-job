const Imap = require('imap')
const inspect = require('util').inspect

const imapEmail = process.env.IMAP_EMAIL
const imapPassword = process.env.IMAP_PASSWORD

// This function can run for a maximum of 300 seconds
export const config = {
  maxDuration: 300,
};

// Configure IMAP server settings
const imapConfig = {
    user: imapEmail,
    password: imapPassword,
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    tlsOptions: {
        rejectUnauthorized: false, // Ignore self-signed certificate errors
    },
    socketOptions: {
        servername: 'imap.gmail.com', // Hostname to match the certificate
    },
}

const handler = async (req, res) => {
    const imap = new Imap(imapConfig)
    function openInbox(cb) {
        imap.openBox('INBOX', true, cb);
    }

    imap.once('ready', function() {
        openInbox(function(err, box) {
            if (err) throw err;
            var f = imap.seq.fetch('1:3', {
                bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
                struct: true
            });
            f.on('message', function(msg, seqno) {
                console.log('Message #%d', seqno);
                var prefix = '(#' + seqno + ') ';
                msg.on('body', function(stream, info) {
                    var buffer = '';
                    stream.on('data', function(chunk) {
                        buffer += chunk.toString('utf8');
                    });
                    stream.once('end', function() {
                        console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
                    });
                });
                msg.once('attributes', function(attrs) {
                    console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
                });
                msg.once('end', function() {
                    console.log(prefix + 'Finished');
                });
            });
            f.once('error', function(err) {
                console.log('Fetch error: ' + err);
            });
            f.once('end', function() {
                console.log('Done fetching all messages!');
                imap.end();
            });
        });
    });

    imap.once('error', function(err) {
        console.log(err);
    });

    imap.once('end', function() {
        console.log('Connection ended');
        res.status(200).json({ message: 'Success' })
    });

    imap.connect()
}

export default handler
