import React, { useState, useEffect, useContext } from "react";
import * as AV from "leancloud-storage";
import Svg from "@/components/svg";
import Button from "@/components/button";
import md5 from "blueimp-md5";
import Context from "@/utils/Context";
import { Comment } from "@/components/comment";
import { LeancloudConfig } from "@/index";
import { markdownToHtmlParser } from "@/utils/parser";

const LeancloudCommentObject = AV.Object.extend("Comment");
const ValineCommentObject = AV.Object.extend("Comment");

interface Props {
  inputEl: React.RefObject<HTMLDivElement>;
}

const Form = (props: Props) => {
  const { inputEl } = props;
  const [email, setEmail] = useState("");
  const [nick, setNick] = useState("");
  const [link, setLink] = useState("");
  const [content, setContent] = useState("");
  const [html, setHtml] = useState("");
  const [isPreview, setIsPreviewt] = useState(false);
  const [error, setError] = useState("");
  const [load, setLoad] = useState(false);
  const [timer, setTimer] = useState(0);

  const { config, state, dispath, i18n } = useContext(Context);

  useEffect(() => {
    loadUser();

    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (isPreview) {
      setHtml(markToHtml());
    }
  }, [isPreview]);

  useEffect(() => {
    if (error) {
      clearTimeout(timer);

      setTimer(
        window.setTimeout(() => {
          setError("");
        }, 3000)
      );
    }
  }, [error]);

  const checkEmail = () => {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!re.test(email)) {
      setError(i18n["error.email"]);
      return false;
    }

    return true;
  };
  const checkContent = () => {
    if (content === "") {
      setError(i18n["error.content"]);
      return false;
    }

    return true;
  };
  const checkLink = () => {
    if (link === "") return true;

    if (
      !/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(
        link
      )
    ) {
      setError(i18n["error.link"]);
      return false;
    }

    return true;
  };
  const markToHtml = () => {
    return markdownToHtmlParser(content);
  };
  const removeRecipient = () => {
    dispath({
      type: "clearReplt"
    });
  };
  const onSend = async () => {
    if (!(checkEmail() && checkContent() && checkLink())) {
      return;
    }

    setLoad(true);

    try {
      let content = markToHtml();
      let comment: Comment;

      if (config.backend === "leancloud") {
        let commentObject = new LeancloudCommentObject();
        let object = {
          email: email,
          emailMd5: md5(email),
          nick: nick,
          link: link,
          content: content,
          pageId: (config.backendConfig as LeancloudConfig).pageId
        };

        if (state.recipient) {
          Object.assign(object, {
            parentId: state.recipient.objectId,
            rootId: state.recipient.rootId || state.recipient.objectId
          });
        }

        commentObject.set(object);

        let resultObject = await commentObject.save();

        comment = {
          nick: resultObject.get("nick"),
          content: resultObject.get("content"),
          emailMd5: resultObject.get("emailMd5"),
          email: resultObject.get("email"),
          link: resultObject.get("link"),
          updatedAt: resultObject.get("updatedAt"),
          createdAt: resultObject.get("createdAt"),
          children: [],
          objectId: resultObject.get("objectId"),
          rootId: resultObject.get("rootId"),
          parentId: resultObject.get("parentId")
        };
      } else {
        let commentObject = new ValineCommentObject();

        let object = {
          mail: email,
          nick: nick || "Anonymous",
          link: link,
          comment: content,
          url: config.pathnameGenerator()
        };

        if (state.recipient) {
          Object.assign(object, {
            pid: state.recipient.objectId,
            rid: state.recipient.rootId || state.recipient.objectId
          });
        }

        commentObject.set(object);

        let resultObject = await commentObject.save();

        comment = {
          nick: resultObject.get("nick"),
          content: resultObject.get("comment"),
          emailMd5: undefined,
          email: resultObject.get("mail"),
          link: resultObject.get("link"),
          updatedAt: resultObject.get("updatedAt"),
          createdAt: resultObject.get("createdAt"),
          children: [],
          objectId: resultObject.get("objectId"),
          rootId: resultObject.get("rid"),
          parentId: resultObject.get("pid")
        };
      }

      if (state.recipient) {
        state.recipient.children.push(comment);

        dispath({
          type: "updateComments"
        });
      } else {
        dispath({
          type: "addRootComment",
          preload: comment
        });
      }

      resetCommentInput();
      setIsPreviewt(false);
      saveUser();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoad(false);
    }
  };
  const togglePreview = () => {
    setIsPreviewt(!isPreview);
  };
  const resetCommentInput = () => {
    setContent("");
    setHtml("");
  };
  const saveUser = () => {
    localStorage.setItem(
      "modis",
      JSON.stringify({
        email: email,
        nick: nick,
        link: link
      })
    );
  };
  const loadUser = () => {
    let data = localStorage.getItem("modis");

    if (data) {
      let user = JSON.parse(data);

      setEmail(user.email);
      setNick(user.nick);
      setLink(user.link);
    }
  };

  return (
    <div className="modis-form" ref={inputEl}>
      <div className="modis-mine">
        <div className="modis-email">
          <div className="modis-icon">
            <Svg name="email-outline" />
          </div>
          <input
            className="modis-input"
            type="email"
            value={email}
            placeholder={i18n.email}
            onChange={e => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <label className="modis-nick">
          <div className="modis-icon">
            <Svg name="account-circle-outline" />
          </div>
          <input
            className="modis-input"
            type="text"
            value={nick}
            placeholder={i18n.nick}
            onChange={e => {
              setNick(e.target.value);
            }}
          />
        </label>
        <div className="modis-link">
          <div className="modis-icon">
            <Svg name="link" />
          </div>
          <input
            className="modis-input"
            type="text"
            value={link}
            placeholder={i18n.link}
            onChange={e => {
              setLink(e.target.value);
            }}
          />
        </div>
      </div>
      {state.recipient && (
        <div className="modis-recipient">
          <div className="modis-info">
            <span>{state.recipient.nick}</span>
            <Button
              flat
              icon
              color="error"
              size="small"
              onClick={removeRecipient}
            >
              <Svg name="clear" />
            </Button>
          </div>
          <div
            dangerouslySetInnerHTML={{
              __html: state.recipient.content
            }}
            className="modis-content"
          />
        </div>
      )}
      <div className="modis-reply">
        {isPreview ? (
          <div
            className="modis-prep modis-input"
            dangerouslySetInnerHTML={{
              __html: html
            }}
          />
        ) : (
          <textarea
            className="modis-input"
            value={content}
            onChange={e => {
              setContent(e.target.value);
            }}
          />
        )}
      </div>
      <div className="modis-bar">
        <Button
          icon
          flat
          size="small"
          className="modis-iconbtn"
          active={isPreview}
          onClick={togglePreview}
        >
          <Svg name="eye" />
        </Button>
        <Button load={load} onClick={onSend}>
          <Svg name="send" />
        </Button>
      </div>
      {error && (
        <div className="modis-error">
          <Svg name="alert-circle" />
          {error}
        </div>
      )}
    </div>
  );
};

export default Form;
