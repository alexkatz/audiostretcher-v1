import * as React from 'react';
import { Color } from '../shared/colors';
import { Constant } from '../shared/constants';
import { Style } from '../shared/styles';

const HANDLE_SIZE = 20;

interface HorizontalSliderProps {
  style?: React.CSSProperties;
  percent: number;
  selectedColor?: string | React.StyleHTMLAttributes<HTMLDivElement>;
  handleColor?: string;
  onPercentChange(percent: number, e: MouseEvent);
  label?: string;
}

class HorizontalSlider extends React.Component<HorizontalSliderProps> {
  private containerDiv: HTMLDivElement = null;
  private isMouseDown: boolean = false;

  public static defaultProps: Partial<HorizontalSliderProps> = {
    selectedColor: Color.DARK_BLUE,
  };

  public componentDidMount() {
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
  }

  public componentWillUnmount() {
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  }
  
  public shouldComponentUpdate(nextProps) {
    return this.props.percent !== nextProps.percent;
  }

  public render() {
    const { style, percent, label, selectedColor, handleColor } = this.props;
    const width = this.containerDiv ? this.containerDiv.getBoundingClientRect().width : 0;
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
              height: '100%',
              left: 0,
              top: 0,
              padding: Constant.PADDING,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: Color.MID_BLUE,
              zIndex: 1,
              ...Style.NO_SELECT,
            }}
            children={label}
          />
        )}
        <div // selected track path container
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: width * percent,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div // selected track
            style={{
              position: 'relative',
              backgroundColor: selectedColor,
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            {handleColor && (
              <div // handle
                style={{
                  position: 'relative',
                  width: HANDLE_SIZE,
                  left: HANDLE_SIZE / 2,
                  minWidth: HANDLE_SIZE,
                  height: '100%',
                  backgroundColor: handleColor,
                }}
              />
            )}
          </div>
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
    const { onPercentChange } = this.props;
    const { width, left } = this.containerDiv.getBoundingClientRect();
    const x = e.clientX - left;
    const percent = Constant.ENSURE_RANGE_INCLUSIVE(x / width);
    onPercentChange(percent, e);
  }
}

export { HorizontalSlider };
