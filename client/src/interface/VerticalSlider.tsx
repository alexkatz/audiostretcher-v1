import * as React from 'react';
import { Color } from '../shared/colors';
import { Constant } from '../shared/constants';
import { Style } from '../shared/styles';

interface VerticalSliderProps {
  style?: React.CSSProperties;
  percent: number;
  onPercentChange(percent: number);
  defaultValue?: number;
}

class VerticalSlider extends React.Component<VerticalSliderProps> {
  private containerDiv: HTMLDivElement = null;
  private isMouseDown: boolean = false;

  public static defaultProps: Partial<VerticalSliderProps> = {
    defaultValue: 1,
  };

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
      percent,
      onPercentChange,
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
          children={`${(percent * 100).toFixed(2)}%`}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            height: `${percent * 100}%`,
            width: '100%',
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
    this.isMouseDown = false;

  }

  private handleMouse = (e: MouseEvent) => {
    const { onPercentChange, defaultValue } = this.props;
    const { height, top } = this.containerDiv.getBoundingClientRect();
    let y = e.clientY - top;
    if (y < 0) { y = 0; }
    if (y > height) { y = height; }
    let percent = (height - y) / height;
    if (e.shiftKey) {
      percent = Math.round(percent * 100) / 100;
    } else if (e.altKey) {
      percent = defaultValue;
    }
    onPercentChange(percent);
  }
}

export { VerticalSlider };
