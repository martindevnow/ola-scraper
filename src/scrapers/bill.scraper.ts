import { Bill, BillStatus } from "../ola/ola.types";
import { yyyymmdd } from "../utils/date.utils";
import { getHtmlFromUrl } from "../utils/http.utils";

const BILLS_RESOURCE =
  "https://www.ola.org/en/legislative-business/bills/parliament-42/session-1";

const SAMPLE_BILL_RESOURCE =
  "https://www.ola.org/en/legislative-business/bills/parliament-42/session-1/bill-247";

const TABLE_QUERY_SELECTOR = "table"; // Only 1 table on this page, thankfully
const ROOT_URL = "https://www.ola.org";

const toCells = (row: HTMLElement) =>
  Array.from<HTMLElement>(row.querySelectorAll("td") as NodeListOf<any>);

export const scrapeAllBills = async () => {
  const html = await getHtmlFromUrl(BILLS_RESOURCE);
  const table = html.querySelector(TABLE_QUERY_SELECTOR);
  const rowsArr = Array.from(table.querySelectorAll("tr"));

  const billArr: Bill[] = rowsArr
    .map((row) => toCells(row))
    .filter((row) => row.length === 3)
    .map(([no, title, sponsor]) => ({
      no: no.innerHTML.trim().toLowerCase(),
      link: ROOT_URL + title.querySelector("a").getAttribute("href"),
      title: title.querySelector("a").innerHTML.trim(),
      sponsor: sponsor.querySelector(".field").innerHTML.trim(),
    }));

  return { billArr };
};

export const scrapeBill = async (bill: Bill) => {
  const baseUrl = bill.link;
  const html = await getHtmlFromUrl(`${baseUrl}/status`);
  const table = html.querySelector(TABLE_QUERY_SELECTOR);
  const rowsArr = Array.from(table.querySelectorAll("tr"));

  const statuses: BillStatus[] = rowsArr
    .map((row) => toCells(row))
    .filter((row) => row.length === 4)
    .map(([dateEle, stageEle, activityEle]) => {
      const date = new Date(dateEle.innerHTML);
      return {
        date,
        link: `https://www.ola.org/en/legislative-business/house-documents/parliament-42/session-1/${yyyymmdd(
          date
        )}/votes-proceedings`,
        stage: stageEle.innerHTML,
        activity: activityEle.innerHTML,
      };
    });
  return statuses;
};
