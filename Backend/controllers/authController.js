import catchAsync from "../utils/catchAsync.js";
import User from "../Models/UserSchema.js";
import Doctor from "../Models/DoctorSchema.js";
import AppError from "../errorHandlers/appError.js";
import {
  SignInAccessToken,
  SignInRefreshToken,
  sendToken,
} from "../utils/sendToken.js";
import Email from "../emails/email.js";
import jwt from "jsonwebtoken";
import { correctPassword } from "../services/passwordServices.js";

// Create activation token and the token
export const createActivationToken = (user) => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const activationToken = jwt.sign(
    { user, activationCode },
    process.env.VERIFY_EMAIL_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );

  return { activationToken, activationCode };
};

// Verify Account before saving it.
export const signUp = catchAsync(async (req, res, next) => {
  const { email, name, password, confirmPassword, role, gender } = req.body;

  //   let checkEmail = null;

  const patient = await User.findOne({ email });
  const doctor = await Doctor.findOne({ email });

  //   if (role === "patient") {
  //     checkEmail = await User.findOne({ email });
  //   } else if (role === "doctor") {
  //     checkEmail = await Doctor.findOne({ email });
  //   }

  if (patient || doctor) return next(new AppError("Email Already exists", 400));

  const user = {
    email,
    name,
    password,
    confirmPassword,
    role,
    gender,
  };

  const { activationToken, activationCode } = createActivationToken(user);

  const data = {
    user: { name: user.name },
    activationCode,
  };

  await new Email(user, data).activateRegistration();

  res.status(201).json({
    success: true,
    message: `Please check your email: ${user.email} to activate your account!`,
    activationCode,
    activationToken,
  });
});

// Sign Up the user - persist user data to database
export const activateUser = catchAsync(async (req, res, next) => {
  //   1) Getting token and check of it's there
  let activation_token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    activation_token = req.headers.authorization.split(" ")[1];
  }

  const { activation_code } = req.body;

  const newUser = jwt.verify(activation_token, process.env.VERIFY_EMAIL_SECRET);

  if (newUser.activationCode != activation_code)
    return next(new AppError("Invalid token. Please try again", 401));

  const { email, name, password, confirmPassword, role, gender } = newUser.user;

  let user = null;

  if (role === "patient") {
    user = await User.create({
      email,
      name,
      password,
      confirmPassword,
      role,
      gender,
    });
  } else if (role === "doctor") {
    user = await Doctor.create({
      email,
      name,
      password,
      confirmPassword,
      role,
      gender,
    });
  }

  sendToken(user, 201, res);
});

// Login the user
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  // 2) Check if user exists && password is correct
  let user = null;

  const patient = await User.findOne({ email }).select("+password");
  const doctor = await Doctor.findOne({ email }).select("+password");

  if (patient) {
    user = patient;
  } else if (doctor) {
    user = doctor;
  }

  if (!user || !(await correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 3) If everything ok, send token to client
  sendToken(user, 200, res);
});

// update access token
export const refreshToken = catchAsync(async (req, res, next) => {
  let refresh_token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    refresh_token = req.headers.authorization.split(" ")[1];
  }

  const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN);

  if (!decoded) return next(new AppError("Could not refresh token", 400));

  let currentUser = null;

  if (decoded.role === "patient") {
    currentUser = await User.findById(decoded.id);
  } else {
    currentUser = await Doctor.findById(decoded.id);
  }

  if (!currentUser)
    return next(new AppError("Please login to access these resources!", 400));

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  const accessToken = SignInAccessToken(
    currentUser._id,
    currentUser.role,
    "5m"
  );
  const refreshToken = SignInRefreshToken(
    currentUser._id,
    currentUser.role,
    "3d"
  );

  req.user = currentUser;

  // Set the Authorization header with the accessToken
  res.setHeader("Authorization", `Bearer ${accessToken}`);
  // Optionally, you can also send the refreshToken in a custom header
  res.setHeader("X-Refresh-Token", refreshToken);

  res.status(200).json({
    status: "success",
    accessToken,
    refreshToken,
  });
});
