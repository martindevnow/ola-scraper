export const META_TITLE = /^Legislative Assembly of Ontario/gi;
export const META_HEADING = /^Votes and Proceedings/gi;
export const META_SESSION_DAY = /^No\. [0-9]{1,3}/gi;
export const META_SESSION_NO = /^[0-9]{1,2}[a-z]{2} Session [0-9]{1,2}[a-z]{2} Parliament/gi;
export const META_DATE = /^[a-z]+ [a-z]+ [0-9]{1,2}, [0-9]{4}/gi;

export const SECTION_TIME = /^[0-9]{1,2}:[0-9]{2} [AP]\.M\./gi;

export const ORDERS_TITLE = /^ORDERS OF THE DAY/gi;
export const QUESTION_TITLE = /^QUESTION PERIOD/gi;
export const DEFERRED_VOTES_TITLE = /^DEFERRED VOTES/gi;

// Voting
export const POSITIVE_VOTE_SECTION = /AYES \/ POUR - [0-9]{1,3}/gi;
export const POSITIVE_VOTE_CONT = /AYES \/ POUR \- Continued/gi;

export const NEGATIVE_VOTE_SECTION = /NAYS \/ CONTRE - [0-9]{1,3}/gi;
export const NEGATIVE_VOTE_CONT = /NAYS \/ CONTRE \- Continued/gi;

export const VOTING_PATTERNS = [
  {
    reg: POSITIVE_VOTE_SECTION,
    type: "ayes",
  },
  {
    reg: POSITIVE_VOTE_CONT,
    type: "ayes",
  },
  {
    reg: NEGATIVE_VOTE_SECTION,
    type: "nays",
  },
  {
    reg: NEGATIVE_VOTE_CONT,
    type: "nays",
  },
] as const;

// ** With Capture Groups
export const READING_BILL = /([a-z]+) Reading of Bill ([0-9]{1,4})/gi;

// Resolution
export const CARRIED_ON_DIVISION = /Carried on the following division/gi;
export const LOST_ON_DIVISION = /Lost on the following division/gi;
export const VOTE_DEFERRED = /Vote deferred/gi;
export const DEBATE_ADJOURNED = /the debate adjourned/gi;
export const BILL_PASSED = /The Bill passed/gi;
export const REFERRED_TO_STANDING_RESOLUTION = /Referred to the Standing Committee on General Government/gi;

export const RESOLUTION_PATTERNS = [
  CARRIED_ON_DIVISION,
  LOST_ON_DIVISION,
  VOTE_DEFERRED,
  DEBATE_ADJOURNED,
  BILL_PASSED,
  REFERRED_TO_STANDING_RESOLUTION,
];
