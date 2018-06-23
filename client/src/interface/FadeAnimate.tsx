import * as React from 'react';
import Radium from 'radium';

interface FadeAnimateProps {
  style?: React.CSSProperties;
  text: string;
}
const FadeAnimate = Radium(({ text, style }: FadeAnimateProps) => (
  <div
    style={{
      ...style,
      animation: 'bounce 1.3s infinite ease-in-out both',
      animationName: Radium.keyframes({
        '0%': { opacity: 1 },
        '25%': { opacity: 0.8 },
        '50%': { opacity: 0.6 },
        '75%': { opacity: 0.8 },
        '100%': { opacity: 1 },
      }, 'bounce') as any,
    }}
  >
    {text}
  </div>
));

export { FadeAnimate };
