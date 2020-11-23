import { isPlainObject, isArray, every } from "lodash";

export default {
  methods: {
    flatten(element) {
      if (_.isArray(element)) {
        return element.map((el) => this.flatten(el));
      }
      if (_.isPlainObject(element)) {
        if ("id" in element) {
          let ret = {}
          ret["id"] = element.id;
          ret["exclude"] = "exclude" in element ? element["exclude"] : false;
          ret["wildcard"] = "wildcard" in element ? element["wildcard"] : false;
          return ret;
        }
        let ret = {};
        Object.entries(element).forEach(
          ([key, value]) => (ret[key] = this.flatten(value))
        );
        return ret;
      }
      return element;
    },
    deepCheck(filter) {
      if (_.isArray(filter)) {
        return _.every(filter.map((value) => this.deepCheck(value)));
      }
      if (_.isPlainObject(filter)) {
        return _.every(
          Object.values(filter).map((value) => this.deepCheck(value))
        );
      }
      return filter == 0 || filter == "" || filter == undefined;
    },
  },
};
