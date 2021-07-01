import React, { FC } from "react";

interface Props {
  name: string;
}

export const Label: FC<Props> = ({ name }) => <p className="mb-1">- {name}</p>;
