export const cookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  maxAge: 1000 * 60 * 60 * 24 * 30,
};

export const sendingCookies = (res, accessToken, refreshToken, message) => {
  res.cookie("refreshToken", refreshToken, cookieOptions);
  res.setHeader("access-token", accessToken);
  res.status(201).json({ message });
};

export const codeCookies = (res, data) => {
  res
    .cookie("code", data, {
      ...cookieOptions,
      maxAge: 1000 * 60 * 5,
    })
    .status(201)
    .json({ message: "Code sent to your email" });
};
