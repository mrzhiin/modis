import marked from "marked";
import dompurify from "dompurify";

export const markdownToHtmlParser = (content: string) => {
  return marked(content);
};

export const htmlSanitizeParser = (content: string) => {
  return dompurify.sanitize(content);
};
