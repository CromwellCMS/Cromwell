import { getCStore } from '@cromwell/core-frontend';
import React from 'react';
import { NumericFormat } from 'react-number-format';

export interface NumberFormatCustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

export const NumberFormatCustom = React.forwardRef<typeof NumericFormat, NumberFormatCustomProps>(
  function NumberFormatCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator
        prefix={getCStore().getActiveCurrencySymbol()}
      />
    );
  },
);
