import Vue from "vue";
import AV from "leancloud-storage";
import md5 from "blueimp-md5";
import sI18n from "./plugins/sI18n";

import App from "@/App.vue";
import MButton from "@/components/button.vue";
import MSvg from "@/components/svg.vue";
import "@/style/index.scss";

const config = {
  el: null,
  backend: "valine",
  locale: "zh-CN",
  gravatar: "https://www.gravatar.com/avatar/",
  gravatarParameters: "?d=mp"
};

const backendConfig = {
  valine: {
    appId: "",
    appKey: "",
    attributes: [
      "objectId",
      "updatedAt",
      "createdAt",
      "nick",
      "link",
      "mail",
      "comment",
      "ua",
      "pid",
      "rid"
    ]
  },
  leancloud: {
    appId: "",
    appKey: "",
    commentAttr: [
      "objectId",
      "updatedAt",
      "createdAt",
      "nick",
      "link",
      "mail",
      "comment",
      "userAgent",
      "pageId",
      "parentId",
      "rootId"
    ]
  }
};

class Modis {
  constructor(options = {}) {
    // check
    if (!options.el) {
      throw "Please Provide el";
    }

    this.config = Object.assign(
      {},
      config,
      backendConfig[options.backend || config.backend],
      options
    );
    this.init();
  }

  async init() {
    // VueConfig
    Vue.config.productionTip = false;

    // config
    Vue.prototype.$_config = this.config;

    // backend
    switch (this.config.backend) {
      case "valine":
        // check
        if (!this.config.appId) {
          throw "Please Provide appId";
        }
        if (!this.config.appKey) {
          throw "Please Provide appKey";
        }

        AV.init({
          appId: this.config.appId,
          appKey: this.config.appKey
        });

        Vue.prototype.$_AV = AV;
        Vue.prototype.$_CommentObject = AV.Object.extend("Comment");

        break;
      case "leancloud":
        // check
        if (!this.config.appId) {
          throw "Please Provide appId";
        }
        if (!this.config.appKey) {
          throw "Please Provide appKey";
        }

        AV.init({
          appId: this.config.appId,
          appKey: this.config.appKey
        });

        Vue.prototype.$_AV = AV;
        Vue.prototype.$_CommentObject = AV.Object.extend("Comment");

        let pathname = window.location.pathname;

        let queryPage = async () => {
          var query = new AV.Query("Page");
          query.equalTo("pathname", pathname);

          let pages = await query.find();

          if (pages.length === 0) {
            await addPage();
          } else {
            this.config.pageId = pages[0].id;
          }
        };

        let addPage = async () => {
          let PageObject = AV.Object.extend("Page");
          let pageObject = new PageObject();

          try {
            pageObject.set({
              pathname: pathname
            });

            let page = await pageObject.save();
            this.config.pageId = page.id;
          } catch (error) {
            if (error.code === 137) {
              await queryPage();
            }
          }
        };

        await queryPage();

        break;
      default:
        break;
    }

    // MD5
    Vue.prototype.$_md5 = md5;

    // Eventbus
    let EventBus = new Vue();
    Vue.prototype.$_EventBus = EventBus;

    //sI18n
    Vue.use(sI18n, {
      locale: this.config.locale
    });

    // UI
    Vue.component("MButton", MButton);
    Vue.component("MSvg", MSvg);

    // mount
    new Vue({
      render: h => h(App)
    }).$mount(this.config.el);
  }
}

export default Modis;
