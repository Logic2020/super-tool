import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import ModelingTabs from './ModelingTabs';
import {TabPanel,a11yProps} from './TabPanel'
import {getMonthYears} from './Data'

export default function DateTabs(props) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
          <ModelingTabs key={props.segments} 
                      monthYear={monthYear} 
                      accountData={props.accountData} 
                      segments={props.segments} 
                      salesperson={props.salesperson}
                      effectiveDate={props.effectiveDate}
                      practice={props.practice} 
                      setTrigger={props.setTrigger} />
        </TabPanel>
      ))}
    </Box>
  );
}
