import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const DoctorSchema = new mongoose.Schema(
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

    gender: { type: String, enum: ["male", "female", "other"] },

    active: {
      type: Boolean,
      default: true,
      select: false,
    },

    ticketPrice: { type: Number },
    role: {
      type: String,
      enum: ["doctor", "admin"],
    },

    // Fields for doctors only
    specialization: { type: String },
    qualifications: {
      type: Array,
    },

    experiences: {
      type: Array,
    },

    bio: { type: String, maxLength: 50 },
    about: { type: String },
    timeSlots: { type: Array },
    // reviews: [{ type: mongoose.Types.ObjectId, ref: "Review" }],
    averageRating: {
      type: Number,
      default: 0,
    },
    totalRating: {
      type: Number,
      default: 0,
    },
    isApproved: {
      type: String,
      enum: ["pending", "approved", "cancelled"],
      default: "pending",
    },
    appointments: [{ type: mongoose.Types.ObjectId, ref: "Appointment" }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

DoctorSchema.pre("save", async function (next) {
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

DoctorSchema.pre(/^find/, function (next) {
  // this points to the current query
  if (this.getOptions().role === "admin") return next();

  this.find({ isApproved: "approved", active: { $ne: false } });
  next();
});

// Virtual populate
DoctorSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "doctor",
  localField: "_id",
});

DoctorSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
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

const Doctor = mongoose.model("Doctor", DoctorSchema);
export default Doctor;
