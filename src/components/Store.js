export const ALL_ACCOUNTS = "all"

export function persistState(store, segment, account, value) {

  // save change to local storage for later recall
  let state = getState(store)

  // if necessary, init a key for this segment
  if ( !state[segment] ) {
    state[segment] = {}
  }

  if (segment && account) {      
    state[segment][account] = value
  }

  store.setItem("state", JSON.stringify(state));
}

export function getState(store) {
  return store.getItem("state") ? JSON.parse(store.getItem("state")): {};
}

export function getPersistedValue(store, segment, account) {
   
  let state = store.getItem("state") ? JSON.parse(store.getItem("state")): {};

  if (state && state[segment] && state[segment][account] != null) {
    return state[segment][account]
  } else {
    return 0
  }
}

export function getStoreAccountKey(account, practice) {
  return `${practice}/${account}`
}
