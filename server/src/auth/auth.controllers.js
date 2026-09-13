import ServerError from "../error/server.error.js";

export const signupController = async (req, res, next) => {
  try {
    const { firstname, lastname, username, email, password } = req.body;

    console.log({ firstname, lastname, username, email, password });

    return res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    next(error);
  }
};
