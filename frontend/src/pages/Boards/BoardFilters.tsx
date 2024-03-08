import React, { useEffect, useState } from 'react';
import {
  IoClipboardOutline,
  IoClipboard,
  IoShareSocialOutline,
  IoShareSocial,
  IoClose,
} from 'react-icons/io5';
import { IoIosStarOutline, IoIosStar } from 'react-icons/io';
import classNames from 'classnames';
import { BoardFiltersPayload } from 'types/boards';
import SearchInput from 'ui/Input/SearchInput';
import { useSearchParams } from 'react-router-dom';
import queryString from 'query-string';

import s from './Boards.module.css';

const BoardFilters: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams({});
  const [filters, setFilters] = useState<BoardFiltersPayload>(queryString.parse(searchParams.toString()));

  useEffect(() => {
    setSearchParams(queryString.stringify(filters));
  }, [filters]);

  const handleBoardFilter = (value: 'my' | 'shared') => {
    setFilters({
      ...filters,
      board: value === filters.board ? undefined : value,
    });
  };

  const handleSearchChange = (search: string) => {
    setFilters(prevFilters => ({ ...prevFilters, search }));

  };

  const handleClear = () => {
    setFilters({});
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
      <SearchInput
        label="Search"
        placeholder="Search by name"
        value={filters.search}
        onChange={handleSearchChange}
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
        <span>Invited boards</span>
      </div>
      {renderClear()}
    </div>
  );
};

export default BoardFilters;