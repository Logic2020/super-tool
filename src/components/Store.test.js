import {persistState,getPersistedValue, ALL_ACCOUNTS, getState} from './Store';

test('getting a non-existent segment returns 0', () => {
  expect(getPersistedValue(storageMock(), "", ALL_ACCOUNTS, "July 1, 2022")).toBe(0);
});

test('segment only', () => {
  let store = storageMock();
  persistState(store, "seg", ALL_ACCOUNTS, 60, "July 1, 2022")
  expect(getPersistedValue(store, "seg", ALL_ACCOUNTS, "July 1, 2022")).toBe(60);
});

test('segment and account', () => {
  let store = storageMock();
  persistState(store, "seg", "practice/acc", 40, "July 1, 2022")
  expect(getPersistedValue(store, "seg", "practice/acc", "July 1, 2022")).toBe(40);
});

test('segment and account with start date after requested date', () => {
  let store = storageMock();
  persistState(store, "seg", "practice/acc", 40, "Sept 1, 2022")
  expect(getPersistedValue(store, "seg", "practice/acc", "July 1, 2022")).toBe(0);
});

test('segment and account with start date before requested date', () => {
  let store = storageMock();
  persistState(store, "seg", "practice/acc", 40, "April 1, 2022")
  expect(getPersistedValue(store, "seg", "practice/acc", "July 1, 2022")).toBe(40);
});

test('segment and mismatched-account', () => {
  let store = storageMock();
  persistState(store, "seg", "practice/accs", 40, "July 1, 2022")
  expect(getPersistedValue(store, "seg", "practice/acc", "July 1, 2022")).toBe(0);
});

test('set value at segment level, and request an account w/out a setting', () => {
  let store = storageMock();
  persistState(store, "seg", ALL_ACCOUNTS, 40, "July 1, 2022")
  expect(getPersistedValue(store, "seg", "practice/acc", "July 1, 2022")).toBe(0);
});

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