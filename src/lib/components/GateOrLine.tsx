/** @jsxImportSource @emotion/react */
import { t } from '../locale';
import { gateStyles } from './gateStyles';

const s = gateStyles;

export const GateOrLine: React.FC = () => (
  <div css={s.orLine.root}>
    <span css={s.orLine.line}>{t('or')}</span>
  </div>
);
