import { uuid } from "../ola/ola.helpers";
import { MPP } from "../ola/ola.types";
import { getHtmlFromUrl } from "../utils/http.utils";

const CURRENT_MPP_RESOURCE = "https://www.ola.org/en/members/current";
const TABLE_QUERY_SELECTOR = "table";
const ROOT_URL = "https://www.ola.org";

const mppUrlByParliament = (parliamentNo: string) => {
  return `https://www.ola.org/en/members/parliament-${parliamentNo}`;
};

const toCells = (row: HTMLElement) =>
  Array.from<HTMLElement>(row.querySelectorAll("td") as NodeListOf<any>);

export const mppScraper = async (parliamentNo?: string) => {
  const url = parliamentNo
    ? mppUrlByParliament(parliamentNo)
    : CURRENT_MPP_RESOURCE;
  const html = await getHtmlFromUrl(url);
  const table = html.querySelector(TABLE_QUERY_SELECTOR);
  const rowsArr = Array.from(table.querySelectorAll("tr"));

  console.log({ len: rowsArr.length });
  const mppArr: MPP[] = rowsArr
    .map((row) => toCells(row))
    .filter((row) => row.length >= 2) // 'current' url has 3, numbered url has 2
    .map(([nameEle, ridingEle, partyEle]) => {
      const name = nameEle.querySelector("a").innerHTML.trim();
      const [last, firstAndTitle] = name.split(",").map((str) => str.trim());
      const first = firstAndTitle.split(".").map((str) => str.trim());
      return {
        uid: uuid(),
        link: ROOT_URL + nameEle.querySelector("a").getAttribute("href"),
        riding: ridingEle.innerHTML.trim(),
        party: partyEle?.innerHTML?.trim() || "",
        parliamentNos: [parliamentNo],
        title: first.length === 2 ? first[0] : "",
        firstName: first.length === 2 ? first[1] : first[0],
        lastName: last,
      };
    });
  console.log({ parsedLen: mppArr.length });

  const parties = Array.from(new Set(mppArr.map(({ party }) => party)));

  return { mppArr, parties };
};
