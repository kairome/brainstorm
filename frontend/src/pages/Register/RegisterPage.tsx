import React, { useEffect, useState } from 'react';
import Header from 'ui/Header/Header';
import s from 'pages/Login/LoginPage.module.css';
import Card from 'ui/Card/Card';
import Form from 'ui/Form/Form';
import Input from 'ui/Input/Input';
import PasswordInput from 'ui/PasswordInput/PasswordInput';
import Button from 'ui/Button/Button';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { register } from 'api/auth';
import { AxiosError } from 'axios';
import { useNotify } from 'store/alert';
import { getApiErrors } from 'utils/apiErrors';
import _ from 'lodash';
import { RegisterPayload } from 'types/auth';
import { getFromLs, setToLs } from 'utils/localStorage';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const notify = useNotify();

  const [formValues, setFormValues] = useState<RegisterPayload & { confirmPassword: string }>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: registerRequest, isPending } = useMutation({
    mutationFn: register.request,
    onError: (err: AxiosError) => {
      const error = getApiErrors(err);
      if (_.isString(error)) {
        notify({ type: 'error', message: error });
        return;
      }

      setErrors(error ?? {});
    },
    onSuccess: (data) => {
      setToLs('token', data.token);
      navigate('/');
    },
  });

  useEffect(() => {
    const token = getFromLs('token');
    if (token) {
      navigate('/');
    }
  }, []);

  useEffect(() => {
    const { password, confirmPassword } = formValues;
    if (password && confirmPassword) {
      setErrors({
        ...errors,
        confirmPassword: confirmPassword !== password ? 'Passwords do not match' : '',
      });
    }
  }, [formValues.password, formValues.confirmPassword]);

  const handleSignup = () => {
    if (_.some(errors, v => !_.isEmpty(v))) {
      return;
    }

    registerRequest(_.omit(formValues, 'confirmPassword'));
  };

  const handleFieldChange = (name: keyof typeof formValues) => (value: string) => {
    setFormValues({
      ...formValues,
      [name]: value,
    });

    if (name !== 'confirmPassword') {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const loginButton = (
    <Button onClick={() => navigate('/login')} disabled={isPending}>
      Log in
    </Button>
  );

  return (
    <>
      <Header buttons={loginButton} />
      <div className={s.content}>
        <Card title="Sign up" className={s.card}>
          <Form
            id="signup-form"
            onSubmit={handleSignup}
            submitBtn="Continue"
            disabled={isPending}
          >
            <Input
              label="Name"
              type="text"
              placeholder="John Smith"
              value={formValues.name}
              onChange={handleFieldChange('name')}
              required
              disabled={isPending}
              error={errors?.name}
            />
            <Input
              label="Email"
              type="email"
              placeholder="some@example.com"
              value={formValues.email}
              onChange={handleFieldChange('email')}
              required
              disabled={isPending}
              error={errors?.email}
              autoComplete="new-password"
            />
            <PasswordInput
              value={formValues.password}
              onChange={handleFieldChange('password')}
              generatePass
              disabled={isPending}
              error={errors?.password}
              autoComplete="new-password"
            />
            <PasswordInput
              label="Confirm password"
              placeholder="Confirm password"
              value={formValues.confirmPassword}
              error={errors?.confirmPassword}
              onChange={handleFieldChange('confirmPassword')}
              disabled={isPending}
              autoComplete="new-password"
            />
          </Form>
        </Card>
      </div>
    </>
  );
};

export default RegisterPage;