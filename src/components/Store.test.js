import {persistState,getPersistedValue, ALL_ACCOUNTS} from './Store';

test('getting a non-existent segment returns 0', () => {
  expect(getPersistedValue(storageMock(), "", ALL_ACCOUNTS)).toBe(0);
});

test('segment only', () => {
  let store = storageMock();
  persistState(store, "seg", ALL_ACCOUNTS, 60)
  expect(getPersistedValue(store, "seg", ALL_ACCOUNTS)).toBe(60);
});

test('segment and account', () => {
  let store = storageMock();
  persistState(store, "seg", "practice/acc", 40, )
  expect(getPersistedValue(store, "seg", "practice/acc")).toBe(40);
});

test('segment and mismatched-account', () => {
  let store = storageMock();
  persistState(store, "seg", "practice/accs", 40)
  expect(getPersistedValue(store, "seg", "practice/acc")).toBe(0);
});

test('set value at segment level, and request an account w/out a setting', () => {
  let store = storageMock();
  persistState(store, "seg", ALL_ACCOUNTS, 40)
  expect(getPersistedValue(store, "seg", "practice/acc")).toBe(0);
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