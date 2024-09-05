const express = require('express');
const multer = require('multer');
const path = require('path');
const excel = require('exceljs');
const { DynamicModel } = require('../../models/employee.models.js'); // Adjust the path accordingly



class multerClass {

    // Set up Multer to store uploaded files in the 'uploads' directory

    static async multerUpload(req, res) {

        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'uploads'); // Save files in the 'uploads' directory
            },
            filename: function (req, file, cb) {
                cb(null, file.originalname); // Use the original file name
            }
        });




        const upload = multer({ storage: storage }).single('excelFile');

        console.log("upload", upload);

        // Invoke the middleware to process the file upload
        upload(req, res, function (err) {
            if (err) {
                return res.status(500).json({ error: 'File upload failed', details: err.message });
            }

            // Access the uploaded file using req.file
            const filePath = req.file.path;

            res.send(filePath);
            
            setTimeout(() => {
                multerClass.excelToDB();
            }, 5000)

            return; 
        });
    }



    static async excelToDB() {

        // importData.js

        const workbook = new excel.Workbook();
        const filePath = path.resolve(__dirname, 'uploads', 'empl.xlsx')

        workbook.xlsx.readFile(filePath).then(() => {
            const worksheet = workbook.getWorksheet(1);

            const headers = worksheet.getRow(1).values;

            worksheet.eachRow({ includeEmpty: true, skipHeader: true }, (row, rowNumber) => {
                const rowData = row.values.reduce((data, value, index) => {
                    const columnName = headers[index];
                    data[columnName] = value;
                    return data;
                }, {});

                // Create a new document using the DynamicModel
                const newEmployee = new DynamicModel(rowData);

                newEmployee.save()
                    .then(() => console.log(`Row ${rowNumber} saved to MongoDB`))
                    .catch((error) => console.error(`Error saving row ${rowNumber}: ${error.message}`));
            });
        });



    }


}


module.exports = multerClass;