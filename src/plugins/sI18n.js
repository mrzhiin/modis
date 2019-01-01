function get(object, key) {
  let keys = key.split(".");
  let value = object;

  for (let index = 0; index < keys.length; index++) {
    let current = value[keys[index]];

    if (current) {
      value = current;
    } else {
      value = "";
      break;
    }
  }

  return value;
}

const install = function(Vue, options) {
  Vue.prototype.$_t = function(key) {
    let _sI18n = this.$options._sI18n;
    let current = _sI18n[options.locale];

    if (_sI18n && current) {
      return get(current, key);
    } else {
      return "";
    }
  };
};

export default { install };
