import "../../css-files/registration.css";
import React, { useState, useEffect, useRef, RefObject } from 'react';
import { Button, Form, Container, FormText, FormLabel, Alert } from 'react-bootstrap';
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { RegistrationForm } from '../../models/registrationForm.model';
import { PasswordStrength } from '../../components/PasswordStrength';
import axios from "../../api/axios";
import useAuth from "../../auth/useAuth";

const FULLNAME_REGEX = /[^a-zA-Z\s]+/;
const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^(?:(?!.*?[.]{2})[a-zA-Z0-9](?:[a-zA-Z0-9.+!%-]{1,64}|)|"[a-zA-Z0-9.+!% -]{1,64}")@[a-zA-Z0-9][a-zA-Z0-9.-]+\.(?:[a-z]{2,}|[0-9]{1,})$/;
const REGISTER_URL = "/api/auth/registration";

export const Register = () => {

  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/home";

  const userRef: RefObject<HTMLInputElement> = useRef(null);
  const errorRef: RefObject<HTMLDivElement> = useRef(null);

  const [registrationState, setRegistrationState] = useState<RegistrationForm>({
    fullName: "",
    userName: "",
    email: "",
    password: "",
    birthdate: "",
    validFullName: false,
    validUserName: false,
    validEmail: false,
    validPassword: false,
    validBirthdate: false,
    fullNameFocus: false,
    userNameFocus: false,
    emailFocus: false,
    passwordFocus: false,
    birthdateFocus: false,
    errorMessage: ""
  });


  const { fullName, userName, email, password, birthdate,
    validFullName, validUserName, validEmail, validPassword, validBirthdate,
    fullNameFocus, userNameFocus, emailFocus, passwordFocus, birthdateFocus, errorMessage
  } = registrationState;

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  useEffect(() => {
    const correct = FULLNAME_REGEX.test(fullName);
    setRegistrationState(prevState => ({ ...prevState, validFullName: correct }));
  }, [fullName]);

  useEffect(() => {
    const correct = USER_REGEX.test(userName);
    setRegistrationState(prevState => ({ ...prevState, validUserName: correct }));
  }, [userName]);

  useEffect(() => {
    const correct = EMAIL_REGEX.test(email);
    setRegistrationState(prevState => ({ ...prevState, validEmail: correct }));
  }, [email]);

  useEffect(() => {
    const correct = PASSWORD_REGEX.test(password);
    setRegistrationState(prevState => ({ ...prevState, validPassword: correct }));
  }, [password]);

  useEffect(() => {
    const valid = isValidBirthDate(birthdate);
    setRegistrationState(prevState => ({ ...prevState, validBirthdate: valid }));
  }, [birthdate]);

  useEffect(() => {
    setRegistrationState(prevState => ({
      ...prevState,
      errorMessage: '',
    }));
  }, [fullName, userName, email, password, birthdate]);

  /* Handle if an input element value has changed */
  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value
    setRegistrationState({
      ...registrationState,
      [evt.currentTarget.name]: value
    });
  }

  /* Handle if an input element gets focus */
  const handleFocus = (evt: React.FocusEvent<HTMLInputElement>) => {
    const { name } = evt.target;
    setRegistrationState(prevState => ({
      ...prevState,
      [`${name}Focus`]: true
    }));
  };

  /* Handle if an input element loses focus */
  const handleBlur = (evt: React.FocusEvent<HTMLInputElement>) => {
    const { name } = evt.target;
    setRegistrationState(prevState => ({
      ...prevState,
      [`${name}Focus`]: false
    }));
  };

  /* Check if user is above 18 years! */
  function isValidBirthDate(birthDate: string): boolean {
    const today = new Date();
    const birth = new Date(birthDate);

    const ageDifference = today.getFullYear() - birth.getFullYear();
    const birthMonth = birth.getMonth();
    const todayMonth = today.getMonth();

    if (ageDifference > 18) {
      return true;
    } else if (ageDifference === 18) {
      if (todayMonth > birthMonth || (todayMonth === birthMonth && today.getDate() >= birth.getDate())) {
        return true;
      }
    }

    return false;
  }

  /* Registration method wwith axios POST method, inserts a user into database */
  const registration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = { fullName, userName, email, password, birthdate };

    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify(data),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        });
      const token = response.data.token;
      const roles = response.data.roleIds;
      const refresh = response.data.refreshToken;
      setAuth({ roles, token, refresh });
      sessionStorage.setItem("roles", JSON.stringify(roles));
      sessionStorage.setItem("accessToken", token);
      sessionStorage.setItem("refreshToken", refresh);
      navigate(from, {replace: true});
    } catch (error: any) {
      if (!error?.response) {
        setRegistrationState(prevState => ({
          ...prevState,
          errorMessage: "No server response!"
        }));
      } else if (error.response.status === 409) {
        setRegistrationState(prevState => ({
          ...prevState,
          errorMessage: "Username or e-mail is taken"
        }));
      } else {
        setRegistrationState(prevState => ({
          ...prevState,
          errorMessage: "Username or e-mail is taken"
        }));
      }
      errorRef.current?.focus();
    }
  }

  return (
    <>
      <Container id="registration-container">
        <Form id="registration-form" onSubmit={registration}>
          <Container id="registration-form-content">
            <Alert
              variant="danger"
              ref={errorRef}
              className={errorMessage ? "errorMessage" : "offscreen"}
              aria-live='assertive'>{errorMessage}</Alert>
            <FormText id="registration-title">Registration</FormText>
            <Form.Group className="mt-3">
              <FormLabel id="registration-labels" htmlFor="fullname">Full name:
                <Container className={validFullName ? "valid" : "hide"}>
                  <FontAwesomeIcon icon={faCheck} />
                </Container>
                <Container className={validFullName || !fullName ? "hide" : "invalid"}>
                  <FontAwesomeIcon icon={faTimes} />
                </Container>
              </FormLabel>
              <Form.Control
                type="text"
                id="fullname"
                name="fullName"
                className="form-control"
                ref={userRef}
                placeholder="Enter your fullname"
                onChange={handleChange}
                required
                aria-invalid={validFullName ? "false" : "true"}
                aria-describedby="uidnote"
                onFocus={handleFocus}
                onBlur={handleBlur}
                autoComplete="off"
              />
              <FormText
                id="uidnote"
                className={fullNameFocus && fullName && !validFullName ? "instructions" : "offscreen"}
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                Provide your fullname
              </FormText>
            </Form.Group>
            <Form.Group className="mt-3">
              <FormLabel id="registration-labels" htmlFor='username'>Username:
                <Container className={validUserName ? "valid" : "hide"}>
                  <FontAwesomeIcon icon={faCheck} />
                </Container>
                <Container className={validUserName || !userName ? "hide" : "invalid"}>
                  <FontAwesomeIcon icon={faTimes} />
                </Container>
              </FormLabel>
              <Form.Control
                type="text"
                id="username"
                name="userName"
                className="form-control"
                placeholder="Enter your username"
                onChange={handleChange}
                required
                aria-invalid={validUserName ? "false" : "true"}
                aria-describedby="uidnote"
                onFocus={handleFocus}
                onBlur={handleBlur}
                autoComplete="off"
              />
              <FormText id="uidnote" className={userNameFocus && userName && !validUserName ? "instructions" : "offscreen"}>
                <FontAwesomeIcon icon={faInfoCircle} />
                4 to 24 characters.<br />
                Must begin with a letter.<br />
                Letters, numbers, underscores, hyphens allowed.
              </FormText>
            </Form.Group>
            <Form.Group className="mt-3">
              <FormLabel id="registration-labels" htmlFor="email">E-mail:
                <Container className={validEmail ? "valid" : "hide"}>
                  <FontAwesomeIcon icon={faCheck} />
                </Container>
                <Container className={validEmail || !email ? "hide" : "invalid"}>
                  <FontAwesomeIcon icon={faTimes} />
                </Container>
              </FormLabel>
              <Form.Control
                type="text"
                id="email"
                name="email"
                className="form-control"
                placeholder="Enter your email"
                onChange={handleChange}
                required
                aria-invalid={validEmail ? "false" : "true"}
                aria-describedby="uidnote"
                onFocus={handleFocus}
                onBlur={handleBlur}
                autoComplete="off"
              />
              <FormText id="uidnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                <FontAwesomeIcon icon={faInfoCircle} />
                Provide a correct e-mail address format. <br />
                E.g. yourname@email.com
              </FormText>
            </Form.Group>
            <Form.Group className="mt-3">
              <FormLabel id="registration-labels" htmlFor="password">Password
                <Container className={validPassword ? "valid" : "hide"}>
                  <FontAwesomeIcon icon={faCheck} />
                </Container>
                <Container className={validPassword || !password ? "hide" : "invalid"}>
                  <FontAwesomeIcon icon={faTimes} />
                </Container>
              </FormLabel>
              <Form.Control
                type="password"
                id="password"
                name="password"
                className="form-control"
                placeholder="Enter your password"
                onChange={handleChange}
                required
                aria-invalid={validPassword ? "false" : "true"}
                aria-describedby="uidnote"
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <PasswordStrength password={password} />
              <FormText id="uidnote" className={passwordFocus && password && !validPassword ? "instructions" : "offscreen"}>
                <FontAwesomeIcon icon={faInfoCircle} />
                8 to 24 characters.<br />
                Must include uppercase and lowercase letters, a number and a special character.<br />
                Allowed special characters: ! @ # $ %
              </FormText>
            </Form.Group>
            <Form.Group className="mt-3">
              <FormLabel id="registration-labels" htmlFor="birthdate">Date of birth:
                <Container className={validBirthdate ? "valid" : "hide"}>
                  <FontAwesomeIcon icon={faCheck} />
                </Container>
                <Container className={validBirthdate || !birthdate ? "hide" : "invalid"}>
                  <FontAwesomeIcon icon={faTimes} />
                </Container>
              </FormLabel>
              <Form.Control
                type="date"
                id="birthdate"
                name="birthdate"
                className="form-control"
                placeholder="Enter your birthdate"
                onChange={handleChange}
                required
                aria-invalid={validBirthdate ? "false" : "true"}
                aria-describedby="uidnote"
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <FormText id="uidnote" className={birthdateFocus && birthdate && !validBirthdate ? "instructions" : "offscreen"}>
                <FontAwesomeIcon icon={faInfoCircle} />
                You must be at least 18 to register
              </FormText>
            </Form.Group>
            <Button
              type="submit"
              className="mt-3" id="btn-registration"
              disabled={validFullName && validUserName && validEmail && validPassword && validBirthdate ? false : true}
            >Register</Button>
            <NavLink to="/login" id="register-link">Already have an account?</NavLink>
          </Container>
        </Form>
      </Container>
    </>
  );
}

export default Register; 