
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static(path.resolve(__dirname, 'public')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/kycImages');
  },
  filename: (req, file, cb) => {
    console.log("req.user", req.user)
    const customerRefNo = req.user._id.toString();
    

    console.log("customerRefNo", customerRefNo)
    // const timestamp = Date.now(); // Use the current timestamp
    // const originalname = path.parse(file.originalname).name; // Extract the filename without extension
    const extension = path.extname(file.originalname); // Extract the file extension
    const filename = `${customerRefNo}${extension}`;
    console.log("filename", filename)
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });


// const employeeController=require('../../controllers/customApi/employeeController.js')
// // user.post('/importuser',upload.single('file'),employeeController.importUser)
// // user.get('/userFind',employeeController.findData)
// router.post('/kycImageUrl',upload.single('file'),kycImage.kycImageUrl)
// //router.post('/storeImageUrl', userImage.storeImageUrl);

// router.get('/getImage', kycImage.kycgetImage);


// //kyc details
// router.route('/details')
//   .get(kycImage.kycDetails)
//   .post(kycImage.kycDetails, kycImage.afterKYC);

const kycImage = require('../../controllers/customApi/kyc.controller.js');

const kyc = new kycImage();
router.post('/pan', kyc.panDetails);
router.post('/adhar', kyc.adharDetails);
router.post('/bank', kyc.bankDetails);
router.get('/getDetails', kyc.getKycDetails);
router.get('/replaceSpaceWithUnderscore', kyc.replaceSpaceWithUnderscore);

module.exports=router;





















