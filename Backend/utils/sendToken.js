import jwt from "jsonwebtoken";

// Parse environment variables to integrate with fallback values
const accessTokenExpire = parseInt(
  process.env.ACCESS_TOKEN_EXPIRES_IN || "300",
  10
);

const refreshTokenExpire = parseInt(
  process.env.REFRESH_TOKEN_EXPIRES_IN || "1200",
  10
);

// options for cookies
// export const accessTokenOptions = {
//   expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000),
//   maxAge: accessTokenExpire * 60 * 60 * 1000,
//   httpOnly: true,
//   sameSite: "lax",
// };

// export const refreshTokenOptions = {
//   expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
//   maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
//   httpOnly: true,
//   sameSite: "lax",
// };

// Prepare and send token to the user
export const sendToken = (user, statusCode, res) => {
  const accessToken = SignInAccessToken(user._id, user.role, "10m");
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
