import {getSegmentSums, Sums} from './Sums';
import {getRelevantAccountData} from '../components/Data';

test('adding revenue sums works', () => {
  let sums = new Sums(3);
  let sums2 = new Sums(4);
  sums.add(sums2)
  expect(sums.revenue).toBe(7);
});

test('adding target revenue sums works', () => {
  let sums = new Sums(3,5);
  let sums2 = new Sums(4,6);
  sums.add(sums2)
  expect(sums.targetRevenue).toBe(11);
});

test('t-mobile revenue summing', () => {
  let segment = "T-Mobile"
  let sums = getSegmentSums(segment,
                            getRelevantAccountData(accountData, [segment], ""),
                            "July 1, 2022");
  expect(sums.revenue).toBe(62);
});

test('microsoft target summing', () => {
  let segment = "Microsoft"
  let sums = getSegmentSums(segment,
                            getRelevantAccountData(accountData, [segment], ""),
                            "July 1, 2022");
  expect(sums.targetRevenue).toBe(26);
});

const accountData = [
  {
    segment: "T-Mobile",
    account: 'atlas',
    revenue: 10,
    targetRevenue: 13,
    salesperson: "jane"
  },
  {
    segment: "T-Mobile",
    account: 'expert assist',
    revenue: 52,
    targetRevenue: 60,
    salesperson: "janey"
  },
  {
    segment: "Microsoft",
    account: 'digital marketing',
    revenue: 19,
    targetRevenue: 18,
    salesperson: "joe"
  },
  {
    segment: "Microsoft",
    account: 'azure analytics',
    revenue: 6,
    targetRevenue: 8,
    salesperson: "joey"
  },
  {
    segment: "Sempra",
    account: 'myaccount re-arch',
    revenue: 99,
    targetRevenue: 105,
    salesperson: "ben"
  },
  {
    segment: "Sempra",
    account: 'digital fortress',
    revenue: 4,
    targetRevenue: 5,
    salesperson: "ben"
  },
  {
    segment: "Sempra",
    account: 'digital fortress part two',
    revenue: 4,
    targetRevenue: 5,
    salesperson: "jane"
  }
];