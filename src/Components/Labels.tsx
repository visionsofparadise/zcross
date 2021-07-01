import React, { FC } from "react";
import { Label } from "./Label";

export const Labels: FC = () => (
  <div className="text-center">
    <div className="mb-5 px-5">
      <div className="row mb-5">
        <div className="col">
          <Label name="Armada" />
          <Label name="Firepower Records" />
          <Label name="Kinphonic" />
          <Label name="OWSLA" />
          <Label name="Confession" />
          <Label name="Interscope" />
          <Label name="Never Say Die" />
          <Label name="Polydor" />
        </div>
      </div>
    </div>
  </div>
);
