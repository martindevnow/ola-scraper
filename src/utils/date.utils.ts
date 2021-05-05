export const yyyymmdd = (date = new Date(Date.now())) =>
  date.toISOString().split("T")[0];
