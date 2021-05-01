export const yyyymmdd = (date = new Date(Date.now())) => {
  return date.toISOString().split("T")[0];
};
