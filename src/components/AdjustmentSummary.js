import * as React from 'react';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import {getState} from './Store';

export function AdjustmentSummary(props) { 

  let state = getState(localStorage)

  // Object.keys(state).forEach( (segment,sdx) => {
  //   console.log(`<TreeItem nodeId="${sdx}" label="${segment}">`)
  //   Object.keys(state[segment]).forEach( (account,adx) => {
  //     console.log(`<TreeItem nodeId="${sdx*adx}" label="${account}" />`)
  //   })})

  return (

    <TreeView
      aria-label="file system navigator"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
    >
      <TreeItem nodeId="1" label="segment 1">
        <TreeItem nodeId="2" label="MUI">
          33
        </TreeItem>
      </TreeItem>
      <TreeItem nodeId="3" label="segment 2">
        <TreeItem nodeId="4" label="MUI">
          35
        </TreeItem>
      </TreeItem>      
    </TreeView>

    // <TreeView
    //   aria-label="file system navigator"
    //   defaultCollapseIcon={<ExpandMoreIcon />}
    //   defaultExpandIcon={<ChevronRightIcon />}
    //   sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
    // >
    //   {Object.keys(state).map( (segment,sdx) => (
    //     <TreeItem nodeId={sdx} label={segment}>
    //       {Object.keys(state[segment]).map( (account,adx) => (
    //         <TreeItem nodeId={sdx+adx} label={account}>{state[segment][account]}</TreeItem>
    //       ))}
    //     </TreeItem>        
    //   ))}
    // </TreeView>
  );
}