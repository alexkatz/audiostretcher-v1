import * as React from 'react';
import Popover, { ArrowContainer } from 'react-tiny-popover';
import { Style } from '../shared/styles';
import { Color } from '../shared/colors';
import { Constant } from '../shared/constants';
import { BusyIndicator } from '../interface/BusyIndicator';
import { YoutubeInput } from '../interface/YoutubeInput';

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
          <YoutubeInput
            isPopoverOpen={isPopoverOpen}
            containerStyle={{
              display: 'flex',
              height: 100,
              ...Style.INNER_BLUE_BOX_SHADOW,
              ...Style.BORDER_RADIUS,
            }}
            value={urlText}
            onChange={e => this.setState({ urlText: e.target.value })}
            onClick={e => e.stopPropagation()}
            onLoadUrl={onLoadUrl}
            isBusy={isBusy}
          />
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
