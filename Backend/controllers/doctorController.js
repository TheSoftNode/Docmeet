import Doctor from "../Models/DoctorSchema.js";
import catchAsync from "./../utils/catchAsync.js";
import AppError from "../errorHandlers/appError.js";
import {
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "../services/GenericService.js";
import Email from "../emails/email.js";

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
  const updatedUser = await Doctor.findByIdAndUpdate(
    req.user.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      doctor: updatedDoctor,
    },
  });
});

export const deleteMe = catchAsync(async (req, res, next) => {
  await Doctor.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

export const reactivateAccount = catchAsync(async (req, res, next) => {
  const doctor = await Doctor.findOne({ email: req.body.email }).setOptions({
    role: "admin",
  });

  if (!doctor)
    return next(
      new AppError(
        "Data not found. Please SignUp to get access to the resources",
        404
      )
    );

  if (doctor.active == true)
    return next(
      new AppError("Login to your Account. Your account is still active", 400)
    );

  doctor.active = true;
  await doctor.save({ validateBeforeSave: false });

  const data = {
    doctor: { name: doctor.name },
  };

  await new Email(doctor, data).accountReactivated();

  res.status(200).json({
    status: "success",
    data: doctor,
  });
});

export const createDoctor = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not defined! Please use /signup instead",
  });
};

export const getDoctor = getOne(Doctor);
export const getAllDoctors = getAll(Doctor);

// Do NOT update passwords with this!
export const updateDoctor = updateOne(Doctor);
export const deleteDoctor = deleteOne(Doctor);
