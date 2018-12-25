<template>
  <div class="modis" ref="self">
    <c-form ref="input" :recipient="recipient" @cleanRecipient="cleanRecipient"></c-form>
    <div class="modis-comments">
      <c-comment v-for="(it) in comments" :key="it.id" :comment="it"></c-comment>
    </div>
    <div v-if="error" class="modis-app-error">
      <m-svg name="alert-circle" class="modis-icon"></m-svg>
      {{error}}
    </div>
    <div class="modis-app-footer">
      <m-button v-if="!isLast" @click="get" round :load="isLoad">
        <m-svg name="dots-horizontal"></m-svg>
      </m-button>
    </div>
  </div>
</template>

<script>
import CForm from "@/components/form.vue";
import CComment from "@/components/comment.vue";

const arrayToTree = function(array = []) {
  let customId = "objectId",
    customParentId = "pid",
    customChildren = "children";

  let map = {};
  let tree = [];

  for (const item of array) {
    item[customChildren] = [];
    map[item[customId]] = item;
  }

  for (const id of Object.keys(map)) {
    let item = map[id];
    let parentId = item[customParentId];

    if (
      typeof parentId !== "undefined" &&
      typeof map[parentId] !== "undefined"
    ) {
      map[parentId][customChildren].push(item);
    } else {
      tree.push(item);
    }
  }

  return tree;
};

export default {
  components: {
    CForm,
    CComment
  },
  data() {
    return {
      comments: [],
      isLoad: false,
      isLast: false,
      recipient: null,
      error: ""
    };
  },
  methods: {
    scrollToInput() {
      let input = this.$refs.input.$el;
      input.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    },
    async getComments() {
      let attributes = this.$_config.attributes;

      let queryRoot = new this.$_AV.Query("Comment");
      queryRoot.equalTo("url", location.pathname);
      queryRoot.doesNotExist("rid");
      queryRoot.descending("createdAt");
      queryRoot.limit("10");
      queryRoot.select(attributes);

      {
        let l = this.comments.length;
        if (l) {
          queryRoot.lessThan("createdAt", this.comments[l - 1].createdAt);
        }
      }

      let rootComments = await queryRoot.find();

      let queryTemp = [];

      for (
        let index = 0, length = rootComments.length;
        index < length;
        index++
      ) {
        const rootComment = rootComments[index];

        let query = new this.$_AV.Query("Comment");
        query.equalTo("rid", rootComment.id);
        query.select(attributes);

        queryTemp.push(query);
      }

      let queryChildren = this.$_AV.Query.or(...queryTemp);

      let childrenComments = await queryChildren.find();

      let comments = rootComments.concat(childrenComments).map(x => {
        let comment = {};

        for (let index = 0; index < attributes.length; index++) {
          const attribute = attributes[index];
          comment[attribute] = x.get(attribute);
        }

        return comment;
      });

      return comments;
    },
    async get() {
      if (this.isLast === true) return;

      this.isLoad = true;

      let comments = await this.getComments();
      let tree = arrayToTree(comments);

      this.comments.push(...tree);
      this.isLoad = false;

      if (tree.length < 10) this.isLast = true;
    },
    listenReply() {
      this.$_EventBus.$on("reply", () => {
        this.scrollToInput();
      });
    },
    listenPost() {
      this.$_EventBus.$on("post", preload => {
        this.comments.unshift(preload.comment);
      });
    },
    cleanRecipient() {
      this.recipient = null;
    }
  },
  created: function() {
    this.get();
    this.listenReply();
    this.listenPost();
  }
};
</script>