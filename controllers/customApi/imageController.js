// const Image = require('../../models/userImage.model.js');
const userModel = require('../../models/user.models.js');
const moment = require('moment');
const path = require('path');

class userImage {
  // static storeImageUrl = async (req, res) => {
  //   const { imageUrl } = req.body;

  //   if (!imageUrl) {
  //     return res.status(400).json({
  //       error: true,
  //       message: 'Image URL is required.',
  //       data: null,
  //     });
  //   }
  //   //const imageUrl = `/uploads/${file.filename}`;

  //   const customerRefNo = req.user._id.toString();
  //   try {
  //     const newImage = new Image({ imageUrl,customerRefNo });
  //     const savedImage = await newImage.save();
     
  //     // Include the MongoDB _id field in the response
  //     return res.status(200).json({
  //       error: false,
  //       message: 'Image uploaded Successfully!',
  //       data: [savedImage]
  //     });
  //   } catch (err) {
  //     console.error(err);
  //     return res.status(500).json({ error: 'Error saving image URL to MongoDB.' });
  //   }
  // };

//upload userImage in the server using multer withouttimestamp

// static storeImageUrl = async (req, res) => {
//   const file = req.file;
//   console.log('file',file)
// // const file = req.body;

//   if (!file) {
//     return res.status(400).json({
//       error: true,
//       message: 'No file uploaded.',
//       data: null,
//     });
//   }

//   // Construct the file path
//   const imageUrl = `/uploads/${file.filename}`;

//   // Now you can use the imageUrl in your controller logic
//   const customerRefNo = req.user._id.toString();
//   try {
//     const newImage = await userModel.findOneAndUpdate({ _id:customerRefNo },{ imageUrl},{new:true} );
    

//     return res.status(200).json({
//       error: false,
//       message: 'Image uploaded successfully!',
//       data: [newImage],
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Error saving image URL to MongoDB.' });
//   }
// };


//withTimestamp
static storeImageUrl = async (req, res) => {
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
  const timestamp = moment().format('YYYYMMDD_HHmmss');
  const filename = `${customerRefNo}${extension}`;

  // Update the filename property of the file object
  file.filename = filename;

  // Construct the file path
  const imageUrl = `/userImages/${filename}`;

  try {
    const newImage = await userModel.findOneAndUpdate({ _id: customerRefNo }, { imageUrl }, { new: true });

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


//getImage

// static getImage= async (req, res) => {
//   const customerRefNo = req.user._id.toString();
//   try {
    

//     // Fetch the image from MongoDB based on the provided imageId
//     const image = await Image.findOne({customerRefNo});

//     if (!image) {
//       return res.status(404).json({
//         error: true,
//         message: 'Image not found.',
//         data: null,
//       });
//     }

//     return res.status(200).json({
//       error: false,
//       message: 'Image retrieved successfully!',
//       data: [image]
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Error fetching image URL from MongoDB.' });
//   }
// };

//getImageServer
static getImage= async (req, res) => {
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
      data: [{imageUrl:file.imageUrl,customerRefNo}]
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error fetching image URL from MongoDB.' });
  }
};

  //updateimage
  // static updateImage = async (req, res) => {
   
  //    const { imageUrl } = req.body;
  //   const customerRefNo = req.user._id.toString();
  //   try {

  //     const updatedImage = await userModel.findOneAndUpdate( { customerRefNo  }, { imageUrl }, { new: true });

  //     if (!updatedImage) {
  //       return res.status(404).json({
  //         error: true,
  //         message: 'Image not found.',
  //         data: null,
  //       });
  //     }

  //     return res.status(200).json({
  //       error: false,
  //       message: 'Image updated successfully!',
  //       data: [updatedImage]
  //     });
  //   } catch (err) {
  //     console.error(err);
  //     return res.status(500).json({ error: 'Error updating image in MongoDB.' });
  //   }
  // };
}

module.exports = userImage;
