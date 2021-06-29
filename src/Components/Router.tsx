import React, { FC } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Services } from "./Services";
import { Clients } from "./Clients";
import { Crew } from "./Crew";
import { Wrapper } from "./Wrapper";

export const Router: FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Wrapper>
          <Route path="/clients" exact render={() => <Clients />} />
          <Route path="/crew" exact render={() => <Crew />} />
          <Route path="/" exact render={() => <Services />} />
        </Wrapper>
      </Switch>
    </BrowserRouter>
  );
};
