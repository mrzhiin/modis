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
  gravatarParameters: "?d=mp&s=60",
  spa: false,
  pageSize: 10,
  pathnameGenerator: function() {
    return window.location.pathname;
  }
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
      "email",
      "emailMd5",
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
    let EventBus = new Vue();

    // VueConfig
    Vue.config.productionTip = false;

    // Global
    Vue.prototype.$_config = this.config;
    Vue.prototype.$_md5 = md5;
    Vue.prototype.$_EventBus = EventBus;

    // backend
    switch (this.config.backend) {
      case "valine":
        if (!this.config.spa) {
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
        }

        Vue.prototype.$_AV = AV;
        Vue.prototype.$_CommentObject = AV.Object.extend("Comment");

        break;
      case "leancloud":
        if (!this.config.spa) {
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
        }

        let queryPage = async () => {
          var query = new AV.Query("Page");
          query.equalTo("pathname", this.config.pathnameGenerator());

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
              pathname: this.config.pathnameGenerator()
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

        Vue.prototype.$_AV = AV;
        Vue.prototype.$_CommentObject = AV.Object.extend("Comment");

        break;
      default:
        break;
    }

    //sI18n
    Vue.use(sI18n, {
      locale: this.config.locale
    });

    // UI
    Vue.component("MButton", MButton);
    Vue.component("MSvg", MSvg);

    new Vue({
      render: h => h(App)
    }).$mount(this.config.el);
  }
}

Modis.initAV = function(
  options = {
    appId: "",
    appKey: ""
  }
) {
  AV.init({
    appId: options.appId,
    appKey: options.appKey
  });
};

export default Modis;
