export interface Parliament {
  uid: string; // "42"
  parliamentNo: string; // "42"
  startDate: Date; // "2018-07-11"
  endDate: Date | null;
}

export interface ParliamentSession {
  uid: string; // "42-1" // Combination key of `parliament` and `session`
  startDate: Date; // "2018-07-11"
  endDate: Date | null;
  sessionNo: string; // "1"

  // bills: Record<string, Bill>;

  // (one) parliament has (many) sessions
  parliament: string; // "42"
}

export interface MPP {
  uid: string; // random-generated
  title?: string;
  firstName: string;
  lastName: string;
  link: string;

  // slug: string;
  riding?: string; // TODO: make this an array of objects (start, end, locationUid)
  party?: string; // TODO: make this an array of objects (start, end, partyUid)

  // - (many) MPPs belongs to (many) parliaments
  parliamentNos?: string[];
}

export interface Bill {
  uid: string; // "42-1-247"
  billNo: string; // "247"
  link: string;
  title: string;
  sponsor: string; // MPP;
  // currentStatus: string;
  // summary?: string;
  // statuses: Record<string, BillStatus>;

  // (one) session has (many) bills
  sessionId: string;
}

export interface BillStatus {
  date: Date;
  stage: string; // First Reading | Second Reading
  activity: string; // Carries | Debate | Deferred Vote | Lost on division;
  link: string;
  readings: ReadingResults[];

  // (one) bill has (many) statuses
  billId: string;
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
