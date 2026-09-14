import ServerError from "../error/server.error.js";

export const signupMiddleware = async (req, res, next) => {
  try {
    const { firstname, lastname, username, email, password } = req.body;

    // validate firstname, lastname, and username
    const validatedNames = nameValidation(firstname, lastname, username);

    // validate email
    const validatedEmail = emailValidation(email);

    // validate password
    const validatedPassword = passwordValidation(password);

    // set validated data to request body
    req.body = {
      ...validatedNames,
      ...validatedEmail,
      ...validatedPassword,
    };

    next();
  } catch (error) {
    next(error);
  }
};

const nameValidation = (firstname, lastname, username) => {
  if (!firstname)
    throw new ServerError("Firtsname cannot be empty", "firstname", 400);
  if (!lastname)
    throw new ServerError("Lastname cannot be empty", "lastname", 400);
  if (!username)
    throw new ServerError("Username cannot be empty", "username", 400);

  // check if firstname, lastname, and username contain only letters
  const nameRegex = /^[a-zA-Z]+$/;
  if (!nameRegex.test(firstname)) {
    throw new ServerError(
      "Firstname should contain only letters",
      "firstname",
      400,
    );
  }
  if (!nameRegex.test(lastname)) {
    throw new ServerError(
      "Lastname should contain only letters",
      "lastname",
      400,
    );
  }

  // check the length of firstname, lastname, and username
  if (firstname.length < 3 || firstname.length > 30) {
    throw new ServerError(
      "Firstname should be between 3 and 30 characters",
      "firstname",
      400,
    );
  }
  if (lastname.length < 3 || lastname.length > 30) {
    throw new ServerError(
      "Lastname should be between 3 and 30 characters",
      "lastname",
      400,
    );
  }
  if (username.length < 3 || username.length > 30) {
    throw new ServerError(
      "Username should be between 3 and 30 characters",
      "username",
      400,
    );
  }

  return {
    firstname: firstname.trim(),
    lastname: lastname.trim(),
    username: username.trim().toLowerCase(),
  };
};

const emailValidation = (email) => {
  if (!email) throw new ServerError("Email cannot be empty", "email", 401);

  // check if email is valid
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ServerError("Invalid email address", "email", 400);
  }

  return { email: email.trim().toLowerCase() };
};

const passwordValidation = (password) => {
  if (!password)
    throw new ServerError("Password cannot be empty", "password", 400);

  // check the password length
  if (password.length < 8 || password.length > 30) {
    throw new ServerError(
      "Password should be between 8 and 30 characters",
      "password",
      400,
    );
  }

  // check if the password at least contain a letter and a number
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/;
  if (!passwordRegex.test(password)) {
    throw new ServerError(
      "Password should contain at least one letter and one number",
      "password",
      400,
    );
  }

  return { password };
};
