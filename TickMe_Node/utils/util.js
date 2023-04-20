const multer = require('multer');
const path = require('path');

function uploadImage(req, res, next) {
  // Define image storage directory and filename
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
      const name = req.body.name || 'default';
      const ext = path.extname(file.originalname);
      cb(null, name + '_header' + ext);
    }
  });

  // Define the upload middleware
  const upload = multer({ storage: storage }).single('avatar');

  // Call the upload middleware
  upload(req, res, function (err) {
    if (err) {
      return res.status(400).json({ message: 'Error uploading image' });
    }
    next();
  });
}

module.exports = {
  uploadImage
};