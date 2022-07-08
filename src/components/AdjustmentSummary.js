
import {getState} from './Store';

export function AdjustmentSummary(props) { 

  let state = getState(localStorage)

  return (
    JSON.stringify(state)
  );
}