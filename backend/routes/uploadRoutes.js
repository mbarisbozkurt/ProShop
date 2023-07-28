import path from "path"
import multer from "multer";
import express from "express";

const router = express.Router();

//no need to know the details, just use it 

const storage = multer.diskStorage({

  //where the image will go
  destination(req, file, cb){ //cb: callback
    cb(null, "uploads/");
  },

  filename(req, file, cb){
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
})

function checkFileType(file, cb){
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if(extname && mimetype){
    return cb(null, true);
  }else{
    cb("Images only!");
  }
}

const upload = multer({
  storage,
})


//image will be submitted to this route
router.post("/", upload.single("image"), (req, res) => {
  res.send({
    message: "Image uploaded!", 
    image: `/${req.file.path}` 
  })
})

export default router;
