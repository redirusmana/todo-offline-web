import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(isToday);
dayjs.extend(isSameOrAfter);

export const toDayjs = (
  dateInput: string | Date | dayjs.Dayjs
): dayjs.Dayjs => {
  return dayjs(dateInput);
};

export const formatToISODateTime = (date: dayjs.Dayjs): string => {
  return date.toISOString();
};

export const parseISODateTime = (isoString: string): dayjs.Dayjs => {
  return dayjs(isoString);
};

export const isDateTimeNow = (isoString: string): boolean => {
  const date = dayjs(isoString);
  return date.isSame(dayjs(), "day");
};

export const isDateTimePast = (isoString: string): boolean => {
  const date = dayjs(isoString);
  return date.isBefore(dayjs());
};

export const formatToDisplayDate = (isoString: string): string => {
  const date = dayjs(isoString);
  return date.format("DD/MM/YYYY");
};
