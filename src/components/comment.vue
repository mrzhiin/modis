<template>
  <div
    class="modis-comment-wrap"
    ref="self"
  >
    <div class="modis-comment">
      <div class="modis-left">
        <img
          class="modis-avatar"
          alt
          :src="avatar"
          :srcset="avatarSrcset"
        >
      </div>
      <div class="modis-right">
        <div class="modis-top">
          <div class="modis-info">
            <a
              class="modis-nick"
              :href="link||false"
              rel="nofollow noopener"
              target="_blank"
            >
              {{ comment.nick||'Anonymous' }}
              <m-svg
                v-if="comment.link"
                name="link"
              />
            </a>
            <div class="modis-date">
              {{ commentDate }}
            </div>
            <div
              class="modis-to"
              v-if="parentComment.nick"
            >
              {{ `@${parentComment.nick}` }}
            </div>
          </div>
          <m-button
            icon
            flat
            class="modis-reply"
            @click="reply"
          >
            <m-svg name="reply" />
          </m-button>
        </div>
        <div
          v-html="safeContent"
          class="modis-content"
        />
      </div>
    </div>
    <template v-if="hasChildren">
      <c-comment
        v-for="(it) in comment.children"
        :key="it.id"
        :comment="it"
        :parent-comment="comment"
      />
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
  computed: {
    hasChildren() {
      return this.comment.children && this.comment.children.length;
    },
    safeContent() {
      return DOMPurify.sanitize(this.comment.comment);
    },
    avatar() {
      let hash =
        this.comment.emailMd5 ||
        this.$_md5(this.comment.mail || this.comment.email || "");
      return `${this.$_config.gravatar}${hash}${
        this.$_config.gravatarParameters
      }`;
    },
    avatarSrcset() {
      let size = 48;
      return `${this.avatar} 1x,${this.avatar}&s=${size * 2}px 2x,${
        this.avatar
      }&s=${size * 3}px 3x`;
    },
    parentNick() {
      return this.$parent;
    },
    commentDate() {
      return this.comment.updatedAt.toLocaleString(this.$_config.locale);
    },
    link() {
      return /^(http:\/\/|https:\/\/)/.test(this.comment.link)
        ? this.comment.link
        : this.comment.link === ""
        ? false
        : "http://" + this.comment.link;
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