interface Config {
  el: string | Element;
  locale: "zh-CN" | "en";
  gravatar: string;
  gravatarParameters: string;
  spa: boolean;
  pageSize: number;
  pathnameGenerator(): string;
  theme: "auto" | "light" | "dark";
  backend: "leancloud";
  backendConfig: LeancloudConfig | ValineConfig;
}

interface ValineConfig {
  appId: string;
  appKey: string;
  commentKey: "objectId";
  commentAttr: string[];
}

interface LeancloudConfig extends ValineConfig {
  pageId: string | undefined;
}

export default class Modis {
  config: Config;
  static initAV(options: { appId: string; appKey: string });
  constructor(options: Config);
  init(): Promise<void>;
}
