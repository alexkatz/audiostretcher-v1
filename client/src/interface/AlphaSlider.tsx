import * as React from 'react';
import { Color } from '../shared/colors';
import { Constant } from '../shared/constants';
import { Style } from '../shared/styles';

interface AlphaSliderProps {
  style?: React.CSSProperties;
  alpha: number;
  width: number;
  onAlphaChange(alpha: number);
}

interface AlphaSliderState {
  isMouseDown: boolean;
}

class AlphaSlider extends React.Component<AlphaSliderProps, AlphaSliderState> {
  private containerDiv: HTMLDivElement = null;
  private isMouseDown: boolean = false;

  constructor(props: AlphaSliderProps) {
    super(props);
    this.state = {
      isMouseDown: false,
    };
  }

  public componentDidMount() {
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
  }

  public componentWillUnmount() {
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  }

  public render() {
    const { style, width, alpha } = this.props;
    const percent = Constant.GET_SLIDER_PERCENT_FROM_ALPHA(alpha);
    return (
      <div
        ref={node => this.containerDiv = node}
        onMouseDown={this.onMouseDown}
        style={{
          position: 'relative',
          ...style,
        }}
      >
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            top: 0,
            left: 0,
            height: '100%',
            width: width * percent,
            backgroundColor: Color.DARK_BLUE,
            overflow: 'hidden',
            paddingLeft: Constant.PADDING,
            color: Color.MID_BLUE,
            fontSize: Constant.FONT_SIZE.REGULAR,
            whiteSpace: 'nowrap',
            zIndex: 1,
          }}
        >
          <div
            style={{
              color: Color.MID_BLUE,
              fontSize: Constant.FONT_SIZE.REGULAR,
              position: 'absolute',
              left: Constant.PADDING,
              top: Constant.PADDING,
            }}
          >
            playback speed
          </div>
          <div
            style={{
              position: 'absolute',
              color: Color.MID_BLUE,
              fontSize: Constant.FONT_SIZE.REGULAR,
              right: -width * (1 - percent) + Constant.PADDING,
              top: Constant.PADDING,
              ...Style.NO_SELECT,
            }}
          >
            {`${(Constant.GET_ALPHA_PERCENT_FROM_SLIDER_PERCENT(percent) * 100).toFixed(2)}%`}
          </div>
        </div>
        <div
          style={{
            color: Color.DARK_BLUE,
            fontSize: Constant.FONT_SIZE.REGULAR,
            position: 'absolute',
            left: Constant.PADDING,
            top: Constant.PADDING,
          }}
        >
          playback speed
        </div>
        <div
          style={{
            position: 'absolute',
            color: Color.DARK_BLUE,
            fontSize: Constant.FONT_SIZE.REGULAR,
            right: Constant.PADDING,
            top: Constant.PADDING,
            ...Style.NO_SELECT,
          }}
        >
          {`${(Constant.GET_ALPHA_PERCENT_FROM_SLIDER_PERCENT(percent) * 100).toFixed(2)}%`}
        </div>
      </div>
    );
  }

  private onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    this.isMouseDown = true;
    this.handleMouse(e as any);
  }

  private onMouseMove = (e: MouseEvent) => {
    if (this.isMouseDown) {
      this.handleMouse(e);
    }
  }

  private onMouseUp = (e: MouseEvent) => {
    if (this.isMouseDown) {
      this.isMouseDown = false;
      this.handleMouse(e);
    }
  }

  private handleMouse = (e: MouseEvent) => {
    const { width, onAlphaChange } = this.props;
    const { left } = this.containerDiv.getBoundingClientRect();
    const x = e.clientX - left;
    const percent = Constant.ENSURE_RANGE_INCLUSIVE(x / width);
    let alpha = Constant.GET_ALPHA_FROM_SLIDER_PERCENT(percent);
    if (e.shiftKey) {
      const alphaPercent = Constant.GET_ALPHA_PERCENT_FROM_SLIDER_PERCENT(percent);
      const roundedAlphaPercent = Math.round(alphaPercent * 100) / 100;
      alpha = Constant.GET_ALPHA_FROM_ALPHA_PERCENT(roundedAlphaPercent);
    } else if (e.altKey) {
      alpha = 1;
    }
    onAlphaChange(alpha);
  }
}

export { AlphaSlider };
