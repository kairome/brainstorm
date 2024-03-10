import React, { useEffect, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import classNames from 'classnames';
import Modal from 'ui/Modal/Modal';
import Input from 'ui/Input/Input';
import Button from 'ui/Button/Button';

import s from './Input.module.css';

interface Props {
  initialValue: string,
  onSave: (v: string) => void,
  canEdit?: boolean,
  className?: string,
}

const InlineInput: React.FC<Props> = (props) => {
  const { initialValue, className, canEdit } = props;
  const [internalValue, setInternalValue] = useState(initialValue);

  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    setInternalValue(initialValue);
  }, [initialValue]);

  const handleBlur = () => {
    setShowEditModal(false);
    if (!internalValue.trim()) {
      setInternalValue(initialValue);
      return;
    }

    if (internalValue === initialValue) {
      return;
    }

    props.onSave(internalValue);
  };

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setInternalValue(e.currentTarget.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  const renderInput = () => {
    if (!canEdit) {
      return (
        <div className={s.inlineInput}>{initialValue}</div>
      );
    }

    return (
      <input
        value={internalValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={s.inlineInput}
      />
    );
  };

  const containerClasses = classNames(s.inlineInputContainer, className, {
    [s.editable]: canEdit,
  });
  return (
    <>
      <div className={containerClasses}>
        {canEdit ? (<CiEdit />) : null}
        {renderInput()}
      </div>
      <div className={s.mobileInline}>
        <CiEdit onClick={() => setShowEditModal(true)} />
      </div>
      <Modal title="Board title" show={showEditModal} onClose={() => setShowEditModal(false)}>
        <Input
          type="text"
          label="Board title"
          value={internalValue}
          onChange={setInternalValue}
          disabled={!canEdit}
        />
        <Button onClick={handleBlur} className={s.saveInternalBtn}>
          Save
        </Button>
      </Modal>
    </>
  );
};

export default InlineInput;