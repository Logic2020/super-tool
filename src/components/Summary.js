import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import {getRelevantAccountData,getRelevantSegments,formatPercentage} from '../Data';
import {getSegmentSums, Sums} from './Sums';
import { useTheme } from '@mui/material/styles';

export default function SummaryView(props) {                                        

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
          <TableRow style={{backgroundColor:'#E9E9E9'}}>
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
              monthYear={props.monthYear}/>
          ))}
          <TotalsRow accountData={props.accountData}
                     segments={activeSegments}
                     salesperson={props.salesperson}
                     monthYear={props.monthYear}
                     effectiveDate={props.effectiveDate}
                     practice={props.practice}/>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function SegmentSummary(props) {

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

function TotalsRow(props) {

  let sums = new Sums()

  props.segments.forEach(segment => {
    let revenueData = getRelevantAccountData(props.accountData, 
                                             [segment], 
                                             props.salesperson,
                                             props.monthYear,
                                             props.effectiveDate,
                                             props.practice)
    
    sums.add(getSegmentSums(segment,revenueData,"totals"))
  })

  // text in totals row should be bolded
  const totalsFontStyle = {fontWeight: useTheme().typography.fontWeightBold}

  return (
    <React.Fragment>
      <TableRow style={{backgroundColor:'#E6F7FE'}}>
        <TableCell component="th" scope="row"><Typography>Totals</Typography></TableCell>
        <TableCell align="right">{sums.revenue}</TableCell>
        <TableCell align="right">{sums.revenue - sums.cogs}</TableCell>
        <TableCell align="right">{formatPercentage((sums.revenue - sums.cogs)/sums.revenue)}</TableCell>
        <TableCell align="right">{sums.adjustedRevenue}</TableCell>
        <TableCell align="right">{sums.adjustedRevenue-sums.targetRevenue}</TableCell>
        <TableCell align="right">{formatPercentage((sums.adjustedRevenue - sums.cogs)/sums.adjustedRevenue)}</TableCell>
      </TableRow>
    </React.Fragment>
  );
}