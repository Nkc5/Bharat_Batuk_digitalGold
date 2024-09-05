
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const moment=require('moment')
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static(path.resolve(__dirname, 'public')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/adharImages');
  },
  filename: (req, file, cb) => {
    console.log("req.user", req.user)
    const customerRefNo = req.user._id.toString();
    

    console.log("customerRefNo", customerRefNo)
    const extension = path.extname(file.originalname); 
    // Extract the file extension
    const filename = `back_${customerRefNo}${extension}`;
    console.log("filename", filename)
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });



const adharImage = require('../../controllers/customApi/adharCard.controller.js');

router.post('/adharBackImageUrl',upload.single('file'),adharImage.adharBackImageUrl)
router.get('/getBackImage', adharImage.adhargetBackImage);


module.exports=router;





















