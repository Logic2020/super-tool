import {Sums} from './Sums';

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