import { Locators } from './Track';
import BufferedPV from '../phaseVocoder/Echo66PhaseVocoder';
import { Constant } from '../shared/constants';

const FRAME_SIZE = 2048;
const BUFFER_SIZE = 4096;

type AudioBufferChangedHandler = (buffer: AudioBuffer) => void;

export type RemoveListener = () => void;

export class Player {
    private internalBuffer: AudioBuffer = null;
    private audioBufferChangedListeners: AudioBufferChangedHandler[] = [];

    private scriptNode: ScriptProcessorNode = null;
    private gainNode: GainNode = null;

    private phaseVocoder: any = null;

    // PUBLIC 

    public audioContext: AudioContext = null;
    public playbackStartedAt: number = null;
    public playbackProgressSeconds: number = null;
    public loopStartPercent: number = 0;
    public loopEndPercent: number = 1;

    public set alpha(value: number) {
        if (this.phaseVocoder) {
            this.phaseVocoder.alpha = value;
        }
    }

    public get alpha(): number {
        return this.phaseVocoder.alpha;
    }

    public get position(): number {
        return this.phaseVocoder.position;
    }

    public set position(value: number) {
        this.phaseVocoder.position = value;
    }

    public get loopStartSeconds(): number {
        return (this.loopStartPercent || 0) * this.internalBuffer.duration;
    }

    public get loopEndSeconds(): number {
        return (this.loopEndPercent || 1) * this.internalBuffer.duration;
    }

    public setBuffer = async (arrayBuffer: ArrayBuffer) => {
        if (this.scriptNode !== null) { this.scriptNode.disconnect(this.gainNode); }
        if (this.gainNode !== null) { this.gainNode.disconnect(this.audioContext.destination); }
        if (this.playbackStartedAt !== null) { this.stop(); }
        if (this.audioContext !== null) { this.audioContext.close(); }
        this.audioContext = this.getNewAudioContext();
        const buffer = await this.audioContext.decodeAudioData(arrayBuffer);
        this.internalBuffer = buffer;
        this.audioBufferChangedListeners.forEach(listener => listener(buffer));
        this.phaseVocoder = new BufferedPV(FRAME_SIZE);
        this.phaseVocoder.set_audio_buffer(this.internalBuffer);
        this.phaseVocoder.alpha = 1;
        this.phaseVocoder.position = 0;
        this.scriptNode = this.audioContext.createScriptProcessor(4096, this.internalBuffer.numberOfChannels, this.internalBuffer.numberOfChannels);
        this.gainNode = this.audioContext.createGain();
        this.scriptNode.connect(this.gainNode);
        this.gainNode.connect(this.audioContext.destination);
        this.scriptNode.onaudioprocess = this.onAudioProcess;
    }

    public setAudioFromFile = (file: File) => {
        const fileReader = new FileReader();
        fileReader.onloadend = async () => this.setBuffer(fileReader.result);
        fileReader.readAsArrayBuffer(file);
    }

    public setAudioFromBuffer = async (buffer: ArrayBuffer) => {
        if (this.audioContext !== null) { this.audioContext.close(); }
        this.audioContext = this.getNewAudioContext();
        return this.setBuffer(buffer);
    }

    public onAudioBufferChanged = (listener: AudioBufferChangedHandler): RemoveListener => {
        this.audioBufferChangedListeners.push(listener);
        return () => {
            const index = this.audioBufferChangedListeners.indexOf(listener);
            this.audioBufferChangedListeners = this.audioBufferChangedListeners.filter((l, i) => i !== index);
        };
    }

    public play = () => {
        this.phaseVocoder.position = this.internalBuffer.length * this.loopStartPercent;
        this.playbackProgressSeconds = 0;
        if (this.playbackStartedAt === null) {
            this.playbackStartedAt = this.audioContext.currentTime;
        }
    }

    public setLoop = ({ startPercent, endPercent }: Locators) => {
        const ensuredStartPercent = Constant.ENSURE_RANGE_INCLUSIVE(startPercent);
        const ensuredEndPercent = Constant.ENSURE_RANGE_INCLUSIVE(endPercent);
        const prevStartPercent = this.loopStartPercent;
        this.loopStartPercent = Math.min(ensuredStartPercent, ensuredEndPercent);
        this.loopEndPercent = Math.max(ensuredStartPercent, ensuredEndPercent);
        if (this.playbackStartedAt !== null && prevStartPercent !== ensuredStartPercent) {
            this.phaseVocoder.position = this.internalBuffer.length * ensuredStartPercent;
            this.playbackProgressSeconds = 0;
        }
    }

    public stop = () => {
        this.playbackStartedAt = null;
        this.playbackProgressSeconds = null;
    }

    // PRIVATE 

    private getNewAudioContext = () => {
        const ValidAudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
        if (ValidAudioContext) {
            return new ValidAudioContext();
        }
        return null;
    }

    private onAudioProcess = ({ outputBuffer }: AudioProcessingEvent) => {
        if (this.playbackStartedAt !== null) {
            this.playbackProgressSeconds = (this.playbackProgressSeconds == null ? 0 : this.playbackProgressSeconds) + (outputBuffer.length / this.audioContext.sampleRate) / this.alpha;
            this.phaseVocoder.process(outputBuffer);
        } else {
            this.playbackProgressSeconds = null;
            for (let channel = 0; channel < outputBuffer.numberOfChannels; channel += 1) {
                const outputData = outputBuffer.getChannelData(channel);
                for (let sample = 0; sample < outputData.length; sample += 1) {
                    outputData[sample] = 0;
                }
            }
        }
    }
}
