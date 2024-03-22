import Doctor from "../Models/DoctorSchema.js";
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
import Notification from "../Models/notificationSchema.js";

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const getDoctorProfile = (req, res, next) => {
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
  //   const filteredBody = filterObj(req.body, "name", "email");
  //   if (req.file) filteredBody.photo = req.file.filename;

  // 3) Update user document
  const updatedDoctor = await Doctor.findByIdAndUpdate(
    req.user.id,
    req.body,
    // filteredBody,
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

export const requestApproval = catchAsync(async (req, res, next) => {
  const user = req.user;

  // send email to the doctor telling him to look out for the approval
  const data = {
    user: { name: user.name, role: user.role },
  };

  // Also, Send a notification to the admin to verify approve the doctor
  const notification = {
    doctor: user.id,
    notificationType: "Approval Request",
    title: "Verify and Approve a new Doctor",
    message: "Please verify my credentials and kindly approve. Thanks.",
    email: user.email,
  };

  await Notification.create(notification);

  await new Email(user, data).awaitApproval();

  // Send email to the admins to verify and approve the doctor
  // 1) Find all the admins
  const adminUser = await User.find({ role: "admin" });
  const adminDoctor = await Doctor.find({ role: "admin" });

  if (adminUser || adminDoctor) {
    let adminEmails = [];

    adminEmails = [
      ...adminEmails,
      ...adminUser.map((el) => {
        return { email: el.email, name: el.name };
      }),
    ];
    adminEmails = [
      ...adminEmails,
      ...adminDoctor.map((el) => {
        return { email: el.email, name: el.name };
      }),
    ];

    //   console.log(adminEmails);

    adminEmails.forEach(async (el) => {
      const approvalAdmin = {
        email: el.email,
      };

      data.user.adminName = el.name;
      await new Email(approvalAdmin, data).doctorApprovalRequest();
    });
  }

  res.status(200).json({
    status: "success",
    message: "Request sent. Await approval",
  });
});

export const approveDoctor = catchAsync(async (req, res, next) => {
  const doctor = await Doctor.findByIdAndUpdate(req.params.id, {
    isApproved: "approved",
  });

  if (!doctor) return next(new AppError("Doctor not found", 404));

  // send email to the doctor telling him that he/she has been approved
  const data = {
    user: { name: doctor.name },
  };

  await new Email(doctor, data).doctorApproved();

  res.status(200).json({
    status: "success",
    data: {
      message: "Doctor Approval successful",
    },
  });
});

export const revokeDoctorApproval = catchAsync(async (req, res, next) => {
  console.log(req.body);

  const doctor = await Doctor.findByIdAndUpdate(req.params.id, {
    isApproved: "revoked",
  });

  if (!doctor) return next(new AppError("Doctor not found", 404));

  // send email to the doctor telling him that he/she has been approved
  const data = {
    user: { name: doctor.name },
    detail: { reason: req.body.actionReason },
  };

  await new Email(doctor, data).doctorRevoked();

  res.status(200).json({
    status: "success",
    data: {
      message: "Doctor Approval successful",
    },
  });
});

export const cancelDoctorApprovalRequest = catchAsync(
  async (req, res, next) => {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, {
      isApproved: "cancelled",
    });

    if (!doctor) return next(new AppError("Doctor not found", 404));

    // send email to the doctor telling him that he/she has been approved
    const data = {
      user: { name: doctor.name },
      detail: { reason: req.body.reason },
    };

    await new Email(doctor, data).doctorApprovalRequestCancelled();

    res.status(200).json({
      status: "success",
      data: {
        message: "Doctor Approval successful",
      },
    });
  }
);

export const getDoctor = getOne(Doctor, [
  { path: "reviews" },
  { path: "appointments" },
]);
export const getAllDoctors = getAll(Doctor);
export const getAllDoctorsByAdmin = getAll(Doctor);
export const updateDoctorRole = updateRole(Doctor, User, "patient");

// Do NOT update passwords with this!
export const updateDoctor = updateOne(Doctor);
export const deleteDoctor = deleteOne(Doctor);
export const deActivateDoctor = deactivateOne(Doctor);
