<template>
  <div class="modis-form">
    <div class="modis-mine">
      <div class="modis-email">
        <div class="modis-icon">
          <!-- <img v-if="emailHash" class="modis-avatar" :src="`https://www.gravatar.com/avatar/${emailHash}`" alt=""> -->
          <!-- <m-svg v-else name="email-outline"></m-svg> -->
          <m-svg name="email-outline"></m-svg>
        </div>
        <input v-model.lazy="email" class="modis-input" type="email" :placeholder="$_t('email')">
      </div>
      <label class="modis-nick">
        <div class="modis-icon">
          <m-svg name="account-circle-outline"></m-svg>
        </div>
        <input v-model.lazy="nick" class="modis-input" type="text" :placeholder="$_t('nickname')">
      </label>
      <div class="modis-link">
        <div class="modis-icon">
          <m-svg name="link"></m-svg>
        </div>
        <input v-model.lazy="link" class="modis-input" type="text" :placeholder="$_t('link')">
      </div>
    </div>
    <div v-if="recipient!==null" class="modis-recipient">
      <div class="modis-info">
        {{recipient.comment.nick}}
        <m-button flat icon color="error" size="small" @click="removeRecipient">
          <m-svg name="clear"></m-svg>
        </m-button>
      </div>
      <div v-html="recipient.comment.comment" class="modis-content"></div>
    </div>
    <div class="modis-reply">
      <div v-if="isPreview" v-html="html" class="modis-prep modis-input"></div>
      <textarea v-else v-model.lazy="comment" class="modis-input"></textarea>
    </div>
    <div class="modis-bar">
      <div class="modis-tip">
        <div class="modis-error" v-if="error">
          <template>
            <m-svg name="alert-circle" class="modis-icon"></m-svg>
            {{error}}
          </template>
        </div>
      </div>
      <div class="modis-buttons">
        <m-button
          icon
          flat
          class="modis-iconbtn"
          @click="isPreview=!isPreview"
          :active="isPreview"
          size="small"
        >
          <m-svg name="eye"></m-svg>
        </m-button>
        <m-button @click="post" :load="load">
          <m-svg name="send"></m-svg>
        </m-button>
      </div>
    </div>
  </div>
</template>

<script>
import DOMPurify from "dompurify";
import marked from "marked";

import CComment from "@/components/comment.vue";

export default {
  _sI18n: {
    en: {
      email: "E-Mail",
      nickname: "Nickname",
      link: "Link",
      error: {
        email: "Please enter vaild email",
        comment: "Please enter a comment",
        link: "Please enter vaild email"
      }
    },
    "zh-CN": {
      email: "邮箱",
      nickname: "昵称",
      link: "链接",
      error: {
        email: "请输入正确的邮箱",
        comment: "请输入评论内容",
        link: "请输入正确的链接"
      }
    }
  },
  data() {
    return {
      email: "",
      emailHash: "",
      emailError: false,
      nick: "",
      link: "",
      comment: "",
      commentError: false,
      html: "",
      isPreview: false,
      recipient: null,
      error: "",
      load: false
    };
  },
  watch: {
    isPreview: function(n) {
      if (n) {
        this.html = this.markToHtml();
      }
    }
  },
  methods: {
    checkEmail() {
      if (
        !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          this.email
        )
      ) {
        this.error = this.$_t("error.email");
      }
    },
    checkComment() {
      if (this.comment === "") {
        this.error = this.$_t("error.comment");
      }
    },
    checkLink() {
      if (this.link === "") return;

      if (
        !/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(
          this.link
        )
      ) {
        this.error = this.$_t("error.link");
      }
    },
    generateEmailHash() {
      this.emailHash = this.$_md5(this.email);
    },
    markToHtml() {
      return marked(this.comment, {
        sanitize: true,
        sanitizer: DOMPurify.sanitize
      });
    },
    removeRecipient() {
      this.recipient = null;
    },
    async post() {
      //check
      this.error = "";
      this.checkEmail();
      this.checkComment();
      this.checkLink();

      if (this.error) return;
      this.load = true;

      try {
        let recipient = this.recipient;
        let content = this.markToHtml();

        switch (this.$_config.backend) {
          case "valine":
            let commentObject = new this.$_CommentObject();
            let comment = {};

            let object = {
              mail: this.email,
              nick: this.nick || "Anonymous",
              link: this.link,
              comment: content,
              url: this.$_config.pathnameGenerator()
            };

            if (recipient !== null) {
              Object.assign(object, {
                pid: this.recipient.comment.objectId,
                rid:
                  this.recipient.comment.rid || this.recipient.comment.objectId
              });
            }

            commentObject.set(object);

            let resultObject = await commentObject.save();

            for (
              let index = 0;
              index < this.$_config.attributes.length;
              index++
            ) {
              const attribute = this.$_config.attributes[index];
              comment[attribute] = resultObject.get(attribute);
            }

            if (recipient !== null) {
              if (recipient.comment.children) {
                recipient.comment.children.push(comment);
              } else {
                this.$set(recipient.comment, "children", [comment]);
              }
            } else {
              this.$_EventBus.$emit("post", { comment });
            }

            break;
          case "leancloud":
            {
              let commentObject = new this.$_CommentObject();
              let comment = {};
              let object = {
                email: this.email,
                emailMd5: this.$_md5(this.email),
                nick: this.nick || "Anonymous",
                link: this.link,
                comment: content,
                pageId: this.$_config.pageId
              };
              if (recipient !== null) {
                Object.assign(object, {
                  parentId: this.recipient.comment.objectId,
                  rootId:
                    this.recipient.comment.rootId ||
                    this.recipient.comment.objectId
                });
              }
              commentObject.set(object);
              let resultObject = await commentObject.save();
              for (
                let index = 0;
                index < this.$_config.commentAttr.length;
                index++
              ) {
                const attribute = this.$_config.commentAttr[index];
                comment[attribute] = resultObject.get(attribute);
              }
              if (recipient !== null) {
                if (recipient.comment.children) {
                  recipient.comment.children.push(comment);
                } else {
                  this.$set(recipient.comment, "children", [comment]);
                }
              } else {
                this.$_EventBus.$emit("post", { comment });
              }
            }

            break;
          default:
            break;
        }

        this.resetCommentInput();
        this.saveUser();
      } catch (error) {
        this.error = error.message;
      }

      this.load = false;
    },
    preview() {
      this.isPreview = !this.isPreview;
    },
    listenReply(preload) {
      this.$_EventBus.$on("reply", preload => {
        this.recipient = preload.recipient;
      });
    },
    cleanRecipient() {
      this.recipient = null;
    },
    resetCommentInput() {
      this.comment = "";
    },
    saveUser() {
      localStorage.setItem(
        "modis",
        JSON.stringify({
          email: this.email,
          nick: this.nick,
          link: this.link
        })
      );
    },
    loadUser() {
      let data = localStorage.getItem("modis");

      if (data) {
        try {
          let user = JSON.parse(data);

          this.email = user.email;
          this.nick = user.nick;
          this.link = user.link;
        } catch (error) {}
      }
    }
  },
  created: function() {
    this.listenReply();
    this.loadUser();
  }
};
</script>
