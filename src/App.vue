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
      <m-button v-if="!isLast" @click="getComments" round :load="isLoad">
        <m-svg name="dots-horizontal"></m-svg>
      </m-button>
    </div>
  </div>
</template>

<script>
import CForm from "@/components/form.vue";
import CComment from "@/components/comment.vue";

const arrayToTree = function(array = [], option = {}) {
  let customId = option.customId,
    customParentId = option.customParentId,
    customChildren = option.customChildren;

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
    async getCommentsValine() {
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

      let rootComments;
      try {
        rootComments = await queryRoot.find();
      } catch (error) {
        if (error.code === 101) {
          throw "Please create Class and make security settings";
        }
        return;
      }

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

      let childrenComments;

      if (queryTemp.length === 0) {
        childrenComments = [];
      } else {
        let queryChildren = this.$_AV.Query.or(...queryTemp);
        childrenComments = await queryChildren.find();
      }

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
    async getCommentsLeancloud() {
      let commentAttr = this.$_config.commentAttr;

      let queryRoot = new this.$_AV.Query("Comment");
      queryRoot.equalTo("pageId", this.$_config.pageId);
      queryRoot.doesNotExist("parentId");
      queryRoot.descending("createdAt");
      queryRoot.limit("10");
      queryRoot.select(commentAttr);

      {
        let l = this.comments.length;
        if (l) {
          queryRoot.lessThan("createdAt", this.comments[l - 1].createdAt);
        }
      }

      let rootComments;
      try {
        rootComments = await queryRoot.find();
      } catch (error) {
        if (error.code === 101) {
          throw "Please create Class and make security settings";
        }
        return;
      }

      let queryTemp = [];

      for (
        let index = 0, length = rootComments.length;
        index < length;
        index++
      ) {
        const rootComment = rootComments[index];

        let query = new this.$_AV.Query("Comment");
        query.equalTo("rootId", rootComment.id);
        query.select(commentAttr);

        queryTemp.push(query);
      }

      let childrenComments;

      if (queryTemp.length === 0) {
        childrenComments = [];
      } else {
        let queryChildren = this.$_AV.Query.or(...queryTemp);
        childrenComments = await queryChildren.find();
      }

      let comments = rootComments.concat(childrenComments).map(x => {
        let comment = {};

        for (let index = 0; index < commentAttr.length; index++) {
          const attribute = commentAttr[index];
          comment[attribute] = x.get(attribute);
        }

        return comment;
      });

      return comments;
    },
    async getComments() {
      if (this.isLast === true) return;

      this.isLoad = true;

      let comments, tree;

      switch (this.$_config.backend) {
        case "valine":
          comments = await this.getCommentsValine();
          tree = arrayToTree(comments, {
            customId: "objectId",
            customParentId: "pid",
            customChildren: "children"
          });
          break;
        case "leancloud":
          comments = await this.getCommentsLeancloud();
          tree = arrayToTree(comments, {
            customId: "objectId",
            customParentId: "parentId",
            customChildren: "children"
          });
          break;
        default:
          break;
      }

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
    this.getComments();
    this.listenReply();
    this.listenPost();
  }
};
</script>