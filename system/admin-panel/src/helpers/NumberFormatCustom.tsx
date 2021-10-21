import { getCStore } from '@cromwell/core-frontend';
import React from 'react';
import NumberFormat from 'react-number-format';

export interface NumberFormatCustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}

export const NumberFormatCustom = React.forwardRef<NumberFormat, NumberFormatCustomProps>(
    function NumberFormatCustom(props, ref) {
        const { onChange, ...other } = props;
        return (
            <NumberFormat
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
                isNumericString
                prefix={getCStore().getActiveCurrencySymbol()}
            />
        );
    },
);