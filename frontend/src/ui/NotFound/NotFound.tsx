import React from 'react';
import { PiArrowCircleLeftBold } from 'react-icons/pi';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from 'ui/Button/Button';
import { setToLs } from 'utils/localStorage';

import s from './NotFound.module.css';

interface Props {
  children?: React.ReactNode,
  text?: string,
  link?: string,
  linkText?: string,
  returnToOriginalUrl?: boolean,
}

const NotFound: React.FC<Props> = (props) => {
  const navigate = useNavigate();
  const {
    text = 'Page does not exist',
    link = '/',
    linkText = 'Go back',
    returnToOriginalUrl,
  } = props;

  const { pathname } = useLocation();

  const handleLinkClick = () => {
    navigate(link);

    if (returnToOriginalUrl) {
      setToLs('returnUrl', pathname);
    }
  };

  const renderContent = () => {
    if (props.children) {
      return props.children;
    }

    return (
      <>
        <div>{text}</div>
        <Button appearance="underline" onClick={handleLinkClick} className={s.goBack}>
          <PiArrowCircleLeftBold />
          {linkText}
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