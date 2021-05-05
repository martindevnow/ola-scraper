export const toCells = (row: HTMLElement) =>
  Array.from<HTMLElement>(row.querySelectorAll("td") as NodeListOf<any>);
