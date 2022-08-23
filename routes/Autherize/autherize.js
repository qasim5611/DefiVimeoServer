const nodemailer = require("nodemailer");

const userModel = require("./../../Models/user.Model");
const refreshTokenModel = require("../../Models/refreshToken.Model");

// const { jwt_secret_key } = require("../../../config/jwtConfig");


const jwt_secret_key = "123456789abcdefghijklmnopqrstuvwxyz";

const secret = "123456789abcdefghijklmnopqrstuvwxyz";
// const nodemailer = require("nodemailer");

var validator = require("validator");
var bcrypt = require("bcryptjs");
var crypto = require("crypto");

var jwt = require("jsonwebtoken");

const sendVerificationEmail = require("./../Emailer/sendmail");

const sendEmail = require("./../Emailer/passreset");




const { constants } = require("buffer");


var code = Math.floor(100000 + Math.random() * 900000);


           const randomTokenString = function () {
             return crypto.randomBytes(40).toString("hex");
           };


const Auth = {
  // import sendEmail from "./../../services/EmailSender/sendmail";

  // showOther: async function (req, res) {
  //   res.sendFile(
  //     path.join(__dirname, "./../../../build/index2.html"),
  //     function (err) {
  //       if (err) {
  //         return res.status(500).send(err);
  //       }
  //     }
  //   );
  // },

  register: async function (req, res) {
    console.log(req.body.name);
    console.log(req.body);
    //  const origin = req.hostname;
    const origin = "https://gaddollcat.herokuapp.com";

    const result = await userModel.findOne({ email: req.body.email });
    if (result) {
      // send already registered error in email to prevent user enumeration
      console.log("Email alredy exist");
      return res.send({
        msg: "Email Already Exist",
      });
    }

    // create user object
    const user = new userModel(req.body);
    console.log(user);

    function hash(password) {
      return bcrypt.hashSync(password, 10);
    }

    // first registered user is an admin
    const isFirstUser = (await userModel.countDocuments({})) === 0;
    user.role = isFirstUser ? "Admin" : "User";
    user.verificationToken = randomTokenString();

    // hash password
    user.passwordHash = hash(req.body.password);

    // save user
    await user.save();
    console.log(user);
    // send email
    await sendVerificationEmail(user, origin);
    return res.send({
      msg: "Verify your mail Now Plz",
    });
  },

  verifyEmail: async function (req, res) {
    try {
      console.log(req.query.token);
      console.log(req.query.token);
      let token = req.query.token;

      const user = await userModel.findOne({ verificationToken: token });
      console.log(token);
      if (!user) {
        return res.send({
          msg: "Verification Failed",
        });
      }
      user.verified = Date.now();
      user.verificationToken = undefined;
      await user.save();
      return res.send({
        msg: "Verification Successful, Close this AND Go to Login Now",
      });
    } catch (err) {
      return res.json("Server Error");
    }
  },
  ////////////////////////////////////////////////////

  authenticate: async function (req, res) {
    console.log(req);
    console.log(req);

    const { email, password } = req.body;
    const ipAddress = req.ip;

    const user = await userModel.findOne({ email });

    console.log(user);
    console.log(user);

    if (!user) {
      return res.send({
        auth: false,
        token: null,
        msg: "Not available email",
      });
    }

    var passwordIsValid = bcrypt.compareSync(password, user.passwordHash);

    var userIsVerifed = user.isVerified;

    if (passwordIsValid == true) {
      if (userIsVerifed == true) {
        function generateJwtToken(user) {
          return jwt.sign({ sub: user.id, id: user.id }, jwt_secret_key, {
            expiresIn: "15m",
          });
        }

        function generateRefreshToken(user, ipAddress) {
          // create a refresh token that expires in 7 days
          return new refreshTokenModel({
            userId: user.id,
            token: randomTokenString(),
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            createdByIp: ipAddress,
          });
        }
        const jwtToken = generateJwtToken(user);
        const refreshToken = generateRefreshToken(user, ipAddress);

        // save refresh token
        await refreshToken.save();

        // return basic details and token

        return res.send({
          user,
          jwtToken,
          refreshToken: refreshToken.token,
          msg: "Login Successfull",
        });
      } else if (userIsVerifed == false) {
        let mailret = user.email;
        console.log("mailret", mailret);

        console.log("user.name", user.name);
        console.log("user.email", user.email);
        //  console.log("code", code);

        // sendEmail(user.email, user.name, code);
        // console.log("sendEmail", code);

        return res.send({
          auth: false,
          token: null,
          msg: "NOT Verified, Check Mail, We Already Have Send you Email", // + redirect to verify page
          user,
        });
      }
    }

    return res.send({
      auth: false,
      token: null,
      msg: "Password Not Correct",
      user,
    });
  },

  ///////////////////////////////////

  forgotPassword: async function (req, res) {
    let { email } = req.body;

    console.log(email);

    userModel.findOne({ email: email }, async function (err, user) {
      console.log("user", user);

      console.log("user", user);

      if (err) {
        return res.json("Error On Server");
      } else if (!user) {
        // return res.send({ msg: "Email Not Found" });

        return res.send({
          msg: "Email Not Found.",
          user,
        });
      }

      /////////////////////////////////

      //////////////////////////////////

      await userModel.updateOne(
        {
          email: email,
        },
        {
          $set: {
            code: code,
          },
        }
      );

      await sendEmail(user.email, user.name, code);

      return res.send({
        msg: "Cool Email Found, Redirecting to Change Password",
        user,
      });
    });
  },
  //////////////////////////////////
  // this is to verify Email , at when the user apply for Password Recovery

  verifyCode: async function (req, res) {
    let email = req.body.email;

    console.log("emailid", email);
    console.log("token2", req.body.values.token);

    console.log("token2", req.body.values.token);

    var Usertoken = req.body.values.token;

    // let code = values.token;
    console.log("Usertoken", Usertoken);

    let mytb1 = await userModel.findOne({ email });

    console.log("is user is find?", mytb1);

    //  console.log("is user is find?", mytb1.name);

    console.log("is user is find?", mytb1.code);

    if (mytb1) {
      if (mytb1.code == Usertoken) {
        return res.send({
          msg: "You Have Been Verified for Password Update. Redirecting...",
          email,
        });
      }

      return res.send({
        msg: "Sorry Your Token Is Not Correct",
        email,
      });
    }
  },

  /////////////////////////////////////////

  resetPassword: async function (req, res) {
    let { email, values } = req.body;

    console.log("emailid", email);
    console.log("token2", values.password);

    let code = values.password;

    let mytb1 = await userModel.findOne({ email });

    console.log("is user is find?", mytb1);

    console.log("is user is find?", mytb1.code);

    console.log("is user is find?", mytb1.passwordHash);

    code = await bcrypt.hash(code, 10);

    if (mytb1) {
      let isUpdates = await userModel.updateOne(
        {
          email: email,
        },
        {
          $set: {
            passwordHash: code,
          },
        }
      );

      if (isUpdates) {
        return res.send({
          msg: "Password Updated",
          isUpdates,
        });
      }

      return res.send({
        msg: "Password Not Updated",
        isUpdates,
      });
    }
  },

  currentUser: async function (req, res) {
    try {
      console.log("req", req.body);

      let myid = req.params.userId;

      console.log("req", myid);


      const user = await userModel.find().where("_id").equals(myid);

      return res.send({
        msg: "Find Successfully",
        user,
      });
    } catch (error) {
      console.log(error);
    }
  },
  //////////////////////////////////
};

module.exports = Auth;
