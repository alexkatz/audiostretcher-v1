import * as React from 'react';
import { AutoSizer } from 'react-virtualized';
import { DropzoneProps, DropFilesEventHandler } from 'react-dropzone';
import { StyleRoot } from 'radium';
import { Color } from '../shared/colors';
import { Constant } from '../shared/constants';
import { Style } from '../shared/styles';
import { Player, RemoveListener } from '../interface/player';
import { Interface } from '../interface/Interface';
import { Welcome } from './Welcome';
const Dropzone = require('react-dropzone').default as React.ComponentType<DropzoneProps>;

interface HomeState {
  audioBuffer: AudioBuffer;
  audioFetchProgress: number;
}

interface ReadResult {
  done: boolean;
  value?: any;
}

class Home extends React.Component<any, HomeState> {
  private player = new Player();
  private removeListeners: RemoveListener[] = [];

  constructor(props: any) {
    super(props);
    this.state = {
      audioBuffer: null,
      audioFetchProgress: 1,
    };
  }

  public componentWillMount() {
    this.removeListeners.push(
      this.player.onAudioBufferChanged(audioBuffer => this.setState({ audioBuffer })),
    );
  }

  public componentWillUnmount() {
    this.removeListeners.forEach(removeListener => removeListener());
  }

  public render() {
    const { audioBuffer, audioFetchProgress } = this.state;
    return (
      <AutoSizer>
        {({ width, height }) => (
          <StyleRoot>
            <div
              style={{
                width,
                height,
                backgroundColor: Color.LIGHT_BLUE,
              }}
            >
              <Dropzone
                disabled={audioBuffer != null}
                onDrop={([file]) => this.player.setAudioFromFile(file)}
                style={{
                  width: '100%',
                  height: '100%',
                } as React.CSSProperties}
              >
                {!audioBuffer && (
                  <Welcome
                    width={width}
                    onLoadUrl={this.onLoadUrl}
                    audioFetchProgress={audioFetchProgress}
                  />
                )}
                {audioBuffer && (
                  <Interface
                    width={width}
                    height={height}
                    audioBuffer={audioBuffer}
                    player={this.player}
                    onLoadUrl={this.onLoadUrl}
                    audioFetchProgress={audioFetchProgress}
                  />
                )}
              </Dropzone>
            </div>
          </StyleRoot>
        )}
      </AutoSizer>
    );
  }

  private onLoadUrl = async (url: string) => {
    if (url === null
      || url === undefined
      || url.length === 0
      || !Constant.IS_YOUTUBE_URL(url)) {
      return;
    }

    this.setState({ audioFetchProgress: 0 }, async () => {
      const result = await Constant.GET_YOUTUBE_AUDIO(url);
      if (result) {
        const reader = result.stream.getReader();
        const readChunksRecursively = async (arrays: Uint8Array[], length: number) => {
          const readResult = await reader.read();
          if (readResult.done) {
            const array = new Uint8Array(length);
            arrays.reduce((length, arr) => {
              array.set(arr, length);
              return length += arr.length;
            }, 0);
            this.setState({ audioFetchProgress: 1 }, () => this.player.setAudioFromBuffer(array.buffer));
          } else {
            const array = readResult.value;
            arrays.push(array);
            length += array.length;
            const audioFetchProgress = length / result.totalLength;
            this.setState({ audioFetchProgress }, () => readChunksRecursively(arrays, length));
          }
        };
        
        readChunksRecursively([], 0);
      }
    });
  }
}

export { Home };
