// Summaries of ride rows: [{ date, city, rides }, ...] with rides as strings or numbers.

export function totalRides(rows) {
  return rows.reduce((sum, row) => sum + Number(row.rides), 0);
}

// Total rides per city, sorted by city name.
export function ridesByCity(rows) {
  const totals = new Map();
  for (const row of rows) {
    totals.set(row.city, (totals.get(row.city) ?? 0) + Number(row.rides));
  }
  return [...totals.entries()]
    .map(([city, rides]) => ({ city, rides }))
    .sort((a, b) => a.city.localeCompare(b.city));
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Monthly totals across all cities: [{ month: "2026-07", label: "July 2026", rides, share }].
// Month comes from the date string ("YYYY-MM-DD"), never a Date, so labels can't shift by timezone.
export function ridesByMonth(rows) {
  const totals = new Map();
  for (const row of rows) {
    const month = row.date.slice(0, 7);
    totals.set(month, (totals.get(month) ?? 0) + Number(row.rides));
  }
  const max = Math.max(...totals.values());
  return [...totals.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, rides]) => {
      const [year, monthNumber] = month.split("-");
      return {
        month,
        label: `${MONTH_NAMES[Number(monthNumber) - 1]} ${year}`,
        rides,
        share: max === 0 ? 0 : rides / max,
      };
    });
}
