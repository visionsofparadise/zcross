import React, { FC } from "react";
import phoenixRising from "./Images/clients/phoenixRising.jpg";
import workingCode from "./Images/clients/workingCode.jpg";
import becomingUnshakeable from "./Images/clients/becomingUnshakeable.jpg";
import mmmn from "./Images/clients/mmmn.jpg";
import { Client } from "./Client";

export const Clients: FC = () => (
  <div className="text-center">
    <div className="mb-5 px-5">
      <div className="row mb-5">
        <div className="col-md">
          <Client
            name="Phoenix Rising"
            imageSource={phoenixRising}
            url="https://www.ashleydrummonds.com/"
          />
        </div>
        <div className="col-md">
          <Client
            name="Working Code"
            imageSource={workingCode}
            url="https://workingcode.dev/"
          />
        </div>
        <div className="col-md">
          <Client
            name="Becoming Unshakeable"
            imageSource={becomingUnshakeable}
            url="#"
          />
        </div>
        <div className="col-md">
          <Client
            name="Make More Money Now!"
            imageSource={mmmn}
            url="https://www.youtube.com/channel/UCIdF0ijr6HFy8geBXiEXh1w/videos"
          />
        </div>
      </div>
    </div>
  </div>
);
