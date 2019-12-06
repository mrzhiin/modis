import React, { useState, useEffect, useReducer, useRef, useMemo } from "react";
import * as AV from "leancloud-storage";
import Button from "@/components/button";
import Svg from "@/components/svg";
import Form from "@/components/form";
import Comment, { Comment as CommentInterface } from "@/components/comment";
import Context from "@/utils/Context";
import { Reducer, InitialState } from "@/utils/Reducer";
import I18n from "@/i18n";

import { Config, LeancloudConfig, ValineConfig } from "@/index";

import arrayToTree from "@/utils/ArrayToTree";

interface Props {
  config: Config;
}

const App = (props: Props) => {
  const { config } = props;
  const [state, dispath] = useReducer(Reducer, InitialState);

  const { comments } = state;
  const [isLoad, setIsLoad] = useState(false);
  const [isLast, setIsLast] = useState(false);

  const inputEl = useRef<HTMLDivElement>(null);

  const i18n = useMemo(() => {
    return I18n[config.locale];
  }, [config]);

  useEffect(() => {
    getComments();
  }, []);

  const themeClass = useMemo(() => {
    return `modis modis--${config.theme}`;
  }, [config]);

  const scrollToInput = () => {
    if (inputEl && inputEl.current) {
      inputEl.current.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  };

  const getCommentsLeancloud = async () => {
    let commentAttr = config.backendConfig.commentAttr;
    let queryRoot = new AV.Query("Comment");
    let rootComments;
    let queryTemp = [];
    let childrenComments: AV.Queriable[] = [];

    {
      let l = comments.length;
      if (l) {
        queryRoot.lessThan("createdAt", comments[l - 1].createdAt);
      }
      queryRoot.equalTo(
        "pageId",
        (config.backendConfig as LeancloudConfig).pageId
      );
      queryRoot.doesNotExist("parentId");
      queryRoot.descending("createdAt");
      queryRoot.limit(config.pageSize);
      queryRoot.select(commentAttr);
    }

    try {
      rootComments = await queryRoot.find();
    } catch (error) {
      throw error.code === 101
        ? "Please create Class and make security settings"
        : error;
    }

    for (let index = 0, length = rootComments.length; index < length; index++) {
      const rootComment = rootComments[index];
      let query = new AV.Query("Comment");
      query.equalTo("rootId", rootComment.id);
      query.select(commentAttr);
      queryTemp.push(query);
    }

    if (queryTemp.length === 0) {
      childrenComments = [];
    } else {
      let queryChildren = AV.Query.or(...queryTemp);
      childrenComments = await queryChildren.find();
    }

    {
      let comments = rootComments.concat(childrenComments).map(x => {
        let comment: CommentInterface = {
          nick: x.get("nick") || "Anonymous",
          content: x.get("content"),
          emailMd5: x.get("emailMd5"),
          email: x.get("email"),
          link: x.get("link"),
          updatedAt: x.get("updatedAt"),
          createdAt: x.get("createdAt"),
          children: [],
          objectId: x.get("objectId"),
          rootId: x.get("rootId"),
          parentId: x.get("parentId")
        };

        return comment;
      });

      return comments;
    }
  };

  const getCommentsValine = async () => {
    let commentAttr = (config.backendConfig as ValineConfig).commentAttr;
    let queryRoot = new AV.Query("Comment");
    let rootComments;
    let queryTemp = [];
    let childrenComments: AV.Queriable[] = [];

    {
      let l = comments.length;
      if (l) {
        queryRoot.lessThan("createdAt", comments[l - 1].createdAt);
      }

      queryRoot.equalTo("url", config.pathnameGenerator());
      queryRoot.doesNotExist("rid");
      queryRoot.descending("createdAt");
      queryRoot.limit(config.pageSize);
      queryRoot.select(commentAttr);
    }

    try {
      rootComments = await queryRoot.find();
    } catch (error) {
      throw error.code === 101
        ? "Please create Class and make security settings"
        : error;
    }

    for (let index = 0, length = rootComments.length; index < length; index++) {
      const rootComment = rootComments[index];
      let query = new AV.Query("Comment");
      query.equalTo("rid", rootComment.id);
      query.select(commentAttr);
      queryTemp.push(query);
    }

    if (queryTemp.length === 0) {
      childrenComments = [];
    } else {
      let queryChildren = AV.Query.or(...queryTemp);
      childrenComments = await queryChildren.find();
    }

    {
      let comments = rootComments.concat(childrenComments).map(x => {
        let comment: CommentInterface = {
          nick: x.get("nick"),
          content: x.get("comment"),
          emailMd5: "",
          email: x.get("mail"),
          link: x.get("link"),
          updatedAt: x.get("updatedAt"),
          createdAt: x.get("createdAt"),
          children: [],
          objectId: x.get("objectId"),
          rootId: x.get("rid"),
          parentId: x.get("pid")
        };

        return comment;
      });

      return comments;
    }
  };

  const getComments = async () => {
    if (isLast === true) {
      return;
    }

    setIsLoad(true);

    let comments: CommentInterface[];

    if (config.backend === "leancloud") {
      comments = await getCommentsLeancloud();
    } else {
      comments = await getCommentsValine();
    }

    let tree = arrayToTree(comments, {
      customId: "objectId",
      customParentId: "parentId",
      customChildren: "children"
    });

    dispath({
      type: "getComments",
      preload: tree
    });
    setIsLoad(false);
    setIsLast(tree.length < config.pageSize ? true : false);
  };

  return (
    <div className={themeClass}>
      <Context.Provider value={{ config, state, dispath, i18n }}>
        <Form inputEl={inputEl}></Form>
        <div className="modis-comments">
          {comments.map((comment: CommentInterface) => (
            <Comment
              key={comment[config.backendConfig.commentKey]}
              comment={comment}
              scrollToInput={scrollToInput}
            ></Comment>
          ))}
        </div>
        <div className="modis-app-footer">
          {!isLast && (
            <Button round load={isLoad} onClick={getComments}>
              <Svg name="dots-horizontal" />
            </Button>
          )}
        </div>
      </Context.Provider>
    </div>
  );
};

export default App;
