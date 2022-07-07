import {persistState,getPersistedValue} from './store';

test('getting a non-existent key returns 0', () => {
  expect(getPersistedValue("", "", storageMock())).toBe(0);
});

test('segment only', () => {
  let store = storageMock();
  persistState("seg", "", 60, store)
  expect(getPersistedValue("seg", "", store)).toBe(60);
});

test('segment and account', () => {
  let store = storageMock();
  persistState("seg", "practice/acc", 40, store)
  expect(getPersistedValue("seg", "practice/acc", store)).toBe(40);
});

test('segment and mismatched-account', () => {
  let store = storageMock();
  persistState("seg", "practice/accs", 40, store)
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