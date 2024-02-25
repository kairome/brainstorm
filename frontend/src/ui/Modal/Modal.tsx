import React from 'react';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { createPortal } from 'react-dom';

import s from './Modal.module.css';

interface Props {
  title: React.ReactNode,
  show: boolean,
  onClose: () => void,
  children: React.ReactNode,
}

const Modal: React.FC<Props> = (props) => {
  if (!props.show) {
    return null;
  }

  return createPortal(
    (<div className={s.modalContainer}>
      <div className={s.modalCover} onClick={props.onClose} />
      <div className={s.modalBody}>
        <div className={s.modalHeader}>
          <h3 className={s.modalTitle}>{props.title}</h3>
          <IoIosCloseCircleOutline
            className={s.modalClose}
            onClick={props.onClose}
          />
        </div>
        {props.children}
      </div>
    </div>),
    document.body,
  );
};

export default Modal;