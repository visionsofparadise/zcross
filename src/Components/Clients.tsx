import React, { FC } from "react";
import { Client } from "./Client";

export const Clients: FC = () => (
  <div className="text-center">
    <Client name="Phoenix Rising" url="https://www.ashleydrummonds.com/" />
    <Client name="Working Code" url="https://workingcode.dev/" />
    <Client name="Becoming Unshakeable" />
    <Client
      name="Make More Money Now!"
      url="https://www.youtube.com/channel/UCIdF0ijr6HFy8geBXiEXh1w/videos"
    />
  </div>
);
