import User from "../Models/UserSchema.js";
import catchAsync from "./../utils/catchAsync.js";
import AppError from "../errorHandlers/appError.js";
import {
  deleteOne,
  getAll,
  getOne,
  updateOne,
  updateRole,
} from "../services/GenericService.js";
import Email from "../emails/email.js";
import Doctor from "../Models/DoctorSchema.js";

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

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
  const filteredBody = filterObj(req.body, "name", "email");
  if (req.file) filteredBody.photo = req.file.filename;

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

export const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// export const updateUserRole = catchAsync(async (req, res, next) => {
//   let newUser = null;

//   if (req.body.role && req.body.role === "doctor") {
//     const user = await User.findByIdAndDelete(req.params.id).select(
//       "+password"
//     );

//     if (!user)
//       return next(new AppError("The user with that ID doesn't exist", 404));

//     const newDoctor = {
//       email: user.email,
//       name: user.name,
//       password: user.password,
//       hashPassword: false,
//       role: "doctor",
//       gender: user.gender,
//     };

//     newUser = new Doctor(newDoctor);

//     await newUser.save({ validateBeforeSave: false });
//   } else {
//     newUser = await User.findByIdAndUpdate(
//       req.params.id,
//       {
//         role: req.body.role,
//       },
//       { new: true }
//     );
//   }

//   res.status(200).json({
//     status: "success",
//     data: newUser,
//   });
// });

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
