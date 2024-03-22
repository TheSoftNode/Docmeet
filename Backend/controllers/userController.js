import User from "../Models/UserSchema.js";
import catchAsync from "./../utils/catchAsync.js";
import AppError from "../errorHandlers/appError.js";
import {
  deactivateOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
  updateRole,
} from "../services/GenericService.js";
import Email from "../emails/email.js";
import Doctor from "../Models/DoctorSchema.js";
import Booking from "../Models/BookingSchema.js";

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const getUserProfile = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

export const getMyAppointments = catchAsync(async (req, res) => {
  // step -1 : retrieve appointments from booking for specific user
  const bookings = await Booking.find({ user: req.user.id });

  // step -2 : extract doctor ids from appointment bookings
  const doctorIds = bookings.map((el) => el.doctor.id);

  // step - 3 : retrieve doctors using doctor ids
  const doctors = await Doctor.find({ _id: { $in: doctorIds } });

  res.status(200).json({
    status: "success",
    data: {
      doctors,
    },
  });
});

export const updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(
    req.body,
    "name",
    "email",
    "gender",
    "bloodType",
    "photo"
  );
  //   if (req.file) filteredBody.photo = req.file.filename;

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

export const reactivateAccount = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email }).setOptions({
    role: "admin",
  });

  if (!user)
    return next(
      new AppError(
        "Data not found. Please SignUp to get access to the resources",
        404
      )
    );

  if (user.active == true)
    return next(
      new AppError("Login to your Account. Your account is still active", 400)
    );

  user.active = true;
  await user.save({ validateBeforeSave: false });

  const data = {
    user: { name: user.name },
  };

  await new Email(user, data).accountReactivated();

  res.status(200).json({
    status: "success",
    data: user,
  });
});

export const createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not defined! Please use /signup instead",
  });
};

export const getUser = getOne(User);
export const getAllUsers = getAll(User);
export const updateUserRole = updateRole(User, Doctor, "doctor");

// Do NOT update passwords with this!
export const updateUser = updateOne(User);
export const deleteUser = deleteOne(User);
export const deActivateUser = deactivateOne(User);
