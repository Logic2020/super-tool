import {persistState, getPersistedValue, findUsableDates} from './store';

test('getting a non-existent key returns 0', () => {
  expect(getPersistedValue(storageMock(), "", "")).toStrictEqual(0);
});

test('segment only', () => {
  let store = storageMock();
  persistState(store, "seg", "", 60, 'July, 2022')
  expect(getPersistedValue(store, "seg", "", 'Jan, 2022')).toBe(60)
});


test('segment and account', () => {
  let store = storageMock();
  persistState(store, "seg", "practice/acc", 40, 'July, 2022')
  expect(getPersistedValue(store, "seg", "practice/acc", "August, 2022")).toBe(40);
});

test('segment and mismatched-account', () => {
  let store = storageMock();
  persistState(store, "seg", "practice/accs", 40)
  expect(getPersistedValue(store, "seg", "practice/acc")).toBe(0);
});

test('segment setting, but no account', () => {
  let store = storageMock();
  persistState(store, "seg", "", 40)
  expect(getPersistedValue(store, "seg", "practice/acc")).toBe(0);
});

test('account stores start date and revenue adjustement', () => {
  let store = storageMock()
  persistState(store, "seg", "practice/acc", 40, 'July, 2022')
  expect(getPersistedValue(store, "seg", "practice/acc", "July, 2022")).toBe(40);
});

test('finds correct revenue with multiple accounts', () => {
  let store = storageMock()
  persistState(store, "seg", "practice/acc", 40, 'July, 2022')
  persistState(store, "seg", "practice2/acc2", 60, 'June, 2022')
  expect(getPersistedValue(store, "seg", "practice2/acc2", "July, 2022")).toBe(60);
})

test('handles single month prior to availilble data', () => {
  let store = storageMock()
  persistState(store, "seg", "practice/acc", 40, 'June, 2022')
  expect(getPersistedValue(store, "seg", "practice/acc", "Jan, 2022")).toBe(40);
})

test('handles multiple months prior to availilble data', () => {
  let store = storageMock()
  persistState(store, "seg", "practice/acc", 40, 'June, 2022')
  persistState(store, "seg", "practice/acc", 60, 'July, 2022')
  expect(getPersistedValue(store, "seg", "practice/acc", "Jan, 2022")).toBe(40);
})

test('handles null value for account and date', () => {
  let store = storageMock()
  persistState(store, "seg", "practice/acc", 40, 'June, 2022')
  expect(getPersistedValue(store, "seg", null, null)).toBe(0);
})


// Storage Mock
function storageMock() {
  let storage = {};

  return {
    setItem: function(key, value) {
      storage[key] = value || '';
    },
    getItem: function(key) {
      return key in storage ? storage[key] : null;
    },
    removeItem: function(key) {
      delete storage[key];
    },
    get length() {
      return Object.keys(storage).length;
    },
    key: function(i) {
      const keys = Object.keys(storage);
      return keys[i] || null;
    }
  };
}