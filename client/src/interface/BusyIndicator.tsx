import * as React from 'react';
import * as Radium from 'radium';
import { Color } from '../shared/colors';

const orbStyle: React.CSSProperties = {
  width: 18,
  height: 18,
  backgroundColor: Color.LIGHT_BLUE,
  borderRadius: '100%',
  display: 'inline-block',
  animation: 'bounce 1.3s infinite ease-in-out both',
  animationName: Radium.keyframes({
    '0%': { transform: 'scale(0.2)' },
    '50%': { transform: 'scale(0.6)' },
    '100%': { transform: 'scale(0.0)' },
  }, 'bounce'),
};

const BusyIndicator = Radium(() => (
  <div>
    <div
      style={{
        ...orbStyle,
        animationDelay: '-0.32s',
      }}
    />
    <div
      style={{
        ...orbStyle,
        animationDelay: '-0.16s',
      }}
    />
    <div style={orbStyle} />
  </div>
));

export { BusyIndicator };
