import * as React from 'react';
import { Player } from './player';
import { Color } from '../shared/colors';
import { Constant } from '../shared/constants';
import { Track } from './Track';
import { Style } from '../shared/styles';
import { VerticalSlider } from './VerticalSlider';
import { HorizontalSlider } from './HorizontalSlider';
import { ECHILD } from 'constants';

const DEFAULT_GAIN = 0.75;
const DEFAULT_PAN = 0;

interface InterfaceProps {
  width: number;
  height: number;
  audioBuffer?: AudioBuffer;
  player: Player;
  onLoadUrl?(urlText: string);
}

interface InterfaceState {
  alpha: number;
  gain: number;
  pan: number;
  urlText: string;
  isInputFocused: boolean;
}

class Interface extends React.Component<InterfaceProps, InterfaceState> {
  constructor(props: InterfaceProps) {
    super(props);
    this.state = {
      alpha: 1,
      pan: DEFAULT_PAN,
      gain: DEFAULT_GAIN,
      urlText: '',
      isInputFocused: false,
    };
  }

  public render() {
    const { width, height, audioBuffer, player, onLoadUrl } = this.props;
    const { alpha, gain, pan, urlText, isInputFocused } = this.state;
    const alphaSliderPercent = Constant.GET_SLIDER_PERCENT_FROM_ALPHA(alpha);
    const halfHeight = height * 0.5;
    const halfHeightThird = halfHeight / 3;
    return (
      <div
        style={{
          width,
          height,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Track
          width={width - (2 * Constant.PADDING)}
          height={halfHeight - (Constant.PADDING * 2)}
          audioBuffer={audioBuffer}
          player={player}
          alpha={alpha}
          gain={gain}
          pan={pan}
          style={{
            marginTop: Constant.PADDING,
            marginBottom: Constant.PADDING,
            marginLeft: Constant.PADDING,
            borderTopLeftRadius: Constant.BORDER_RADIUS,
            borderTopRightRadius: Constant.BORDER_RADIUS,
            borderBottomLeftRadius: Constant.BORDER_RADIUS,
            borderBottomRightRadius: Constant.BORDER_RADIUS,
            overflow: 'hidden',
          }}
          userInteractionEnabled={!isInputFocused}
        />
        <div // playback speed slider container
          style={{
            height: halfHeightThird,
            position: 'relative',
            paddingLeft: Constant.PADDING,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div // playback speed label
            style={{
              color: Color.MID_BLUE,
              marginBottom: Constant.PADDING,
              ...Style.NO_SELECT,
            }}
            children={'playback speed'}
          />
          <HorizontalSlider
            style={{
              marginRight: Constant.PADDING,
              marginBottom: Constant.PADDING,
              height: halfHeightThird - Constant.PADDING,
              flex: '1 1 auto',
            }}
            percent={alphaSliderPercent}
            onPercentChange={this.onAlphaPercentChange}
            label={this.getAlphaLabel(alphaSliderPercent)}
          />
        </div>
        <div // bottom two thirds container
          style={{
            height: halfHeightThird * 2,
            display: 'flex',
            paddingLeft: Constant.PADDING,
          }}
        >
          <div // gain slider container
            style={{
              width: Math.max(halfHeightThird / 1.25, Constant.SLIDER_WIDTH) - Constant.PADDING,
              marginBottom: Constant.PADDING,
              marginRight: Constant.PADDING,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div // gain label
              style={{
                color: Color.MID_BLUE,
                marginBottom: Constant.PADDING,
                ...Style.NO_SELECT,
              }}
              children={'gain'}
            />
            <VerticalSlider
              style={{
                flex: '1 1 auto',
              }}
              percent={gain}
              onPercentChange={gain => this.setState({ gain })}
              label={`${(gain * 100).toFixed(2)}%`}
            />
          </div>
          <div // pan and url container
            style={{
              flex: '1 1 auto',
              display: 'flex',
              flexDirection: 'column',
              paddingBottom: Constant.PADDING,
              paddingRight: Constant.PADDING,
            }}
          >
            <div // pan container
              style={{
                height: halfHeightThird,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div // pan label
                style={{
                  color: Color.MID_BLUE,
                  marginBottom: Constant.PADDING,
                  ...Style.NO_SELECT,
                }}
                children={'pan'}
              />
              <HorizontalSlider // pan slider
                style={{
                  flex: '1 1 auto',
                  marginBottom: Constant.PADDING,
                }}
                label={`${pan.toFixed(2)}`}
                handleColor={Color.DARK_BLUE}
                selectedColor={'transparent'}
                percent={Constant.GET_PAN_PERCENT_FROM_PAN(pan)}
                onPercentChange={this.onPanChange}
              />
            </div>
            <div // url container
              style={{
                height: halfHeightThird,
                display: 'flex',
                flexDirection: 'column',
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
                  height: halfHeightThird,
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
                  onFocus={() => this.setState({ isInputFocused: true })}
                  onBlur={() => this.setState({ isInputFocused: false })}
                />
                <button
                  onClick={() => onLoadUrl(urlText)}
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
          </div>
        </div>
      </div>
    );
  }

  private getAlphaLabel = (percent: number) => `${(Constant.GET_ALPHA_PERCENT_FROM_SLIDER_PERCENT(percent) * 100).toFixed(2)}%`;

  private onAlphaPercentChange = (percent: number, e: MouseEvent) => {
    let alpha = Constant.GET_ALPHA_FROM_SLIDER_PERCENT(percent);
    if (e.shiftKey) {
      const alphaPercent = Constant.GET_ALPHA_PERCENT_FROM_SLIDER_PERCENT(percent);
      const roundedAlphaPercent = Math.round(alphaPercent * 100) / 100;
      alpha = Constant.GET_ALPHA_FROM_ALPHA_PERCENT(roundedAlphaPercent);
    } else if (e.altKey) {
      alpha = 1;
    }
    this.setState({ alpha });
  }

  private onPanChange = (panPercent: number, e: MouseEvent) => {
    let newPanPercent = panPercent;
    if (e.shiftKey) {
      newPanPercent = Math.round(panPercent * 100) / 100;
    } else if (e.altKey) {
      newPanPercent = 0.5;
    }
    this.setState({ pan: Constant.GET_PAN_FROM_PERCENT(newPanPercent) });
  }

}

export { Interface };
