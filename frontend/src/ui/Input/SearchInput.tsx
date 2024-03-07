import React, { useEffect, useMemo, useState } from 'react';
import Input from 'ui/Input/Input';
import { IoSearchOutline } from 'react-icons/io5';
import _ from 'lodash';

interface Props {
  label: string,
  placeholder: string,
  onChange: (v: string) => void,
  value?: string,
  delay?: number,
  className?: string,
}

const SearchInput: React.FC<Props> = (props) => {
  const {
    label,
    placeholder,
    value = '',
    delay = 1500,
  } = props;
  const [searchTextInternal, setSearchTextInternal] = useState('');

  const debounceSearch = useMemo(() => _.debounce((v: string) => {
    props.onChange(v);
  }, delay), []);

  useEffect(() => {
    if (value !== searchTextInternal) {
      setSearchTextInternal(value);
    }
  }, [value]);

  const handleSearchChange = (val: string) => {
    debounceSearch.cancel();
    setSearchTextInternal(val);
    debounceSearch(val);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      debounceSearch.cancel();
      props.onChange(searchTextInternal);
    }
  };

  return (
    <Input
      type="text"
      label={label}
      placeholder={placeholder}
      value={searchTextInternal}
      onChange={handleSearchChange}
      onKeyPress={handleKeyPress}
      icon={<IoSearchOutline />}
      className={props.className}
      iconPosition="left"
    />
  );
};

export default SearchInput;