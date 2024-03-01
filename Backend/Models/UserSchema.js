import mongoose from "mongoose";
import crypto from "crypto";
import validator from "validator";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please tell us your email!"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email address"],
    },

    name: {
      type: String,
      required: [true, "Please tell us your name"],
    },

    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false,
    },

    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        // This only works on CREATE and SAVE!!!
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same!",
      },
    },

    passwordChangedAt: {
      type: Date,
      select: false,
    },

    passwordResetToken: String,
    passwordResetExpires: Date,

    phone: { type: Number },

    photo: { type: String, default: "default.jpg" },

    role: {
      type: String,
      enum: ["patient", "doctor"],
      default: "patient",
    },

    gender: { type: String, enum: ["male", "female", "other"] },

    active: {
      type: Boolean,
      default: true,
      // select: false,
    },

    bloodType: { type: String },
    appointments: [{ type: mongoose.Types.ObjectId, ref: "Booking" }],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

const User = mongoose.model("User", UserSchema);
export default User;
