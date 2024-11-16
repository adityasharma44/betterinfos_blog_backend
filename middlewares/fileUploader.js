import cryptoRandomString from "crypto-random-string";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { fileCategory } = req.params;
    if (fileCategory) {
      const uploadPath = path.join("uploads", fileCategory);
      cb(null, uploadPath);
    } else {
      cb(null, "uploads");
    }
  },
  filename: function (req, file, cb) {
    cb(
      null,
      cryptoRandomString({ length: 10, type: "alphanumeric" }) +
        path.extname(file.originalname)
    );
  },
});

const fileExtensionFilter = (req, file, cb) => {
  if (
    // file.mimetype === "application/pdf" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpg .png .jpeg files are allowed!"), false);
  }
};

const imgUpload = multer({
  storage: storage,
  fileFilter: fileExtensionFilter,
  limits: {
    fileSize: 1024 * 1024 * 10, // 10MB file size limit
  },
});
 
const uploadFile = imgUpload.fields([
  { name: "profileImage", maxCount: 1 },
  { name: "blogImage", maxCount: 1 },
  // { name: "salesDocs", maxCount: 10 },
]);

export default uploadFile;
