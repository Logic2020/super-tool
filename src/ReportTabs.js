import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import SummaryReport from './Report';
import {TabPanel,a11yProps} from './TabPanel'

export default function ReportTabs(props) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="inner-tabs">
          <Tab label="By Revenue" {...a11yProps(0)} />
          <Tab label="By Margin%" {...a11yProps(1)} />
          <Tab label="By Margin" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <SummaryReport segments={props.segments} 
                       salesperson={props.salesperson} 
                       accountData={props.accountData}
                       monthYear={props.monthYear}
                       effectiveDate={props.effectiveDate}
                       practice={props.practice}/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        TBD
      </TabPanel>
      <TabPanel value={value} index={2}>
        TBD
      </TabPanel>
    </Box>
  );
}
