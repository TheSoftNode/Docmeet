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

    hashPassword: {
      type: Boolean,
      default: true,
      select: false,
    },

    confirmPassword: {
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
      type: [String],
      enum: ["patient", "admin"],
      default: ["patient"],
    },

    gender: { type: String, enum: ["male", "female", "other"] },

    active: {
      type: Boolean,
      default: true,
      select: false,
    },

    bloodType: { type: String },
    appointments: [{ type: mongoose.Types.ObjectId, ref: "Booking" }],
  },
  { timestamps: true }
);

UserSchema.index({ role: 1 });

UserSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password") || !this.hashPassword) {
    this.hashPassword = undefined;
    return next();
  }

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.confirmPassword = undefined;
  this.hashPassword = undefined;

  next();
});

UserSchema.pre(/^find/, function (next) {
  // this points to the current query
  if (this.getOptions().role === "admin") return next();

  this.find({ active: { $ne: false } });
  next();
});

UserSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", UserSchema);
export default User;
