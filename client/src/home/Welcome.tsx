import * as React from 'react';
import Popover, { ArrowContainer } from 'react-tiny-popover';
import { Style } from '../shared/styles';
import { Color } from '../shared/colors';
import { Constant } from '../shared/constants';
import { BusyIndicator } from '../shared/busyIndicator';

interface WelcomeProps {
  width: number;
  onLoadUrl?(urlText: string);
  isBusy?: boolean;
}

interface WelcomeState {
  urlText: string;
  isPopoverOpen: boolean;
}

class Welcome extends React.Component<WelcomeProps, WelcomeState> {
  constructor(props: WelcomeProps) {
    super(props);
    this.state = {
      urlText: '',
      isPopoverOpen: false,
    };
  }

  public componentDidUpdate(prevProps: WelcomeProps, prevState: WelcomeState) {
    if (this.state.urlText !== prevState.urlText) {
      this.setState({ isPopoverOpen: this.state.urlText.length > 0 && !Constant.IS_YOUTUBE_URL(this.state.urlText) });
    }
  }

  public render() {
    const { width, onLoadUrl, isBusy } = this.props;
    const { urlText, isPopoverOpen } = this.state;
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          ...Style.NO_SELECT,
        }}
      >
        <div
          style={{
            flex: '33.333%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: Math.min(Math.round(width / 10), 50),
            color: Color.MID_BLUE,
            cursor: 'default',
          }}
        >
          audio stretcher
        </div>
        <div
          style={{
            flex: '33.333%',
            display: 'flex',
            flexDirection: 'column',
            width: '90%',
          }}
        >
          <div // url label
            style={{
              color: Color.MID_BLUE,
              marginBottom: Constant.PADDING,
              ...Style.NO_SELECT,
            }}
            children={'youtube url'}
          />
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
                height: 100,
                ...Style.INNER_BLUE_BOX_SHADOW,
                ...Style.BORDER_RADIUS,
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
                value={urlText}
                onChange={e => this.setState({ urlText: e.target.value })}
                onClick={e => e.stopPropagation()}
              />
              <button
                onClick={e => {
                  e.stopPropagation();
                  if (!isBusy) {
                    onLoadUrl(urlText);
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
                  <BusyIndicator />
                )}
                {!isBusy && (
                  <span children={'get audio'} />
                )}
              </button>
            </div>
          </Popover>
        </div>
        <div
          style={{
            flex: '33.333%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: Math.min(Math.round(width / 20), 30),
            fontWeight: Constant.FONT_WEIGHT.LIGHT,
            color: Color.MID_BLUE,
            cursor: 'default',
          }}
        >
          or click anywhere, or drag an audio file in
        </div>
      </div>
    );
  }
}

export { Welcome };
