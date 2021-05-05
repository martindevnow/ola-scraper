import { Bill } from "../ola/ola.types";
import { toCells } from "../utils/dom.utils";
import { getHtmlFromUrl } from "../utils/http.utils";

// const SAMPLE_BILLS_RESOURCE =
//   "https://www.ola.org/en/legislative-business/bills/parliament-42/session-1";

const TABLE_QUERY_SELECTOR = "table"; // Only 1 table on this page, thankfully
const ROOT_URL = "https://www.ola.org";

const billsUrlByParliamentSession = (
  parliamentNo: string,
  sessionNo: string
) => {
  return `https://www.ola.org/en/legislative-business/bills/parliament-${parliamentNo}/session-${sessionNo}`;
};

export const billsScraper = async (parliamentNo: string, sessionNo: string) => {
  const url = billsUrlByParliamentSession(parliamentNo, sessionNo);
  const html = await getHtmlFromUrl(url);
  const table = html.querySelector(TABLE_QUERY_SELECTOR);
  const rowsArr = Array.from(table.querySelectorAll("tr"))
    .map((row) => toCells(row))
    .filter((row) => row.some((cell) => !!cell));

  const billArr: Bill[] = rowsArr
    .filter((row) => row.length === 3)
    .map(([no, title, sponsor]) => ({
      uid: `${parliamentNo}-${sessionNo}-${no.innerHTML.trim().toLowerCase()}`,
      billNo: no.innerHTML.trim().toLowerCase(),
      link: ROOT_URL + title.querySelector("a").getAttribute("href"),
      title: title.querySelector("a").innerHTML.trim(),
      sponsor: sponsor.querySelector(".field").innerHTML.trim(),
      sessionId: `${parliamentNo}-${sessionNo}`,
    }));

  return { billArr };
};
