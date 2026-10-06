import { test } from "node:test";
import assert from "node:assert/strict";
import { totalRides, ridesByCity, ridesByMonth } from "../site/src/stats.js";

const rows = [
  { date: "2026-07-01", city: "Miami", rides: "10" },
  { date: "2026-07-01", city: "Boston", rides: "20" },
  { date: "2026-07-02", city: "Boston", rides: 30 },
];

test("totalRides sums the rides column", () => {
  assert.equal(totalRides(rows), 60);
});

test("ridesByCity totals per city in alphabetical order", () => {
  assert.deepEqual(ridesByCity(rows), [
    { city: "Boston", rides: 50 },
    { city: "Miami", rides: 10 },
  ]);
});

test("ridesByMonth sums ride counts across cities into one monthly total", () => {
  assert.deepEqual(
    ridesByMonth([
      { date: "2026-07-01", city: "Boston", rides: "20" },
      { date: "2026-07-01", city: "Miami", rides: "10" },
      { date: "2026-07-15", city: "Denver", rides: 5 },
    ]),
    [{ month: "2026-07", label: "July 2026", rides: 35, share: 1 }],
  );
});

test("ridesByMonth lists months oldest to newest with each month's share of the busiest", () => {
  assert.deepEqual(
    ridesByMonth([
      { date: "2026-09-03", city: "Boston", rides: "25" },
      { date: "2026-07-10", city: "Boston", rides: "50" },
      { date: "2026-08-20", city: "Miami", rides: "100" },
    ]),
    [
      { month: "2026-07", label: "July 2026", rides: 50, share: 0.5 },
      { month: "2026-08", label: "August 2026", rides: 100, share: 1 },
      { month: "2026-09", label: "September 2026", rides: 25, share: 0.25 },
    ],
  );
});

test("ridesByMonth gives every month a share of 0 when all monthly totals are zero", () => {
  assert.deepEqual(
    ridesByMonth([
      { date: "2026-07-01", city: "Boston", rides: "0" },
      { date: "2026-08-01", city: "Boston", rides: "0" },
    ]),
    [
      { month: "2026-07", label: "July 2026", rides: 0, share: 0 },
      { month: "2026-08", label: "August 2026", rides: 0, share: 0 },
    ],
  );
});

test("ridesByMonth returns no months for no rows", () => {
  assert.deepEqual(ridesByMonth([]), []);
});

test("ridesByMonth totals a partial month from only the days it has", () => {
  assert.deepEqual(
    ridesByMonth([
      { date: "2026-07-30", city: "Boston", rides: "7" },
      { date: "2026-07-31", city: "Miami", rides: "8" },
    ]),
    [{ month: "2026-07", label: "July 2026", rides: 15, share: 1 }],
  );
});

test("ridesByMonth includes a month with no ride counts as a zero monthly total", () => {
  assert.deepEqual(
    ridesByMonth([
      { date: "2026-07-01", city: "Boston", rides: "40" },
      { date: "2026-09-01", city: "Boston", rides: "20" },
    ]),
    [
      { month: "2026-07", label: "July 2026", rides: 40, share: 1 },
      { month: "2026-08", label: "August 2026", rides: 0, share: 0 },
      { month: "2026-09", label: "September 2026", rides: 20, share: 0.5 },
    ],
  );
});

test("ridesByMonth runs from December into January across a year boundary", () => {
  assert.deepEqual(
    ridesByMonth([
      { date: "2027-02-01", city: "Miami", rides: "10" },
      { date: "2026-11-30", city: "Boston", rides: "10" },
    ]),
    [
      { month: "2026-11", label: "November 2026", rides: 10, share: 1 },
      { month: "2026-12", label: "December 2026", rides: 0, share: 0 },
      { month: "2027-01", label: "January 2027", rides: 0, share: 0 },
      { month: "2027-02", label: "February 2027", rides: 10, share: 1 },
    ],
  );
});
