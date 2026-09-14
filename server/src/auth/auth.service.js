import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import ServerError from "../error/server.error.js";
import { getUserByEmail, getUserByUsername } from "../helpers/users.helper.js";
import emailSender from "../utils/nodemailer.js";
import { codeToken } from "../utils/tokens.js";
import pool from "../db/pool.js";

export const signupService = async (
  firstname,
  lastname,
  username,
  email,
  password,
) => {
  // verify if the user email is already in use
  const existingUser = await getUserByEmail(email);
  if (existingUser)
    throw new ServerError("Email is already in use", "email", 400);

  // verify if the user username is already in use
  const existingUsername = await getUserByUsername(username);
  if (existingUsername)
    throw new ServerError("Username is already in use", "username", 400);

  const mailSent = await emailSender(email);
  if (!mailSent.ok) throw new ServerError(mailSent.message, "email", 500);

  const data = {
    firstname,
    lastname,
    username,
    email,
    password,
    code: mailSent.code,
  };

  const getCodeToken = codeToken(data);

  return getCodeToken;
};

export const signupVerifyService = async (req, codeSent) => {
  // verify if the token is still available
  const payload = jwt.verify(req.cookies.code, process.env.CODE_TOKEN_SECRET);
  if (!payload) throw new ServerError("Code nay expired", "code", 409);

  const { firstname, lastname, username, email, password, code } = payload;

  // verify if the code sent is the correct one
  if (codeSent != code)
    throw new ServerError("Incorrect verification code", "code", 409);

  // hashing the password
  const newPassword = await bcrypt.hash(password, 10);

  // creating the user
  const { rows } = await pool.query(
    `
    INSERT INTO users (firstname, lastname, username, email, password)
        VALUES ($1, $2, $3, $4, $5) RETURNING id;
    `,
    [firstname, lastname, username, email, newPassword],
  );

  return rows[0].id;
};

export const signinService = async (email, password) => {
  // verify if the user email is in db
  const user = await getUserByEmail(email);
  if (!user) throw new ServerError("User not found", "email", 404);

  // verify if the password is correct
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect)
    throw new ServerError("Incorrect password", "password", 409);

  return user.id;
};
