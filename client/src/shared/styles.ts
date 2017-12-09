import { Constant } from './constants';
import { Color } from './colors';

export const Style = {
    NO_SELECT: {
        userSelect: 'none',
        MsUserSelect: 'none',
        MozUserSelect: 'none',
        KhtmlUserSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
    } as React.CSSProperties,
    INNER_BLUE_BOX_SHADOW: { boxShadow: `0px 0px 0px ${Constant.SLIDER_TRACK_SIZE}px ${Color.MID_BLUE} inset` } as React.CSSProperties,
    BORDER_RADIUS: {
        borderTopLeftRadius: Constant.BORDER_RADIUS,
        borderTopRightRadius: Constant.BORDER_RADIUS,
        borderBottomLeftRadius: Constant.BORDER_RADIUS,
        borderBottomRightRadius: Constant.BORDER_RADIUS,
        overflow: 'hidden',
    } as React.CSSProperties,
};
