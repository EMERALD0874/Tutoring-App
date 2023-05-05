import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { login } from "../api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  return (
    <LoginContainer>
      <h1>Login</h1>
      <p>Log in to your account to access your appointments.</p>
      <form>
        <div
          style={{
            display: "flex",
            width: "300px",
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
            width: "300px",
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
            login(username, password)
              .then((res) => {
                navigate("/");
              })
              .catch((err) => {
                setError(err.message);
              });
          }}
        >
          Login
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
          Register
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
