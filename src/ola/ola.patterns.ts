export const META_TITLE = /^Legislative Assembly of Ontario/gi;
export const META_HEADING = /^Votes and Proceedings/gi;
export const META_SESSION_DAY = /^No\. [0-9]{1,3}/gi;
export const META_SESSION_NO = /^[0-9]{1,2}[a-z]{2} Session [0-9]{1,2}[a-z]{2} Parliament/gi;
export const META_DATE = /^[a-z]+ [a-z]+ [0-9]{1,2}, [0-9]{4}/gi;

export const SECTION_TIME = /^[0-9]{1,2}:[0-9]{2} [AP]\.M\./gi;

export const ORDERS_TITLE = /^ORDERS OF THE DAY/gi;
export const QUESTION_TITLE = /^QUESTION PERIOD/gi;
export const DEFERRED_VOTES_TITLE = /^DEFERRED VOTES/gi;

export const POSITIVE_VOTE_SECTION = /^AYES \/ POUR - [0-9]{1,3}/gi;
export const POSITIVE_VOTE_CONT = /^AYES \/ POUR \- Continued/gi;

export const NEGATIVE_VOTE_SECTION = /^NAYS \/ CONTRE - [0-9]{1,3}/gi;
export const NEGATIVE_VOTE_CONT = /^NAYS \/ CONTRE \- Continued/gi;

export const BILL_PASSED = /^The Bill passed/gi;
export const REFERRED_TO_STANDING_RESOLUTION = /^Referred to the Standing Committee on General Government/gi;

// With Capture Groups
export const SECOND_READING_BILL = /^Second Reading of Bill ([0-9]{1,4}),/gi;

export const CARRIED_ON_DIVISION = /^Carried on the following division/gi;
export const LOST_ON_DIVISION = /^Lost on the following division/gi;
