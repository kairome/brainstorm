import React, { useState } from 'react';
import { IoEye, IoEyeOff } from 'react-icons/io5';
import Input from 'ui/Input/Input';
import Button from 'ui/Button/Button';
import { generateStrongPassword } from 'utils/auth';

interface Props {
  label?: string,
  placeholder?: string,
  error?: string,
  value: string,
  onChange: (v: string) => void,
  generatePass?: boolean,
  disabled?: boolean,
  autoComplete?: string,
}

const PasswordInput: React.FC<Props> = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    label = 'Password',
    placeholder = 'Enter your password',
    error,
  } = props;

  const renderEye = () => {
    if (!showPassword) {
      return (
        <IoEyeOff onClick={() => setShowPassword(true)} />
      );
    }

    return (
      <IoEye onClick={() => setShowPassword(false)} />
    );
  };

  const handleGenPassword = () => {
    const newPass = generateStrongPassword();
    setShowPassword(true);
    props.onChange(newPass);
  };

  const renderGenPassword = () => {
    if (!props.generatePass) {
      return null;
    }

    return (
      <Button theme="underline" onClick={handleGenPassword}>
        Generate strong password
      </Button>
    );
  };

  return (
    <>
      <Input
        label={label}
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        value={props.value}
        onChange={props.onChange}
        icon={renderEye()}
        error={error}
        disabled={props.disabled}
        required
        autoComplete={props.autoComplete}
      />
      {renderGenPassword()}
    </>
  );
};

export default PasswordInput;