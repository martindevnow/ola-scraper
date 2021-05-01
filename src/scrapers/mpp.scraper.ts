import { getHtmlFromUrl } from "../utils/http.utils";

const MPP_RESOURCE = "https://www.ola.org/en/members/current";
const TABLE_QUERY_SELECTOR = "#block-views-block-member-lists-block-2";
const ROOT_URL = "https://www.ola.org";

const toCells = (row: HTMLElement) =>
  Array.from<HTMLElement>(row.querySelectorAll("td") as NodeListOf<any>);

export const mppScraper = async () => {
  const html = await getHtmlFromUrl(MPP_RESOURCE);
  const table = html.querySelector(TABLE_QUERY_SELECTOR);
  const rowsArr = Array.from(table.querySelectorAll("tr"));

  const mppArr = rowsArr
    .map((row) => toCells(row))
    .filter((row) => row.length === 3)
    .map(([name, riding, party]) => ({
      name: name.querySelector("a").innerHTML.trim(),
      link: ROOT_URL + name.querySelector("a").getAttribute("href"),
      riding: riding.innerHTML.trim(),
      party: party.innerHTML.trim(),
    }));

  const parties = Array.from(new Set(mppArr.map(({ party }) => party)));

  return { mppArr, parties };
};
