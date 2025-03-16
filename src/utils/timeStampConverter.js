export const timeStampToHourMints = (timestamp) => {
  const date = new Date(
    timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
  );
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }); // Convert to hour:minute AM/PM format
};

export const timeStampToDateTime = (timestamp) => {
  const date = new Date(
    timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
  );
  return date
    .toLocaleString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(",", " |"); // Convert to date and time format in 12-hour format with | separator
};

export const timeStampToDate = (timestamp) => {
  let date;
  if (timestamp.nanoseconds) {
    date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  } else {
    date = new Date(timestamp);
  }
  return date
    .toLocaleString([], {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    })
    .replaceAll("/", "."); // Convert to date and time format in 12-hour format with | separator
};

export const timeStampToDate2 = (timestamp) => {
  let date;
  if (timestamp.nanoseconds) {
    date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  } else {
    date = new Date(timestamp);
  }
  return date.toLocaleString([], {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};
