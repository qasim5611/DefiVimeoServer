const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");

const SiteGeneral = require("./../../Models/adminDashboard/SiteGeneral.Model");
const SiteSocials = require("./../../Models/adminDashboard/SiteSocials.Model");
const HomeBanner = require("./../../Models/adminDashboard/HomeBanner.Model");
// const NftPromote = require("./../../Models/adminDashboard/NftPromote.Model");

const NftPromote = require("./../../Models/adminDashboard/NftPromote.Model");
const NftPopular = require("./../../Models/adminDashboard/NftPopular.Model");
const NftRecent = require("./../../Models/adminDashboard/NftRecent.Model");

const NftBanner = require("./../../Models/adminDashboard/NftBanner.Model");

const AboutUs = require("./../../Models/adminDashboard/AboutUs.Model");

const HomeDocs = require("./../../Models/adminDashboard/HomeDocs");
const HomeDocsHeading = require("./../../Models/adminDashboard/HomeDocsHead");








const jwt_secret_key = "123456789abcdefghijklmnopqrstuvwxyz";

const secret = "123456789abcdefghijklmnopqrstuvwxyz";
// const nodemailer = require("nodemailer");

var validator = require("validator");
var bcrypt = require("bcryptjs");
var crypto = require("crypto");

var jwt = require("jsonwebtoken");



const adminDashboard = {
  // import sendEmail from "./../../services/EmailSender/sendmail";
  setGeneral: async function (req, res) {
    try {
      let data = Object.assign({}, req.body);
      // let user_id = req.body.id;
      let image;
      if (req.file) {
        image = req.file.filename;
        data.image = image;
      }

      console.log("data");
      console.log(data);

      let key = "admin0011";

      const result = await SiteGeneral.findOne({ keyname: key });

      if (result) {
        console.log(result);
        let update = await SiteGeneral.findOneAndUpdate(
          { keyname: key },
          data,
          {
            isNew: true,
          }
        );
        if (update) {
          console.log("update", update);
          return res.send({
            msg: "Updated Successful",
          });
        }
      }

      // let update = await TeamMember.findOneAndUpdate({ _id: user_id }, data, {
      //   isNew: true,
      // });
      // collectionName.update({KeyToUpdate},{Set Command})
    } catch (err) {
      console.log(err);
      return res.json("Server Error");
    }
  },

  setHomeBanner: async function (req, res) {
    try {
      console.log(req.body);
      let data = Object.assign({}, req.body);
      // let user_id = req.body.id;
      let image;
      if (req.file) {
        image = req.file.filename;
        data.image = image;
      }

      console.log("data");
      console.log(data);

      // let key = "admin0011";

      // //First save me
      //  const user = new HomeBanner(data);
      //  console.log(user);
      // let isSaved =  await user.save();
      // if(isSaved){
      //    return res.send({
      //      msg: "Saved Successful",
      //      isSaved
      //    });
      // }

      let update = await HomeBanner.findOneAndUpdate(
        { _id: req.body.generalid },
        data,
        {
          isNew: true,
        }
      );
      if (update) {
        console.log("update", update);
        return res.send({
          msg: "Updated Successful",
        });
      }

      // let update = await TeamMember.findOneAndUpdate({ _id: user_id }, data, {
      //   isNew: true,
      // });
      // collectionName.update({KeyToUpdate},{Set Command})
    } catch (err) {
      console.log(err);
      return res.json("Server Error");
    }
  },

  updateAboutUs: async function (req, res) {
    try {
      console.log(req.body);
      let data = Object.assign({}, req.body);

      // let image;
      // if (req.file) {
      //   image = req.file.filename;
      //   data.image = image;
      // }

      console.log("data");
      console.log(data);

      // let key = "admin0011";

      //First save me
      //  const user = new AboutUs(data);
      //  console.log(user);
      // let isSaved =  await user.save();
      // if(isSaved){
      //    return res.send({
      //      msg: "Saved Successful",
      //      isSaved
      //    });
      // }

      let user = await AboutUs.findOneAndUpdate(
        { _id: req.body.idtoUpdate },
        data,
        {
          isNew: true,
        }
      );
      if (user) {
        console.log("user", user);
        return res.send({
          msg: "Updated Successful",
          user: [user],
        });
      }

      // let update = await TeamMember.findOneAndUpdate({ _id: user_id }, data, {
      //   isNew: true,
      // });
      // collectionName.update({KeyToUpdate},{Set Command})
    } catch (err) {
      console.log(err);
      return res.json("Server Error");
    }
  },

  // const multipleFileUpload = async (req, res, next) => {
  setNftPromote: async function (req, res, next) {
    try {
      console.log("req");
      console.log(req);
      let filesArray = [];
      req.files.forEach((element) => {
        const file = {
          fileName: element.originalname,
          filePath: element.path,
          fileType: element.mimetype,
          fileID: uuidv4(),
          //  fileSize: fileSizeFormatter(element.size, 2),
        };
        filesArray.push(file);
      });
      console.log(req.body.id);
      let id = req.body.id;

      const multipleFiles = {
        title: req.body.title,
        files: filesArray,
      };

      let isUpdates = await NftPromote.findOneAndUpdate(
        { _id: id },
        multipleFiles,
        { upsert: true }
      );
      // if (isUpdates) {
      //   console.log("isUpdates", isUpdates);
      //   return res.send({
      //     msg: "Files Uploaded Successfully",
      //     isUpdates,
      //   });
      // }
      // let isSaved = await multipleFiles.save();
      //  res.status(201).send("Files Uploaded Successfully");
      // console.log(isSaved);
      if (isUpdates) {
        console.log("test");
        const user = await NftPromote.find();

        return res.json(user);
        //       return res.send({
        //   msg: "Files Uploaded Successfully", // + redirect to verify page
        // });
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  setNftPopular: async function (req, res, next) {
    try {
      console.log("req");
      console.log(req);
      let filesArray = [];
      req.files.forEach((element) => {
        const file = {
          fileName: element.originalname,
          filePath: element.path,
          fileType: element.mimetype,
          //  fileSize: fileSizeFormatter(element.size, 2),
        };
        filesArray.push(file);
      });
      console.log(req.body.id);
      let id = req.body.id;

      // const multipleFiles = new MultipleFile({
      //   title: req.body.title,
      //   files: filesArray,
      // });
      // await multipleFiles.save();

      const multipleFiles = {
        title: req.body.title,
        files: filesArray,
      };
      // await multipleFiles.save();
      // res.status(201).send("Files Uploaded Successfully");

      // if (isUpdates) {
      //   console.log("isUpdates", isUpdates);
      //   return res.send({
      //     msg: "Files Uploaded Successfully",
      //     isUpdates,
      //   });
      // }

      // console.log(isSaved)

      let isUpdates = await NftPopular.findOneAndUpdate(
        { _id: id },
        multipleFiles,
        { upsert: true }
      );
      if (isUpdates) {
        console.log("test");
        const user = await NftPopular.find();

        return res.json(user);
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  setNftRecent: async function (req, res, next) {
    try {
      console.log("req");
      console.log(req);
      let filesArray = [];
      req.files.forEach((element) => {
        const file = {
          fileName: element.originalname,
          filePath: element.path,
          fileType: element.mimetype,
          //  fileSize: fileSizeFormatter(element.size, 2),
        };
        filesArray.push(file);
      });
      console.log(req.body.id);
      let id = req.body.id;

      //  const multipleFiles = new NftRecent({
      //    title: req.body.title,
      //    files: filesArray,
      //  });
      //  await multipleFiles.save();

      const multipleFiles = {
        title: req.body.title,
        files: filesArray,
      };

      // let isSaved = await multipleFiles.save();
      //  res.status(201).send("Files Uploaded Successfully");
      // console.log(isSaved);

      let isUpdates = await NftRecent.findOneAndUpdate(
        { _id: id },
        multipleFiles,
        { upsert: true }
      );
      if (isUpdates) {
        console.log("test");
        const user = await NftRecent.find();

        return res.json(user);
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  setHomeDocs: async function (req, res) {
    try {
      console.log("req");
      console.log(req);
      console.log(req.body.idtoUpdate);

      //   console.log(req.body.id);
      let id = req.body.idtoUpdate;

      let data = Object.assign({}, req.body);

      let image;
      if (req.file) {
        image = req.file.filename;
        data.image = image;
      }

      // // //First save me
      //  const user = new HomeDocs(data);
      // let isSaved =  await user.save();
      // if(isSaved){
      //    return res.send({
      //      msg: "Saved Successful",
      //      isSaved
      //    });
      // }

      // const multipleFiles = {
      //   data,
      // };

      let isUpdates = await HomeDocs.findOneAndUpdate({ _id: id }, data, {
        upsert: true,
      });
      if (isUpdates) {
        console.log("test");
        const user = await HomeDocs.find();

        return res.send({
          msg: "Updated Successful",
          user,
        });
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  setHomeDocsHead: async function (req, res) {
    try {
      console.log("req");
      console.log(req);
      console.log(req.body.idtoUpdate);

      //   console.log(req.body.id);
      let id = req.body.idtoUpdate;

      let data = Object.assign({}, req.body);



      // // //First save me
      //  const user = new HomeDocs(data);
      // let isSaved =  await user.save();
      // if(isSaved){
      //    return res.send({
      //      msg: "Saved Successful",
      //      isSaved
      //    });
      // }

      // const multipleFiles = {
      //   data,
      // };

      let isUpdates = await HomeDocsHeading.findOneAndUpdate({ _id: id }, data, {
        upsert: true,
      });
      if (isUpdates) {
        console.log("test");
        const user = await HomeDocsHeading.find();

        return res.send({
          msg: "Updated Successful",
          user,
        });
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  setDocsHeading: async function (req, res) {
    try {
      console.log("req");
      console.log(req);
      console.log(req.body.idtoUpdate);

      // console.log(req.body.id);
      let id = req.body.idtoUpdate;

      let data = Object.assign({}, req.body);

      // let image;
      // if (req.file) {
      //   image = req.file.filename;
      //   data.image = image;
      // }

      // //First save me
      //  const user = new HomeDocsHeading(data);
      // let isSaved =  await user.save();
      // if(isSaved){
      //    return res.send({
      //      msg: "Saved Successful",
      //      isSaved
      //    });
      // }

      // const multipleFiles = {
      //   data,
      // };

      let isUpdates = await HomeDocsHeading.findOneAndUpdate(
        { _id: id },
        data,
        {
          upsert: true,
        }
      );
      if (isUpdates) {
        console.log("test");
        const user = await HomeDocsHeading.find();

        return res.send({
          msg: "Updated Successful",
          user,
        });
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  setNftBanner: async function (req, res, next) {
    try {
      console.log("req");
      console.log(req);
      let filesArray = [];
      req.files.forEach((element) => {
        const file = {
          fileName: element.originalname,
          filePath: element.path,
          fileType: element.mimetype,
          //  fileSize: fileSizeFormatter(element.size, 2),
        };
        filesArray.push(file);
      });
      console.log(req.body.id);
      let id = req.body.id;

      //  const multipleFiles = new NftBanner({
      //    title: req.body.title,
      //    files: filesArray,
      //  });
      //  await multipleFiles.save();

      const multipleFiles = {
        title: req.body.title,
        files: filesArray,
      };

      // let isSaved = await multipleFiles.save();
      //  res.status(201).send("Files Uploaded Successfully");
      // console.log(isSaved);

      let isUpdates = await NftBanner.findOneAndUpdate(
        { _id: id },
        multipleFiles,
        { upsert: true }
      );
      if (isUpdates) {
        console.log("test");
        const user = await NftBanner.find();

        return res.send({
          msg: "Updated Successful",
          user,
        });
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  getHomeDocs: async function (req, res) {
    try {
      console.log("test");
      const user = await HomeDocs.find();

      // return res.json(user);
      return res.send({
        msg: "Updated Successful",
        user,
      });
    } catch (error) {
      console.log(error);
    }
  },

  getDocsHeading: async function (req, res) {
    try {
      console.log("test");
      const user = await HomeDocsHeading.find();

      // return res.json(user);
      return res.send({
        msg: "Updated Successful",
        user,
      });
    } catch (error) {
      console.log(error);
    }
  },

  getHomeDocsbyid: async function (req, res) {
    try {
      console.log("req", req.query.id);

      const user = await HomeDocs.find().where("_id").equals(req.query.id);

      return res.send({
        msg: "Find Successfully",
        user,
      });
    } catch (error) {
      console.log(error);
    }
  },

  getNftPromote: async function (req, res) {
    try {
      console.log("test");
      const user = await NftPromote.find();

      return res.json(user);
    } catch (error) {
      console.log(error);
    }
  },

  getNftPopular: async function (req, res) {
    try {
      console.log("test");
      const user = await NftPopular.find();

      return res.json(user);
    } catch (error) {
      console.log(error);
    }
  },

  getNftRecent: async function (req, res) {
    try {
      console.log("test");
      const user = await NftRecent.find();

      return res.json(user);
    } catch (error) {
      console.log(error);
    }
  },

  getAboutUs: async function (req, res) {
    try {
      console.log("test");
      const user = await AboutUs.find();

      // return res.json(user);
      return res.send({
        msg: "Updated Successful",
        user,
      });
    } catch (error) {
      console.log(error);
    }
  },

  getNftBanner: async function (req, res) {
    try {
      console.log("test");
      const user = await NftBanner.find();
      return res.send({
        msg: "Updated Successful",
        user,
      });
      // return res.json(user);
    } catch (error) {
      console.log(error);
    }
  },

  getHomeBanner: async function (req, res) {
    try {
      // let id= "sdcf";
      // console.log(req.body);
      // let id = req.body;
      const user = await HomeBanner.find();

      return res.json(user);
    } catch (error) {
      console.log(error);
    }
  },

  getGeneral: async function (req, res) {
    try {
      const user = await SiteGeneral.find()
        .where("keyname")
        .equals("admin0011");

      return res.json(user);
    } catch (error) {
      console.log(error);
    }
  },

  setSocialLinks: async function (req, res) {
    try {
      // let data = Object.assign({}, req.body);
      // let user_id = req.body.id;

      console.log(req.body);

      console.log(req.body);

      let key = "admin2233";

      var objForUpdate = {};

      if (req.body.twitter) objForUpdate.twitter = req.body.twitter;
      if (req.body.fcb) objForUpdate.fcb = req.body.fcb;
      if (req.body.insta) objForUpdate.insta = req.body.insta;
      if (req.body.linkdin) objForUpdate.linkdin = req.body.linkdin;
      if (req.body.snapchat) objForUpdate.snapchat = req.body.snapchat;
      if (req.body.discord) objForUpdate.discord = req.body.discord;
      if (req.body.reddit) objForUpdate.reddit = req.body.reddit;
      if (req.body.pintrest) objForUpdate.pintrest = req.body.pintrest;

      //before edit- There is no need for creating a new variable
      //var setObj = { $set: objForUpdate }

      objForUpdate = { $set: objForUpdate };

      // const isUpdates = await SiteSocials.update({ keyname: key }, objForUpdate);
      let isUpdates = await SiteSocials.findOneAndUpdate(
        { keyname: key },
        objForUpdate,
        {
          isNew: true,
        }
      );

      if (isUpdates) {
        console.log("isUpdates", isUpdates);
        return res.send({
          msg: "SocialLinks Updated Successful",
        });
      }
    } catch (err) {
      console.log(err);
      return res.json("Server Error");
    }
  },

  getSocialLinks: async function (req, res) {
    try {
      const user = await SiteSocials.find()
        .where("keyname")
        .equals("admin2233");

      return res.json(user);
    } catch (error) {
      console.log(error);
    }
  },

  fileSizeFormatter: async function (bytes, decimal) {
    if (bytes === 0) {
      return "0 Bytes";
    }
    const dm = decimal || 2;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "YB", "ZB"];
    const index = Math.floor(Math.log(bytes) / Math.log(1000));
    return (
      parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) +
      " " +
      sizes[index]
    );
  },

  //////////////////////////////////
};

module.exports = adminDashboard;
