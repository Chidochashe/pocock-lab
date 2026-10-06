# Rides dashboard

A static dashboard summarizing daily ride counts for a set of cities.

## Language

**Ride count**:
The number of rides recorded for one city on one date; one row of the sample data.
_Avoid_: Trip, record

**City**:
A place whose rides are counted separately.
_Avoid_: Market, region

**Month**:
A calendar month identified by year and month (e.g. July 2026); ride counts belong to the month of their date, and a month with missing days is still a month.
_Avoid_: Period, month name alone

**Monthly total**:
The sum of all ride counts, across every city, whose date falls in a given month; zero for a month with no ride counts.
_Avoid_: Monthly rides per city, monthly average
