import React from 'react';
import { PiArrowCircleLeftBold } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import Button from 'ui/Button/Button';

import s from './NotFound.module.css';

interface Props {
  children?: React.ReactNode,
  text?: string,
  link?: string,
}

const NotFound: React.FC<Props> = (props) => {
  const navigate = useNavigate();
  const {
    text = 'Page does not exist',
    link = '/',
  } = props;
  const renderContent = () => {
    if (props.children) {
      return props.children;
    }

    return (
      <>
        <div>{text}</div>
        <Button appearance="underline" onClick={() => navigate(link)} className={s.goBack}>
          <PiArrowCircleLeftBold />
          Go back
        </Button>
        <div>
        </div>
      </>
    );
  };

  return (
    <div className={s.container}>
      <h1>Whoops! :(</h1>
      {renderContent()}
    </div>
  );
};

export default NotFound;