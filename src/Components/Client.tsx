import React, { FC } from "react";

interface Props {
  name: string;
  url?: string;
}

export const Client: FC<Props> = ({ name, url }) =>
  url ? (
    <a href={url} rel="noreferrer" target="_blank">
      <p className="mb-1">{name}</p>
    </a>
  ) : (
    <p className="mb-1">{name}</p>
  );
