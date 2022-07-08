import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Salesperson,Segments,MonthYearPicker,EffectiveDate,PracticeArea} from './Inputs';
import DateTabs from './DateTabs';
import {TabPanel,a11yProps} from './TabPanel'
import RawDataTable from "./components/RawDataTable";
import SummaryView from "./components/Summary";
import {getLatestDate} from "./Data"
import {AdjustmentSummary} from "./components/AdjustmentSummary";

export default function OuterTabs(props) {

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // for segments pick list
  const [segments, setSegments] = React.useState([]);

  const handleSegmentChange = (event) => {
    const {
      target: { value },
    } = event;
    setSegments(value);
  };

  // for salesperson pick
  const [salesperson, setSalesperson] = React.useState('');

  const handleSalespersonChange = (event) => {
    setSalesperson(event.target.value);
  };

  // for effective date pick (should default to the latest date available)
  const [effectiveDate, setEffectiveDate] = React.useState(getLatestDate(props.allEffectiveDates));

  const handleEffectiveDateChange = (event) => {
   setEffectiveDate(event.target.value);
  };

  // for practice pick
  const [practice, setPractice] = React.useState('');

  const handlePracticeChange = (event) => {
    setPractice(event.target.value);
  };

  // for date picks
  const [startDate, setStartDate] = React.useState(new Date());

  const handleStartDateChange = (startDate) => {
    setStartDate(startDate);
  };

  const [endDate, setEndDate] = React.useState(new Date());

  const handleEndDateChange = (endDate) => {
    setEndDate(endDate);
  };

  // for triggering refreshes of tabular data based on slider changes
  const [trigger, setTrigger] = React.useState(0); 

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="By Accounts" {...a11yProps(0)} />
          <Tab label="By People" {...a11yProps(1)} />
          <Tab label="Raw Data" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Stack direction="row" spacing={2}>
          <Stack spacing={2}>
            <Segments changer={handleSegmentChange} 
                      value={segments} 
                      allSegments={props.allSegments}/>
            <Salesperson changer={handleSalespersonChange} 
                         value={salesperson}
                         allSalespersons={props.allSalespersons}/>
            <PracticeArea changer={handlePracticeChange} 
                           value={practice}
                           allPracticeAreas={props.allPracticeAreas}/>  
            <EffectiveDate changer={handleEffectiveDateChange} 
                           value={effectiveDate}
                           allEffectiveDates={props.allEffectiveDates}/>        
          </Stack>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
              <MonthYearPicker label="Start Date" date={startDate} setDate={handleStartDateChange} minDate={new Date()}/>
              <MonthYearPicker label="End Date" date={endDate} setDate={handleEndDateChange} minDate={startDate}/>
            </Stack>
            <SummaryView key={props.segments} 
                      accountData={props.accountData} 
                      segments={segments} 
                      salesperson={salesperson}
                      effectiveDate={effectiveDate}
                      practice={practice} 
                      setTrigger={setTrigger}/>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header">
                  <Typography>Adjustments Summary</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <AdjustmentSummary/>
                </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header">
                <Typography>Make Adjustments</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <DateTabs startDate={startDate} 
                        endDate={endDate} 
                        accountData={props.accountData} 
                        segments={segments} 
                        salesperson={salesperson}
                        effectiveDate={effectiveDate}
                        practice={practice} 
                        setTrigger={setTrigger}/>
              </AccordionDetails>
            </Accordion>
          </Stack>
        </Stack>
      </TabPanel>
      <TabPanel value={value} index={1}>
        TBD
      </TabPanel>
      <TabPanel value={value} index={2}>
        <RawDataTable rows={props.accountData} />
      </TabPanel>
    </Box>
  );
}
