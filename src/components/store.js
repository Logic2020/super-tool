//A default value for start month is supplied so the new paramenter doesn't break previous unit tests
function persistState(store, segment, account, value, start_month) {

  // save change to local storage for later recall
  let state = store.getItem("state") ? JSON.parse(store.getItem("state")): {};

  // if necessary, init a key for this segment
  if ( !state[segment] ) {
    state[segment] = {}
  }

  if (segment && !account) {
    state[segment]["all"]= {}
    state[segment]["all"][start_month] = {
      'revenue_increase': value
    }
  } else if (segment && account) {      
    state[segment][account] = {}
    state[segment][account][start_month] = {
      'revenue_increase': value
    }
  }
  store.setItem("state", JSON.stringify(state));
}

function getPersistedValue(store, segment, account) {
   
  let state = store.getItem("state") ? JSON.parse(store.getItem("state")): {};

  if (state && state[segment] && !account && state[segment]["all"]) {
    // segment but no account
    return state[segment]["all"]
  } else if (state && state[segment] && state[segment][account] != null) {
    // segment and account
    return state[segment][account]
  } else {
    return {
      "revenue_increase": 0
    }
  }
}

export {persistState,getPersistedValue} 