const nodemailer = require("nodemailer");

// let testAccount = await nodemailer.createTestAccount();



const sendVerificationEmail = async (user,origin) => {

   let message;
   if (origin) {
     const verifyUrl = `${origin}/verify-email?token=${user.verificationToken}`;
     message = `<p>Please click the below link to verify your email address:</p>
                   <p><a href="${verifyUrl}">${verifyUrl}</a></p>`;
   } else {
     message = `<p>Please use the below token to verify your email address with the <code>/user/verify-email</code> api route:</p>
                   <p><code>${user.verificationToken}</code></p>`;
   }

   console.log({
     to: user.email,
     subject: "Sign-up Verification API - Verify Email",
     html: `<h4>Verify Email</h4>
               <p>Thanks for registering!</p>
               ${message}`,
   });

   var smtpTransport = nodemailer.createTransport({
     service: "gmail",
     host: "smtp.gmail.com",
     port: 587,
     // ssl:     true,
     secure: false,
    //  requireTLS: true,
     auth: {
       user: "qasimtahir5611@gmail.com",
       pass: "Qasim@1048576",
     },
     tls: { rejectUnauthorized: false },
   });

   // await sendmail(message, user, origin);

   // await sendEmail(message, user, origin);
   //   console.log("code", message);
   const mailOptions = {
     from: `"Verify Your Accout by Token" <qasimtahir5611@gmail.com>`,
     to: `${user.email}`,
     subject: "Please Vrifiy your Email account",
     html: `
     <h3 style="font-family: cursive">Hy ${user.name} RagDoll Cat NFT wansts to Verify your Email click button </h3>
     <h3>${message}</h3>`,
   };
   console.log(mailOptions);
   smtpTransport.sendMail(mailOptions, function (error, response) {
     if (error) {
       console.log(error);
       return false;
     } else {
       console.log(response);
       return true;
     }
   });

};
module.exports = sendVerificationEmail;
