import { getBillNoFromUid } from "../ola/ola.helpers";
import {
  READING_BILL,
  RESOLUTION_PATTERNS,
  VOTING_PATTERNS,
} from "../ola/ola.patterns";
import {
  BillStatus,
  ReadingResults,
  ReadingResultsBuilder,
} from "../ola/ola.types";
import { toCells } from "../utils/dom.utils";
import { getHtmlFromUrl } from "../utils/http.utils";

const TABLE_QUERY_SELECTOR = "table"; // Only 1 table on this page, thankfully

export const readingsScraper = async (
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
      return reading && reading[2] === getBillNoFromUid(status.billId)
        ? index
        : null;
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

  return results as ReadingResults;
};
