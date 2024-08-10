import multer from "multer";

import dotenv from "dotenv";
dotenv.config();

const storage = multer.diskStorage({
  destination: function (req, file, cb) { 
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const date = new Date();
    const fileName = file.originalname.split(".");
    cb(null, `${fileName[0]}-${date.getTime()}.${fileName[1]}`);
  },
});

export const upload = multer({
  storage: storage,
});
