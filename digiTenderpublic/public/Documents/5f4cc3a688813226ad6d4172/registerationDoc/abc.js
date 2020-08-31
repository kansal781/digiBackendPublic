const createV3 = async function (req, res) {
  res.setHeader("Content-Type", "application/json");
  console.log("console of signin api");
  console.log(req.body);
  const body = req.body;
  const device = tbl_user_devices;
  const address = tbl_addresses;

  //console.log(body);

  //CCC
  //Welcome Templete Fetch
  /*let err,mailtemplates;
    [err, mailtemplates] = await to(tbl_mail_templates.findOne({where: {id: '1'}}));
    var htmlTemplateText = mailtemplates.template_text;
    */

  if (!body.name) {
    return ReE(res, "Please enter an name to register.");
  } else {
    let err,
      user,
      devicetoken,
      isRegistered,
      isUserData,
      mobileNo,
      phoneNo,
      addressData,
      emailAddress,
      isUserDataGoogle,
      isUserDataFacebook;

    body.mobile_no = body.mobile_no.replace(`+${body.country_code}`, "");

    body.name = body.name;
    body.user_status = "1";
    body.user_type = 0;
    body.email_id = body.email_id;
    if (body.google_id === "") {
      body.google_id = null;
    }
    if (body.twiter_id === "") {
      body.twiter_id = null;
    }
    if (body.facebook_id === "") {
      body.facebook_id = null;
    }

    if (body.linked_id === "") {
      body.linked_id = null;
    }
    if (body.instagram_id === "") {
      body.instagram_id = null;
    }
    //body.google_id = body.google_id;

    //Lang Code
    body.is_language = body.is_language;

    emailAddress = body.email_id;

    body.is_sp = 0;
    //Currency Code
    body.currency_id = "0";

    var is_sign_up = body.is_sign_up;

    //console.log(body.mobile_no);

    if (body.mobile_no != null && is_sign_up == "1") {
      mobileNo = body.mobile_no;
      body.password = mobileNo;
      phoneNo = body.country_code + "" + mobileNo;

      [err, isUserData] = await to(
        User.findOne({
          where: { mobile_no: body.mobile_no, country_code: body.country_code },
        })
      );

      if (isUserData == null) {
        let userEntry;
        body.phone_no = phoneNo;
        body.profile_pic = "";

        [err, userEntry] = await to(authService.createUser(body));
        //console.log(err);

        [err, user] = await to(authService.authUser(body));
        let userArray = user.toWeb();
        console.log(userArray);

        //device Token Code
        device.user_id = userArray.id;
        device.device_token = body.device_token;
        device.device_type = body.device_type;

        [err, devicetoken] = await to(tbl_user_devices.create(device));
        if (err) TE("error in inserting device token" + err.message);

        isRegistered = false;
        if (emailAddress) {
          //Mail Code

          var notification_name = body.name;
          var mapObjEnglish = {
            NAME: notification_name,
          };

          htmlTemplateText = htmlTemplateText.replace(/NAME/gi, function (
            matchedEnglish
          ) {
            return mapObjEnglish[matchedEnglish];
          });

          var htmlTemplateText = htmlTemplateText
            .replace(/\[/g, "")
            .replace(/]/g, "");

          //console.log(htmlTemplateText);

          var nodemailer = require("nodemailer");
          let MyHtml;
          let mailerName = body.name;
          MyHtml = htmlTemplateText;

          var transporter = nodemailer.createTransport({
            service: "gmail",
            port: 25,
            secure: false,
            auth: {
              user: "nits.g.setup@gmail.com",
              pass: "NITS.G.setup@01020304",
            },
            tls: {
              rejectUnauthorized: false,
            },
          });
          //console.log(emailAddress);
          var mailOptions = {
            from: "nits.g.setup@gmail.com",
            to: emailAddress,
            subject: "Welcome To Sheghardy APP",
            html: MyHtml,
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });
        }
        if (user.is_verified == 1) {
          return ReS(res, {
            message: "User registered successfully.",
            registered: isRegistered,
            token: user.getJWT(),
            data: userArray,
          });
        } else {
          return ReS(res, {
            message: "User registered successfully.",
            registered: isRegistered,
            data: userArray,
          });
        }
      } else {
        [err, user] = await to(authService.authUser(body));
        if (err) return ReE(res, err, 422);

        isRegistered = true;

        //device Token Code
        let isDeviceData;
        [err, isDeviceData] = await to(
          tbl_user_devices.findOne({
            where: {
              device_token: body.device_token,
              device_type: body.device_type,
              user_id: user.id,
            },
          })
        );
        if (isDeviceData == null) {
          device.user_id = user.id;
          device.device_token = body.device_token;
          device.device_type = body.device_type;
          [err, devicetoken] = await to(tbl_user_devices.create(device));
          if (err) TE("error in inserting device token" + err.message);
        }

        if (user.is_verified == 1) {
          return ReS(res, {
            message: "User registered successfully.",
            registered: isRegistered,
            token: user.getJWT(),
            data: userArray,
          });
        } else {
          return ReS(res, {
            message: "User registered successfully.",
            registered: isRegistered,
            data: userArray,
          });
        }
      }
    }

    //Google sign Up
    if (body.google_id != null && is_sign_up == "2") {
      [err, isUserDataGoogle] = await to(
        User.findOne({ where: { google_id: body.google_id } })
      );

      //body.mobile_no = "";
      //body.country_code = "";
      body.password = body.google_id;

      if (isUserDataGoogle == null) {
        //Mobile Check
        if (body.mobile_no != null) {
          let isUserDataG;
          [err, isUserDataG] = await to(
            User.findOne({
              where: {
                mobile_no: body.mobile_no,
                country_code: body.country_code,
              },
            })
          );

          if (isUserDataG != null) {
            let isRegistered = true;
            return ReS(res, {
              message: "Mobile No Already Register.",
              registered: isRegistered,
              token: [],
              data: [],
            });
          }
        }

        let userEntry;
        body.phone_no = "";
        body.profile_pic = "";

        [err, userEntry] = await to(authService.createUser(body));
        //console.log(userEntry);
        //console.log(err);

        [err, user] = await to(authService.authUser(body));
        let userArray = user.toWeb();

        //device Token Code
        device.user_id = userArray.id;
        device.device_token = body.device_token;
        device.device_type = body.device_type;

        [err, devicetoken] = await to(tbl_user_devices.create(device));
        if (err) TE("error in inserting device token" + err.message);

        isRegistered = false;

        if (emailAddress != "") {
          //Mail Code
          var nodemailer = require("nodemailer");
          let MyHtml;
          let mailerName = body.name;
          MyHtml = htmlTemplateText;

          var transporter = nodemailer.createTransport({
            service: "gmail",
            port: 25,
            secure: false,
            auth: {
              user: "nits.g.setup@gmail.com",
              pass: "NITS.G.setup@01020304",
            },
            tls: {
              rejectUnauthorized: false,
            },
          });
          //console.log(emailAddress);
          var mailOptions = {
            from: "nits.g.setup@gmail.com",
            to: emailAddress,
            subject: "Welcome To Sheghardy APP",
            html: MyHtml,
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });
        }
        if (user.is_verified == 1) {
          return ReS(res, {
            message: "User registered successfully.",
            registered: isRegistered,
            token: user.getJWT(),
            data: userArray,
          });
        } else {
          return ReS(res, {
            message: "User registered successfully.",
            registered: isRegistered,
            data: userArray,
          });
        }
      } else {
        body.password = body.google_id;

        //console.log(body);

        [err, user] = await to(authService.authUser(body));
        if (err) return ReE(res, err, 422);

        isRegistered = true;

        //device Token Code
        let isDeviceData;
        [err, isDeviceData] = await to(
          tbl_user_devices.findOne({
            where: {
              device_token: body.device_token,
              device_type: body.device_type,
              user_id: user.id,
            },
          })
        );
        if (isDeviceData == null) {
          device.user_id = user.id;
          device.device_token = body.device_token;
          device.device_type = body.device_type;
          [err, devicetoken] = await to(tbl_user_devices.create(device));
          if (err) TE("error in inserting device token" + err.message);
        }

        if (user.is_verified == 1) {
          return ReS(res, {
            message: "User registered successfully.",
            registered: isRegistered,
            token: user.getJWT(),
            data: userArray,
          });
        } else {
          return ReS(res, {
            message: "User registered successfully.",
            registered: isRegistered,
            data: userArray,
          });
        }
      }
    }

    //Facebook sign Up
    if (body.facebook_id != null && is_sign_up == "3") {
      [err, isUserDataFacebook] = await to(
        User.findOne({ where: { facebook_id: body.facebook_id } })
      );

      //body.mobile_no = "";
      //body.country_code = "";
      body.password = body.facebook_id;

      if (isUserDataFacebook == null) {
        //Mobile Check
        if (body.mobile_no != null) {
          let isUserDataG;
          [err, isUserDataG] = await to(
            User.findOne({
              where: {
                mobile_no: body.mobile_no,
                country_code: body.country_code,
              },
            })
          );

          if (isUserDataG != null) {
            let isRegistered = true;
            return ReS(res, {
              message: "Mobile No Already Register.",
              registered: isRegistered,
              token: [],
              data: [],
            });
          }
        }

        let userEntry;
        body.phone_no = "";
        body.profile_pic = "";

        [err, userEntry] = await to(authService.createUser(body));
        //console.log(userEntry);
        //console.log(err);

        [err, user] = await to(authService.authUser(body));
        let userArray = user.toWeb();

        //device Token Code
        device.user_id = userArray.id;
        device.device_token = body.device_token;
        device.device_type = body.device_type;

        [err, devicetoken] = await to(tbl_user_devices.create(device));
        if (err) TE("error in inserting device token" + err.message);

        isRegistered = false;

        if (emailAddress != "") {
          //Mail Code
          var nodemailer = require("nodemailer");
          let MyHtml;
          let mailerName = body.name;
          MyHtml = htmlTemplateText;

          var transporter = nodemailer.createTransport({
            service: "gmail",
            port: 25,
            secure: false,
            auth: {
              user: "nits.g.setup@gmail.com",
              pass: "NITS.G.setup@01020304",
            },
            tls: {
              rejectUnauthorized: false,
            },
          });
          //console.log(emailAddress);
          var mailOptions = {
            from: "nits.g.setup@gmail.com",
            to: emailAddress,
            subject: "Welcome To Sheghardy APP",
            html: MyHtml,
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });
        }
        if (user.is_verified == 1) {
          return ReS(res, {
            message: "User registered successfully.",
            registered: isRegistered,
            token: user.getJWT(),
            data: userArray,
          });
        } else {
          return ReS(res, {
            message: "User registered successfully.",
            registered: isRegistered,
            data: userArray,
          });
        }
      } else {
        body.password = body.facebook_id;

        //console.log(body);

        [err, user] = await to(authService.authUser(body));
        if (err) return ReE(res, err, 422);

        isRegistered = true;

        //device Token Code
        let isDeviceData;
        [err, isDeviceData] = await to(
          tbl_user_devices.findOne({
            where: {
              device_token: body.device_token,
              device_type: body.device_type,
              user_id: user.id,
            },
          })
        );
        if (isDeviceData == null) {
          device.user_id = user.id;
          device.device_token = body.device_token;
          device.device_type = body.device_type;
          [err, devicetoken] = await to(tbl_user_devices.create(device));
          if (err) TE("error in inserting device token" + err.message);
        }

        if (user.is_verified == 1) {
          return ReS(res, {
            message: "User registered successfully.",
            registered: isRegistered,
            token: user.getJWT(),
            data: userArray,
          });
        } else {
          return ReS(res, {
            message: "User registered successfully.",
            registered: isRegistered,
            data: userArray,
          });
        }
      }
    }

    //Instagram sign Up
    if (body.instagram_id != null && is_sign_up == "4") {
      [err, isUserDataFacebook] = await to(
        User.findOne({ where: { instagram_id: body.instagram_id } })
      );

      //body.mobile_no = "";
      //body.country_code = "";
      body.password = body.instagram_id;

      if (isUserDataFacebook == null) {
        //Mobile Check
        if (body.mobile_no != null) {
          let isUserDataG;
          [err, isUserDataG] = await to(
            User.findOne({
              where: {
                mobile_no: body.mobile_no,
                country_code: body.country_code,
              },
            })
          );

          if (isUserDataG != null) {
            let isRegistered = true;
            return ReS(res, {
              message: "Mobile No Already Register.",
              registered: isRegistered,
              token: [],
              data: [],
            });
          }
        }

        let userEntry;
        body.phone_no = "";
        body.profile_pic = "";

        [err, userEntry] = await to(authService.createUser(body));
        //console.log(userEntry);
        //console.log(err);

        [err, user] = await to(authService.authUser(body));
        let userArray = user.toWeb();

        //device Token Code
        device.user_id = userArray.id;
        device.device_token = body.device_token;
        device.device_type = body.device_type;

        [err, devicetoken] = await to(tbl_user_devices.create(device));
        if (err) TE("error in inserting device token" + err.message);

        isRegistered = false;

        if (emailAddress != "") {
          //Mail Code
          var nodemailer = require("nodemailer");
          let MyHtml;
          let mailerName = body.name;
          MyHtml = htmlTemplateText;

          var transporter = nodemailer.createTransport({
            service: "gmail",
            port: 25,
            secure: false,
            auth: {
              user: "nits.g.setup@gmail.com",
              pass: "NITS.G.setup@01020304",
            },
            tls: {
              rejectUnauthorized: false,
            },
          });
          //console.log(emailAddress);
          var mailOptions = {
            from: "nits.g.setup@gmail.com",
            to: emailAddress,
            subject: "Welcome To Sheghardy APP",
            html: MyHtml,
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });
        }
        if (user.is_verified == 1) {
          return ReS(res, {
            message: "User registered successfully.",
            registered: isRegistered,
            token: user.getJWT(),
            data: userArray,
          });
        } else {
          return ReS(res, {
            message: "User registered successfully.",
            registered: isRegistered,
            data: userArray,
          });
        }
      } else {
        body.password = body.instagram_id;

        //console.log(body);

        [err, user] = await to(authService.authUser(body));
        if (err) return ReE(res, err, 422);

        isRegistered = true;

        //device Token Code
        let isDeviceData;
        [err, isDeviceData] = await to(
          tbl_user_devices.findOne({
            where: {
              device_token: body.device_token,
              device_type: body.device_type,
              user_id: user.id,
            },
          })
        );
        if (isDeviceData == null) {
          device.user_id = user.id;
          device.device_token = body.device_token;
          device.device_type = body.device_type;
          [err, devicetoken] = await to(tbl_user_devices.create(device));
          if (err) TE("error in inserting device token" + err.message);
        }

        if (user.is_verified == 1) {
          return ReS(res, {
            message: "User registered successfully.",
            registered: isRegistered,
            token: user.getJWT(),
            data: userArray,
          });
        } else {
          return ReS(res, {
            message: "User registered successfully.",
            registered: isRegistered,
            data: userArray,
          });
        }
      }
    }

    if (body.linked_id != null && is_sign_up == "5") {
      [err, isUserDataFacebook] = await to(
        User.findOne({ where: { linked_id: body.linked_id } })
      );

      //body.mobile_no = "";
      //body.country_code = "";
      body.password = body.linked_id;

      if (isUserDataFacebook == null) {
        //Mobile Check
        if (body.mobile_no != null) {
          let isUserDataG;
          [err, isUserDataG] = await to(
            User.findOne({
              where: {
                mobile_no: body.mobile_no,
                country_code: body.country_code,
              },
            })
          );

          if (isUserDataG != null) {
            let isRegistered = true;
            return ReS(res, {
              message: "Mobile No Already Register.",
              registered: isRegistered,
              token: [],
              data: [],
            });
          }
        }

        let userEntry;
        body.phone_no = "";
        body.profile_pic = "";

        [err, userEntry] = await to(authService.createUser(body));
        //console.log(userEntry);
        //console.log(err);

        [err, user] = await to(authService.authUser(body));
        let userArray = user.toWeb();

        //device Token Code
        device.user_id = userArray.id;
        device.device_token = body.device_token;
        device.device_type = body.device_type;

        [err, devicetoken] = await to(tbl_user_devices.create(device));
        if (err) TE("error in inserting device token" + err.message);

        isRegistered = false;

        if (emailAddress != "") {
          //Mail Code
          var nodemailer = require("nodemailer");
          let MyHtml;
          let mailerName = body.name;
          MyHtml = htmlTemplateText;

          var transporter = nodemailer.createTransport({
            service: "gmail",
            port: 25,
            secure: false,
            auth: {
              user: "nits.g.setup@gmail.com",
              pass: "NITS.G.setup@01020304",
            },
            tls: {
              rejectUnauthorized: false,
            },
          });
          //console.log(emailAddress);
          var mailOptions = {
            from: "nits.g.setup@gmail.com",
            to: emailAddress,
            subject: "Welcome To Sheghardy APP",
            html: MyHtml,
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });
        }
        if (user.is_verified == 1) {
          return ReS(res, {
            message: "User registered successfully.",
            registered: isRegistered,
            token: user.getJWT(),
            data: userArray,
          });
        } else {
          return ReS(res, {
            message: "User registered successfully.",
            registered: isRegistered,
            data: userArray,
          });
        }
      } else {
        body.password = body.linked_id;

        //console.log(body);

        [err, user] = await to(authService.authUser(body));
        if (err) return ReE(res, err, 422);

        isRegistered = true;

        //device Token Code
        let isDeviceData;
        [err, isDeviceData] = await to(
          tbl_user_devices.findOne({
            where: {
              device_token: body.device_token,
              device_type: body.device_type,
              user_id: user.id,
            },
          })
        );
        if (isDeviceData == null) {
          device.user_id = user.id;
          device.device_token = body.device_token;
          device.device_type = body.device_type;
          [err, devicetoken] = await to(tbl_user_devices.create(device));
          if (err) TE("error in inserting device token" + err.message);
        }

        if (user.is_verified == 1) {
          return ReS(res, {
            message: "User registered successfully.",
            registered: isRegistered,
            token: user.getJWT(),
            data: userArray,
          });
        } else {
          return ReS(res, {
            message: "User registered successfully.",
            registered: isRegistered,
            data: userArray,
          });
        }
      }
    }

    if (body.twiter_id != null && is_sign_up == "6") {
      [err, isUserDataFacebook] = await to(
        User.findOne({ where: { twiter_id: body.twiter_id } })
      );

      //body.mobile_no = "";
      //body.country_code = "";
      body.password = body.twiter_id;

      if (isUserDataFacebook == null) {
        //Mobile Check
        if (body.mobile_no != null) {
          let isUserDataG;
          [err, isUserDataG] = await to(
            User.findOne({
              where: {
                mobile_no: body.mobile_no,
                country_code: body.country_code,
              },
            })
          );

          if (isUserDataG != null) {
            let isRegistered = true;
            return ReS(res, {
              message: "Mobile No Already Register.",
              registered: isRegistered,
              token: [],
              data: [],
            });
          }
        }

        let userEntry;
        body.phone_no = "";
        body.profile_pic = "";

        [err, userEntry] = await to(authService.createUser(body));
        //console.log(userEntry);
        //console.log(err);

        [err, user] = await to(authService.authUser(body));
        let userArray = user.toWeb();

        //device Token Code
        device.user_id = userArray.id;
        device.device_token = body.device_token;
        device.device_type = body.device_type;

        [err, devicetoken] = await to(tbl_user_devices.create(device));
        if (err) TE("error in inserting device token" + err.message);

        isRegistered = false;

        if (emailAddress != "") {
          //Mail Code
          var nodemailer = require("nodemailer");
          let MyHtml;
          let mailerName = body.name;
          MyHtml = htmlTemplateText;

          var transporter = nodemailer.createTransport({
            service: "gmail",
            port: 25,
            secure: false,
            auth: {
              user: "nits.g.setup@gmail.com",
              pass: "NITS.G.setup@01020304",
            },
            tls: {
              rejectUnauthorized: false,
            },
          });
          //console.log(emailAddress);
          var mailOptions = {
            from: "nits.g.setup@gmail.com",
            to: emailAddress,
            subject: "Welcome To Sheghardy APP",
            html: MyHtml,
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });
        }
        if (user.is_verified == 1) {
          return ReS(res, {
            message: "User registered successfully.",
            registered: isRegistered,
            token: user.getJWT(),
            data: userArray,
          });
        } else {
          return ReS(res, {
            message: "User registered successfully.",
            registered: isRegistered,
            data: userArray,
          });
        }
      } else {
        body.password = body.twiter_id;

        //console.log(body);

        [err, user] = await to(authService.authUser(body));
        if (err) return ReE(res, err, 422);

        isRegistered = true;

        //device Token Code
        let isDeviceData;
        [err, isDeviceData] = await to(
          tbl_user_devices.findOne({
            where: {
              device_token: body.device_token,
              device_type: body.device_type,
              user_id: user.id,
            },
          })
        );
        if (isDeviceData == null) {
          device.user_id = user.id;
          device.device_token = body.device_token;
          device.device_type = body.device_type;
          [err, devicetoken] = await to(tbl_user_devices.create(device));
          if (err) TE("error in inserting device token" + err.message);
        }

        if (user.is_verified == 1) {
          return ReS(res, {
            message: "User registered successfully.",
            registered: isRegistered,
            token: user.getJWT(),
            data: userArray,
          });
        } else {
          return ReS(res, {
            message: "User registered successfully.",
            registered: isRegistered,
            data: userArray,
          });
        }
      }
    }

    if (err) return ReE(res, err, 422);
  }
};
module.exports.createV3 = createV3;
