import React, { useEffect, useMemo, useState } from 'react';
import Input from 'ui/Input/Input';
import _ from 'lodash';
import {
  IoSearchOutline,
  IoClipboardOutline,
  IoClipboard,
  IoShareSocialOutline,
  IoShareSocial,
  IoClose,
} from 'react-icons/io5';
import { IoIosStarOutline, IoIosStar } from 'react-icons/io';
import classNames from 'classnames';
import { BoardFiltersPayload } from 'types/boards';

import s from './Boards.module.css';

interface Props {
  onChange: (f: BoardFiltersPayload) => void,
}

const BoardFilters: React.FC<Props> = (props) => {
  const [searchTextInternal, setSearchTextInternal] = useState('');

  const [filters, setFilters] = useState<BoardFiltersPayload>({});

  const debounceSearch = useMemo(() => _.debounce((value: string) => {
    setFilters(prevFilters => ({ ...prevFilters, search: value }));
  }, 1500), []);

  useEffect(() => {
    props.onChange(filters);
  }, [filters]);

  const handleSearchChange = (value: string) => {
    debounceSearch.cancel();
    setSearchTextInternal(value);
    debounceSearch(value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      debounceSearch.cancel();
      setFilters({ ...filters, search: searchTextInternal });
    }
  };

  const handleBoardFilter = (value: 'my' | 'shared') => {
    setFilters({
      ...filters,
      board: value === filters.board ? undefined : value,
    });
  };

  const handleClear = () => {
    setFilters({});
    setSearchTextInternal('');
  };

  const renderClear = () => {
    if (!filters.search && !filters.isFavorite && !filters.board) {
      return null;
    }

    return (
      <div onClick={handleClear} className={s.clearFilters}>
        <IoClose />
        Clear
      </div>
    );
  };

  const favPillClasses = classNames(s.filterPill, {
    [s.pillActive]: filters.isFavorite,
  });

  const myBoardClasses = classNames(s.filterPill, {
    [s.pillActive]: filters.board === 'my',
  });

  const sharedBoardClasses = classNames(s.filterPill, {
    [s.pillActive]: filters.board === 'shared',
  });

  return (
    <div className={s.filters}>
      <Input
        type="text"
        label="Search"
        placeholder="Search by name"
        value={searchTextInternal}
        onChange={handleSearchChange}
        onKeyPress={handleKeyPress}
        icon={<IoSearchOutline />}
        iconPosition="left"
      />
      <div className={favPillClasses} onClick={() => setFilters({ ...filters, isFavorite: !filters.isFavorite })}>
        {filters.isFavorite ? <IoIosStar /> : <IoIosStarOutline />}
        <span>Favorites</span>
      </div>
      <div className={myBoardClasses} onClick={() => handleBoardFilter('my')}>
        {filters.board === 'my' ? <IoClipboard /> : <IoClipboardOutline />}
        <span>My boards</span>
      </div>
      <div className={sharedBoardClasses} onClick={() => handleBoardFilter('shared')}>
        {filters.board === 'shared' ? <IoShareSocial /> : <IoShareSocialOutline />}
        <span>Shared boards</span>
      </div>
      {renderClear()}
    </div>
  );
};

export default BoardFilters;