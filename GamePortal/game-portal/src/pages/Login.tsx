import "../css-files/login.css"
import React, { useState, useRef, RefObject, useEffect } from 'react';
import { Alert, Button, Container, Form, FormLabel, FormText } from 'react-bootstrap';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { LoginCredentials } from '../models/loginCredentials.model';
import axios from "../api/axios";
import useAuth from "../auth/useAuth";
import { jwtDecode } from "jwt-decode";

const LOGIN_URL = "/api/auth/login";

export const Login = () => {
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const userRef: RefObject<HTMLInputElement> = useRef(null);
  const errorRef: RefObject<HTMLDivElement> = useRef(null);

  const [loginState, setLoginState] = useState<LoginCredentials>({
    userName: "",
    password: "",
    errorMessage: "",
  });

  const { userName, password, errorMessage } = loginState;

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  useEffect(() => {
    setLoginState((prevCredentials) => ({
      ...prevCredentials,
      errorMessage: "",
    }));
  }, [userName, password]);



  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;
    setLoginState({
      ...loginState,
      [evt.currentTarget.name]: value,
    });
  };

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(LOGIN_URL,
        JSON.stringify({ userName, password }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: false
        }
      );
      const token = response.data.token;
      setAuth({ userName, password, token });
      setLoginState((prevCredentials) => ({
        userName: '',
        password: '',
        errorMessage: ''
      }));
      navigate(from, { replace: true });
    } catch (error: any) {
      if (!error?.response) {
        setLoginState((prevCredentials) => ({
          ...prevCredentials,
          errorMessage: "No server response",
        }));
      } else if (error.response.status === 400) {
        setLoginState((prevCredentials) => ({
          ...prevCredentials,
          errorMessage: "Missing username or password",
        }));
      } else if (error.response.status === 401) {
        setLoginState((prevCredentials) => ({
          ...prevCredentials,
          errorMessage: "Unauthorized",
        }));
      } else {
        setLoginState((prevCredentials) => ({
          ...prevCredentials,
          errorMessage: "Login failed",
        }));
      }
      errorRef.current?.focus();
    }
  };


  return (
    <>
      <Container id="login-container">
        <Form id="login-form" onSubmit={login}>
          <Container id="login-form-content">
            <Alert
              variant="danger"
              ref={errorRef}
              className={errorMessage ? "errorMessage" : "offscreen"}
              aria-live='assertive'>{errorMessage}</Alert>
            <FormText id="login-title">Login</FormText>

            <Form.Group className="mt-3">
              <FormLabel id="login-labels" htmlFor="username">Username</FormLabel>
              <Form.Control
                type="text"
                id="username"
                name="userName"
                className="form-control"
                placeholder="Enter username"
                autoComplete="off"
                ref={userRef}
                onChange={handleChange}
                value={userName}
                required
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <FormLabel id="login-labels" htmlFor="password">Password</FormLabel>
              <Form.Control
                type="password"
                id="password"
                name="password"
                className="form-control"
                placeholder="Enter password"
                onChange={handleChange}
                value={password}
                required
              />
            </Form.Group>
            <Button type="submit" className="mt-3" id="btn-login">
              Login
            </Button>
            <NavLink to="/register" id="login-link">Register</NavLink>
          </Container>
        </Form>
      </Container>
    </>
  );
}


export default Login;