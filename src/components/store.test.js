import {persistState,getPersistedValue} from './store';

test('getting a non-existent key returns 0', () => {
  expect(getPersistedValue(storageMock(), "", "")).toBe(0);
});

test('segment only', () => {
  let store = storageMock();
  persistState(store, "seg", "", 60, store)
  expect(getPersistedValue(store, "seg", "")).toBe(60);
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

test('segment setting, but no account', () => {
  let store = storageMock();
  persistState("seg", "", 40, store)
  expect(getPersistedValue("seg", "practice/acc", store)).toBe(0);
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