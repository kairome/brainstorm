import React, { useEffect, useState } from 'react';
import Header from 'ui/Header/Header';
import Button from 'ui/Button/Button';
import Card from 'ui/Card/Card';
import Input from 'ui/Input/Input';
import Form from 'ui/Form/Form';
import PasswordInput from 'ui/PasswordInput/PasswordInput';
import { useNavigate } from 'react-router-dom';
import { getFromLs, setToLs } from 'utils/localStorage';
import { useMutation } from '@tanstack/react-query';
import { login } from 'api/auth';
import { AxiosError } from 'axios';
import { getApiErrors } from 'utils/apiErrors';
import { useNotify } from 'store/alert';
import _ from 'lodash';

import s from './LoginPage.module.css';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const notify = useNotify();

  const { mutate: loginRequest, isPending } = useMutation({
    mutationFn: login.request,
    onError: (err: AxiosError) => {
      const error = getApiErrors(err);
      notify({ type: 'error', message: _.isString(error) ? error : 'Failed to log in' });
    },
    onSuccess: (data) => {
      setToLs('token', data.token);
      navigate('/');
    },
  },
  );

  useEffect(() => {
    const token = getFromLs('token');
    if (token) {
      navigate('/');
    }
  }, []);

  const handleLogin = () => {
    loginRequest({
      email,
      password,
    });
  };

  const signUpButton = (
    <Button onClick={() => navigate('/register')} disabled={isPending}>
      Sign up
    </Button>
  );

  return (
    <>
      <Header buttons={signUpButton} />
      <div className={s.content}>
        <Card title="Log in" className={s.card}>
          <Form
            id="login-form"
            onSubmit={handleLogin}
            submitBtn="Continue"
            loading={isPending}
          >
            <Input
              label="Email"
              type="email"
              placeholder="some@example.com"
              value={email}
              onChange={setEmail}
              disabled={isPending}
              required
            />
            <PasswordInput
              value={password}
              onChange={setPassword}
              disabled={isPending}
            />
          </Form>
        </Card>
      </div>
    </>
  );
};

export default LoginPage;