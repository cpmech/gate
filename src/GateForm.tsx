import { GateSignUpForm, GateStore, LocalGateSignUpForm, LocalGateStore, SvgGateLogo } from './lib';
import { isLocal, gate } from './gate';

export const GateForm: React.FC = () => {
  if (isLocal) {
    return <LocalGateSignUpForm gate={gate as LocalGateStore} logo={<SvgGateLogo />} />;
  }

  return (
    <GateSignUpForm
      gate={gate as GateStore}
      colorSpinner="#ea8a2e"
      colorTitleLoading="#ea8a2e"
      logo={<SvgGateLogo />}
      mayHideEmailLogin={false}
      initShownEmailLogin={false}
    />
  );
};
