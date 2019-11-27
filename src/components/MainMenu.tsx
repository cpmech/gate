import React, { useEffect, useState } from 'react';
/** @jsx jsx */ import { jsx, css } from '@emotion/core';
import { Link } from '@reach/router';
import { ButtonLink, TopMenu, Narrow, Wide, ITopMenuEntry, ButtonSpin } from 'rcomps';
import { IconAccount, IconClose } from '@cpmech/react-icons';
import { GateStore } from './GateStore';

interface IMainMenuProps {
  gate: GateStore;
  NarrowLogoSvg?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  NarrowLogoIcon?: React.FunctionComponent<{ size?: number; style?: React.CSSProperties }>;
  narrowMiddleEntries?: ITopMenuEntry[];
  narrowShowEmail?: boolean;
  narrowLogoSize?: number;
  narrowButtonColor?: string;
  narrowButtonHoverColor?: string;
  narrowButtonHeight?: number;
  WideLogoSvg?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  WideLogoIcon?: React.FunctionComponent<{ size?: number; style?: React.CSSProperties }>;
  wideMiddleEntries?: ITopMenuEntry[];
  wideShowEmail?: boolean;
  wideLogoHeight?: number;
  wideLogoWidth?: number;
  wideMaxPageWidth?: number;
  wideButtonColor?: string;
  wideButtonColorDisabled?: string;
  wideButtonColorSpinner?: string;
  wideButtonBackgroundColor?: string;
  wideButtonHoverColor?: string;
  wideButtonBorderRadius?: number;
  wideButtonFontWeight?: string;
  wideButtonHeight?: number;
  wideButtonWidth?: string;
  loginText?: string;
  logoutText?: string;
  backgroundColor?: string;
  emailFontSize?: string;
  emailColor?: string;
  getEmail?: () => string;
}

export const MainMenu: React.FC<IMainMenuProps> = ({
  gate,
  NarrowLogoSvg,
  NarrowLogoIcon,
  narrowMiddleEntries = [],
  narrowShowEmail = false,
  narrowLogoSize = 38,
  narrowButtonColor = '#5d5c61',
  narrowButtonHoverColor = '#848389',
  narrowButtonHeight = 34,
  WideLogoSvg,
  WideLogoIcon,
  wideMiddleEntries = [],
  wideShowEmail = true,
  wideLogoHeight = 50,
  wideLogoWidth = 100,
  wideMaxPageWidth = 960,
  wideButtonColor = '#ffffff',
  wideButtonColorDisabled = '#d6d5d7',
  wideButtonColorSpinner = '#ffffff',
  wideButtonBackgroundColor = '#5d5c61',
  wideButtonHoverColor = '#848389',
  wideButtonBorderRadius = 200,
  wideButtonFontWeight = 'bold',
  wideButtonHeight = 34,
  wideButtonWidth = '130px',
  loginText = 'Welcome!',
  logoutText = 'Sign Out',
  backgroundColor = '#c5cbe3',
  emailFontSize = '70%',
  emailColor = '#343434',
  getEmail,
}) => {
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoading(gate.loading);
    setLoggedIn(gate.loggedIn);
    return gate.subscribe(() => {
      setLoading(gate.loading);
      setLoggedIn(gate.loggedIn);
    }, '@cpmech/gate/MainMenu');
  }, [gate]);

  const handleLogInOut = () => {
    if (loggedIn) {
      gate.logout();
    }
  };

  const access = !loading && loggedIn;
  const email = access && getEmail ? getEmail() : '';

  const narrowArray =
    narrowShowEmail && loggedIn
      ? narrowMiddleEntries.concat([
          <span key="show-email" style={{ fontSize: emailFontSize, color: emailColor }}>
            {email}
          </span>,
        ])
      : narrowMiddleEntries;

  const wideArray =
    wideShowEmail && loggedIn
      ? wideMiddleEntries.concat([
          <span key="show-email" style={{ fontSize: emailFontSize, color: emailColor }}>
            {email}
          </span>,
        ])
      : wideMiddleEntries;

  return (
    <React.Fragment>
      <Narrow>
        <div
          css={css`
            background-color: ${backgroundColor};
            ${access ? '' : 'display:none;'}
          `}
        >
          <TopMenu
            centered={true}
            entries={[
              <Link key="mainmenu-go-home" to="/">
                {NarrowLogoSvg && <NarrowLogoSvg height={narrowLogoSize} width={narrowLogoSize} />}
                {NarrowLogoIcon && <NarrowLogoIcon size={narrowLogoSize} />}
              </Link>,

              ...narrowArray,

              <ButtonLink
                key="mainmenu-login-logout"
                onClick={handleLogInOut}
                color={narrowButtonColor}
                hoverColor={narrowButtonHoverColor}
              >
                {loggedIn ? (
                  <IconClose size={narrowButtonHeight} />
                ) : (
                  <IconAccount size={narrowButtonHeight} />
                )}
              </ButtonLink>,
            ]}
          />
        </div>
      </Narrow>
      <Wide>
        <div
          css={css`
            background-color: ${backgroundColor};
            ${access ? '' : 'display:none;'}
          `}
        >
          <div
            css={css`
              max-width: ${wideMaxPageWidth}px;
              margin: auto;
            `}
          >
            <TopMenu
              entries={[
                <Link key="mainmenu-go-home" to="/">
                  {WideLogoSvg && <WideLogoSvg height={wideLogoHeight} width={wideLogoWidth} />}
                  {WideLogoIcon && <WideLogoIcon size={wideLogoWidth} />}
                </Link>,

                ...wideArray,

                <ButtonSpin
                  key="mainmenu-login-logout"
                  spin={loading}
                  disabled={false}
                  onClick={handleLogInOut}
                  colorSpinner={wideButtonColorSpinner}
                  color={wideButtonColor}
                  colorDisabled={wideButtonColorDisabled}
                  backgroundColor={wideButtonBackgroundColor}
                  hoverColor={wideButtonHoverColor}
                  borderRadius={wideButtonBorderRadius}
                  fontWeight={wideButtonFontWeight}
                  height={wideButtonHeight}
                  width={wideButtonWidth}
                >
                  {loggedIn ? logoutText : loginText}
                </ButtonSpin>,
              ]}
            />
          </div>
        </div>
      </Wide>
    </React.Fragment>
  );
};
