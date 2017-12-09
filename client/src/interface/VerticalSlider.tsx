import * as React from 'react';
import { Color } from '../shared/colors';
import { Constant } from '../shared/constants';
import { Style } from '../shared/styles';

interface VerticalSliderProps {
  style?: React.CSSProperties;
  percent: number;
  onPercentChange(percent: number);
  defaultValue?: number;
  label?: string;
}

class VerticalSlider extends React.Component<VerticalSliderProps> {
  private containerDiv: HTMLDivElement = null;
  private isMouseDown: boolean = false;

  public static defaultProps: Partial<VerticalSliderProps> = {
    defaultValue: 0.75,
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
      label,
    } = this.props;
    const height = this.containerDiv ? this.containerDiv.getBoundingClientRect().height : 0;
    return (
      <div
        ref={node => {
          if (this.containerDiv === null) {
            this.containerDiv = node;
            this.forceUpdate();
          }
        }}
        style={{
          position: 'relative',
          ...Style.BORDER_RADIUS,
          ...Style.INNER_BLUE_BOX_SHADOW,
          ...style,
        }}
        onMouseDown={this.onMouseDown}
      >
        {label && (
          <div // label
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              color: Color.MID_BLUE,
              zIndex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: Constant.PADDING,
              ...Style.NO_SELECT,
            }}
            children={label}
          />
        )}
        <div // selected track path container
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            height: height * percent,
            width: '100%',
            backgroundColor: Color.DARK_BLUE,
          }}
        >
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
    this.isMouseDown = false;

  }

  private handleMouse = (e: MouseEvent) => {
    const { onPercentChange, defaultValue } = this.props;
    const { height, top } = this.containerDiv.getBoundingClientRect();
    const y = e.clientY - top - (Constant.SLIDER_SELECTED_TRACK_SIZE * 0.5);
    let percent = Constant.ENSURE_RANGE_INCLUSIVE((height - y) / height);
    if (e.shiftKey) {
      percent = Math.round(percent * 100) / 100;
    } else if (e.altKey) {
      percent = defaultValue;
    }
    onPercentChange(percent);
  }
}

export { VerticalSlider };
