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
  appId: "",
  appKey: "",
  locale: "zh-CN",
  gravatar: "https://www.gravatar.com/avatar/",
  gravatarParameters: "?d=mp",
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
};

class Modis {
  constructor(options = {}) {
    // check
    if (!options.el) throw "Please el";
    if (!options.appId) throw "Please el";
    if (!options.appKey) throw "Please el";

    this.config = Object.assign({}, config, options);
    this.init();
  }

  init() {
    // VueConfig
    Vue.config.productionTip = false;

    // config
    Vue.prototype.$_config = this.config;

    // AV
    AV.init({
      appId: this.config.appId,
      appKey: this.config.appKey
    });
    Vue.prototype.$_AV = AV;
    Vue.prototype.$_CommentObject = AV.Object.extend("Comment");

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
