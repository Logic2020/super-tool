import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Slider from '@mui/material/Slider';
import { useTheme } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

function EffectiveDate(props) {

  return (
    <Box sx={{ minWidth: 150 }}>
      <FormControl fullWidth>
        <InputLabel id="effective-date-label">Effective Date</InputLabel>
        <Select
          labelId="effective-date-label"
          id="effective-date"
          value={props.value}
          label="Effective Date"
          onChange={props.changer}
        >
          {props.allEffectiveDates.map(effectiveDate => (
              <MenuItem value={effectiveDate}>{effectiveDate}</MenuItem>
            ))}
        </Select>
      </FormControl>
    </Box>
  );
}

function PracticeArea(props) {

  return (
    <Box sx={{ minWidth: 150 }}>
      <FormControl fullWidth>
        <InputLabel id="practice-label">Practice</InputLabel>
        <Select
          labelId="practice-label"
          id="practice"
          label="Practice"
          onChange={props.changer}
          value={props.value}
        >
          <MenuItem value=""><em>None</em></MenuItem>
          {props.allPracticeAreas.map(practiceArea => (
              <MenuItem value={practiceArea}>{practiceArea}</MenuItem>
            ))}
        </Select>
      </FormControl>
    </Box>
  );
}

function Salesperson(props) {

  return (
    <Box sx={{ minWidth: 150 }}>
      <FormControl fullWidth>
        <InputLabel id="salesperson-label">Salesperson</InputLabel>
        <Select
          labelId="salesperson-label"
          id="salesperson"
          label="Salesperson"
          onChange={props.changer}
          value={props.value}
        >
          <MenuItem value=""><em>None</em></MenuItem>
          {props.allSalespersons.map(salesperson => (
              <MenuItem value={salesperson}>{salesperson}</MenuItem>
            ))}
        </Select>
      </FormControl>
    </Box>
  );
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(segment, segments, theme) {

  return {
    fontWeight:
      segments.indexOf(segment) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightBold,
  };
}

function Segments(props) {

  const theme = useTheme()

  return (
    <Box sx={{ minWidth: 150 }}>
      <FormControl fullWidth>
        <InputLabel id="segmentation-label">Segment</InputLabel>
        <Select
          labelId="segment-label"
          id="segment"
          label="Segment"
          multiple
          onChange={props.changer}
          value={props.value}
          MenuProps={MenuProps}
        >
          {props.allSegments.map((segment) => (
            <MenuItem
              key={segment}
              value={segment}
              style={getStyles(segment, props.value, theme)}
            >
              {segment}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

const marks = [
  {
    value: 0,
    label: '0',
  },
  {
    value: 100,
    label: '100',
  },
];

function valuetext(value) {
  return `${value}%`;
}

function PercentIncrease(props) {
  return (
    <Box sx={{ width: 30 , display: 'inline-block'}}>
      <Slider
        aria-label="Always visible"
        value={props.value}
        defaultValue={props.default}
        getAriaValueText={valuetext}
        step={5}
        marks={marks}
        valueLabelDisplay="auto"
        onChange={props.changer}
      />
    </Box>
  );
}

function MonthYearPicker(props) {

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        views={['year', 'month']}
        label={props.label}
        minDate={props.minDate}
        maxDate={new Date(new Date(props.minDate).setFullYear(props.minDate.getFullYear()+2))}
        value={props.date}
        onChange={(newValue) => {
          props.setDate(newValue);
        }}
        renderInput={(params) => <TextField {...params} helperText={null} />}
      />
    </LocalizationProvider>
  );
}

export {Salesperson,EffectiveDate,Segments,PercentIncrease,MonthYearPicker,PracticeArea}