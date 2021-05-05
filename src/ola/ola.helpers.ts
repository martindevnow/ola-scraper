export const psb = (billUid: string) => {
  const [parliamentNo, sessionNo, billNo] = billUid.split("-");
  return { parliamentNo, sessionNo, billNo };
};

export const getParliamentNoFromUid = (billUid: string) =>
  psb(billUid).parliamentNo;

export const getSessionNoFromUid = (billUid: string) => psb(billUid).sessionNo;

export const getBillNoFromUid = (billUid: string) => psb(billUid).billNo;

// TODO: Replace with something better, or rely on DB to auto-generate on create
export const uuid = () =>
  Math.floor(Math.random() * 100000000000000000000).toString(36);

interface NameObj {
  title: string;
  firstName: string;
  lastName: string;
}

export const parseFormattedName = (name: string): NameObj => {
  const [last, firstAndTitle] = name.split(",").map((str) => str.trim());
  const first = firstAndTitle
    .split(".")
    .map((str) => str.trim())
    .filter(Boolean);
  const nameObj = {
    title: first.length === 2 && first[1] !== "" ? first[0] : "",
    firstName: first.length === 2 ? first[1] : first[0],
    lastName: last,
  };
  return nameObj;
};
