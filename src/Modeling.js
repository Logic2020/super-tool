import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {PercentIncrease} from './Inputs';
import {getRelevantAccountData,getRelevantSegments,getAdjustedRevenue,formatPercentage} from './components/Data';
import {persistState,getPersistedValue,getStoreAccountKey, ALL_ACCOUNTS} from './components/Store';
import {Sums, getSegmentSums} from './components/Sums'
import { useTheme } from '@mui/material/styles';

export default function ModelingView(props) {                                       

  let activeSegments = getRelevantSegments(props.accountData, 
                                           props.segments,
                                           props.salesperson,
                                           props.monthYear,
                                           props.effectiveDate,
                                           props.practice)

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow  style={{backgroundColor:'#E9E9E9'}}>
            <TableCell />
            <TableCell >Segment</TableCell>
            <TableCell align="right">Current Revenue</TableCell>
            <TableCell align="right">Revenue Increase%</TableCell>
            <TableCell align="right">Adjusted Revenue</TableCell>
            <TableCell align="right">Target Revenue</TableCell>
            <TableCell align="right">Revenue Over/Under</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {activeSegments.map((segment) => (
            <Row key={segment} 
              segment={segment} 
              rows={getRelevantAccountData(props.accountData, 
                                          [segment], 
                                          props.salesperson,
                                          props.monthYear,
                                          props.effectiveDate,
                                          props.practice)}
              monthYear={props.monthYear}    
              setTrigger={props.setTrigger}/>
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

function Row(props) {
  const { rows, segment } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <SegmentRow segment={segment} 
                  rows={rows} 
                  open={open} 
                  setOpen={setOpen}
                  monthYear={props.monthYear}
                  setTrigger={props.setTrigger}/>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                By Account
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Account</TableCell>
                    <TableCell>Practice</TableCell>
                    <TableCell>Current Revenue</TableCell>
                    <TableCell align="right">Revenue Increase%</TableCell>
                    <TableCell align="right">Adjusted Revenue</TableCell>
                    <TableCell align="right">Target Revenue</TableCell>
                    <TableCell align="right">Over/Under</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((accountRow) => (
                    <AccountRow row={accountRow} 
                                segment={props.segment} 
                                monthYear={props.monthYear}
                                setTrigger={props.setTrigger}/>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function SegmentRow(props) {

  let rows = props.rows;

  // for segment sliders
  const [segmentIncreaseValue, setSegmentIncreaseValue] = 
        React.useState(getPersistedValue(localStorage, 
                                         props.segment,
                                         ALL_ACCOUNTS,
                                         props.monthYear));

  const handleSegmentChange = (event, newValue) => {
    setSegmentIncreaseValue(newValue);

    // persist changes
    persistState(localStorage, props.segment,ALL_ACCOUNTS,newValue, props.monthYear)

    // trigger a refresh of the totals based on this new increase value
    props.setTrigger(newValue)
  };

  let sums = getSegmentSums(props.segment, rows, props.monthYear, "segment")

  return (
    <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
      <TableCell>
        <IconButton
          aria-label="expand row"
          size="small"
          onClick={() => props.setOpen(!(props.open))}
        >
          {props.open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
      </TableCell>
      <TableCell component="th" scope="row">{props.segment}</TableCell>
      <TableCell align="right">{sums.revenue}</TableCell>
      <TableCell align="right"><PercentIncrease value={segmentIncreaseValue} changer={handleSegmentChange} default={segmentIncreaseValue}/></TableCell>
      <TableCell align="right">{sums.adjustedRevenue}</TableCell>
      <TableCell align="right">{sums.targetRevenue}</TableCell>
      <TableCell align="right">{sums.adjustedRevenue-sums.targetRevenue}</TableCell>
    </TableRow>
  )
}

function AccountRow(props) {

  let segment = props.segment
  let accountRow = props.row

  // for account sliders
  const [accountIncreaseValue, setAccountIncreaseValue] = 
          React.useState(getPersistedValue(localStorage, segment, 
                getStoreAccountKey(accountRow.account, accountRow.practice),
                props.monthYear));

  const handleAccountChange = (event, newValue) => {
    setAccountIncreaseValue(newValue);
    persistState(localStorage, 
                 segment,
                 getStoreAccountKey(accountRow.account,accountRow.practice),
                 newValue, 
                 props.monthYear)

    props.setTrigger(newValue)
  };

  return (
    <TableRow key={props.segment-accountRow.account}>
      <TableCell component="th" scope="row">{accountRow.account}</TableCell>
      <TableCell>{accountRow.practice}</TableCell>
      <TableCell>{accountRow.revenue}</TableCell>
      <TableCell align="right"><PercentIncrease value={accountIncreaseValue} changer={handleAccountChange} default={accountIncreaseValue}/></TableCell>
      <TableCell align="right">{getAdjustedRevenue(accountRow.revenue,accountIncreaseValue)}</TableCell>
      <TableCell align="right">{accountRow.targetRevenue}</TableCell>
      <TableCell align="right">{getAdjustedRevenue(accountRow.revenue,accountIncreaseValue)-accountRow.targetRevenue}</TableCell>
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
    
    sums.add(getSegmentSums(segment,revenueData, props.monthYear, "totals"))
  })

  // text in totals row should be bolded
  const totalsFontStyle = {fontWeight: useTheme().typography.fontWeightBold}

  return (
    <React.Fragment>
      <TableRow style={{backgroundColor:'#E6F7FE'}}>
        <TableCell/>
        <TableCell component="th" scope="row">Totals</TableCell>
        <TableCell align="right">{sums.revenue}</TableCell>
        <TableCell align="right">{formatPercentage((sums.adjustedRevenue-sums.revenue)/sums.revenue)}</TableCell>
        <TableCell align="right">{sums.adjustedRevenue}</TableCell>
        <TableCell align="right">{sums.targetRevenue}</TableCell>
        <TableCell align="right">{sums.adjustedRevenue-sums.targetRevenue}</TableCell>
      </TableRow>
    </React.Fragment>
  );
}


