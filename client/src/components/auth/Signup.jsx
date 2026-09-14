import React, { useState } from "react";
import { Eye, EyeSplash } from "../svg";
import { registerData } from "../../services/auth";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [seePassword, setSeePassword] = useState(false);

  const [firstnameErr, setFirstnameErr] = useState(false);
  const [lastnameErr, setLastnameErr] = useState(false);
  const [passwordErr, setPasswordErr] = useState(false);
  const [aliasErr, setAliasErr] = useState(false);
  const [emailErr, setEmailErr] = useState(false);

  const [firstnameErrTxt, setFirstnameErrTxt] = useState("");
  const [lastnameErrTxt, setLastnameErrTxt] = useState("");
  const [passwordErrTxt, setPasswordErrTxt] = useState("");
  const [aliasErrTxt, setAliasErrTxt] = useState("");
  const [emailErrTxt, setEmailErrTxt] = useState("");

  const [loading, setLoading] = useState(false);

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setAliasErr(false);
    setEmailErr(false);
    setPasswordErr(false);
    setFirstnameErr(false);
    setLastnameErr(false);

    setAliasErrTxt("");
    setEmailErrTxt("");
    setPasswordErrTxt("");
    setFirstnameErrTxt("");
    setLastnameErrTxt("");
    setLoading(true);

    try {
      const res = await registerData(
        firstname,
        lastname,
        username,
        email,
        password,
      );

      if (!res.success) throw new Error(res.message);

      navigate("/verify");
    } catch (error) {
      setLoading(false);

      // console.log(error.response);

      if (error?.response?.data?.about == "email") {
        setEmailErr(true);
        setLoading(false);
        setEmailErrTxt(error.response.data.message);
      }

      if (error?.response?.data?.about == "username") {
        setAliasErr(true);
        setAliasErrTxt(error.response.data.message);
      }

      if (error?.response?.data?.about == "firstname") {
        setFirstnameErr(true);
        setFirstnameErrTxt(error.response.data.message);
      }

      if (error?.response?.data?.about == "lastname") {
        setLastnameErr(true);
        setLastnameErrTxt(error.response.data.message);
      }

      if (error?.response?.data?.about == "password") {
        setPasswordErr(true);
        setPasswordErrTxt(error.response.data.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Sign up</h1>

      <article className="name_field">
        <div className="name_container">
          <label>First Name</label>
          <input
            type="text"
            placeholder=" "
            maxLength={40}
            value={firstname}
            onChange={(e) =>
              setFirstname(
                e.target.value.charAt(0).toUpperCase() +
                  e.target.value.slice(1),
              )
            }
            required
          />
        </div>
        {firstnameErr && <p className="error">*{firstnameErrTxt}</p>}
      </article>
      <article className="name_field">
        <div className="name_container">
          <label>Last Name</label>
          <input
            type="text"
            placeholder=" "
            maxLength={40}
            value={lastname}
            onChange={(e) =>
              setLastname(
                e.target.value.charAt(0).toUpperCase() +
                  e.target.value.slice(1),
              )
            }
            required
          />
        </div>
        {lastnameErr && <p className="error">*{lastnameErrTxt}</p>}
      </article>

      <article className="alias_field">
        <div className="alias_container">
          <label>Username</label>
          <input
            type="text"
            placeholder=" "
            value={username}
            onKeyDown={(e) => e.key === " " && e.preventDefault()}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={15}
            required
          />
        </div>
        {aliasErr && <p className="error">*{aliasErrTxt}</p>}
      </article>

      <article className="email_field">
        <div className="email_container">
          <label>Email</label>
          <input
            type="email"
            placeholder=" "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={40}
            required
          />
        </div>
        {emailErr && <p className="error">*{emailErrTxt}</p>}
      </article>

      <article className="password_field">
        <div className="password_container">
          <label>Password</label>
          <input
            type={seePassword ? "text" : "password"}
            placeholder=" "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            maxLength={12}
            required
          />
          {seePassword ? (
            <span onClick={() => setSeePassword(false)}>
              <Eye />
            </span>
          ) : (
            <span onClick={() => setSeePassword(true)}>
              <EyeSplash />
            </span>
          )}
        </div>
        {passwordErr && <p className="error">*{passwordErrTxt}</p>}
      </article>

      {loading ? (
        <div className="loading">
          <span></span>
          <span></span>
          <span></span>
        </div>
      ) : (
        <button type="submit" className="btn">
          Sign up
        </button>
      )}
    </form>
  );
}

export default Signup;
