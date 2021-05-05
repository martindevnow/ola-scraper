import { psb } from "../ola/ola.helpers";
import { Bill, BillStatus } from "../ola/ola.types";
import { yyyymmdd } from "../utils/date.utils";
import { toCells } from "../utils/dom.utils";
import { getHtmlFromUrl } from "../utils/http.utils";

// const SAMPLE_BILL_RESOURCE =
//   "https://www.ola.org/en/legislative-business/bills/parliament-42/session-1/bill-247";
// const SAMPLE_BILL_VOTE_PROCEEDINGS_RESOURCES =
//   "https://www.ola.org/en/legislative-business/house-documents/parliament-42/session-1/2021-04-26/votes-proceedings";

const TABLE_QUERY_SELECTOR = "table"; // Only 1 table on this page, thankfully

export const billStatusesScraper = async ({
  uid,
  link,
}: Bill): Promise<BillStatus[]> => {
  const html = await getHtmlFromUrl(`${link}/status`);
  const table = html.querySelector(TABLE_QUERY_SELECTOR);
  const rowsArr = Array.from(table.querySelectorAll("tr"));
  const { parliamentNo, sessionNo } = psb(uid);

  const statuses: BillStatus[] = rowsArr
    .map((row) => toCells(row))
    .filter((row) => row.length === 4)
    .map(([dateEle, stageEle, activityEle]) => {
      const date = new Date(dateEle.innerHTML);
      return {
        billId: uid,
        date,
        link: `https://www.ola.org/en/legislative-business/house-documents/parliament-${parliamentNo}/session-${sessionNo}/${yyyymmdd(
          date
        )}/votes-proceedings`,
        stage: stageEle.innerHTML,
        activity: activityEle.innerHTML,
        readings: [],
      };
    });
  return statuses;
};

// Testing:
// billScraper({ link: SAMPLE_BILL_RESOURCE } as Bill);
// scrapeBillReadings({
//   link: SAMPLE_BILL_VOTE_PROCEEDINGS_RESOURCES,
//   billId: "42-1-269",
// } as BillStatus);
