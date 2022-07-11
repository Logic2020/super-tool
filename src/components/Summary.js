import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import {getRelevantAccountData,getRelevantSegments,formatPercentage,getMonthYears} from '../Data';
import {getSegmentSums, Sums} from './Sums';

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
              accountData={props.accountData}
              segment={segment} 
              salesperson={props.salesperson}
              effectiveDate={props.effectiveDate}
              practice={props.practice}
              startDate={props.startDate} 
              endDate={props.endDate}/>
          ))}
          <TotalsRow accountData={props.accountData}
                     segments={activeSegments}
                     salesperson={props.salesperson}
                     monthYear={props.monthYear}
                     effectiveDate={props.effectiveDate}
                     practice={props.practice}
                     startDate={props.startDate} 
                     endDate={props.endDate}/>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function SegmentSummary(props) {

  let sums = new Sums()

  // sum over each month year
  getMonthYears(props.startDate,props.endDate).forEach(monthYear => {
    let revenueData = getRelevantAccountData(props.accountData, 
                                             [props.segment], 
                                             props.salesperson,
                                             monthYear,
                                             props.effectiveDate,
                                             props.practice)
    
    sums.add(getSegmentSums(props.segment,revenueData,"totals"))
  })

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

  // sum over each month year, then sum over all segments
  getMonthYears(props.startDate,props.endDate).forEach(monthYear => {
    props.segments.forEach(segment => {
      let revenueData = getRelevantAccountData(props.accountData, 
                                              [segment], 
                                              props.salesperson,
                                              monthYear,
                                              props.effectiveDate,
                                              props.practice)
      
      sums.add(getSegmentSums(segment,revenueData,"totals"))
    })
  })

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