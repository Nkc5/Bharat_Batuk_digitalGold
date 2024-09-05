
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const moment=require('moment')
const bodyParser = require('body-parser');
const fs = require('fs');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static(path.resolve(__dirname, 'public')));


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/adharImages');
  },
  filename: (req, file, cb) => {
    const customerRefNo = req.user._id.toString();
    const baseFolderPath = './public/adharImages'; // Base folder for storing images
    const extension = path.extname(file.originalname);
    let filename;

    // Check for "front" image existence
    const frontImagePath = path.join(baseFolderPath, `${customerRefNo}${extension}`);
    const backImagePath = path.join(baseFolderPath, `back_${customerRefNo}${extension}`);
    if (fs.existsSync(frontImagePath)) {
      if (fs.existsSync(backImagePath)){
        return response.json("Adhar Already Uploaded")
      }
      
      // If "front" image exists, prepare filename for "back" image
      filename = `back_${customerRefNo}${extension}`;
      console.log("Back image filename:", filename);
    } else {
      // If "front" image does not exist, it's assumed to be the "front" image being uploaded
      filename = `${customerRefNo}${extension}`;
      console.log("Front image filename:", filename);
    }

    req.filename = filename; // Store filename in request for later use
    cb(null, filename); // Proceed with this filename
  }
});

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, './public/adharImages');
//   },
//   filename: (req, file, cb) => {
//     console.log("req.user", req.user)
//     const customerRefNo = req.user._id.toString();
    
//     const folderPath = `public/adharImages/back_${customerRefNo}`;
//     var filename;




//     console.log("customerRefNo", customerRefNo)
//     // const timestamp = Date.now(); // Use the current timestamp
//     // const originalname = path.parse(file.originalname).name; // Extract the filename without extension
//     var extension = path.extname(file.originalname); 
    
//     if (!fs.existsSync(folderPath)) {
//       filename = `${customerRefNo}${extension}`;
//       console.log("front",filename)
//  }
//  else{
//    filename = `back_${customerRefNo}${extension}`;
//    console.log("back",filename)
//  }

//     // Extract the file extension
//     var timestamp = moment().format('YYYYMMDD_HHmmss');
//     console.log("filename", filename)
//     req.filename= filename;
//     cb(null, filename);
//   },
// });


const upload = multer({ storage: storage });


// const employeeController=require('../../controllers/customApi/employeeController.js')
const adharImage = require('../../controllers/customApi/adharCard.controller.js');
// user.post('/importuser',upload.single('file'),employeeController.importUser)
// user.get('/userFind',employeeController.findData)
router.post('/adharImageUrl',upload.single('file'),adharImage.adharImageUrl)
router.post('/adharBackImageUrl',upload.single('file'),adharImage.adharBackImageUrl)
// router.post('/storeImageUrl', userImage.storeImageUrl);

router.get('/getImage', adharImage.adhargetImage);


module.exports=router;





















