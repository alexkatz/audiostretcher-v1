import * as React from 'react';
import { Color } from '../shared/colors';
import { Constant } from '../shared/constants';
import { Style } from '../shared/styles';

interface AlphaSliderProps {
  style?: React.CSSProperties;
  alpha: number;
  onAlphaChange(alpha: number);
}

class AlphaSlider extends React.Component<AlphaSliderProps> {
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
    const { style, alpha } = this.props;
    const percent = Constant.GET_SLIDER_PERCENT_FROM_ALPHA(alpha);
    const width = this.containerDiv ? this.containerDiv.getBoundingClientRect().width : 0;
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
            color: Color.MID_BLUE,
            fontSize: Constant.FONT_SIZE.REGULAR,
            position: 'absolute',
            left: Constant.PADDING,
            top: Constant.PADDING,
            zIndex: 1,
          }}
          children={'playback speed'}
        />
        <div
          style={{
            position: 'absolute',
            color: Color.MID_BLUE,
            fontSize: Constant.FONT_SIZE.REGULAR,
            right: Constant.PADDING,
            top: Constant.PADDING,
            zIndex: 1,
            ...Style.NO_SELECT,
          }}
          children={`${(Constant.GET_ALPHA_PERCENT_FROM_SLIDER_PERCENT(percent) * 100).toFixed(2)}%`}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${percent * 100}%`,
            backgroundColor: Color.DARK_BLUE,
          }}
        />
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
    const { onAlphaChange } = this.props;
    const { width, left } = this.containerDiv.getBoundingClientRect();
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
