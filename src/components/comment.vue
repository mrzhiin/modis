<template>
  <div class="modis-comment-wrap" ref="self">
    <div class="modis-comment">
      <div class="modis-left">
        <img class="modis-avatar" :src="avatar" alt>
      </div>
      <div class="modis-right">
        <div class="modis-top">
          <div class="modis-info">
            <div class="modis-nick">{{comment.nick||'Anonymous'}}</div>
            <div class="modis-date">{{commentDate}}</div>
          </div>
          <div class="modis-to" v-if="parentComment.nick">{{`@${parentComment.nick}`}}</div>
          <m-button icon flat class="modis-reply" @click="reply">
            <m-svg name="reply"></m-svg>
          </m-button>
        </div>
        <div v-html="safeContent" class="modis-content"></div>
      </div>
    </div>
    <template v-if="hasChildren">
      <c-comment
        v-for="(it) in comment.children"
        :key="it.id"
        :comment="it"
        :parentComment="comment"
      ></c-comment>
    </template>
  </div>
</template>

<script>
import DOMPurify from "dompurify";

export default {
  name: "CComment",
  props: {
    comment: {
      type: Object,
      default() {
        return {};
      }
    },
    parentComment: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  computed: {
    hasChildren() {
      return this.comment.children && this.comment.children.length;
    },
    safeContent() {
      return DOMPurify.sanitize(this.comment.comment);
    },
    avatar() {
      let hash = this.$_md5(this.comment.mail || "");
      return `https://www.gravatar.com/avatar/${hash}`;
    },
    parentNick() {
      return this.$parent;
    },
    commentDate() {
      return this.comment.updatedAt.toLocaleString(this.$i18n.locale);
    }
  },
  methods: {
    reply() {
      this.$_EventBus.$emit("reply", {
        recipient: this
      });
    }
  }
};
</script>