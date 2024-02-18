import React, { useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import classNames from 'classnames';

import s from './Input.module.css';

interface Props {
  initialValue: string,
  onSave: (v: string) => void,
  className?: string,
}

const InlineInput: React.FC<Props> = (props) => {
  const { initialValue, className } = props;
  const [internalValue, setInternalValue] = useState(initialValue);

  const handleBlur = () => {
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

  return (
    <div className={classNames(s.inlineInputContainer, className)}>
      <CiEdit />
      <input
        value={internalValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={s.inlineInput}
      />
    </div>
  );
};

export default InlineInput;