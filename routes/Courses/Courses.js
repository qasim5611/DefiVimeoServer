const nodemailer = require("nodemailer");
const fs = require('fs');

const Course = require("../../Models/adminDashboard/Courses.Model");
const VideosSchema = require("../../Models/adminDashboard/Videos.Model");
const watchedSchema = require("../../Models/adminDashboard/watched.Model");


const axios = require("axios").default;
const path = require("path");
const _dirname = path.resolve();

var Vimeo = require("vimeo").Vimeo;

// Vimeo Account APP ID Credentials to Use Their API
const CLIENT_ID = "3013c6564f670c8c5dbc595ee8374da5ecf966e5";
const CLIENT_SECRET =
  "Lamjczk2Jvk6u/aNTyNlGmaeSQlR1juoLyPlct2MbPGkKhl56Npqd2Xv4anTpxRhXirL8QQlskYGEWmDzoqfH0nA3JskhNLxj88EEldfz5IRn8On4PwNWUwJB37X6vNZ";
const ACCESS_TOKEN = "c87665c2e6caff9b588439dca20dd106"; // also same for Berear Token
let client = new Vimeo(CLIENT_ID, CLIENT_SECRET, ACCESS_TOKEN);

console.log("client", client);

const UserID = process.env.VIMEO_USER_ID;

console.log("Vimeo UserID", UserID);

const Courses = {
  addCourse: async function (req, res) {
    try {
      let {
        title,
        auther,
        instructorBio,
        module, //level
        image,
        description,
        moduleList,
        learnList,
      } = req.body;

      if (req.file) image = req.file.filename;
      let learnLists = learnList.split(",", "-->");
      let moduleLists = moduleList.split(",", "-->");


      let headersList = {
        "Accept": "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Authorization": "Bearer c87665c2e6caff9b588439dca20dd106",
        "Content-Type": "application/json"
      }
      let bodyContent = JSON.stringify({
        name: title,
      });
      let reqOptions = {
        url: `https://api.vimeo.com/users/${UserID}/projects`,
        method: "POST",
        headers: headersList,
        data: bodyContent,
      };

      response = await axios.request(reqOptions);
      let resp = response.data;
      if (resp) {
        let newUser = new Course({
          title,
          auther,
          instructorBio,
          module,
          image,
          description,
          moduleLists: moduleList.split(","),
          learnLists: learnList.split(","),
          is_pinned: resp.is_pinned,
          is_private_to_user: resp.is_private_to_user,
          privacy: resp.privacy.view,
          resource_key: resp.resource_key,
          uri: resp.uri,
        });
        let result = await newUser.save();
        if (result) {
          return res.send({
            msg: "Course Folder Added Successfully",
            resp,
          });
        }
      }
    } catch (err) {
      return res.status(err.status || 500).send(err.message);
    }
  },

  getCourse: async function (req, res) {
    try {
      const user = await Course.find();
      return res.send({
        msg: "Find Successfully",
        user,
      });
    } catch (error) {
      console.log(error);
    }
  },

  getperwatched: async function (req, res) {
    try {
      const user = await watchedSchema.find();
      return res.send({
        msg: "Find Successfully",
        user,
      });
    } catch (error) {
      console.log(error);
    }
  },

  

  perWatchedRecord: async function (req, res) {
    try {
      let uri = req.body.VideoUrlId;
      let videoId = uri.slice(31,40);

      let metamask_id = req.body.userMetamaskId;  //  User to MetaMask Id
      let myperc = req.body.perWatched;  // % Watched By User to Specific Video

      let isMatched = await watchedSchema.find({metamask_id: metamask_id, videoId:videoId});
      // its already exists lets update it
      if(isMatched.length > 0){
         // here also check if next % is grateer that Previous % (if true then Allow)
        if(isMatched[0].percentageWatched < myperc){
          let myData = {
            "metamask_id" : isMatched[0].metamask_id,
            "percentageWatched" : myperc,
            "videoId" : isMatched[0].videoId,
          }

          let update = await watchedSchema.findOneAndUpdate(
            { _id: isMatched[0]._id },
            myData,
            {
              isNew: true,
            }
          );

          if(update){
            return res.send({
              msg: "Updated Watched Time Successfully!",
            });
          }
        }

        else{
            console.log("viwed Less than First time")
            return res.send({
              msg: "viwed Less than First time",
            });
        }
      }

      else{

        //its new ltes save it now
        let newObj = new watchedSchema({
          metamask_id,
          "percentageWatched" : myperc,
          videoId,
        });
  
        let result = await newObj.save();
        
  
        if(result){
          return res.send({
            msg: "Recorded Successfully!",
          });
        }

      }

      
    
     

    } catch (error) {
      console.log(error);
    }
  },


  getCourseByid: async function (req, res) {
    try {
      const user = await Course.find().where("_id").equals(req.query.id);
      if (user) {

        return res.send({
          msg: "Find Successfully",
          user,
        });
      }
     
    } catch (error) {
      console.log(error);
    }
  },

  


  getVideosByCourseId: async function (req, res) {
    try {
      const user = await Course.find().where("_id").equals(req.query.id);
      if (user) {
        let courseTitle = user[0].title;
        let courseModules = user[0].moduleLists;

        const specificCourseVideos =
          await VideosSchema.find().where("courseName").equals(courseTitle);
        if (specificCourseVideos) {
          return res.send({
            msg: "Find Successfully",
            specificCourseVideos,
          });
        }
      }

    } catch (error) {
      console.log(error);
    }
  },
  

  // In Progress
  getVideoDetaiByUri: async function (req, res) {
    try {
      // console.log( "getVideoDetaiByUri params", req.query.id);
      
      // const user = await Course.find();
      // const result = await Course.findOne({ _id: key });
      // const user = await VideosSchema.find().where("_id").equals(req.query.id);
    
      //  console.log("getVideoDetaiByUri", user);
      //  console.log("getVideoDetaiByUri", user);

      //  console.log("getVideoDetaiByUri 2", user[0]);

      // if (user) {
      //   return res.send({
      //     msg: "Find Successfully",
      //     user,
      //   });

      // }


      // return res.json(user);

    } catch (error) {
      console.log(error);
    }
  },

  getVideosById: async function (req, res) {
    try {
      const user = await VideosSchema.find().where("_id").equals(req.query.id);
      if (user) {
        return res.send({
          msg: "Find Successfully",
          user,
        });
      }

    } catch (error) {
      console.log(error);
    }
  },

  getVideos: async function (req, res) {
    try {
      const user = await VideosSchema.find();
      return res.send({
        msg: "Find Successfully",
        user,
      });
    } catch (error) {
      console.log(error);
    }
  },



  getCourseModules: async function (req, res) {
    try {
      console.log(req.body.courseName);
      const user = await Course.find()
        .where("title")
        .equals(req.body.courseName);

      console.log("user.moduleList", user);

      // return res.json(user);
      return res.send({
        msg: "Find Successfully",
        user,
      });
    } catch (error) {
      console.log(error);
    }
  },

  addToVimeo: async function (req, res) {
    let { courseName, moduleName, title, length } = req.body;
    try {
      let myuri = [];
      var data = fs.readFileSync('./config.json'),
      myObj = JSON.parse(data);
      console.log("myObj", myObj);
      let vedioname = myObj.videoFsName;
      let file_name = path.join(_dirname, `./uploads/${vedioname}`);
      console.log("file_name", file_name);
      client.upload(
        file_name,
        {
          name: title,
          description: "myDescription",
          privacy: { view: "anybody" },
        },
        async function (uri) {
          console.log("Your video URI is: " + uri);
          let vidsUri = uri.split("videos/")[1];
          myuri.push(vidsUri);
          console.log("vidsUri", vidsUri);
          if (uri) {
            // client.request(
            //   myuri + "?fields=transcode.status",
            //   async function (error, body, status_code, headers) {
            //     if (body.transcode.status === "complete") {
            //       console.log("Your video finished transcoding.");
            //     } else if (body.transcode.status === "in_progress") {
            //       console.log("Your video is still transcoding.");

            //       // stopTask();
            //     } else {
            //       console.log(
            //         "Your video encountered an error during transcoding."
            //       );
            //     }
            //   }
            // );

            const user = await Course.find().where("title").equals(courseName);
            if (user) {
              let FolderUri = user[0].uri.split("projects/")[1];
              let myVideoUri = myuri[0];
              try{
                let headersList = {
                  "Accept": "*/*",
                  "Authorization": "Bearer c87665c2e6caff9b588439dca20dd106",
                  "Content-Type": "application/json"
                }
                let reqOptions = {
                  url: `https://api.vimeo.com/users/${UserID}/projects/${FolderUri}/videos/${myVideoUri}`,
                  method: "PUT",
                  headers: headersList,
                };
                let responsenow = await axios.request(reqOptions);
                console.log(responsenow);
              }
              catch (err) {
                console.log(err, "err--->");
                return res.status(err.status || 500).send(err.message);
              }            
              ////////////////////////////// Get Uploaded Vedio Complete Detail //////////////////////////////////////
              let headersList = {
                "Accept": "*/*",
                "Authorization": "Bearer c87665c2e6caff9b588439dca20dd106",
                "Content-Type": "application/json"
              }
              let compVideoDetail = {
                url: `https://api.vimeo.com/videos/${myVideoUri}`,
                method: "GET",
                headers: headersList,
              }
              let videoDetailResp = await axios.request(compVideoDetail);  
              //////////////////////////////////////////////////////               
              let newVideo = new VideosSchema({
                title,
                length,
                courseName,
                moduleName,
                userID: `${UserID}`,
                folderUri: `${FolderUri}`,
                myVideoUri: `${myVideoUri}`,
                embed: videoDetailResp.data.embed.html,
                manage_link: videoDetailResp.data.manage_link,
                player_embed_url: videoDetailResp.data.player_embed_url,
                privacy: videoDetailResp.data.privacy.view,
              });
              let result = await newVideo.save();
              // Noew its Time to Remove Temporary File/MP4 from uploads using **config.json** 
              let fileToRemove = path.join(_dirname, `./uploads/${vedioname}`);
              fs.unlink(fileToRemove, (err) => {
                if (err) {
                  console.error(err)
                  return
                }
                //file removed
              })
              if (result) {
                return res.send({
                  msg: "uploaded Successfully, transCoding Start..",
                  result,
                });
              }
            }
          }
        },
        function (bytes_uploaded, bytes_total) {
          // Built In Vimeo Function
          var percentage = ((bytes_uploaded / bytes_total) * 100).toFixed(2);
          console.log(bytes_uploaded, bytes_total, percentage + "%");
        },
        function (error) {
          console.log("Failed because: " + error);
          return res.send({
            msg: "Failed because: Unable to locate file to upload.",
          });
        }
      );




    } catch (err) {
      console.log(err, "err--->");
      return res.status(err.status || 500).send(err.message);
    }
    // }, 5000);
  },


  updateToVimeo: async function (req, res) {
    let { courseName, moduleName, title, length } = req.body;
  
    try {

      /////////////// First Delete Previous Video ////////////
      const user = await VideosSchema.find().where("_id").equals(req.body.idtoUpdate);
      if(user){
        let VideoUri = user[0].myVideoUri;
        let headersList = {
          "Accept": "*/*",
          "Authorization": "Bearer c87665c2e6caff9b588439dca20dd106" 
         }
         let reqOptions = {
           url: `https://api.vimeo.com/videos/${VideoUri}`,
           method: "DELETE",
           headers: headersList,
         }
         let response = await axios.request(reqOptions);
         console.log(response.data);


         
      let myuri = [];
      var data = fs.readFileSync('./config.json'),
     
      myObj = JSON.parse(data);
      console.log("myObj", myObj);

      let vedioname = myObj.videoFsName;


      console.log("vedioname", vedioname);
      let file_name = path.join(_dirname, `./uploads/${vedioname}`);
      console.log("file_name", file_name);
      client.upload(
        file_name,
        {
          name: title,
          description: "myDescription",
          privacy: { view: "anybody" },
        },
        async function (uri) {
          console.log("Your video URI is: " + uri);
          let vidsUri = uri.split("videos/")[1];
          myuri.push(vidsUri);
          console.log("vidsUri", vidsUri);
          if (uri) {

            const user = await Course.find().where("title").equals(courseName);

            if (user) {
              console.log("user", user[0].uri);
              console.log("user", user);
              let FolderUri = user[0].uri.split("projects/")[1];
              console.log("FolderUri", FolderUri);

              let myVideoUri = myuri[0];
              console.log("myVideoUri", myVideoUri);


              let headersList = {
                "Accept": "*/*",
                "Authorization": "Bearer c87665c2e6caff9b588439dca20dd106",
                "Content-Type": "application/json"
              }

              let reqOptions = {
                url: `https://api.vimeo.com/users/${UserID}/projects/${FolderUri}/videos/${myVideoUri}`,
                method: "PUT",
                headers: headersList,
              };

              let response1 = await axios.request(reqOptions);
              console.log(response1.data);

              ////////////////////////////// Get Uploaded Vedio Complete Detail //////////////////////////////////////
              let compVideoDetail = {
                url: `https://api.vimeo.com/videos/${myVideoUri}`,
                method: "GET",
                headers: headersList,
              }
              let videoDetailResp = await axios.request(compVideoDetail);
              let myData = {
                title,
                length,
                courseName,
                moduleName,
                userID: `${UserID}`,
                folderUri: `${FolderUri}`,
                myVideoUri: `${myVideoUri}`,
                embed: videoDetailResp.data.embed.html,
                manage_link: videoDetailResp.data.manage_link,
                player_embed_url: videoDetailResp.data.player_embed_url,
                privacy: videoDetailResp.data.privacy.view,
              };
              // let result = await newVideo.save();

              let update = await VideosSchema.findOneAndUpdate(
                { _id: req.body.idtoUpdate },
                myData,
                {
                  isNew: true,
                }
              );
              if (update) {

              let fileToRemove = path.join(_dirname, `./uploads/${vedioname}`);

              fs.unlink(fileToRemove, (err) => {
                if (err) {
                  console.error(err)
                  return
                }

                //file removed
              })

              return res.send({
                msg: "Updated Successfully.",
              });

              


              }


            

            }
          }
        },
        function (bytes_uploaded, bytes_total) {
          var percentage = ((bytes_uploaded / bytes_total) * 100).toFixed(2);
          console.log(bytes_uploaded, bytes_total, percentage + "%");
        },
        function (error) {
          console.log("Failed because: " + error);
          return res.send({
            msg: "Failed because: Unable to locate file to upload.",
          });
        }
      );



  
      }
  


      ////////////////////////////////////////
      

    } catch (err) {
      console.log(err, "err--->");
      return res.status(err.status || 500).send(err.message);
    }
    // }, 5000);
  },


  deleteCourseById: async function (req, res) {
    let find = await Course.findById(req.body.id);
    if (find) {
      console.log("find.uri", find.uri);
      let FolderUri = find.uri.split("projects/")[1];
      console.log("FolderUri", FolderUri);

      let headersList = {
        "Accept": "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Authorization": "Bearer c87665c2e6caff9b588439dca20dd106"
      }
      let reqOptions = {
        url: `https://api.vimeo.com/users/${UserID}/projects/${FolderUri}?should_delete_clips=true`,
        method: "DELETE",
        headers: headersList,
      }
      let response = await axios.request(reqOptions);
      if (response) {
        await find.delete();
        return res.send({
          msg: "Deleted Successfully",
          find,
        });

      }

    } else {
      throw new Error("Service not Found");
    }
  },

  updateCourse: async function (req, res) {
    try {
      let data = Object.assign({}, req.body);
      let user_id = req.body.idtoUpdate;
      let image;
      if (req.file) {
        image = req.file.filename;
        data.image = image;
      }
      let find = await Course.findById(req.body.idtoUpdate);
      if (find) {
        let FolderUri = find.uri.split("projects/")[1];
        let headersList = {
          "Accept": "*/*",
          "Authorization": "Bearer c87665c2e6caff9b588439dca20dd106",
          "Content-Type": "application/json"
        }
        let bodyContent = JSON.stringify({
          "name": req.body.title
        });
        let reqOptions = {
          url: `https://api.vimeo.com/users/${UserID}/projects/${FolderUri}`,
          method: "PATCH",
          headers: headersList,
          data: bodyContent,
        }
        let response = await axios.request(reqOptions);
        console.log(response.data);
        if (response) {
          let isupdate = await Course.findOneAndUpdate({ _id: user_id }, data, {
            isNew: true,
          });
          if (isupdate) {
            return res.send({
              msg: "Course Updated Successfully",
              isupdate,
            });
          }
        }
      }
    }
    catch (err) {
      return res.status(err.status || 500).send(err.message);
    }
  },


  deleteVideoByid: async function (req, res) {
    console.log("folder Id", req.body.id);
    let find = await VideosSchema.findById(req.body.id);
    if (find) {
      let VideoUri = find.manage_link.split("videos/")[1];
      console.log("VideoUri", VideoUri);
      let FolderUri = find.folderUri;

      let headersList = {
        "Accept": "*/*",
        "Authorization": "Bearer c87665c2e6caff9b588439dca20dd106"
      }
      let reqOptions = {
        url: `https://api.vimeo.com/users/${UserID}/projects/${FolderUri}/videos/${VideoUri}`,
        method: "DELETE",
        headers: headersList,
      }
      let response = await axios.request(reqOptions);
      if (response) {
        await find.delete();
        return res.send({
          msg: "Video Deleted Successfully",
          find,
        });

      }

    } else {
      throw new Error("Service not Found");
    }
  },

};

module.exports = Courses;
