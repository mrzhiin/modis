import React from "react";
import { Config, DEFAULT_CONFIG } from "@/index";
import { InitialState, Reducer, Action, State } from "@/utils/Reducer";

interface Context {
  config: Config;
  state: State;
  dispath: React.Dispatch<Action>;
  i18n: {
    [props: string]: string;
  };
}

const ConfigContext = React.createContext<Context>({
  config: DEFAULT_CONFIG,
  state: InitialState,
  dispath: () => {},
  i18n: {}
});

export default ConfigContext;
