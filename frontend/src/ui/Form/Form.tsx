import React from 'react';
import Button from 'ui/Button/Button';

import s from './Form.module.css';

interface Props extends React.PropsWithChildren {
  id: string,
  submitBtn: React.ReactNode,
  onSubmit: () => void,
  loading?: boolean,
  disabled?: boolean,
}

const Form: React.FC<Props> = (props) => {
  const { id, submitBtn, loading } = props;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    props.onSubmit();
  };

  const renderSubmitBtn = () => {
    if (typeof submitBtn === 'string') {
      return (
        <Button
          type="submit"
          fullWidth
          className={s.submitBtn}
          loading={loading}
        >
          {submitBtn}
        </Button>
      );
    }

    return submitBtn;
  };

  return (
    <form className={s.form} id={id} onSubmit={handleSubmit}>
      {props.children}
      {renderSubmitBtn()}
    </form>
  );
};

export default Form;