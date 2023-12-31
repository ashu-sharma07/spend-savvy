// creating jwt token and saving in cookie

export const sendToken = (user, statusCode, res) => {
  const token = user.getJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  // remove password from output
  user.password = undefined;
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    user,
  });
};
