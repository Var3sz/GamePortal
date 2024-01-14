import { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import {
  Container, Card, CardHeader, CardBody,
  Heading, FormControl, Input, FormLabel, FormErrorMessage,
  Link, Button, Text, Alert, AlertIcon, AlertDescription
} from '@chakra-ui/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { PasswordStrengthBar } from '../../components/PasswordStrengthBar';
import axios from "../../api/axios";
import { REGISTER_URL } from '../../api/axios';
import useAuth from "../../auth/useAuth";
import { PASSWORD_REGEX, EMAIL_REGEX } from "../../helpers/auth.helper";

interface RegistrationForm {
  fullName: string;
  userName: string;
  email: string;
  password: string;
  birthdate: string;
}

export const Register = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/home";
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [isPasswordValid, setIsPasswordValid] = useState<boolean | undefined>(undefined);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);


  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    watch
  } = useForm<RegistrationForm>();

  useEffect(() => {
    register('fullName', { required: 'Fullname is required' });
    register('userName', { required: 'Username is required' });
    register('email', {
      required: 'Email address is required',
      pattern: {
        value: EMAIL_REGEX,
        message: 'Invalid email format',
      },
    });
    register('password', {
      required: 'Password is required',
      pattern: {
        value: PASSWORD_REGEX,
        message: 'Invalid password format',
      },
      validate: (value) => {
        const isValid = PASSWORD_REGEX.test(value);
        setIsPasswordValid(isValid);
        return isValid;
      }
    });
    register('birthdate', { required: 'Birthdate is required' });
  }, [register]);


  const registration: SubmitHandler<RegistrationForm> = async (data) => {
    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({
          fullName: data.fullName,
          userName: data.userName,
          email: data.email,
          password: data.password,
          birthdate: data.birthdate
        }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        });
      const token = response.data.token;
      const player = response.data.player;
      const refresh = response.data.refreshToken;
      setAuth({ player, token, refresh });
      sessionStorage.setItem("player", JSON.stringify(player));
      sessionStorage.setItem("accessToken", token);
      sessionStorage.setItem("refreshToken", refresh);
      navigate(from, { replace: true });
    } catch (error: any) {
      if (!error?.response) {
        setRegistrationError("No server response!");
      } else if (error.response.status === 409) {
        setRegistrationError("Username or e-mail is taken");
      } else {
        setRegistrationError('Registration failed');
      }
    }
  }

  return (
    <Container className="d-flex flex-column justify-content-center col-lg">
      <Card variant={'loginCard'}>
        <CardHeader>
          <Heading variant={'authTitle'}>Sign Up</Heading>
        </CardHeader>
        <CardBody mb={"0px"}>
          <Form onSubmit={handleSubmit(registration)}>
            <FormControl mt={'3px'} isRequired isInvalid={!!errors.fullName}>
              <FormLabel>Fullname</FormLabel>
              <Input
                type={'text'}
                placeholder='Your fullname'
                autoComplete="off"
                {...register('fullName')}
              />
              <FormErrorMessage>
                {errors.fullName && errors.fullName.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl mt={'15px'} isRequired isInvalid={!!errors.userName}>
              <FormLabel>Username</FormLabel>
              <Input
                type={'text'}
                placeholder='Your Username'
                autoComplete="off"
                {...register('userName')}
              />
              <FormErrorMessage>
                {errors.userName && errors.userName.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl mt={'15px'} isRequired isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input
                type={'email'}
                placeholder='example@bme.hu'
                autoComplete="off"
                {...register('email')}
              />
              <FormErrorMessage>
                {errors.email && errors.email.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl mt={'15px'} isRequired isInvalid={!!errors.password}>
              <FormLabel>Password</FormLabel>
              <Input
                type={'password'}
                placeholder='Your password'
                autoComplete="off"
                {...register('password')}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
              />
              <PasswordStrengthBar mt={3} password={watch("password")} />
              <FormErrorMessage>
                {errors.password && errors.password.message}
              </FormErrorMessage>
              {isPasswordFocused && !isPasswordValid && (
                <Alert >
                  <AlertIcon />
                  <AlertDescription>
                    Password should contain at least one lowercase letter, one uppercase letter, one number, one special character, and be between 8 and 24 characters long.
                  </AlertDescription>
                </Alert>
              )}
            </FormControl>
            <FormControl mt={'25px'} pb={'30px'} isRequired isInvalid={!!errors.birthdate}>
              <FormLabel>Birthdate</FormLabel>
              <Input
                type={'date'}
                placeholder='Your password'
                autoComplete="off"
                {...register('birthdate')}
              />
              <FormErrorMessage>
                {errors.birthdate && errors.birthdate.message}
              </FormErrorMessage>
            </FormControl>
            <Button type="submit" variant={'authButton'} isLoading={isSubmitting}>
              Sign Up
            </Button>
            {registrationError && (
              <Text color="red" mt={2}>
                {registrationError}
              </Text>
            )}
          </Form>
          <Link
            href={'/login'}
            color={'primary'}
            fontSize={'md'}
            _hover={{
              textDecoration: 'none',
              color: 'black',
            }}
          >
            Sign In
          </Link>
        </CardBody>
      </Card>
    </Container>
  );
}

export default Register; 