const PDFDocument = require('pdfkit');

/**
 * Generates a PDF document from the given content and returns it as a binary buffer.
 * @param {string} content - The text content to be included in the PDF.
 * @returns {Promise<Buffer>} - A promise that resolves with the PDF data as a binary buffer.
 */
const generatePDF = (content) => {
    return new Promise((resolve, reject) => {
        // Create a new PDF document
        const doc = new PDFDocument();
        let buffers = [];

        // Collect data chunks as they are generated
        doc.on('data', (chunk) => buffers.push(chunk));

        // Once PDF generation is complete, concatenate all chunks to form the final binary data
        doc.on('end', () => {
            let pdfData = Buffer.concat(buffers);
            resolve(pdfData);
        });

        // Handle any errors during PDF generation
        doc.on('error', (err) => {
            reject(err);
        });

        // Add content to the document
        doc.fontSize(12).text(content, {
            align: 'left',
            width: 410
        });

        // Finalize the PDF, indicating we're finished writing to it
        doc.end();
    });
};

module.exports = { generatePDF };
