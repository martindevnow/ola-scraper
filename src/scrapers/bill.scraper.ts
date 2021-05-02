import {
  READING_BILL,
  RESOLUTION_PATTERNS,
  VOTING_PATTERNS,
} from "../ola/ola.patterns";
import {
  Bill,
  BillStatus,
  ReadingResults,
  ReadingResultsBuilder,
} from "../ola/ola.types";
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

export const scrapeBill = async (bill: Bill): Promise<BillStatus[]> => {
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
        readings: [],
      };
    });
  return statuses;
};

export const scrapeBillReadings = async (
  status: BillStatus
): Promise<ReadingResults[]> => {
  const baseUrl = status.link;
  const html = await getHtmlFromUrl(`${baseUrl}`);

  // There are 3 tables on this page
  // The last of which has the vote records
  const tables = Array.from(html.querySelectorAll(TABLE_QUERY_SELECTOR));
  const votesTable = tables[tables.length - 1];

  const rowsArr = Array.from(votesTable.querySelectorAll("tr"))
    .map((row) => toCells(row))
    .filter((row) => row.some((cell) => !!cell)); // non-empty rows

  const voteIndexes = rowsArr
    .map(([firstCell], index) => {
      const reading = READING_BILL.exec(firstCell.innerHTML);
      return reading && reading[2] === status.billNo ? index : null;
    })
    .filter((index) => index !== null);

  if (voteIndexes.length === 0) {
    throw Error(`Didn't vote on that bill on that day`);
  }

  return voteIndexes.map((voteIndex) => {
    let endIndex = rowsArr.findIndex(([firstCell], i) => {
      const reading = READING_BILL.exec(firstCell.innerHTML);
      return i > voteIndex && reading; // && reading[2] !== status.billNo;
    });

    if (endIndex === -1) {
      endIndex = rowsArr.length;
    }

    // check for decision
    // look for a resolution from the `ola.patterns` file.
    // also check for votes and add them for the mpps
    const statuses = getStatusesAndVotes(rowsArr.slice(voteIndex, endIndex));
    const { stage, ayes, nays, resolutions } = statuses;
    return { stage, ayes, nays, resolutions };
  });
};

const getStatusesAndVotes = (rows: HTMLElement[][]) => {
  const results = rows.reduce(
    (acc, row) => {
      const [firstCell] = row;

      const isReading = READING_BILL.test(firstCell.innerHTML);
      if (isReading) {
        acc.stage = firstCell.innerHTML;
        return acc;
      }

      // Check what pattern the first cell matches
      const isVoting = VOTING_PATTERNS.find(({ reg }) =>
        reg.test(firstCell.innerHTML)
      );
      if (isVoting) {
        acc.voteType = isVoting.type;
        return acc;
      }

      if (acc.voteType !== null) {
        // If row after voting, add the votes for each <p> in the cell & clear vote type
        const votes = row
          .map((cell) =>
            Array.from(cell.querySelectorAll("p")).map(
              (mppNameParagraph) => mppNameParagraph.innerHTML
            )
          )
          // Flatten
          .reduce((acc, curr) => [...acc, ...curr], []);
        acc[acc.voteType] = acc[acc.voteType].concat(votes);
        acc.voteType = null;
        return acc;
      }

      // if "resolution" pattern, add that as a field to return too
      const resolutionReg = RESOLUTION_PATTERNS.find((reg) =>
        reg.test(firstCell.innerHTML)
      );

      if (resolutionReg) {
        acc.resolutions.push(firstCell.querySelector("p").innerHTML);
        return acc;
      }

      console.log("no vote, not post-vote, no resolution..");
      console.log(firstCell.innerHTML);

      return acc;
    },
    {
      ayes: [],
      nays: [],
      resolutions: [],
      voteType: null, // 'ayes', 'nays'
    } as ReadingResultsBuilder
  );

  return results;
};

// Testing:
// scrapeBill({ link: SAMPLE_BILL_RESOURCE } as Bill);
scrapeBillReadings({
  link: SAMPLE_BILL_VOTE_PROCEEDINGS_RESOURCES,
  billNo: "269",
} as BillStatus);
