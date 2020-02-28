import React from 'react';
/** @jsx jsx */ import { jsx } from '@emotion/core';
import { Modal } from 'rcomps';
import { t } from 'locale';
import { styles } from './styles';

const s = styles.modalError;

export interface IGateModalError {
  message: string;
  onClose: () => void;
}

export const GateModalError: React.FC<IGateModalError> = ({ message, onClose }) => {
  return (
    <Modal
      title={t('error')}
      onClose={onClose}
      titleStyle={s.title}
      minWidth={s.minWidth}
      maxWidth={s.maxWidth}
    >
      <div css={s.content}>{message}</div>
    </Modal>
  );
};
