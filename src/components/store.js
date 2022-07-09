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
   
  let state = store.getItem("state") ? JSON.parse(store.getItem("state")): {};

  if (state && state[segment] && !account && state[segment]["all"]) {
    // segment but no account
    // need to create an object of all the dates we need and return them and their values with the dates as the keys 
    let accountKeys = Object.keys(state[segment]['all'])
    let validMonths = accountKeys.slice(findIndexOfMonth(selectedDate, accountKeys)) //should return keys for only relavent months
    let segmentDates = {}

    for(let i = 0; i < validMonths.length; i++){
      let selectedMonth = state[segment]['all'][validMonths[i]]
      segmentDates[validMonths[i]] = selectedMonth
    }
    return segmentDates

  } else if (state && state[segment] && state[segment][account] != null) {
    // segment and account
    let validMonths = state[segment][account].keys().slice(findIndexOfMonth(selectedDate))
    let accountDates = {}

    for(let i = 0; i < validMonths.lenth; i++){
      accountDates[validMonths[i]] = state[segment][accountDates][validMonths[i]]
    }

    return accountDates
  } else {
    return {
      "revenue_increase": 0
    }
  }
}

// export function findUsableDates(selectedDate, dateArray){
//   let parsedDates = dateArray.map(currentDate => {
//     return parseMonthYear(currentDate)
//   })
//   let deleteList = []
//   let parsedSelectedDate = parseMonthYear(selectedDate);
//   for(let i = 0; i < parsedDates.length; i++){
//     if(parsedDates[i][1] < parsedSelectedDate[1]){
//       deleteList.push(i)
//     }
//     else if(parsedDates[i][1] == parsedSelectedDate[1]){
//       if(parsedDates[i][0] < selectedDate[0]){
//         deleteList.push(i)
//       }
//     }
//   }

//   for(let x = 0; x < deleteList.length; x++){
//     dateArray.slice(x, 1)
//   }
//   //still need to return dates to original order
//   return dateArray
// }

export {persistState, getPersistedValue} 