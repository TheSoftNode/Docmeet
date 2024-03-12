import catchAsync from "../utils/catchAsync.js";
import AppError from "../errorHandlers/appError.js";
import APIFeatures from "../utils/apiFeatures.js";

export const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

export const deactivateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    await Model.findByIdAndUpdate(req.params.id, { active: false });

    res.status(204).json({
      status: "success",
      data: "Account deactivated!",
    });
  });

export const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

export const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

export const getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

export const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on doctor (hack)
    let filter = {};
    if (req.user) {
      if (Model.modelName == "Doctor") {
        if (req.user.role.includes("admin")) {
          filter = {};
        } else {
          filter = { isApproved: "approved" };
        }
      }
    }

    if (req.params.doctorId)
      filter = { ...filter, doctor: req.params.doctorId };

    console.log(filter);

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // const doc = await features.query.explain();
    const doc = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });

export const updateRole = (Model, destModel, newRole) =>
  catchAsync(async (req, res, next) => {
    let newUser = null;

    if (req.body.role && req.body.role === newRole) {
      const doc = await Model.findByIdAndDelete(req.params.id).select(
        "+password"
      );

      if (!doc)
        return next(
          new AppError("The user/doc with that ID doesn't exist", 404)
        );

      const newDoc = {
        email: doc.email,
        name: doc.name,
        password: doc.password,
        hashPassword: false,
        role: newRole,
        gender: doc.gender,
      };

      newUser = new destModel(newDoc);

      await newUser.save({ validateBeforeSave: false });
    } else {
      //   newUser = await Model.findById(req.params.id);
      //   newUser.role = [...newUser.role, req.body.role];
      //   newUser.save({ validateBeforeSave: false });

      newUser = await Model.findByIdAndUpdate(
        req.params.id,
        {
          //   $push: { roles: { $each: req.body.roles } },
          $push: { role: req.body.role },
        },
        { new: true }
      );

      if (!newUser)
        return next(
          new AppError("The user/doctor with that Id wasn't found", 404)
        );

      //   newUser = await Model.findByIdAndUpdate(
      //     req.params.id,
      //     {
      //       role: req.body.role,
      //     },
      //     { new: true }
      //   );
    }

    res.status(200).json({
      status: "success",
      data: newUser,
    });
  });
