import catchAyncErrors from "../middleware/catchAyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sendToken } from "../utils/jwtToken.js";
import sendEmail from "../utils/sendEmail.js";
import User from "../models/userModel.js";
import axios from "axios";
import * as EmailValidator from "email-validator";

// Register a user -- Public
export const registerUser = catchAyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;
  let regex = new RegExp(
    "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
  );

  if (!regex.test(email)) {
    return next(new ErrorHandler("Please enter valid email", 400));
  }
  if (!EmailValidator.validate(email)) {
    return next(new ErrorHandler("Please enter valid email", 400));
  }
  const user = await User.create({
    name,
    email,
    password,
  });
  sendToken(user, 201, res);
});

// Login user -- Public

export const loginUser = catchAyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  // Check if email and password is entered by user
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & password", 400));
  }
  // Finding user in database
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }
  sendToken(user, 200, res);
});

// Logout user -- Public
export const logout = catchAyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});

export const forgotPassword = catchAyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
  }
  // Get reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  const message = `Your password reset OTP is :\n\n${resetToken}\n\nIf you have not requested this email, then ignore it.`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Spend Savvy Password Recovery",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to: ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset password -- Public

export const resetPassword = catchAyncErrors(async (req, res, next) => {
  const resetPasswordToken = req.body.resetPasswordOtp;
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new ErrorHandler("Password reset OTP is invalid or has expired", 400)
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }
  // Setup new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendToken(user, 200, res);
});

export const setPref = catchAyncErrors(async (req, res, next) => {
  const preferences = req.body;
  const setPredict = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/predict", {
        Gender: preferences.gender,
        Age: Number(preferences.age),
        Study_year: Number(preferences.studyYear),
        Living: preferences.living,
        Scholarship: preferences.scholarship,
        Part_time_job: preferences.jobs,
        Transporting: preferences.transporting,
        Smoking: preferences.smoking,
        Drinks: preferences.drinks,
        Games_Hobbies: preferences.hobbies,
        Cosmetics_Self_Care: preferences.cosmetics,
        Monthly_Subscription: preferences.sub,
      });
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const predictedBudget = await setPredict();
  // res.status(200).json({
  //   messege: predictedBudget.prediction,
  // });
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { preferences: preferences, pBudget: predictedBudget.prediction },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  await user.save();
  res.status(200).json({
    messege: predictedBudget.prediction,
  });
});

// mdical preferences
export const setMedical = catchAyncErrors(async (req, res, next) => {
  const preferences = req.body;
  const setPredict = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/predict_medical", {
        sex: preferences.sex,
        age: Number(preferences.age),
        bmi: Number(preferences.bmi),
        children: preferences.children,
        smoker: preferences.smoker,
        region: preferences.region,
      });
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const predictedMedical = await setPredict();
  res.status(200).json({
    messege: predictedMedical.prediction,
  });
});
