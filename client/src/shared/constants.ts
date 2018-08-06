import { Locators } from '../interface/Track';

const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? 'http://musicalmind.io/audio'
    : 'http://localhost:3001/audio';

const SLIDER_WIDTH = 75;
const CANVAS_HEIGHT_PERCENT = 0.7;
const MIN_ALPHA = 0.5;
const MAX_ALPHA = 5;
const GET_PAN_FROM_PERCENT = (percent: number): number => (2 * percent) - 1;
const GET_PAN_PERCENT_FROM_PAN = (pan: number): number => (pan + 1) / 2;
const GET_ALPHA_FROM_SLIDER_PERCENT = (sliderPercent: number): number => MIN_ALPHA + ((MAX_ALPHA - MIN_ALPHA) * sliderPercent);
const GET_ALPHA_FROM_ALPHA_PERCENT = (alphaPercent: number): number => 1 / alphaPercent;
const GET_SLIDER_PERCENT_FROM_ALPHA = (alpha: number): number => (alpha - MIN_ALPHA) / (MAX_ALPHA - MIN_ALPHA);
const GET_ALPHA_PERCENT_FROM_SLIDER_PERCENT = (sliderPercent: number): number => 1 / GET_ALPHA_FROM_SLIDER_PERCENT(sliderPercent);
const LOCATORS_ARE_EQUAL = (a: Locators, b: Locators): boolean => a.startPercent === b.startPercent && a.endPercent === b.endPercent;

const ENSURE_RANGE_INCLUSIVE = (n: number): number => {
    if (n < 0) { return 0; }
    if (n > 1) { return 1; }
    return n;
};

const SECONDS_TO_HHMMSSMM = (n: number): string => {
    const HOUR_SECONDS = 3600;
    const MINUTE_SECONDS = 60;
    const hours = Math.floor(n / HOUR_SECONDS);
    const minutes = Math.floor((n - (hours * HOUR_SECONDS)) / MINUTE_SECONDS);
    const seconds = n - (hours * HOUR_SECONDS) - (minutes * MINUTE_SECONDS);
    const milliseconds = Math.floor((seconds % 1) * 100);
    const secondsFloored = Math.floor(seconds);
    const hh = hours < 10 ? `0${hours}` : hours;
    const mm = minutes < 10 ? `0${minutes}` : minutes;
    const ss = secondsFloored < 10 ? `0${secondsFloored}` : secondsFloored;
    const mmm = milliseconds < 10 ? `0${milliseconds}` : milliseconds;
    return `${hours > 0 ? `${hh}:` : ''}${mm}:${ss}:${mmm}`;
};

const GET_YOUTUBE_AUDIO = async (url: string): Promise<{ stream: ReadableStream, totalLength: number }> => {
    try {
        const result = await fetch(`${API_BASE_URL}?url=${url}`);
        const totalLength = Number(result.headers.get('Content-Length'));
        return {
            stream: result.body,
            totalLength,
        };
    } catch (error) {
        console.log(error);
        return null;
    }
};

const IS_YOUTUBE_URL = (url: string): boolean =>
    url.startsWith('https://www.youtube.com/')
    || url.startsWith('https://www.youtu.be/');

export const Constant = {
    FONT_WEIGHT: {
        LIGHT: 300 as 300,
        REGULAR: 400 as 400,
    },
    FONT_SIZE: {
        TINY: 10,
        SMALL: 15,
        REGULAR: 20,
        LARGE: 40,
    },
    PADDING: 8,
    Key: {
        SPACE: 32,
        SHIFT: 16,
        Z: 90,
        ESCAPE: 27,
        S: 83,
    },
    NO_OP: (() => { }) as () => void,
    SLIDER_WIDTH,
    CANVAS_HEIGHT_PERCENT,
    LOCATORS_ARE_EQUAL,
    MIN_ALPHA,
    MAX_ALPHA,
    GET_PAN_FROM_PERCENT,
    GET_PAN_PERCENT_FROM_PAN,
    GET_ALPHA_FROM_SLIDER_PERCENT,
    GET_ALPHA_FROM_ALPHA_PERCENT,
    GET_SLIDER_PERCENT_FROM_ALPHA,
    GET_ALPHA_PERCENT_FROM_SLIDER_PERCENT,
    IS_YOUTUBE_URL,
    ENSURE_RANGE_INCLUSIVE,
    SECONDS_TO_HHMMSSMM,
    GET_YOUTUBE_AUDIO,
    SLIDER_HANDLE_SIZE: 20,
    SLIDER_TRACK_SIZE: 2,
    SLIDER_SELECTED_TRACK_SIZE: 4,
    BORDER_RADIUS: 10,
    DEFAULT_INPUT_HEIGHT: 100,
};
