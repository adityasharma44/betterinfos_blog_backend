import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPaths = {
      ebooksImage: "uploads/ebooksImage",
      appEbookImage: "uploads/ebooksImage/appEbookImage",
      ebooksPdf: "uploads/ebooksPdf",
      audioFile: "uploads/audioFile",
      audioImage: "uploads/audioImage",
      songImage: "uploads/songImage",
      podcastThumbnail: "uploads/podcastThumbnail",
      video: "uploads/video",
      videoThumbnail: "uploads/videoThumbnail",
      videoAppThumbnail: "uploads/videoThumbnail/videoAppThumbnail",
      courseAppThumbnail: "uploads/courseThumbnail/courseAppThumbnail",
      featureImage: "uploads/courseThumbnail/featureImage",
      homeBanner: "uploads/homeBanner",
    };
    const uploadPath =
      uploadPaths[file.fieldname] ||
      path.join("uploads", req.params.fileCategory);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileExtensionFilter = (req, file, cb) => {
  const allowedMimetypes = [
    "application/pdf",
    "video/mp4",
    "audio/mpeg",
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
  ];
  if (allowedMimetypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only PDF, MP3, JPG, PNG, JPEG, and WebP files are allowed!"),
      false
    );
  }
};

const imgUpload = multer({
  storage,
  fileFilter: fileExtensionFilter,
  limits: { fileSize: 1024 * 1024 * 1024 }, // 1GB file size limit
});

export const uploadFile = (req, res, next) => {
  const upload = imgUpload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "sliderImages", maxCount: 10 },
    { name: "dailyThoughts", maxCount: 10 },
    { name: "ebooksImage", maxCount: 1 },
    { name: "ebooksPdf", maxCount: 1 },
    { name: "articleImage", maxCount: 1 },
    { name: "eventImage", maxCount: 1 },
    { name: "audioImage", maxCount: 1 },
    { name: "audioFile", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "videoThumbnail", maxCount: 1 },
    { name: "videoAppThumbnail", maxCount: 1 },
    { name: "courseThumbnail", maxCount: 1 },
    { name: "songImage", maxCount: 1 },
    { name: "suvicharImage", maxCount: 1 },
    { name: "storyImage", maxCount: 1 },
    { name: "podcastThumbnail", maxCount: 1 },
    { name: "liveImage", maxCount: 1 },
    { name: "appEbookImage", maxCount: 1 },
    { name: "courseAppThumbnail", maxCount: 1 },
    { name: "homeBanner", maxCount: 1 },
    { name: "featureImage", maxCount: 10 },
  ]);
  upload(req, res, async (err) => {
    if (err) return next(err);
    next();
  });
};
