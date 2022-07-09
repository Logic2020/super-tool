import {getRelevantAccountData, getRelevantSegments, findIndexOfMonth, findMonthYearDifference, parseMonthYear} from './Data';

test('segment filtering works', () => {
  let data = getRelevantAccountData(revenueData, "Microsoft","", "", "July 5, 2022");
  expect(data.length).toBe(2);
});

test('empty segment returns all data', () => {
  let data = getRelevantAccountData(revenueData, "", null, "", "July 5, 2022");
  expect(data.length).toBe(revenueData.length/2);
});

test('salesperson filtering works', () => {
  let data = getRelevantAccountData(revenueData, null, "janey", "", "July 5, 2022");
  expect(data.length).toBe(1);
});

test('multi-segment salesperson filtering works', () => {
  let data = getRelevantAccountData(revenueData, "","jane", "", "July 5, 2022");
  expect(data.length).toBe(2);
});

test('segment+salesperson filtering works', () => {
  let data = getRelevantAccountData(revenueData, "T-Mobile", "jane", "", "July 5, 2022");
  expect(data[0].segment).toBe("T-Mobile")
  expect(data.length).toBe(1);
});

test('get all segments works', () => {
  let data = getRelevantSegments(revenueData, [], "", "", "July 5, 2022");
  console.log(data)
  expect(data.length).toBe(3);
});

test('get 2 segments works', () => {
  let data = getRelevantSegments(revenueData, ["Microsoft","T-Mobile"], "", "", "July 5, 2022");
  expect(data.length).toBe(2);
});

test('get segments associated with a single salesperson', () => {
  let data = getRelevantSegments(revenueData, [], "ben", "", "July 5, 2022");
  expect(data.length).toBe(1);
});

// test('parses month and year', () => {
//   let dateObj = parseMonthYear('7-2022')
//   expect(dateObj).toStrictEqual([7, 2022])
// })

test('find difference between two dates same year', () => {
  let diff = findMonthYearDifference('3-2022', '5-2022');
  expect(diff).toBe(2);
})

test('find difference between two dates different year 1 year gap', () => {
  let diff = findMonthYearDifference('11-2022', '1-2023');
  expect(diff).toBe(2);
})

test('find difference between two dates different year 2 year gap', () => {
  let diff = findMonthYearDifference('11-2022', '1-2024');
  expect(diff).toBe(14);
})

test('get index of month in array that is greater than selected month', () => {
  let selectedMonth = 'Jan, 2022'
  let dateArray = ['Nov, 2021', 'Dec, 2021', 'Jan, 2022', 'Feb, 2022']
  expect(findIndexOfMonth(selectedMonth, dateArray)).toBe(2)
})


const revenueData = [
  {
    segment: "T-Mobile",
    account: 'atlas',
    revenue: 10,
    targetRevenue: 13,
    salesperson: "jane",
    effectiveDate: "July 2, 2022"
  },
  {
    segment: "T-Mobile",
    account: 'atlas',
    revenue: 10,
    targetRevenue: 13,
    salesperson: "jane",
    effectiveDate: "July 5, 2022"
  },  
  {
    segment: "T-Mobile",
    account: 'expert assist',
    revenue: 52,
    targetRevenue: 60,
    salesperson: "janey",
    effectiveDate: "July 2, 2022"
  },
  {
    segment: "T-Mobile",
    account: 'expert assist',
    revenue: 52,
    targetRevenue: 60,
    salesperson: "janey",
    effectiveDate: "July 5, 2022"
  },
  {
    segment: "Microsoft",
    account: 'digital marketing',
    revenue: 19,
    targetRevenue: 18,
    salesperson: "joe",
    effectiveDate: "July 2, 2022"
  },
  {
    segment: "Microsoft",
    account: 'digital marketing',
    revenue: 19,
    targetRevenue: 18,
    salesperson: "joe",
    effectiveDate: "July 5, 2022"
  },
  {
    segment: "Microsoft",
    account: 'azure analytics',
    revenue: 6,
    targetRevenue: 8,
    salesperson: "joey",
    effectiveDate: "July 2, 2022"
  },
  {
    segment: "Microsoft",
    account: 'azure analytics',
    revenue: 6,
    targetRevenue: 8,
    salesperson: "joey",
    effectiveDate: "July 5, 2022"
  },
  {
    segment: "Sempra",
    account: 'myaccount re-arch',
    revenue: 99,
    targetRevenue: 105,
    salesperson: "ben",
    effectiveDate: "July 2, 2022"
  },
  {
    segment: "Sempra",
    account: 'myaccount re-arch',
    revenue: 99,
    targetRevenue: 105,
    salesperson: "ben",
    effectiveDate: "July 5, 2022"
  },  
  {
    segment: "Sempra",
    account: 'digital fortress',
    revenue: 4,
    targetRevenue: 5,
    salesperson: "ben",
    effectiveDate: "July 2, 2022"
  },
  {
    segment: "Sempra",
    account: 'digital fortress',
    revenue: 4,
    targetRevenue: 5,
    salesperson: "ben",
    effectiveDate: "July 5, 2022"
  },  
  {
    segment: "Sempra",
    account: 'digital fortress part two',
    revenue: 4,
    targetRevenue: 5,
    salesperson: "jane",
    effectiveDate: "July 2, 2022"
  },
  {
    segment: "Sempra",
    account: 'digital fortress part two',
    revenue: 4,
    targetRevenue: 5,
    salesperson: "jane",
    effectiveDate: "July 5, 2022"
  }  
];