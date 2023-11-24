export const extractPdfTextInNodejsEnv = async (pdfUrl) => {
    try {
      const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf')
  
      const pdf = await pdfjsLib.getDocument(pdfUrl).promise
      // Note: worker is needed, or it will throw the error:
      // Setting up fake worker failed: "Cannot read properties of undefined (reading 'WorkerMessageHandler')".
      const workerSrc = await import('pdfjs-dist/legacy/build/pdf.worker.entry')
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc
  
      const totalPageCount = pdf.numPages
  
      const countPromises = Array.from(
        { length: totalPageCount },
        (_, i) => i + 1
      ).map(async (_, index) => {
        const currentPage = index + 1
        const page = await pdf.getPage(currentPage)
  
        const textContent = await page.getTextContent()
        const content = textContent.items
          .map((item) => ('str' in item ? item.str : ''))
          .join(' ')
  
        return content
      })
  
      const texts = await Promise.all(countPromises)
      const parsedText = texts.join(' ')
  
      return parsedText
    } catch (e) {
      console.error(e)
      throw e
    }
  }
  