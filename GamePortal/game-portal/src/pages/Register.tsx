import * as React from 'react';
import { Button, Form, Container, FormText, FormLabel, Alert} from 'react-bootstrap';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import { RegistrationForm } from '../models/registrationForm.model';


//TODO: Regisztráció bekötése ha lesz backend
export const Register = () => {
    return (
      <>
        <Container id="registration-container">
          <Form id="registration-form">
            <Container id="registration-form-content">
              <FormText id="registration-title">Registration</FormText>
              <Form.Group className="mt-3">
                <FormLabel id="registration-labels" htmlFor="name">Full name</FormLabel>
                <Form.Control id="name" name="fullname" type="text" className="form-control" 
                              placeholder="Enter your fullname" required  />
                <Form.Control.Feedback type="invalid">Please provide your fullname</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mt-3">
                <FormLabel id="registration-labels" htmlFor="e-mail">E-mail</FormLabel>
                <Form.Control id="e-mail" name="email" type="email" 
                              className="form-control" placeholder="Enter your email"  required  />
                <Form.Control.Feedback type="invalid">Please provide a valid email</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mt-3">
                <FormLabel id="registration-labels" htmlFor="user">Username</FormLabel>
                <Form.Control id="user" name="username" type="text" className="form-control" 
                              placeholder="Enter your username" required />
                <Form.Control.Feedback type="invalid">Please provide a username</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mt-3">
                <FormLabel id="registration-labels" htmlFor="pass">Password</FormLabel>
                <Form.Control id="pass" name="password" type="password" className="form-control" 
                              placeholder="Enter your password" required />
                <Form.Control.Feedback type="invalid">Please provide a password</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mt-3">
                <FormLabel id="registration-labels" htmlFor="date-of-birth">Date of birth</FormLabel>
                  <Form.Control id="date-of-birth" name="birth" type="text" className="form-control" 
                                placeholder="Enter your birthdate" required />
                  <Form.Control.Feedback type="invalid">Please provide your birthdate</Form.Control.Feedback>
                  
              </Form.Group>
                <Button className="mt-5" id="btn-registration" >
                  Register
                </Button>
              <NavLink to="/login" id="register-link">Already have an account?</NavLink>
            </Container>
          </Form>
        </Container>
      </>
      );
}

export default Register;