import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import ReportTabs from './ReportTabs';
import {TabPanel,a11yProps} from './TabPanel'

export default function DateTabs(props) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function getMonthYears(startDateTime, stopDateTime) {
    let monthYearDateTimeArray = [];
    let currentDateTime = new Date(startDateTime);
    while (currentDateTime <= stopDateTime) {
      monthYearDateTimeArray.push(new Date(currentDateTime));
      currentDateTime = new Date(currentDateTime.setMonth(currentDateTime.getMonth()+1));
    }

    // reduce month array to strings 
    return monthYearDateTimeArray.map((item) => {
      return `${item.toLocaleString('default', { month: 'short' })} ${item.getFullYear()}`
    });
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="inner-tabs">
          {getMonthYears(props.startDate,props.endDate).map((monthYear, index) => (
              <Tab key={monthYear} label={monthYear} {...a11yProps(index)}/>
            ))}          
        </Tabs>
      </Box>
      {getMonthYears(props.startDate,props.endDate).map((monthYear, index) => (
        <TabPanel key={monthYear} value={value} index={index}>
          <ReportTabs key={props.segments} 
                      monthYear={monthYear} 
                      accountData={props.accountData} 
                      segments={props.segments} 
                      salesperson={props.salesperson}
                      effectiveDate={props.effectiveDate}
                      practice={props.practice} />
        </TabPanel>
      ))}
    </Box>
  );
}
