const express = require("express");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
var Storage = require("node-storage");
require('fs')
const connectDb = require("./config/connection");
const app = express();
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const http = require("http");

const { uploadall } = require("./helpers/filehelper");

// app.use(cors({credentials: true}));
app.use(cors());
// app.use(helmet());
var fs = require('fs');
var bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

const _dirname = path.resolve();
app.use("uploads", express.static(path.join(_dirname, "uploads")));

const multer = require("multer");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads");
  },
  filename(req, file, cb) {
    let myuid = uuidv4();
    cb(null, myuid + "." + file.mimetype.split("/")[1]);
 
  },
});
var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "video/webm" ||
      file.mimetype == "video/mp4" ||
      file.mimetype == "video/mav"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      // return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
      return cb(new Error("File is required"));
    }
  },
});

const storageVideo = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads");
  },
  filename(req, file, cb) {
    let myuid = uuidv4();
    cb(null, myuid + "." + file.mimetype.split("/")[1]);
    var myOptions = {
      videoFsName: `${myuid}.${file.mimetype.split("/")[1]}`
    };
    
    var data = JSON.stringify(myOptions);

    fs.writeFile('./config.json', data, function (err) {
      if (err) {
        console.log('There has been an error saving your configuration data.');
        console.log(err.message);
        return;
      }
      console.log('Configuration saved successfully.')
    });
  },
});


var uploadVideo = multer({
  storage: storageVideo,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "video/webm" ||
      file.mimetype == "video/mp4" ||
      file.mimetype == "video/mav"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      // return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
      return cb(new Error("File is required"));
    }
  },
});




const storageUpdateVideo = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads");
  },
  filename(req, file, cb) {
    let myuid = uuidv4();
    cb(null, myuid + "." + file.mimetype.split("/")[1]);
    var myOptions = {
      videoFsName: `${myuid}.${file.mimetype.split("/")[1]}`
    };
    var data = JSON.stringify(myOptions);
    fs.writeFile('./config.json', data, function (err) {
      if (err) {
        console.log('There has been an error saving your configuration data.');
        console.log(err.message);
        return;
      }
      console.log('Configuration saved successfully.')
    });
  },
});


var updatevideo = multer({
  storage: storageUpdateVideo,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "video/webm" ||
      file.mimetype == "video/mp4" ||
      file.mimetype == "video/mav"
    ) {
      cb(null, true);
      console.log("video played");
    } else {
      cb(null, false);
      // return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
      return cb(new Error("File is required"));
    }
  },
});

app.use("/uploads", express.static(path.join(_dirname, "uploads")));
// Admin Panel Login System API
let Authenticate = require("./routes/Autherize/autherize");
app.post("/register", Authenticate.register);
app.get("/verify-email", Authenticate.verifyEmail);
app.post("/authenticate", Authenticate.authenticate);
app.post("/forgot-password", Authenticate.forgotPassword);
app.post("/VerifyTokenforpass", Authenticate.verifyCode);
app.post("/resetpassword", Authenticate.resetPassword);
app.post("/getcurrentUser", Authenticate.currentUser);
// Vimeo Courses and All Videos Handlers API
let SiteCourses = require("./routes/Courses/Courses");
app.post("/addCourse", upload.single("image"), SiteCourses.addCourse);
app.get("/getCourse", SiteCourses.getCourse);
app.get("/getCourseByid", SiteCourses.getCourseByid);

app.post("/getCourseModules", SiteCourses.getCourseModules);
app.post("/deleteCourse", SiteCourses.deleteCourseById);
app.post("/updateCourse", upload.single("image"), SiteCourses.updateCourse);
app.get("/getCourseByid", SiteCourses.getCourseByid);

app.get("/getVideosByCourseId", SiteCourses.getVideosByCourseId);
app.get("/getVideoDetaiByUri", SiteCourses.getVideoDetaiByUri);
app.get("/getVideosById", SiteCourses.getVideosById);
app.get("/getVideos", SiteCourses.getVideos);
app.post("/addToVimeo", uploadVideo.single("video"), SiteCourses.addToVimeo);
app.post("/updateVideoToVimeo", uploadVideo.single("video") ,  SiteCourses.updateToVimeo);
app.post("/deleteVideoByid", SiteCourses.deleteVideoByid);

// app.post("/updateToVimeo", updateVideo.single("video"), SiteCourses.updateToVimeo);
// Vimeo ALL Videos agains Metamask Ids Watched Time Recorder
app.get("/getperwatched", SiteCourses.getperwatched);
app.post("/perWatchedRecord", SiteCourses.perWatchedRecord);


///////////////////////////////////////
app.use(express.static("./build"));

// app.use("*", (req, res) => {
//   res.sendfile("./build/index.html");
// });

connectDb();

const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
server.listen(PORT, function () {
  console.log("server is listning on port " + PORT);
});
