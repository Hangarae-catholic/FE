export const formatDateTimeToISO = (date: Date | null, time: string): string => {
  const formattedDate = date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` : null;

  return new Date(`${formattedDate}T${time}:00`).toISOString();
};
