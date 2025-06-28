import React from "react";
import { Typography } from "@mui/material";
import {
  formatToDisplayDate,
  isDateTimePast,
  isDateTimeNow,
} from "../../../core/utils/date";
import type { ITodoBadgeProps } from "../../types/todo.type";

const TodoBadge: React.FC<ITodoBadgeProps> = ({ date, isCompleted }) => {
  let displayDate: string;
  let textColor: string;

  const futureCompletedColor = "primary.main";
  const presentColor = "primary.success";
  const pastColor = "error.main";

  displayDate = formatToDisplayDate(date);
  textColor = futureCompletedColor;

  if (!isCompleted) {
    if (isDateTimeNow(date)) {
      displayDate = "Today";
      textColor = presentColor;
    } else if (isDateTimePast(date)) {
      displayDate = `Overdue - ${formatToDisplayDate(date)}`;
      textColor = pastColor;
    }
  }

  return (
    <Typography
      id={`TodoBadge-Typography-displayDate-${displayDate}`}
      sx={{
        color: textColor,
        margin: "auto",
        padding: "auto",
      }}
    >
      {displayDate}
    </Typography>
  );
};

export default TodoBadge;
