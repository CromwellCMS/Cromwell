import { GlobalStylesProps as StyledGlobalStylesProps } from '@mui/system';
import { getPalette } from '@helpers/getPalette';
import { alpha, SimplePaletteColorOptions } from '@mui/material';

export const getGlobalStyles: () => StyledGlobalStylesProps['styles'] = () => {
  const palette = getPalette();
  const mainColor = (palette.primary as SimplePaletteColorOptions).main;

  return {
    '.RsuiteDateRangePicker': {
      '--rs-picker-value': 'rgba(0, 0, 0, 0.87)',
      '--rs-input-focus-border': mainColor,
      '--rs-btn-primary-bg': mainColor,
      '--rs-btn-primary-hover-bg': mainColor,
      '--rs-btn-primary-active-bg': mainColor,
      '--rs-btn-link-text': mainColor,
      '--rs-bg-active': mainColor,
      '--rs-text-active': mainColor,
      '--rs-btn-link-hover-text': mainColor,
      '--rs-listbox-option-hover-text': mainColor,
      '--rs-listbox-option-hover-bg': alpha(mainColor, 0.4),
      '--rs-calendar-range-bg': alpha(mainColor, 0.2),
      '--rs-state-focus-shadow': 'none',
      '--rs-border-primary': '#babdce',
      '--rs-shadow-overlay': '0px 0px 20px 0px rgb(114 120 136 / 30%)',
      fontFamily: '"Roboto", sans-serif;',
    },
    '.RsuiteDateRangePicker  .rs-btn-primary': {
      backgroundColor: mainColor,
    },
    '.RsuiteDateRangePicker .rs-picker-menu': {
      borderRadius: '20px',
    },
    '.RsuiteDateRangePicker .rs-picker-default .rs-picker-toggle': {
      margin: '1px',
    },
    '.RsuiteDateRangePicker .rs-picker-default .rs-picker-toggle.rs-picker-toggle-active': {
      margin: '0px',
      borderWidth: '2px',
    },
    '.RsuiteDateRangePicker .rs-picker-default .rs-picker-toggle.rs-btn': {
      paddingTop: '0.5rem',
      paddingBottom: '0.5rem',
      borderRadius: '8px !important',
    },
    // '.RsuiteDateRangePicker .rs-picker-daterange .rs-picker-toggle.rs-btn .rs-picker-toggle-caret, .RsuiteDateRangePicker .rs-picker-daterange .rs-picker-toggle.rs-btn .rs-picker-toggle-clean':
    //   {
    //     height: '32px',
    //     fontSize: '14px',
    //   },
    '.RsuiteDateRangePicker .rs-picker-daterange .rs-picker-toggle.rs-btn .rs-picker-toggle-clean': {
      marginRight: '3px',
    },
    '.RsuiteDateRangePicker .rs-picker-daterange-predefined': {
      border: 0,
    },
    '.RsuiteDateRangePicker .rs-picker-daterange-header': {
      padding: '14px 18px',
      fontSize: '16px',
    },
    '.RsuiteDateRangePicker .rs-calendar-table-cell-content, .RsuiteDateRangePicker .rs-calendar-header-title': {
      fontSize: '14px',
    },
    '.RsuiteDateRangePicker .rs-calendar-header-title': {
      marginTop: '3px',
    },
    '.RsuiteDateRangePicker .rs-calendar-header-month-toolbar': {
      marginBottom: '5px',
    },
    '.RsuiteDateRangePicker .rs-picker-daterange-menu .rs-calendar, .RsuiteDateRangePicker .rs-picker-daterange-calendar-group':
      {
        height: '315px',
      },
    '.RsuiteDateRangePicker .rs-picker-daterange-calendar-group': {
      display: 'flex',
    },
    '.RsuiteDateRangePicker .rs-calendar-table-cell-in-range:before': {
      height: '29px',
    },
    '.RsuiteDateRangePicker .rs-picker-menu .rs-calendar .rs-calendar-table-cell-content': {
      width: '35px',
      height: '35px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    '.RsuiteDateRangePicker .rs-btn-icon.rs-btn-xs>.rs-icon': {
      fontSize: '16px',
    },
    '.RsuiteDateRangePicker .rs-picker-toggle-clean:hover': {
      color: 'var(--rs-btn-link-hover-text)',
    },
    '.RsuiteDateRangePicker .rs-picker-toggle-value, .RsuiteDateRangePicker .rs-picker-toggle-textbox': {
      fontSize: '0.875rem',
    },
    '.RsuiteDateRangePicker .rs-picker-menu .rs-calendar .rs-calendar-month-dropdown-scroll': {
      height: '270px',
    },
  };
};
