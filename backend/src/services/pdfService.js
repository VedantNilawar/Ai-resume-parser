import pdfParse from 'pdf-parse';

/**
 * Extracts and normalizes text from a resume PDF buffer.
 * @param {Buffer|Uint8Array} buffer - Raw file buffer from multer
 * @returns {Promise<{ text: string, numPages: number, characterCount: number }>}
 */
export async function extractTextFromPDF(buffer) {
  if (!buffer || buffer.length === 0) {
    const error = new Error('The uploaded PDF buffer is empty.');
    error.statusCode = 400;
    throw error;
  }

  try {
    // In Node.js 20+, Node's Buffer pool can cause legacy PDF.js to read from offset 0.
    // Creating an isolated Uint8Array guarantees a clean, unpooled ArrayBuffer.
    const cleanUint8Array = new Uint8Array(buffer);

    const options = {
      max: 0
    };

    const data = await pdfParse(cleanUint8Array, options);

    const rawText = data.text || '';
    // Clean and normalize text
    const cleanedText = rawText
      .replace(/\r\n/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n\s*\n\s*\n+/g, '\n\n')
      .trim();

    if (!cleanedText || cleanedText.length < 20) {
      const error = new Error(
        'Unable to extract readable text from the PDF. It may be an image-only scan or password-protected. Please ensure your PDF contains selectable text.'
      );
      error.statusCode = 422;
      throw error;
    }

    return {
      text: cleanedText,
      numPages: data.numpages || 1,
      characterCount: cleanedText.length
    };
  } catch (err) {
    if (err.statusCode) {
      throw err;
    }
    const error = new Error(
      `Failed to parse PDF file: ${err.message || 'Unknown parsing error'}`
    );
    error.statusCode = 400;
    throw error;
  }
}
