import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Paper from '@mui/material/Paper';
import {getRelevantAccountData,getRelevantSegments} from '../Data';
import {getSegmentSums} from './Sums';

export default function SummaryView(props) {

  // for triggering refreshes of the totals row based on slider changes
  const [trigger, setTrigger] = React.useState(0);                                           

  let activeSegments = getRelevantSegments(props.accountData, 
                                           props.segments,
                                           props.salesperson,
                                           props.monthYear,
                                           props.effectiveDate,
                                           props.practice)

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Segment</TableCell>
            <TableCell align="right">Current Revenue</TableCell>
            <TableCell align="right">Current Margin</TableCell>
            <TableCell align="right">Current Margin %</TableCell>
            <TableCell align="right">Revised Revenue</TableCell>
            <TableCell align="right">Revised Margin</TableCell>
            <TableCell align="right">Revised Margin %</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {activeSegments.map((segment) => (
            <SegmentSummary key={segment} 
              segment={segment} 
              rows={getRelevantAccountData(props.accountData, 
                                          [segment], 
                                          props.salesperson,
                                          props.monthYear,
                                          props.effectiveDate,
                                          props.practice)}
              monthYear={props.monthYear}    
              summaryTrigger={setTrigger}/>
          ))}
          {/* <TotalsRow accountData={props.accountData}
                     segments={activeSegments}
                     salesperson={props.salesperson}
                     monthYear={props.monthYear}
                     effectiveDate={props.effectiveDate}
                     practice={props.practice}
                     trigger={trigger}/> */}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function SegmentSummary(props) {
  const { rows, segment } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <SegmentRow segment={segment} 
                  rows={rows} 
                  open={open} 
                  setOpen={setOpen}
                  monthYear={props.monthYear}
                  summaryTrigger={props.summaryTrigger}/>
  );
}

function SegmentRow(props) {

  let rows = props.rows;

  let sums = getSegmentSums(props.segment, rows, "segment")

  return (
    <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
      <TableCell component="th" scope="row">{props.segment}</TableCell>
      <TableCell align="right">{sums.revenue}</TableCell>
      <TableCell align="right">{sums.revenue - sums.cogs}</TableCell>
      <TableCell align="right">{formatPercentage((sums.revenue - sums.cogs)/sums.revenue)}</TableCell>
      <TableCell align="right">{sums.adjustedRevenue}</TableCell>
      <TableCell align="right">{sums.adjustedRevenue - sums.cogs}</TableCell>
      <TableCell align="right">{formatPercentage((sums.adjustedRevenue - sums.cogs)/sums.adjustedRevenue)}</TableCell>
    </TableRow>
  )
}

function formatPercentage(percentage) {
  return (100*percentage).toFixed(0) + "%"
}