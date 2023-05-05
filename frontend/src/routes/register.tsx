import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { register } from "../api";

export default function Register() {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  return (
    <LoginContainer>
      <h1>Register</h1>
      <p>Create an account to start creating tutoring appointments.</p>
      <form>
        <div
          style={{
            display: "flex",
            width: "400px",
            justifyContent: "space-between",
            marginBottom: ".5rem",
          }}
        >
          <label htmlFor="first">First Name</label>
          <input
            type="text"
            id="first"
            style={{
              width: "200px",
            }}
            value={first}
            onChange={(e) => setFirst(e.target.value)}
          />
        </div>
        <div
          style={{
            display: "flex",
            width: "400px",
            justifyContent: "space-between",
            marginBottom: ".5rem",
          }}
        >
          <label htmlFor="last">Last Name</label>
          <input
            type="text"
            id="last"
            style={{
              width: "200px",
            }}
            value={last}
            onChange={(e) => setLast(e.target.value)}
          />
        </div>
        <div
          style={{
            display: "flex",
            width: "400px",
            justifyContent: "space-between",
            marginBottom: ".5rem",
          }}
        >
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            style={{
              width: "200px",
            }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div
          style={{
            display: "flex",
            width: "400px",
            justifyContent: "space-between",
            marginBottom: "2rem",
          }}
        >
          <label htmlFor="birthday">Birthday</label>
          <input
            type="date"
            id="birthday"
            style={{
              width: "200px",
            }}
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
          />
        </div>
        <div
          style={{
            display: "flex",
            width: "400px",
            justifyContent: "space-between",
            marginBottom: ".5rem",
          }}
        >
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            style={{
              width: "200px",
            }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div
          style={{
            display: "flex",
            width: "400px",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            style={{
              width: "200px",
            }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          style={{
            width: "300px",
          }}
          onClick={(e) => {
            e.preventDefault();
            register(username, password, first, last, email, new Date(birthday))
              .then((res) => {
                navigate("/login");
              })
              .catch((err) => {
                setError(err.message);
              });
          }}
        >
          Register
        </button>
        <button
          type="button"
          style={{
            width: "300px",
            marginTop: ".5rem",
            backgroundColor: "rgb(49, 87, 44)",
            display: "block",
          }}
          onClick={(e) => {
            e.preventDefault();
            navigate("/register");
          }}
        >
          Return to Login
        </button>
        {error && (
          <p
            style={{
              color: "red",
              marginTop: "1rem",
            }}
          >
            {error}
          </p>
        )}
      </form>
    </LoginContainer>
  );
}

const LoginContainer = styled.div`
  padding: 4rem;
  width: 100%;
  min-height: 100%;

  h1 {
    margin-bottom: 0.5rem;
  }

  p {
    margin-bottom: 3rem;
  }
`;
