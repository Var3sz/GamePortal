import * as React from 'react';
import { Alert, Button, Container, Form, FormGroup, FormLabel, FormText } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';


//TODO: Login bekötése ha lesz backend
export const Login = () => {
  return (
    <>
      <Container id="login-container">
        <Form id="login-form">
          <Container id="login-form-content">
            <FormText id="login-title">Login</FormText>
            <Form.Group className="mt-3">
              <FormLabel id="login-labels" htmlFor="user">Username</FormLabel>
              <Form.Control id="user" name="username" type="text" className="form-control" placeholder="Enter username" required />
              <Form.Control.Feedback type="invalid">Please provide your username</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mt-3">
              <FormLabel id="login-labels" htmlFor="pass">Password</FormLabel>
              <Form.Control id="pass" name="password" type="password" className="form-control" placeholder="Enter password" required />
              <Form.Control.Feedback type="invalid">Please provide your password</Form.Control.Feedback>
            </Form.Group>
            <Button className="mt-5" id="btn-login">
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