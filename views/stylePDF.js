const PDFDocument = require('pdfkit');
const fs = require('fs');



 // Function to save PDF content to a file
 function savePDFToFile(pdfContent, pdfPath) {
    const stream = fs.createWriteStream(pdfPath);
    pdfContent.pipe(stream);
    return new Promise((resolve, reject) => {
        stream.on('finish', () => resolve());
        stream.on('error', (error) => reject(error));
        pdfContent.end();
    });
}


function createStyledPDF(data) {
    const doc = new PDFDocument();

    // Add your custom styling and content here
    doc.font('Helvetica-Bold').fontSize(20).text('Bharat Batuk', { align: 'center' });

    doc.moveDown();
    doc.font('Helvetica').fontSize(14).text('Digital Gold Purchase Details', { align: 'center' });

    // Dynamically add data fields to the PDF
    doc.moveDown();
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            if (typeof data[key] === 'object') {
                // Handle nested objects
                doc.fontSize(12).text(`${key}:`);
                for (const nestedKey in data[key]) {
                    if (data[key].hasOwnProperty(nestedKey)) {
                        doc.fontSize(12).text(`  ${nestedKey}: ${data[key][nestedKey]}`);
                    }
                }
            } else {
                // Handle regular key-value pairs
                doc.fontSize(12).text(`${key}: ${data[key]}`);
            }
    }
}

    return doc;
}


module.exports = {createStyledPDF, savePDFToFile};