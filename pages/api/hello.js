import { extractPdfTextInNodejsEnv } from "../../test"

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
export default async function handler(req, res) {
  try {
    const text = await extractPdfTextInNodejsEnv('https://www-net.cs.umass.edu/wireshark-labs/Wireshark_Intro_v8.0.pdf')

    res.status(200).json({ text })
  } catch (error) {
    res.status(500).json({ error })
  }
}
