import * as React from 'react';
import { Constant } from '../shared/constants';
import { Style } from '../shared/styles';

const TutorialIcon = ({ style, ...props}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    style={{
      borderRadius: '50%',
      padding: Constant.PADDING,
      width: 30,
      height: 30,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      ...Style.NO_SELECT,
      ...style,
    }}
    {...props}
  >
    ?
  </div>
);

export { TutorialIcon };
