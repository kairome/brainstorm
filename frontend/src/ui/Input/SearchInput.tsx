import React, { useEffect, useMemo, useState } from 'react';
import Input from 'ui/Input/Input';
import { IoSearchOutline } from 'react-icons/io5';
import _ from 'lodash';

interface Props {
  label: string,
  placeholder: string,
  value?: string,
  onChange: (v: string) => void,
}

const SearchInput: React.FC<Props> = (props) => {
  const {
    label,
    placeholder,
    value = '',
  } = props;
  const [searchTextInternal, setSearchTextInternal] = useState('');

  const debounceSearch = useMemo(() => _.debounce((v: string) => {
    props.onChange(v);
  }, 1500), []);

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
      iconPosition="left"
    />
  );
};

export default SearchInput;