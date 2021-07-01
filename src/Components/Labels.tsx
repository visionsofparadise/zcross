import React, { FC } from "react";
import armada from "./Images/labels/armada.jpg";
import confession from "./Images/labels/confession.jpg";
import interscope from "./Images/labels/interscope.png";
import neverSayDie from "./Images/labels/neverSayDie.jpg";
import owsla from "./Images/labels/owsla.jpg";
import polydor from "./Images/labels/polydor.png";
import { Label } from "./Label";

export const Labels: FC = () => (
  <div className="text-center">
    <div className="mb-5 px-5">
      <div className="row mb-5">
        <div className="col-md">
          <Label name="Armada" imageSource={armada} />
        </div>
        <div className="col-md">
          <Label name="Confession" imageSource={confession} />
        </div>
        <div className="col-md">
          <Label name="Interscope" imageSource={interscope} />
        </div>
        <div className="col-md">
          <Label name="Never Say Die" imageSource={neverSayDie} />
        </div>
        <div className="col-md">
          <Label name="OWSLA" imageSource={owsla} />
        </div>
        <div className="col-md">
          <Label name="Polydor" imageSource={polydor} />
        </div>
      </div>
    </div>
  </div>
);
