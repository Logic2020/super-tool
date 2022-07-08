export function persistState(store, segment, account, value) {

  // save change to local storage for later recall
  let state = store.getItem("state") ? JSON.parse(store.getItem("state")): {};

  // if necessary, init a key for this segment
  if ( !state[segment] ) {
    state[segment] = {}
  }

  if (segment && !account) {
    state[segment]["all"] = value
  } else if (segment && account) {      
    state[segment][account] = value
  }

  store.setItem("state", JSON.stringify(state));
}

export function getPersistedValue(store, segment, account) {
   
  let state = store.getItem("state") ? JSON.parse(store.getItem("state")): {};

  if (state && state[segment] && !account && state[segment]["all"]) {
    // segment but no account
    return state[segment]["all"]
  } else if (state && state[segment] && state[segment][account] != null) {
    // segment and account
    return state[segment][account]
  } else {
    return 0
  }
}

export function getStoreAccountKey(account, practice) {
  return `${practice}/${account}`
}
