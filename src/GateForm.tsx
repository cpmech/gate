/** @jsxImportSource @emotion/react */
import { IconEarth } from '@cpmech/iricons/IconEarth';
import { GateSignUpForm, GateStore, LocalGateSignUpForm, LocalGateStore } from './lib';
import { isLocal, gate } from './gate';

export const GateForm: React.FC = () => {
  if (isLocal) {
    return <LocalGateSignUpForm gate={gate as LocalGateStore} logo={<IconEarth size="100px" />} />;
  }

  return (
    <GateSignUpForm
      gate={gate as GateStore}
      colorSpinner="#ea8a2e"
      colorTitleLoading="#ea8a2e"
      logo={<IconEarth size="100px" />}
      mayHideEmailLogin={false}
      initShownEmailLogin={false}
    />
  );
};
