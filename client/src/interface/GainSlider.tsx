import * as React from 'react';
import { Color } from '../shared/colors';
import { Constant } from '../shared/constants';
import { Style } from '../shared/styles';

interface GainSliderProps {
  style?: React.CSSProperties;
  gain: number;
  onGainChange(gain: number);
}

class GainSlider extends React.Component<GainSliderProps> {
  private containerDiv: HTMLDivElement = null;
  private isMouseDown: boolean = false;

  public componentDidMount() {
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
  }

  public componentWillUnmount() {
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  }

  public render() {
    const {
      style,
      gain,
      onGainChange,
    } = this.props;
    return (
      <div
        ref={node => this.containerDiv = node}
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          ...style,
        }}
        onMouseDown={this.onMouseDown}
      >
        <div
          style={{
            color: Color.MID_BLUE,
            fontSize: Constant.FONT_SIZE.REGULAR,
            right: Constant.PADDING,
            top: Constant.PADDING,
            ...Style.NO_SELECT,
            zIndex: 1,
          }}
          children={`${(gain * 100).toFixed(2)}%`}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            height: `${gain * 100}%`,
            width: '100%',
            backgroundColor: Color.DARK_BLUE,
          }}
        />
      </div>
    );
  }

  private onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    this.isMouseDown = true;
    this.handleMouse(e.clientY);
  }

  private onMouseMove = (e: MouseEvent) => {
    if (this.isMouseDown) {
      this.handleMouse(e.clientY);
    }
  }

  private onMouseUp = (e: MouseEvent) => {
    this.isMouseDown = false;

  }

  private handleMouse = (clientY: number) => {
    const { onGainChange } = this.props;
    const { height, top } = this.containerDiv.getBoundingClientRect();
    let y = clientY - top;
    if (y < 0) { y = 0; }
    if (y > height) { y = height; }
    onGainChange((height - y) / height);
  }
}

export { GainSlider };
