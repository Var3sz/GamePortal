import "../css-files/login.css"
import React, { useState, useContext, useRef, RefObject, useEffect } from 'react';
import { Alert, Button, Container, Form, FormLabel, FormText } from 'react-bootstrap';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { LoginCredentials } from '../models/loginCredentials.model';
import AuthContext from "../provider/AuthProvider";
import axios from "../api/axios";

const LOGIN_URL = "/api/auth/login";

export const Login = () => {

  const userContext = useContext(UserContext);

  const setAuth = useContext(AuthContext);

  const userRef: RefObject<HTMLInputElement> = useRef(null);
  const errorRef: RefObject<HTMLDivElement> = useRef(null);

  const [loginState, setLoginState] = useState<LoginCredentials>({
    userName: "",
    password: "",
    errorMessage: "",
  });

  const { userName, password, errorMessage } = loginState;

  const [loginSuccess, setLoginSuccess] = useState<boolean | null>(null);


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
    setLoginSuccess(null);
    const value = evt.target.value;
    setLoginState({
      ...loginState,
      [evt.currentTarget.name]: value,
    });
  };


  const renderLoginResult = () => {
    if (loginSuccess && userName !== "admin") {
      return (
        <Routes>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      );
    } else if (
      loginSuccess === false &&
      (userName === "" || password === "")
    ) {
      return <Alert variant="danger">Please fill out all fields</Alert>;
    } else if (loginSuccess === false) {
      return <Alert variant="danger">Wrong username or password</Alert>;
    }
    else if (loginSuccess) {
      return (
        <Routes>
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      );
    }

    else if (loginSuccess === false && (userName === "" || password === "")) {
      return <Alert variant="danger">Please fill out all fields</Alert>
    }

    else if (loginSuccess === false) {
      return <Alert variant="danger">Wrong username or password</Alert>
    }
  }


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
      const accessToken = response.data.accessToken;
      
      userContext?.setPlayer(response.data.player); 
      setLoginSuccess(true);
      /*setLoginState((prevCredentials) => ({
        userName: '',
        password: '',
        errorMessage: ''
      }));*/
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

    /*fetch("http://localhost:5086/api/login", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginState),
    }).then((response) => {
      if (response.status === 200) {
        const jsonPromise = response.json();
        jsonPromise.then((data) => {
          userContext?.setPlayer(data);
          console.log(data);
          setLoginSuccess(true);
        });
      } else {
        console.log("no data passed back");
        setLoginSuccess(false);
      }
    });*/
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
            <Container>{renderLoginResult()}</Container>
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