import React from 'react';
import { Authenticator, Greetings } from 'aws-amplify-react';
import { UsernameAttributes } from 'aws-amplify-react/lib-esm/Auth/common/types';

const signUpConfig = {
  hiddenDefaults: ['phone_number'],
};

export const GateKeeper: React.FC = () => {
  return (
    <Authenticator
      hide={[Greetings]}
      signUpConfig={signUpConfig}
      usernameAttributes={UsernameAttributes.EMAIL}
    />
  );
};
