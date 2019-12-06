import React from "react";
import ReactDOM from "react-dom";
import * as AV from "leancloud-storage";
import "@/style/index.scss";
import App from "@/components/app";

export interface Config {
  el: string | Element;
  locale: "zh-CN" | "en";
  gravatar: string;
  gravatarParameters: string;
  pageSize: number;
  pathnameGenerator(): string;
  theme: "auto" | "light" | "dark";
  backend: "leancloud";
  backendConfig: LeancloudConfig | ValineConfig;
}

export interface ValineConfig {
  appId: string;
  appKey: string;
  commentKey: "objectId";
  commentAttr: string[];
  spa: boolean;
}

export interface LeancloudConfig extends ValineConfig {
  pageId: string | undefined;
}

const initAV = (options: { appId: string; appKey: string }) => {
  AV.init({
    appId: options.appId,
    appKey: options.appKey
  });
};

const BACKEND_CONFIGS: {
  leancloud: LeancloudConfig;
  valine: ValineConfig;
} = {
  leancloud: {
    appId: "",
    appKey: "",
    pageId: "",
    commentKey: "objectId",
    commentAttr: [
      "objectId",
      "content",
      "email",
      "emailMd5",
      "link",
      "nick",
      "pageId",
      "parentId",
      "rootId",
      "createdAt",
      "updatedAt"
    ],
    spa: false
  },
  valine: {
    appId: "",
    appKey: "",
    commentKey: "objectId",
    commentAttr: [
      "objectId",
      "comment",
      "insertedAt",
      "link",
      "mail",
      "nick",
      "pid",
      "rid",
      "ua",
      "url",
      "createdAt",
      "updatedAt"
    ],
    spa: false
  }
};

export const DEFAULT_CONFIG: Config = {
  el: "",
  locale: "zh-CN",
  gravatar: "https://www.gravatar.com/avatar/",
  gravatarParameters: "?d=mp&s=60",
  pageSize: 10,
  pathnameGenerator() {
    return window.location.pathname;
  },
  theme: "auto",
  backend: "leancloud",
  backendConfig: BACKEND_CONFIGS["leancloud"]
};

class Modis {
  config: Config;
  static initAV = initAV;

  constructor(options = DEFAULT_CONFIG) {
    if (!options.el) {
      throw "Please Provide el in config";
    }

    this.config = Object.assign({}, DEFAULT_CONFIG, options, {
      backendConfig: Object.assign(
        {},
        BACKEND_CONFIGS[options.backend || DEFAULT_CONFIG.backend],
        options.backendConfig
      )
    });

    Object.assign(this.config, {
      gravatar: new URL(this.config.gravatar).href,
      gravatarParameters: new URLSearchParams(
        this.config.gravatarParameters
      ).toString()
    });

    this.init();
  }

  async init() {
    if (this.config.backend === "leancloud") {
      if (!this.config.backendConfig.spa) {
        if (!this.config.backendConfig.appId) {
          throw "Please Provide appId in backendConfig";
        }
        if (!this.config.backendConfig.appKey) {
          throw "Please Provide appKey in backendConfig";
        }

        initAV({
          appId: this.config.backendConfig.appId,
          appKey: this.config.backendConfig.appKey
        });
      }

      let queryPage = async () => {
        let query = new AV.Query("Page");
        query.equalTo("pathname", this.config.pathnameGenerator());

        let pages = await query.find();
        if (pages.length === 0) {
          await addPage();
        } else {
          (this.config.backendConfig as LeancloudConfig).pageId = pages[0].id;
        }
      };

      let addPage = async () => {
        let PageObject = AV.Object.extend("Page");
        let pageObject = new PageObject();

        try {
          pageObject.set({
            pathname: this.config.pathnameGenerator()
          });

          let page = await pageObject.save();
          (this.config.backendConfig as LeancloudConfig).pageId = page.id;
        } catch (error) {
          if (error.code === 137) {
            await queryPage();
          }
        }
      };

      await queryPage();
    } else if (this.config.backend === "valine") {
      if (!this.config.backendConfig.spa) {
        if (!this.config.backendConfig.appId) {
          throw "Please Provide appId in backendConfig";
        }
        if (!this.config.backendConfig.appKey) {
          throw "Please Provide appKey in backendConfig";
        }

        initAV({
          appId: this.config.backendConfig.appId,
          appKey: this.config.backendConfig.appKey
        });
      }
    }

    let targetEl;

    if (typeof this.config.el === "string") {
      let element = document.querySelector(this.config.el);
      if (element) {
        targetEl = element;
      } else {
        throw new Error("Can't find Element");
      }
    } else {
      targetEl = this.config.el;
    }

    ReactDOM.render(
      React.createElement(App, { config: this.config }),
      targetEl
    );
  }
}

export default Modis;
