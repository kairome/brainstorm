import React from 'react';
import Loader from 'ui/Loader/Loader';

import s from './Loader.module.css';

interface Props {
  loading: boolean,
  children: React.ReactNode,
}

const ContentLoader: React.FC<Props> = (props) => {
  const { loading } = props;
  return (
    <>
      {loading ? (
        <div className={s.contentLoaderCover}>
          <Loader />
        </div>
      ) : null}
      <div className={loading ? s.contentLoaderChildren : undefined}>
        {props.children}
      </div>
    </>
  );
};

export default ContentLoader;