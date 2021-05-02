import { READING_BILL } from "../ola/ola.patterns";
import { Bill, BillStatus } from "../ola/ola.types";
import { yyyymmdd } from "../utils/date.utils";
import { getHtmlFromUrl } from "../utils/http.utils";

const BILLS_RESOURCE =
  "https://www.ola.org/en/legislative-business/bills/parliament-42/session-1";

const SAMPLE_BILL_RESOURCE =
  "https://www.ola.org/en/legislative-business/bills/parliament-42/session-1/bill-247";

const SAMPLE_BILL_VOTE_PROCEEDINGS_RESOURCES =
  "https://www.ola.org/en/legislative-business/house-documents/parliament-42/session-1/2021-04-26/votes-proceedings";

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
        billNo: bill.no,
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

export const scrapeVotesStatus = async (status: BillStatus) => {
  const baseUrl = status.link;
  const html = await getHtmlFromUrl(`${baseUrl}`);

  // There are 3 tables on this page
  // The last of which has the vote records
  const tables = Array.from(html.querySelectorAll(TABLE_QUERY_SELECTOR));
  const votesTable = tables[tables.length - 1];

  const rowsArr = Array.from(votesTable.querySelectorAll("tr"))
    .map((row) => toCells(row))
    .filter((row) => row.some((cell) => !!cell)); // non-empty rows

  const voteIndex = rowsArr.findIndex(([firstCell]) => {
    const reading = READING_BILL.exec(firstCell.innerHTML);
    return reading && reading[2] === status.billNo;
  });

  if (voteIndex === -1) {
    throw Error(`Didn't vote on that bill on that day`);
  }

  console.log(voteIndex);
  console.log(rowsArr[voteIndex][0].innerHTML);

  let endIndex = rowsArr.findIndex(([firstCell], i) => {
    const reading = READING_BILL.exec(firstCell.innerHTML);
    return i > voteIndex && reading && reading[2] !== status.billNo;
  });

  if (endIndex === -1) {
    endIndex = rowsArr.length - 1;
  }

  console.log(endIndex);
  console.log(rowsArr[endIndex][0].innerHTML);

  // check for decision
  // look for a resolution from the `ola.patterns` file.
  // also check for votes and add them for the mpps
};

// Testing:
// scrapeBill({ link: SAMPLE_BILL_RESOURCE } as Bill);
scrapeVotesStatus({
  link: SAMPLE_BILL_VOTE_PROCEEDINGS_RESOURCES,
  billNo: "269",
} as BillStatus);
