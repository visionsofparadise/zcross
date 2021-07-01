import React, { FC } from "react";
import ReactAudioPlayer from "react-audio-player";

interface Props {
  src: string;
}

export const AudioPlayer: FC<Props> = ({ src }) => (
  <ReactAudioPlayer
    src={src}
    controls
    style={{ height: 24 + "px", width: 192 + "px" }}
  />
);
