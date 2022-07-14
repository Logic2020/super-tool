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
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {PercentIncrease} from './Inputs';
import {getRelevantSegmentData,getRelevantSegments,getAdjustedRevenue,formatPercentage} from './components/Data';
import {persistState,getPersistedValue,getStoreAccountKey, ALL_ACCOUNTS} from './components/Store';
import {Sums, getAccountSums, getSegmentSums, getAccounts} from './components/Sums'
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
              rows={getRelevantSegmentData(props.accountData, 
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

  // get the accounts for this segment
  let accounts = getAccounts(rows);

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
                    <TableCell />
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
                  {accounts.map((accountObj) => (
                    <AccountRow rows={rows} 
                                segment={props.segment}
                                account={accountObj.name}
                                practice={accountObj.practice}
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

  let {segment, account, practice, rows, monthYear} = props;

  const [open, setOpen] = React.useState(false);

  // for account sliders
  const [accountIncreaseValue, setAccountIncreaseValue] = 
          React.useState(getPersistedValue(localStorage, segment, 
                getStoreAccountKey(account, practice),
                props.monthYear));

  const handleAccountChange = (event, newValue) => {
    setAccountIncreaseValue(newValue);
    persistState(localStorage, 
                 segment,
                 getStoreAccountKey(account,practice),
                 newValue, 
                 props.monthYear)

    props.setTrigger(newValue)
  };

  // isolate the rows for this account and practice
  let accountRows = rows.filter(item => {
    return item.account === account && item.practice === practice
  });

  // sum over the account rows
  let sums = getAccountSums(accountRows, segment, account, practice, monthYear, "account")

  return (
    <React.Fragment>
      <TableRow key={account-practice}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!(open))}
          >
            {props.open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">{account}</TableCell>
        <TableCell>{practice}</TableCell>
        <TableCell>{sums.revenue}</TableCell>
        <TableCell align="right"><PercentIncrease value={accountIncreaseValue} changer={handleAccountChange} default={accountIncreaseValue}/></TableCell>
        <TableCell align="right">{getAdjustedRevenue(sums.revenue,accountIncreaseValue)}</TableCell>
        <TableCell align="right">{sums.targetRevenue}</TableCell>
        <TableCell align="right">{getAdjustedRevenue(sums.revenue,accountIncreaseValue)-sums.targetRevenue}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                By Project
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>Project Number</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell>Current Revenue</TableCell>
                    <TableCell align="right">Revenue Increase%</TableCell>
                    <TableCell align="right">Adjusted Revenue</TableCell>
                    <TableCell align="right">Target Revenue</TableCell>
                    <TableCell align="right">Over/Under</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {accountRows.map((projectRow) => (
                    <ProjectRow row={projectRow} 
                                segment={segment}
                                account={account}
                                practice={practice}
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
  )
}

function ProjectRow(props) {

  let {row} = props

  // for account sliders
  const [projectIncreaseValue, setProjectIncreaseValue] = React.useState();

  const handleProjectChange = (event, newValue) => {
    setProjectIncreaseValue(newValue);
    // persistState(localStorage, 
    //           segment,
    //           getStoreAccountKey(account,practice),
    //           newValue, 
    //           props.monthYear)

    props.setTrigger(newValue)
  };

  let adjustedRevenue = getAdjustedRevenue(row.revenue,projectIncreaseValue)

  return (
    <React.Fragment>
      <TableRow >
        <TableCell/>
        <TableCell component="th" scope="row">
        <Tooltip title={row.projectName}>
          <Button>{row.projectNumber}</Button>
        </Tooltip>
        </TableCell>
        <TableCell align="right">{row.projectStartDate}</TableCell>
        <TableCell align="right">{row.projectEndDate}</TableCell>
        <TableCell align="right">{row.revenue}</TableCell>
        <TableCell align="right"><PercentIncrease value={projectIncreaseValue} changer={handleProjectChange} default={projectIncreaseValue}/></TableCell>
        <TableCell align="right">{adjustedRevenue}</TableCell>
        <TableCell align="right">{row.targetRevenue}</TableCell>
        <TableCell align="right">{adjustedRevenue - row.targetRevenue}</TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function TotalsRow(props) {

  let sums = new Sums()

  props.segments.forEach(segment => {
    let revenueData = getRelevantSegmentData(props.accountData, 
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
