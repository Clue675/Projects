const PDFDocument = require('pdfkit');
const fs = require('fs');

/**
 * Generates a PDF document with the given content.
 * @param {string} filename - The filename to save the PDF as.
 * @param {string} content - The content to include in the PDF.
 */
const generatePDF = (filename, content) => {
    return new Promise((resolve, reject) => {
        // Create a document
        const doc = new PDFDocument();

        // Pipe the PDF into a writable stream (e.g., a file)
        doc.pipe(fs.createWriteStream(filename));

        // Add content to the document
        doc.fontSize(12).text(content, {
            align: 'left',
            width: 410
        });

        // Finalize the PDF and end the stream
        doc.end();

        // Resolve the promise once the stream has finished
        doc.on('finish', () => {
            resolve(`PDF saved as ${filename}`);
        });

        // Reject the promise on error
        doc.on('error', (err) => {
            reject(err);
        });
    });
};

module.exports = { generatePDF };
