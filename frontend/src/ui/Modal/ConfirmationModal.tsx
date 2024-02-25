import React, { useEffect } from 'react';
import Button from 'ui/Button/Button';

import Modal from './Modal';
import s from './Modal.module.css';

interface Props {
  title: string,
  text: string,
  show: boolean,
  onClose: () => void,
  isLoading?: boolean,
  isSuccess?: boolean,
  onConfirm: () => void,
}

const ConfirmationModal: React.FC<Props> = (props) => {
  useEffect(() => {
    if (props.isSuccess) {
      props.onClose();
    }
  }, [props.isSuccess]);

  return (
    <Modal title={props.title} show={props.show} onClose={props.onClose}>
      <div>
        <div className={s.confirmationText}>{props.text}</div>
        <div className={s.confirmationBtns}>
          <Button
            appearance="underline"
            onClick={props.onConfirm}
            loading={props.isLoading}
          >
            Confirm
          </Button>
          <Button
            appearance="underline"
            theme="danger"
            onClick={props.onClose}
            disabled={props.isLoading}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;