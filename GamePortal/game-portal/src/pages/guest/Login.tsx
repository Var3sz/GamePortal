import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Form } from 'react-bootstrap';
import {
  Alert, AlertIcon, AlertTitle, AlertDescription,
  FormControl, FormErrorMessage, FormLabel, Input,
  Card, CardHeader, CardBody,
  Container, Heading, Button, Link, Text
} from '@chakra-ui/react';
import useAuth from '../../auth/useAuth';
import axios from '../../api/axios';

interface LoginForm {
  userName: string;
  password: string;
}

const LOGIN_URL = '/api/auth/login';

export const Login: React.FC = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/home';
  const isUnauthorized = location.state?.unauthorized;
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<LoginForm>();

  useEffect(() => {
    register('userName', { required: 'Username is required' });
    register('password', { required: 'Password is required' });
  }, [register]);

  const login: SubmitHandler<LoginForm> = async (data) => {
    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ userName: data.userName, password: data.password }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      const token = response.data.token;
      const roles = response.data.roleIds;
      const refresh = response.data.refreshToken;
      setAuth({ roles, token, refresh });
      sessionStorage.setItem('roles', JSON.stringify(roles));
      sessionStorage.setItem('accessToken', token);
      sessionStorage.setItem('refreshToken', refresh);

      setValue('userName', '');
      setValue('password', '');

      navigate(from, { replace: true });
    } catch (error: any) {
      if (!error.response) {
        setLoginError('No server response');
      } else if (error.response.status === 401) {
        setLoginError('Incorrect credentials');
      } else {
        setLoginError('Login failed');
      }
    }
  };

  return (
    <Container className="d-flex flex-column justify-content-center col-lg- mt-3">
      <Card variant={'loginCard'}>
        <CardHeader>
          {isUnauthorized && (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle>Please Sign In!</AlertTitle>
              <AlertDescription>For playing online, please sign in.</AlertDescription>
            </Alert>
          )}
          <Heading variant={'authTitle'}>Sign In</Heading>
        </CardHeader>
        <CardBody mb={"0px"}>
          <Form onSubmit={handleSubmit(login)}>
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
            <FormControl mt={'25px'} pb={'30px'} isRequired isInvalid={!!errors.password}>
              <FormLabel>Password</FormLabel>
              <Input
                type={'password'}
                placeholder='Your password'
                autoComplete="off"
                {...register('password')}
              />
              <FormErrorMessage>
                {errors.password && errors.password.message}
              </FormErrorMessage>
            </FormControl>
            <Button type="submit" variant={'authButton'} isLoading={isSubmitting}>
              Login
            </Button>
            {loginError && (
              <Text color="red" mt={2}>
                {loginError}
              </Text>
            )}
          </Form>
          <Link
            href={'/register'}
            color={'primary'}
            fontSize={'md'}
            _hover={{
              textDecoration: 'none',
              color: 'black',
            }}
          >
            Sign Up
          </Link>
        </CardBody>
      </Card>
    </Container>
  );
};