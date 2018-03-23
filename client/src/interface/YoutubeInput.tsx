import * as React from 'react';
import Popover, { ArrowContainer } from 'react-tiny-popover';
import { Color } from '../shared/colors';
import { Constant } from '../shared/constants';
import { Style } from '../shared/styles';
import { FadeAnimate } from './FadeAnimate';

interface YoutubeInputProps {
  audioFetchProgress?: number;
  isPopoverOpen?: boolean;
  containerStyle?: React.CSSProperties;
  onLoadUrl?(urlText: string);
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onClick?: React.MouseEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
}

const YoutubeInput = ({
  audioFetchProgress,
  value,
  onLoadUrl,
  onClick,
  containerStyle,
  onFocus,
  onBlur,
  onChange,
  isPopoverOpen,
}: YoutubeInputProps) => {
  const isBusy = audioFetchProgress < 1;
  return (
    <Popover
      isOpen={isPopoverOpen}
      content={({ targetRect, popoverRect }) => (
        <ArrowContainer
          arrowColor={Color.MID_BLUE}
          position={'top'}
          targetRect={targetRect}
          popoverRect={popoverRect}
        >
          <div
            style={{
              padding: Constant.PADDING,
              backgroundColor: Color.MID_BLUE,
              color: Color.LIGHT_BLUE,
              ...Style.BORDER_RADIUS,
            }}
          >
            make sure this link is to a youtube video!
          </div>
        </ArrowContainer>
      )}
    >
      <div // input and button container
        style={{
          display: 'flex',
          height: Constant.DEFAULT_INPUT_HEIGHT,
          ...Style.INNER_BLUE_BOX_SHADOW,
          ...Style.BORDER_RADIUS,
          ...containerStyle,
        }}
      >
        <input
          style={{
            minHeight: Constant.SLIDER_WIDTH,
            outline: 'none',
            backgroundColor: 'transparent',
            border: 'none',
            padding: Constant.PADDING,
            fontSize: Constant.FONT_SIZE.LARGE,
            color: Color.MID_BLUE,
            flex: '1 1 auto',
          }}
          type={'text'}
          value={value}
          onChange={onChange}
          onClick={onClick}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={e => e.keyCode === 13 && onLoadUrl(value)}
        />
        <button
          onClick={e => {
            e.stopPropagation();
            if (!isBusy) {
              onLoadUrl(value);
            }
          }}
          style={{
            fontSize: Constant.FONT_SIZE.REGULAR,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            outline: 'none',
            color: Color.LIGHT_BLUE,
            backgroundColor: Color.MID_BLUE,
            ...Style.BORDER_RADIUS,
            cursor: isBusy ? 'cursor' : 'pointer',
            width: 120,
          }}
        >
          {isBusy && (
            <FadeAnimate text={`${(audioFetchProgress * 100).toFixed(2)}%`} />
          )}
          {!isBusy && (
            <span children={'get audio'} />
          )}
        </button>
      </div>
    </Popover>
  );
};

export { YoutubeInput };
