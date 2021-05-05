import * as fs from "fs";
import * as path from "path";

import { billsScraper } from "../scrapers/bills.scraper";

const scrapeBills = async () => {
  const parliamentNo = "42";
  const sessionNo = "1";
  const { billArr } = await billsScraper(parliamentNo, sessionNo);

  const filename = path.join(
    path.resolve(__dirname),
    "..",
    "..",
    "mock",
    "bills.json"
  );
  fs.writeFileSync(filename, JSON.stringify(billArr, null, 2));
};

scrapeBills();
