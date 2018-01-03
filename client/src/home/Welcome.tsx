import * as React from 'react';
import { Style } from '../shared/styles';
import { Color } from '../shared/colors';
import { Constant } from '../shared/constants';

interface WelcomeProps {
  width: number;
  onLoadUrl?(urlText: string);
}

interface WelcomeState {
  urlText: string;
}

class Welcome extends React.Component<WelcomeProps, WelcomeState> {
  constructor(props: WelcomeProps) {
    super(props);
    this.state = {
      urlText: '',
    };
  }

  public render() {
    const { width, onLoadUrl } = this.props;
    const { urlText } = this.state;
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
                onLoadUrl(urlText);
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
                cursor: 'pointer',
              }}
              children={'get audio'}
            />
          </div>
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
