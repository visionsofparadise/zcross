import React, { FC } from "react";

interface Props {
  name: string;
  imageSource: string;
}

export const Label: FC<Props> = ({ name, imageSource }) => (
  <div className="card mb-3">
    <img src={imageSource} className="card-img-top" alt={name} />
  </div>
);
