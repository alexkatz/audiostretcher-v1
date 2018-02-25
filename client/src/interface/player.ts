import { Locators } from './Track';
import BufferedPV from '../phaseVocoder/Echo66PhaseVocoder';
import { Constant } from '../shared/constants';

const FRAME_SIZE = 2048;
const BUFFER_SIZE = 4096;

type AudioBufferChangedHandler = (buffer: AudioBuffer) => void;

export type RemoveListener = () => void;

export class Player {
  private internalBuffer: AudioBuffer = null;
  private internalPan: number = 0;
  private audioBufferChangedListeners: AudioBufferChangedHandler[] = [];

  private scriptNode: ScriptProcessorNode = null;
  private outputGainNode: GainNode = null;
  private inputSplitterNode: ChannelSplitterNode = null;
  private outputMergerNode: ChannelMergerNode = null;
  private leftLGainNode: GainNode = null;
  private leftRGainNode: GainNode = null;
  private rightLGainNode: GainNode = null;
  private rightRGainNode: GainNode = null;

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

  public set gain(value: number) {
    if (this.outputGainNode !== null) {
      this.outputGainNode.gain.value = value;
    }
  }

  public get gain(): number {
    return this.outputGainNode !== null ? this.outputGainNode.gain.value : null;
  }

  public set pan(value: number) {
    this.internalPan = value;
    if (this.leftLGainNode !== null) {
      this.leftLGainNode.gain.value = Constant.ENSURE_RANGE_INCLUSIVE(1 - this.internalPan);
      this.leftRGainNode.gain.value = Constant.ENSURE_RANGE_INCLUSIVE(this.internalPan);
      this.rightLGainNode.gain.value = this.internalPan >= 0 ? 0 : Math.abs(this.internalPan);
      this.rightRGainNode.gain.value = Constant.ENSURE_RANGE_INCLUSIVE(1 + this.internalPan);
    }
  }

  public get pan(): number {
    return this.internalPan;
  }

  public get loopStartSeconds(): number {
    return (this.loopStartPercent || 0) * this.internalBuffer.duration;
  }

  public get loopEndSeconds(): number {
    return (this.loopEndPercent || 1) * this.internalBuffer.duration;
  }

  public setBuffer = (arrayBuffer: ArrayBuffer) => {
    if (this.playbackStartedAt !== null) { this.stop(); }
    if (this.audioContext !== null) { this.audioContext.close(); }
    this.audioContext = this.getNewAudioContext();
    this.audioContext.decodeAudioData(arrayBuffer, buffer => {
      this.internalBuffer = buffer;
      this.audioBufferChangedListeners.forEach(listener => listener(buffer));
      this.phaseVocoder = new BufferedPV(FRAME_SIZE);
      this.phaseVocoder.set_audio_buffer(this.internalBuffer);
      this.phaseVocoder.alpha = 1;
      this.phaseVocoder.position = 0;

      // TODO: handle mono...

      // audio source
      this.scriptNode = this.audioContext.createScriptProcessor(4096, this.internalBuffer.numberOfChannels, this.internalBuffer.numberOfChannels);

      // output gain
      this.outputGainNode = this.audioContext.createGain();

      // input splitter
      this.inputSplitterNode = this.audioContext.createChannelSplitter(2);

      // output merger
      this.outputMergerNode = this.audioContext.createChannelMerger(2);

      // left and right gains
      this.leftLGainNode = this.audioContext.createGain();
      this.leftRGainNode = this.audioContext.createGain();
      this.rightLGainNode = this.audioContext.createGain();
      this.rightRGainNode = this.audioContext.createGain();
      this.leftLGainNode.gain.value = 1;
      this.leftRGainNode.gain.value = 0;
      this.rightLGainNode.gain.value = 0;
      this.rightRGainNode.gain.value = 1;

      // okay, now for signal routing...

      // feed stereo source to inputSplitter
      this.scriptNode.connect(this.inputSplitterNode);

      // feed inputSplitter to all gains
      this.inputSplitterNode.connect(this.leftLGainNode, 0, 0);
      this.inputSplitterNode.connect(this.leftRGainNode, 1, 0);
      this.inputSplitterNode.connect(this.rightLGainNode, 0, 0);
      this.inputSplitterNode.connect(this.rightRGainNode, 1, 0);

      // feed gains to outputMerger channel
      this.leftLGainNode.connect(this.outputMergerNode, 0, 0);
      this.leftRGainNode.connect(this.outputMergerNode, 0, 0);
      this.rightLGainNode.connect(this.outputMergerNode, 0, 1);
      this.rightRGainNode.connect(this.outputMergerNode, 0, 1);

      // feed outputMerger to outputGain
      this.outputMergerNode.connect(this.outputGainNode);

      // feed outputGain to dest
      this.outputGainNode.connect(this.audioContext.destination);

      this.scriptNode.onaudioprocess = this.onAudioProcess;
    });
  }

  public setAudioFromFile = (file: File) => {
    const fileReader = new FileReader();
    fileReader.onloadend = () => this.setBuffer(fileReader.result);
    fileReader.readAsArrayBuffer(file);
  }

  public setAudioFromBuffer = (buffer: ArrayBuffer) => {
    if (this.audioContext !== null) { this.audioContext.close(); }
    this.audioContext = this.getNewAudioContext();
    this.setBuffer(buffer);
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
