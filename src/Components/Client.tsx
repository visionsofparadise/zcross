import React, { FC } from "react";

interface Props {
  name: string;
  imageSource: string;
  url: string;
}

export const Client: FC<Props> = ({ name, imageSource, url }) => (
  <div className="card mb-3">
    <a href={url} rel="noreferrer" target="_blank">
      <img src={imageSource} className="card-img-top" alt={name} />
    </a>
  </div>
);
