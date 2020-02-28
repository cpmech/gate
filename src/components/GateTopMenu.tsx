import React from 'react';
import { GateStore } from 'service';
import { Button } from 'rcomps';
import { t } from 'locale';

export interface IGateTopMenuProps {
  gate: GateStore;
}

export const GateTopMenu: React.FC<IGateTopMenuProps> = ({ gate }) => {
  return (
    <div>
      <Button onClick={async () => await gate.signOut()}>{t('signOut')}</Button>
      <div>HELLO</div>
    </div>
  );
};
