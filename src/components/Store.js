export const ALL_ACCOUNTS = "all"

export function persistState(store, segment, account, value, startDateStr) {

  // save change to local storage for later recall
  let state = getState(store)

  // if necessary, init a key for this segment
  if ( !state[segment] ) {
    state[segment] = {}
  }

  if (segment && account) {      
    state[segment][account] = {
      value: value,
      startDateStr: startDateStr
    }
  }

  store.setItem("state", JSON.stringify(state));
}

export function getState(store) {
  return store.getItem("state") ? JSON.parse(store.getItem("state")): {};
}

export function getPersistedValue(store, segment, account, desiredDateStr) {
   
  let state = store.getItem("state") ? JSON.parse(store.getItem("state")): {};

  if (state && state[segment] && 
      state[segment][account] != null && 
      (new Date(state[segment][account]["startDateStr"])).getTime() <= (new Date(desiredDateStr)).getTime()) {
    return state[segment][account]["value"]
  } else {
    return 0
  }
}

export function getStoreAccountKey(account, practice) {
  return `${account}/${practice}/`
}

export function getStoreProjectKey(account, practice, project) {
  return `${account}/${practice}/${project}`
}
