import * as React from 'react';
import { Button, Form, Container, FormText, FormLabel, Alert } from 'react-bootstrap';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import { RegistrationForm } from '../models/registrationForm.model';
import PasswordStrength from '../components/PasswordStrength';


//TODO: Regisztráció bekötése ha lesz backend
export const Register = () => {
  const userContext = useContext(UserContext);

  const [registrationState, setRegistrationState] = useState<RegistrationForm>({
    fullName: "",
    userName: "",
    email: "",
    password: "",
    birthdate: ""
  });

  const [registrationSuccess, setRegistrationSuccess] = useState<boolean | null>(null);

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setRegistrationSuccess(null);
    const value = evt.target.value
    setRegistrationState({
      ...registrationState,
      [evt.currentTarget.name]: value
    });
  }

  /* Check if any field is empty! */
  function emptyFields() {
    return registrationState.fullName === "" || registrationState.userName === ""
      || registrationState.email === "" || registrationState.password === "" || registrationState.birthdate === "";
  }

  /* Check if email address is valid! */
  function isValidEmail(email: string) {
    const emailPattern = /^(?:(?!.*?[.]{2})[a-zA-Z0-9](?:[a-zA-Z0-9.+!%-]{1,64}|)|\"[a-zA-Z0-9.+!% -]{1,64}\")@[a-zA-Z0-9][a-zA-Z0-9.-]+\.(?:[a-z]{2,}|[0-9]{1,})$/;
    if (!emailPattern.test(email)) {
      return false;
    }
    return true;
  }

  function isValidBirthDate(birthDate: string) {
    const today = new Date();
    const birth = new Date(birthDate);
    const ageDifference = today.getFullYear() - birth.getFullYear();
    const birthMonth = birth.getMonth();
    const todayMonth = today.getMonth();

    if (todayMonth < birthMonth || (todayMonth === birthMonth && today.getDate() < birth.getDate())) {
      return ageDifference - 1 >= 18;
    } else {
      return ageDifference >= 18;
    }
  }

  /* Render the screen based on if the given credentials are correct! */
  const renderRegistrationResult = () => {
    if (registrationSuccess && isValidEmail(registrationState.email)) {
      return (
        <Routes>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      );
    }

    else if (registrationSuccess === false && (emptyFields())) {
      return <Alert variant="danger">Please fill out all fields</Alert>
    }

    else if (registrationSuccess === false && !isValidEmail(registrationState.email)) {
      return <Alert variant="danger">Enter a correct email address</Alert>
    }

    else if (registrationSuccess === false && !isValidBirthDate(registrationState.birthdate)) {
      return <Alert variant="danger">You must be older than 18</Alert>
    }

    else if (registrationSuccess === false) {
      return <Alert variant="danger">The user already exists</Alert>
    }
  }

  /* Registration method with POST request for creating a new user in the database */
  const registration = () => {
    if (emptyFields() || !isValidEmail(registrationState.email) || !isValidBirthDate(registrationState.birthdate)) {
      setRegistrationSuccess(false);
      return;
    }

    fetch('http://localhost:5086/api/registration', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registrationState)
    })
      .then(response => {
        if (response.status === 200) {
          const jsonPromise = response.json();
          jsonPromise.then(data => {
            userContext?.setPlayer(data);
            console.log(data);
            setRegistrationSuccess(true)
          });
        }
        else {
          console.log("no data passed back");
          setRegistrationSuccess(false)
        }
      });
  }

  return (
    <>
      <Container id="registration-container">
        <Form id="registration-form">
          <Container id="registration-form-content">
            <FormText id="registration-title">Registration</FormText>
            <Form.Group className="mt-3">
              <FormLabel id="registration-labels">Full name</FormLabel>
              <Form.Control
                name="fullName"
                type="text"
                className="form-control"
                placeholder="Enter your fullname"
                onChange={handleChange}
                required />
              <Form.Control.Feedback type="invalid">Please provide your fullname</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mt-3">
              <FormLabel id="registration-labels">Username</FormLabel>
              <Form.Control
                name="userName"
                type="text"
                className="form-control"
                placeholder="Enter your username"
                onChange={handleChange}
                required />
              <Form.Control.Feedback type="invalid">Please provide a username</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mt-3">
              <FormLabel id="registration-labels">E-mail</FormLabel>
              <Form.Control
                name="email"
                type="email"
                className="form-control"
                placeholder="Enter your email"
                pattern='^(?:(?!.*?[.]{2})[a-zA-Z0-9](?:[a-zA-Z0-9.+!%-]{1,64}|)|\"[a-zA-Z0-9.+!% -]{1,64}\")@[a-zA-Z0-9][a-zA-Z0-9.-]+\.(?:[a-z]{2,}|[0-9]{1,})$'
                onChange={handleChange}
                required />
              <Form.Control.Feedback type="invalid">Please provide a valid email</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mt-3">
              <FormLabel id="registration-labels">Password</FormLabel>
              <Form.Control
                name="password"
                type="password"
                className="form-control"
                placeholder="Enter your password"
                onChange={handleChange}
                required />
            </Form.Group>
            <PasswordStrength password={registrationState.password} />
            <Form.Group className="mt-3">
              <FormLabel id="registration-labels">Date of birth</FormLabel>
              <Form.Control
                name="birthdate"
                type="date"
                className="form-control"
                placeholder="Enter your birthdate"
                onChange={handleChange}
                required />
            </Form.Group>
            <Container className="d-grid gap-2 mt-2"></Container>
            <Container>{renderRegistrationResult()}</Container>
            <Button className="mt-3" id="btn-registration" onClick={() => registration()}>
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