export interface MPP {
  name: string;
  riding: string;
  party: string;
}

export interface BillStatus {
  billNo: string;
  date: Date;
  stage: string; // First Reading | Second Reading
  activity: string; // Carries | Debate | Deferred Vote | Lost on division;
  link: string;
  readings: ReadingResults[];
}

export interface Bill {
  no: string;
  link: string;
  title: string;
  sponsor: string; // MPP;
  // currentStatus: string;
  // summary?: string;
  // statuses: Record<string, BillStatus>;
}

export interface Parliament {
  parliament: number; // 42
  session: number; // 1
  startDate: Date; // "2018-07-11"
  endDate: Date | null;
  bills: Record<string, Bill>;
}

export interface ReadingResults {
  stage: string; // First Reading, etc
  ayes: string[]; // array of names
  nays: string[]; // array of names
  resolutions: string[]; // array of "resolutions about the reading"
}

export interface ReadingResultsBuilder extends ReadingResults {
  voteType: "ayes" | "nays" | null; //
}
