import * as React from 'react';
import { Player } from './player';
import { Color } from '../shared/colors';
import { Constant } from '../shared/constants';
import { Track } from './Track';
import { AlphaSlider } from './AlphaSlider';
import { Style } from '../shared/styles';
import { VerticalSlider } from './VerticalSlider';

const DEFAULT_GAIN = 0.75;

interface InterfaceProps {
  width: number;
  height: number;
  audioBuffer?: AudioBuffer;
  player: Player;
}

interface InterfaceState {
  alpha: number;
  gain: number;
  urlText: string;
}

class Interface extends React.Component<InterfaceProps, InterfaceState> {
  constructor(props: InterfaceProps) {
    super(props);
    this.state = {
      alpha: 1,
      gain: DEFAULT_GAIN,
      urlText: '',
    };
  }

  public render() {
    const { width, height, audioBuffer, player } = this.props;
    const { alpha, gain, urlText } = this.state;
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
          width={width}
          height={Constant.GET_CANVAS_HEIGHT(height)}
          audioBuffer={audioBuffer}
          player={player}
          alpha={alpha}
          gain={gain}
        />
        <div
          style={{
            position: 'relative',
            height: Constant.HEADER_HEIGHT,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: Constant.PADDING,
            ...Style.NO_SELECT,
          }}
        >
          <AlphaSlider
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
            alpha={alpha}
            onAlphaChange={alpha => this.setState({ alpha })}
          />
        </div>
        <div
          style={{
            position: 'relative',
            flex: '1 1 auto',
            display: 'flex',
          }}
        >
          <VerticalSlider
            style={{
              position: 'absolute',
              width: Constant.HEADER_HEIGHT * 2,
              height: '100%',
            }}
            percent={gain}
            onPercentChange={gain => this.setState({ gain })}
            defaultValue={DEFAULT_GAIN}
          />
        </div>
        <input
          style={{
            height: Constant.HEADER_HEIGHT,
            backgroundColor: 'blue',
            border: 'none',
            outline: 'none',
          }}
          type={'text'}
          value={urlText}
          onChange={e => this.setState({ urlText: e.target.value })}
        />
      </div>
    );
  }
}

export { Interface };
