export const getParliamentNoFromUid = (billUid: string) =>
  billUid.split("-")?.[0];
export const getSessionNoFromUid = (billUid: string) => billUid.split("-")?.[1];
export const getBillNoFromUid = (billUid: string) => billUid.split("-")?.[2];

// TODO: Replace with something better, or rely on DB to auto-generate on create
export const uuid = () =>
  Math.floor(Math.random() * 100000000000000000000).toString(36);
