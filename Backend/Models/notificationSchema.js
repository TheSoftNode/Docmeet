import mongoose from "mongoose";
import validator from "validator";

const notificationSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      //   required: [true, "Please provide your name"],
    },

    doctor: {
      type: mongoose.Schema.ObjectId,
      ref: "Doctor",
    },

    notificationType: {
      type: String,
      required: true,
      default: "request",
    },

    title: {
      type: String,
      required: [true, "Please provide a title for your request"],
    },

    message: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: [true, "Please provide your email address"],
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },

    status: {
      type: String,
      required: true,
      default: "unread",
    },
  },
  { timestamps: true }
);

notificationSchema.pre(/^find/, function (next) {
  this.populate({
    path: "doctor",
    select: "name photo",
  }).populate({
    path: "user",
    select: "name photo",
  });
  next();
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
