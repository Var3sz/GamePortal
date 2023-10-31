import * as React from 'react';
import { Alert, Button, Container, Form, FormGroup, FormLabel, FormText } from 'react-bootstrap';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import { useContext } from 'react';
import { UserContext } from '../UserContext';
import { LoginCredentials } from '../models/loginCredentials.model';


//TODO: Login bekötése ha lesz backend
export const Login = () => {
  const userContext = useContext(UserContext);

  const [loginState, setLoginState] = useState<LoginCredentials>({
    userName: "",
    password: "",
  });

  const [loginSuccess, setLoginSuccess] = useState<boolean | null>(null);

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setLoginSuccess(null);
    const value = evt.target.value;
    setLoginState({
      ...loginState,
      [evt.currentTarget.name]: value,
    });
  };


  const renderLoginResult = () => {
    if (loginSuccess && loginState.userName !== "admin") {
      return (
        <Routes>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      );
    } else if (
      loginSuccess === false &&
      (loginState.userName === "" || loginState.password === "")
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

    else if (loginSuccess === false && (loginState.userName === "" || loginState.password === "")) {
      return <Alert variant="danger">Please fill out all fields</Alert>
    }

    else if (loginSuccess === false) {
      return <Alert variant="danger">Wrong username or password</Alert>
    }
  }


  const login = () => {
    fetch("http://localhost:5086/api/login", {
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
    });
  };


  return (
    <>
      <Container id="login-container">
        <Form id="login-form">
          <Container id="login-form-content">
            <FormText id="login-title">Login</FormText>
            <Form.Group className="mt-3">
              <FormLabel id="login-labels">Username</FormLabel>
              <Form.Control
                name="userName"
                type="text"
                className="form-control"
                placeholder="Enter username"
                onChange={handleChange}
                required />
            </Form.Group>
            <Form.Group className="mt-3">
              <FormLabel id="login-labels">Password</FormLabel>
              <Form.Control
                name="password"
                type="password"
                className="form-control"
                placeholder="Enter password"
                onChange={handleChange}
                required />
            </Form.Group>
            <Container className="d-grid gap-2 mt-4"></Container>
            <Container>{renderLoginResult()}</Container>
            <Button className="mt-3" id="btn-login" onClick={() => login()}>
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