import * as fs from "fs";
import * as path from "path";

import { mppsScraper } from "../scrapers/mpps.scraper";

const scrapeMpps = async () => {
  const parliamentNo = "42";
  const { mppArr } = await mppsScraper(parliamentNo);

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
