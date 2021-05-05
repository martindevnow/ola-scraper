import { parseFormattedName, uuid } from "../ola/ola.helpers";
import { MPP } from "../ola/ola.types";
import { toCells } from "../utils/dom.utils";
import { getHtmlFromUrl } from "../utils/http.utils";

const CURRENT_MPP_RESOURCE = "https://www.ola.org/en/members/current";
const TABLE_QUERY_SELECTOR = "table";
const ROOT_URL = "https://www.ola.org";

const mppUrlByParliament = (parliamentNo: string) => {
  return `https://www.ola.org/en/members/parliament-${parliamentNo}`;
};

export const mppsScraper = async (parliamentNo?: string) => {
  const url = parliamentNo
    ? mppUrlByParliament(parliamentNo)
    : CURRENT_MPP_RESOURCE;
  const html = await getHtmlFromUrl(url);
  const table = html.querySelector(TABLE_QUERY_SELECTOR);
  const rowsArr = Array.from(table.querySelectorAll("tr"));

  const mppArr: MPP[] = rowsArr
    .map((row) => toCells(row))
    .filter((row) => row.length >= 2) // 'current' url has 3, numbered url has 2
    .map(([nameEle]) => {
      const name = nameEle.querySelector("a").innerHTML.trim();
      const link = ROOT_URL + nameEle.querySelector("a").getAttribute("href");
      return {
        uid: uuid(),
        slug: link.split("/")[link.split("/").length - 1],
        link,
        ...parseFormattedName(name),
      };
    });

  return { mppArr };
};
