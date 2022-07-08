import {persistState,getPersistedValue} from './store';

test('getting a non-existent key returns 0', () => {
  expect(getPersistedValue(storageMock(), "", "")).toStrictEqual({
    "revenue_increase": 0
  });
});

test('segment only', () => {
  let store = storageMock();
  persistState(store, "seg", "", 60, '7-2022')
  expect(getPersistedValue(store, "seg", "")).toStrictEqual(
    {
      "7-2022": {
        "revenue_increase": 60
      }
    })
});

test('segment and account', () => {
  let store = storageMock();
  persistState(store, "seg", "practice/acc", 40, '7-2022')
  expect(getPersistedValue(store, "seg", "practice/acc")).toStrictEqual({
    '7-2022': {
      'revenue_increase': 40
    }
  });
});

test('segment and mismatched-account', () => {
  let store = storageMock();
  persistState(store, "seg", "practice/accs", 40)
  expect(getPersistedValue(store, "seg", "practice/acc")).toStrictEqual({
    "revenue_increase": 0
  });
});

test('segment setting, but no account', () => {
  let store = storageMock();
  persistState(store, "seg", "", 40)
  expect(getPersistedValue(store, "seg", "practice/acc")).toStrictEqual({
    "revenue_increase": 0
  });
});

test('account stores start date and revenue adjustement', () => {
  let store = storageMock()
  persistState(store, "seg", "practice/acc", 40, '7-2022')
  expect(getPersistedValue(store, "seg", "practice/acc")).toStrictEqual({
    '7-2022': {
      "revenue_increase": 40
    }
  })
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