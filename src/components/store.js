import { findIndexOfMonth } from '../Data.js';

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

function getPersistedValue(store, segment, account, selectedDate) {
  //should return just the revenue % for the month that findIndexOfMonth selects
  let state = store.getItem("state") ? JSON.parse(store.getItem("state")): {};

  if (state && state[segment] && !account && state[segment]["all"]) {

    let accountKeys = Object.keys(state[segment]['all'])
    let validMonth = accountKeys[findIndexOfMonth(selectedDate, accountKeys)]
    return state[segment]['all'][validMonth]['revenue_increase']

  } else if (state && state[segment] && state[segment][account] != null) {
    // segment and account
    // let accountKeys = Object.keys(state[segment][account])
    // let validMonths = accountKeys.slice(findIndexOfMonth(selectedDate, accountKeys))
    // let accountDates = {}

    // for(let i = 0; i < validMonths.length-1; i++){
    //   accountDates[validMonths[i]] = state[segment][account][validMonths[i]]
    // }

    let accountKeys = Object.keys(state[segment][account])
    let validMonth = accountKeys[findIndexOfMonth(selectedDate, accountKeys)]
    return state[segment][account][validMonth]['revenue_increase']
  } else {
    return 0
  }
}

export {persistState, getPersistedValue} 