import dayjs from "dayjs";

export function formatDate(number: number): string {
  return dayjs(number).format("MMM DD");
}
