import * as fs from "fs";
import * as path from "path";

import { mppScraper } from "../scrapers/mpp.scraper";

const scrapeMpps = async () => {
  // leave no args to get current list
  // const parliamentNo = "42";
  const { mppArr } = await mppScraper();

  const filename = path.join(
    path.resolve(__dirname),
    "..",
    "..",
    "mock",
    "mpps.json"
  );
  console.log({ filename });
  fs.writeFileSync(filename, JSON.stringify(mppArr, null, 2));
};

scrapeMpps();
