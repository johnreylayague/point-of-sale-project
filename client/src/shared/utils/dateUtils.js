export function formatDate(utcTimestamp) {
  const originalDate = new Date(utcTimestamp);
  const formattedDate = originalDate.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  return formattedDate;
}

export function formateDateNumeric(utcTimestamp) {
  const formattedDate = utcTimestamp.substring(0, 10);

  return formattedDate;
}

export function formatDateISO(utcTimestamp) {
  const date = new Date(utcTimestamp);
  const formattedDate = date.toISOString();

  return formattedDate;
}
