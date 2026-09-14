import request from "supertest";
import app from "../../src/app.js";

describe("GET /auth/session", () => {
  test("should return 401 status code", async () => {
    const response = await request(app).get("/auth/session");
    expect(response.status).toBe(401);
  });
});

describe("POST /auth/signup", () => {
  const userData = {
    firstname: "Jhon",
    lastname: "Doe",
    username: "jhondoe",
    email: "jhondoe@gmail.com",
    password: "123456ab",
  };

  test("should return 400 status code if any field is empty", async () => {
    const response = await request(app).post("/auth/signup").send({
      firstname: "",
      lastname: "",
      username: "",
      email: "",
      password: "",
    });

    expect(response.status).toBe(400);
  });

  // name validation
  test("Firstname should contain only letters", async () => {
    const response = await request(app)
      .post("/auth/signup")
      .send({ ...userData, firstname: "Jhon3" });

    expect(response.status).toBe(400);
    expect(response.body.about).toMatch("firstname");
  });
  test("Lastname should contain only letters", async () => {
    const response = await request(app)
      .post("/auth/signup")
      .send({ ...userData, lastname: "Doe3" });

    expect(response.status).toBe(400);
    expect(response.body.about).toMatch("lastname");
  });

  test("Firstname should have between 3 and 30 chatacters ", async () => {
    const firstnames = [
      "jo",
      "Jhon Doe Jhon Doe Jhon Doe Jhon Doe Jhon Doe Jhon Doe",
    ];

    for (let i = 0; i < firstnames.length; i++) {
      const response = await request(app)
        .post("/auth/signup")
        .send({ ...userData, firstname: firstnames[i] });

      expect(response.status).toBe(400);
      expect(response.body.about).toMatch("firstname");
    }
  });
  test("Lastname should have between 3 and 30 chatacters ", async () => {
    const lastnames = [
      "Do",
      "Jhon Doe Jhon Doe Jhon Doe Jhon Doe Jhon Doe Jhon Doe",
    ];

    for (let i = 0; i < lastnames.length; i++) {
      const response = await request(app)
        .post("/auth/signup")
        .send({ ...userData, lastname: lastnames[i] });

      expect(response.status).toBe(400);
      expect(response.body.about).toMatch("lastname");
    }
  });
  test("Username should have between 3 and 30 chatacters ", async () => {
    const usernames = [
      "jd",
      "Jhon Doe Jhon Doe Jhon Doe Jhon Doe Jhon Doe Jhon Doe",
    ];

    for (let i = 0; i < usernames.length; i++) {
      const response = await request(app)
        .post("/auth/signup")
        .send({ ...userData, username: usernames[i] });

      expect(response.status).toBe(400);
      expect(response.body.about).toMatch("username");
    }
  });

  // email validation
  test("Should return 400 code if email is not valid", async () => {
    const fakeEmails = [
      "john gmail@gmail.com",
      "@gmail.com",
      "john@",
      "john@gmail",
    ];

    for (let i = 0; i < fakeEmails.length; i++) {
      const response = await request(app)
        .post("/auth/signup")
        .send({
          ...userData,
          email: fakeEmails[i],
        });

      expect(response.status).toBe(400);
      expect(response.body.about).toMatch("email");
    }
  });

  // password validation
  test("Should return 400 code if password is empty", async () => {
    const response = await request(app)
      .post("/auth/signup")
      .send({
        ...userData,
        password: "",
      });

    expect(response.status).toBe(400);
    expect(response.body.about).toMatch("password");
  });
  test("password should have between 8 and 30 characters", async () => {
    const passwords = ["123456a", "123456abababababababababababababababab"];

    for (let i = 0; i < passwords.length; i++) {
      const response = await request(app)
        .post("/auth/signup")
        .send({
          ...userData,
          password: passwords[i],
        });

      expect(response.status).toBe(400);
      expect(response.body.about).toMatch("password");
    }
  });
});

// "test": "node --experimental-vm-modules node_modules/jest/bin/jest.js --runInBand ./tests/auth/signin.spec.js ./tests/auth/signup.spec.js"
