import { extractPdfTextInNodejsEnv } from "../../test"

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
export default async function handler(req, res) {
  try {
    const text = await extractPdfTextInNodejsEnv('/workspaces/nextjs-with-imap-cron-job/Sinwa PO (TP23162914) (2023-11-06 16.50.05).pdf')

    res.status(200).json({ text })
  } catch (error) {
    res.status(500).json({ error })
  }
}
