import React, { useMemo, useContext, useRef } from "react";
import Svg from "@/components/svg";
import Button from "@/components/button";
import * as DOMPurify from "dompurify";
import md5 from "blueimp-md5";
import Context from "@/utils/Context";

interface Props {
  comment: Comment;
  parentComment?: Comment;
  scrollToInput: () => void;
  parentCommentEl?: any;
  scrollToParentComment?: () => void;
}

export interface Comment {
  nick: string;
  content: string;
  emailMd5?: string;
  email: string;
  link: string;
  updatedAt: Date;
  createdAt: Date;
  children: Comment[];
  objectId: string;
  rootId: string | undefined;
  parentId: string | undefined;
}

const Comment = (props: Props) => {
  const { config, dispath } = useContext(Context);
  const {
    comment,
    parentComment,
    scrollToInput,
    scrollToParentComment
  } = props;

  const commentEl = useRef<HTMLDivElement>(null);

  const safeContent = useMemo(() => {
    return DOMPurify.sanitize(comment.content);
  }, [comment]);

  const avatar = useMemo(() => {
    const hash = comment.emailMd5 || md5(comment.email || "");

    return `${config.gravatar}${hash}?${config.gravatarParameters}`;
  }, [comment]);

  const avatarSrcset = useMemo(() => {
    const size = 60;

    return `${avatar} 1x,${avatar}&s=${size * 2} 2x,${avatar}&s=${size * 3} 3x`;
  }, [avatar]);

  const timeISO = useMemo(() => {
    return comment.updatedAt.toISOString();
  }, [comment]);

  const time = useMemo(() => {
    return comment.updatedAt.toLocaleString();
  }, [comment]);

  const link = useMemo(() => {
    return /^(http:\/\/|https:\/\/)/.test(comment.link)
      ? comment.link
      : comment.link === ""
      ? false
      : "http://" + comment.link;
  }, [comment]);

  const reply = () => {
    if (scrollToInput) {
      scrollToInput();
    }
    dispath({
      type: "reply",
      preload: comment
    });
  };

  const scrollToComment = () => {
    if (commentEl.current) {
      commentEl.current.scrollIntoView({
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="modis-comment-wrap">
      <div className="modis-comment" ref={commentEl}>
        <div className="modis-left">
          <img className="modis-avatar" src={avatar} srcSet={avatarSrcset} />
        </div>
        <div className="modis-right">
          <div className="modis-top">
            <div className="modis-info">
              <a
                className="modis-nick"
                rel="nofollow noopener"
                target="_blank"
                href={link || ""}
              >
                {comment.nick}
                {comment.link && <Svg name="link" />}
              </a>
              <time className="modis-date" dateTime={timeISO}>
                {time}
              </time>
              {parentComment && parentComment.nick && (
                <div
                  className="modis-to"
                  onClick={scrollToParentComment}
                >{`@${parentComment.nick}`}</div>
              )}
            </div>
            <Button icon flat className="modis-reply" onClick={reply}>
              <Svg name="reply" />
            </Button>
          </div>
          <div
            className="modis-content"
            dangerouslySetInnerHTML={{
              __html: safeContent
            }}
          ></div>
        </div>
      </div>
      {comment.children.map((commentChildren: Comment) => (
        <Comment
          key={commentChildren[config.backendConfig.commentKey]}
          comment={commentChildren}
          parentComment={comment}
          scrollToInput={scrollToInput}
          parentCommentEl={commentEl}
          scrollToParentComment={scrollToComment}
        ></Comment>
      ))}
    </div>
  );
};

export default Comment;
