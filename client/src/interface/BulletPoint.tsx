import * as React from 'react';
import { Constant } from '../shared/constants';
import { Color } from '../shared/colors';

interface BulletPointProps {
  style?: React.CSSProperties;
  children?: any;
}

const BulletPoint = ({ style, children }: BulletPointProps) => (
  <div
    style={{
      padding: Constant.PADDING / 2,
      color: Color.DARK_BLUE,
      fontSize: 14,
      ...style,
    }}
  >
    &bull; {children}
  </div>
);

export { BulletPoint };
