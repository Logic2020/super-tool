function persistState(segment, account, value) {
   // save change to local storage for later recall
    let state = localStorage.getItem("state") ? JSON.parse(localStorage.getItem("state")): {};
    
    // if necessary, init a key for this segment
    if ( !state[segment] ) {
      state[segment] = {}
    }

    if (segment && !account) {
      state[segment]["all"] = value
    } else if (segment && account) {      
      state[segment][account] = value
    }

    localStorage.setItem("state", JSON.stringify(state));
}

function getPersistedValue(segment, account) {
   
   let state = localStorage.getItem("state") ? JSON.parse(localStorage.getItem("state")): {};
   return state && state[segment] && state[segment][account] != null ? state[segment][account]: (state && state[segment] && state[segment]["all"] !=null ? state[segment]["all"] : 0 : 0)
}

export {persistState,getPersistedValue} 