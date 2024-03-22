import jwt from "jsonwebtoken";

// Prepare and send token to the user
export const sendToken = (user, statusCode, res) => {
  const accessToken = SignInAccessToken(user._id, user.role, "90d");
  const refreshToken = SignInRefreshToken(user._id, user.role, "3d");

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
    refreshToken,
  });
};

// Sign Access token
export const SignInAccessToken = function (id, role, exp) {
  return jwt.sign({ id, role }, process.env.ACCESS_TOKEN, {
    expiresIn: exp,
  });
};

// Sign Refresh token
export const SignInRefreshToken = function (id, role, exp) {
  return jwt.sign({ id, role }, process.env.REFRESH_TOKEN, {
    expiresIn: exp,
  });
};
