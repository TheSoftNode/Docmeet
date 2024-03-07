import catchAsync from "../utils/catchAsync.js";
import AppError from "../errorHandlers/appError.js";
import Jwt from "jsonwebtoken";
import User from "../Models/UserSchema.js";
import Doctor from "../Models/DoctorSchema.js";

export const isAuthenticated = catchAsync(async (req, res, next) => {
  // get token from headers
  const authToken = req.headers.authorization;

  // Check if token exists
  if (!authToken || !authToken.startsWith("Bearer ")) {
    return next(new AppError("Please, login to access this resources", 401));
  }

  const access_token = authToken.split(" ")[1];

  const decoded = Jwt.verify(access_token, process.env.ACCESS_TOKEN);

  if (!decoded) return next(new AppError("Invalid Access Token", 400));

  let user;
  const patient = await User.findById(decoded.id);

  //   let doctor = null;

  if (!patient) {
    const doctor = await Doctor.findById(decoded.id);
    user = doctor;
  } else {
    user = patient;
  }

  //   if (patient) {
  //     user = patient;
  //   } else if (doctor) {
  //     user = doctor;
  //   }

  if (!user)
    return next(new AppError("Please login to access this resource", 400));

  // 4) Check if user changed password after the token was issued
  if (user.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  req.user = user;
  next();
});
