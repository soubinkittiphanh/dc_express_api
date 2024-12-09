const fileUpload = require('express-fileupload');

const uploadFile = (file) => {
    const response = {
        mti: '00',
        message: ''
    }
    if (!file || Object.keys(file).length === 0) {
        response.mti = '01'
        response.message = 'No files were uploaded.'
        return response;
    }

    // Access the uploaded file
    const myFile = file;

    // Move the file to a public directory
    file.mv(`/uploads/${myFile.name}`, (err) => {
        if (err) {
            response.mti = '01'
            response.message = err
            return response;
        }
        response.mti = '00'
        response.message = 'File uploaded!'
        return response;
    });
}