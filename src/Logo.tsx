import React from 'react';
/** @jsx jsx */ import { jsx } from '@emotion/core';
import { useMediaQuery } from 'react-responsive';
import { ReactComponent as ImgLogo } from './logo.svg';

interface IProps {
  sizeNarrow?: number;
  sizeWide?: number;
}

export const Logo: React.FC<IProps> = ({ sizeNarrow = 80, sizeWide = 100 }) => {
  const isNarrow = useMediaQuery({ maxWidth: 600 });
  const size = isNarrow ? sizeNarrow : sizeWide;
  return (
    <React.Fragment>
      <ImgLogo width={size} height={size} />
    </React.Fragment>
  );
};
