import { getHtmlFromUrl } from "../utils/http.utils";

const BILL_RESOURCE =
  "https://www.ola.org/en/legislative-business/bills/parliament-42/session-1";
const TABLE_QUERY_SELECTOR = "table"; // Only 1 table on this page, thankfully
const ROOT_URL = "https://www.ola.org";

const toCells = (row: HTMLElement) =>
  Array.from<HTMLElement>(row.querySelectorAll("td") as NodeListOf<any>);

export const billScraper = async () => {
  const html = await getHtmlFromUrl(BILL_RESOURCE);
  const table = html.querySelector(TABLE_QUERY_SELECTOR);
  const rowsArr = Array.from(table.querySelectorAll("tr"));

  const billArr = rowsArr
    .map((row) => toCells(row))
    .filter((row) => row.length === 3)
    .map(([no, title, sponsor]) => ({
      no: no.innerHTML.trim(),
      link: ROOT_URL + title.querySelector("a").getAttribute("href"),
      title: title.querySelector("a").innerHTML.trim(),
      sponsor: sponsor.querySelector(".field").innerHTML.trim(),
    }));

  return { billArr };
};
