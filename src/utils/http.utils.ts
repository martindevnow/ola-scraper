import got from "got";
import { JSDOM } from "jsdom";

export const getHtmlFromUrl = async (url: string) => {
  const response = await got(url);
  const { document } = new JSDOM(response.body).window;
  return document.querySelector("body");
};
