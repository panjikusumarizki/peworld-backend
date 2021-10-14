

const multer = require('multer');
const {failed} = require('../helper/response')
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'src/img')
    },
    filename: (req, file, callback) => {
      const exstensi = file.originalname.split('.')
        callback(null, `${file.originalname}-${Date.now()}.${exstensi[1]}`);
    }
});

const upload = multer({
    storage,
    // Max 2 mb
    limits:{fileSize:2000000},
    fileFilter(req,file,callback) {
        if (file.originalname.match(/\.(JPG|jpg|JPEG|jpeg|png|PNG)\b/)) {
            callback(null,true)
        }else{
            callback('File must be of type jpeg,jpg or png', null)
        }
    }
});

module.exports = upload;
