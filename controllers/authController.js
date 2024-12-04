import Joi from "joi";
import CustomErrorHandler from "../service/customErrorHandler.js";
import bcrypt from "bcrypt";
import { userModel } from "../models/auth.model.js";
import JwtService from "../service/JwtService.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

export const authController = {
  register: async (req, res, next) => {
    const registerUserSchema = Joi.object({
      name: Joi.string().required().min(3).max(30),
      email: Joi.string().required().email(),
      password: Joi.string()
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        )
        .message(
          "Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter, one number, and one special character"
        )
        .required(),
    });

    const { error } = registerUserSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { name, email, password } = req.body;

    try {
      const existingUser = await userModel.findOne({ email: email });
      if (existingUser) {
        return res.status(401).json({
          success: false,
          message: "Email already Exists Try another One",
        });

        // if (existingUser.verified === false) {
        //   const token = JwtService.sign(
        //     { _id: existingUser._id },
        //     process.env.JWT_SECRET
        //   );

        //   let mailTransporter = nodemailer.createTransport({
        //     service: "gmail",
        //     host:"smtp.gmail.com",
        //     port:465,
        //     secure:true,
        //     auth: {
        //       user: process.env.USER,
        //       pass: process.env.PASS,
        //     },
        //   });

        //   let mailDetails = {
        //     to: existingUser.email,
        //     from: process.env.USER,
        //     subject: "Verify your account clicking here !",
        //     html: `
        //     <h1> Welcome to BetterInfos Blog! </h1>
        //     <p> We are happy to have you here </p>
        //     <a href="http://localhost:5000/auth/activate/${token}"> Click here to verify your email </a>
        //   `,
        //   };

        //   await mailTransporter.sendMail(mailDetails);

        //   return res.status(200).json({
        //     success: true,
        //     message: "Account activation link has been sent to your account",
        //   });
        // } else {
        //   return res.status(401).json({
        //     success: false,
        //     message: "Email is already Exists and Verified!",
        //   });
        // }
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await userModel.create({
        name,
        email,
        password: hashedPassword,
        verified: true,
      });

      const token = JwtService.sign({ _id: user._id }, process.env.JWT_SECRET);

      // let mailTransporter = nodemailer.createTransport({
      //   service: "gmail",
      //   auth: {
      //     user: process.env.USER,
      //     pass: process.env.PASS,
      //   },
      // });

      // let mailDetails = {
      //   to: email,
      //   from: process.env.USER,
      //   subject: "Verify your account clicking here !",
      //   html: `
      //   <h1> Welcome to BetterInfos Blog! </h1>
      //   <p> We are happy to have you here </p>
      //   <a href="http://localhost:5000/auth/activate/${token}"> Click here to verify your email </a>
      // `,
      // };

      // await mailTransporter.sendMail(mailDetails);

      return res.status(200).json({
        success: true,
        message: "Registration Successfull",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong" + error.message,
      });
    }
  },

  activateAccount: async (req, res, next) => {
    try {
      const token = req.params.token;
      if (token) {
        const decode = jwt.decode(token);
        const userId = decode._id;
        try {
          const existingUser = await userModel.findByIdAndUpdate(
            userId,
            { verified: true },
            { new: true }
          );
          if (!existingUser) {
            return res
              .status(404)
              .json({ success: false, message: "User not found." });
          }

          if (existingUser) {
            res.redirect(
              302,
              "https://betterinfos.vercel.app/verification-successfull"
            );
          }

          // res.status(200).json({
          //   success: true,
          //   message: "User verified successfully.",
          //   user: existingUser,
          // });
        } catch (error) {
          console.log(error);
          res
            .status(500)
            .json({ success: false, message: "Internal server error." });
        }
      }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  },

  login: async (req, res, next) => {
    const loginSchema = Joi.object({
      email: Joi.string().required(),
      password: Joi.string()
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        )
        .message(
          "Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter, one number, and one special character"
        )
        .required(),
    });

    const { error } = loginSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { email, password } = req.body;

    try {
      const user = await userModel.findOne({ email: email });

      if (!user) {
        return next(
          CustomErrorHandler.wrongCredentials("Incorrect email or password")
        );
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return next(
          CustomErrorHandler.wrongCredentials("Incorrect email or password")
        );
      }

      const payload = {
        _id: user._id,
      };

      const token = JwtService.sign(payload, process.env.JWT_SECRET);

      return res.json({
        token: token,
        id: user._id,
        name: user.name,
        message: "Login Successful",
      });
    } catch (error) {
      return next(err);
    }
  },

  updateProfile: async (req, res, next) => {
    const fileImage = req.files?.profileImage?.[0];
    const { userId, name, email, profileImage } = req.body;

    try {
      const user = await userModel.findOneAndUpdate(
        { _id: userId },
        {
          name,
          email,
          profileImage: profileImage || fileImage?.filename,
        },
        { new: true }
      );

      return res.json({
        message: "Profile Updated Successfully",
        profile: user,
      });
    } catch (error) {
      return next(error);
    }
  },

  getUserProfile: async (req, res, next) => {
    const { userId } = req.body;

    try {
      const user = await userModel.findOne({ _id: userId });

      if (user) {
        return res.json({
          message: "user profile fetched",
          profile: user,
        });
      } else {
        return res.status(401).json({ message: "User Doesn't Exist" });
      }
    } catch (error) {
      return next(error);
    }
  },
};
