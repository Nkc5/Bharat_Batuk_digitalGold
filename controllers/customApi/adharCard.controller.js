// const Image = require('../../models/userImage.model.js');
const userModel = require('../../models/user.models.js');
const moment = require('moment');
const path = require('path');

class adharImage {
  

//withTimestamp

static adharImageUrl = async (req, res) => {
  const customerRefNo = req.user._id.toString();
  const file = req.file;
  //const file = req.body;
  if (!file) {
    return res.status(400).json({
      error: true,
      message: 'No file uploaded.',
      data: null,
    });
  }

  const extension = path.extname(file.originalname)
  console.log("extension",extension)

  // Generate a unique filename using the current timestamp
  var timestamp = moment().format('YYYYMMDD_HHmmss');
  const filename = req.filename;
  console.log("filename",filename)
  


  // Update the filename property of the file object
  file.filename = filename;

  // Construct the file path
  const adharUrl = `/adharImages/${filename}`;
  const adharBackUrl = `/adharImages/${filename}`;
  // const adharBackUrl = `/adharImages/${filename}`;
  // const adharBackUrl = `back_${customerRefNo}${extension}`;
  console.log("adharUrl",adharUrl)
  // console.log("backUrl",adharBackUrl)
  // console.log("adharBackUrl",adharBackUrl)

  try {
    if (filename.startsWith('back_')) {
      var newImage = await userModel.findOneAndUpdate({ _id: customerRefNo }, { adharBackUrl }, { new: true });
      console.log("newImage",newImage)
  

    }else{

      var newImage = await userModel.findOneAndUpdate({ _id: customerRefNo }, { adharUrl }, { new: true });
      console.log("newImage",newImage)
  
    }
   
    return res.status(200).json({
      error: false,
      message: 'Image uploaded successfully!',
      data: [newImage],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
       error: true,
       message: err.message,
       data: [],

       });
  }
};





//getImageServer
static adhargetImage= async (req, res) => {
  const customerRefNo = req.user._id.toString();
  try {
    

    // Fetch the image from MongoDB based on the provided imageId
    console.log("Fetching image for customerRefNo:",customerRefNo);
    const file = await userModel.findOne({_id:customerRefNo});

    if (!file) {
      return res.status(404).json({
        error: true,
        message: 'Image not found.',
        data: null,
      });
    }
    console.log('Returning image.',file);
    return res.status(200).json({
      error: false,
      message: 'Image retrieved successfully!',
      data: [{kycImages:file.kycImages,customerRefNo}]
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error fetching image URL from MongoDB.' });
  }
};




// adhar back Image
static adharBackImageUrl = async (req, res) => {
  const customerRefNo = req.user._id.toString();
  const file = req.file;
  //const file = req.body;

  if (!file) {
    return res.status(400).json({
      error: true,
      message: 'No file uploaded.',
      data: null,
    });
  }

  const extension = path.extname(file.originalname)

  // Generate a unique filename using the current timestamp
  const filename = `back_${customerRefNo}${extension}`;

  // Update the filename property of the file object
  file.filename = filename;

  // Construct the file path
  const adharBackUrl = `/adharImages/${filename}`;

  try {
    const newImage = await userModel.findOneAndUpdate({ _id: customerRefNo }, { adharBackUrl }, { new: true });

    return res.status(200).json({
      error: false,
      message: 'Image uploaded successfully!',
      data: [newImage],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
       error: true,
       message: err.message,
       data: [],

       });
  }
};





//getImageServer
static adhargetBackImage= async (req, res) => {
  const customerRefNo = req.user._id.toString();
  try {
    

    // Fetch the image from MongoDB based on the provided imageId
    console.log("Fetching image for customerRefNo:",customerRefNo);
    const file = await userModel.findOne({_id:customerRefNo});

    if (!file) {
      return res.status(404).json({
        error: true,
        message: 'Image not found.',
        data: null,
      });
    }
    console.log('Returning image.',file);
    return res.status(200).json({
      error: false,
      message: 'Image retrieved successfully!',
      data: [{adharBackUrl:file.adharBackUrl}]
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error fetching image URL from MongoDB.' });
  }
};

  
}

module.exports = adharImage;
