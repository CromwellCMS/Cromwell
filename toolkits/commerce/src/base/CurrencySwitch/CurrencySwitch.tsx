import { getCmsSettings, TCurrency } from '@cromwell/core';
import { getCStore } from '@cromwell/core-frontend';
import clsx from 'clsx';
import React from 'react';

import { BaseSelect, TBaseSelect } from '../shared/Select';
import styles from './CurrencySwitch.module.scss';

/**
 * Displays select component of all available currencies in the store.
 * Configure currencies in admin panel settings.
 */
export type CurrencySwitchProps = {
  classes?: Partial<Record<'root' | 'select', string>>;

  elements?: {
    Select?: TBaseSelect;
  };
};

export function CurrencySwitch(props: CurrencySwitchProps) {
  const cmsConfig = getCmsSettings();
  const currencies: TCurrency[] | undefined = cmsConfig?.currencies;
  const cstore = getCStore();
  const [currency, setCurrency] = React.useState<string | null | undefined>(cstore.getActiveCurrencyTag());
  const { classes } = props;
  const { Select = BaseSelect } = props.elements ?? {};

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const val = event.target.value as string;
    setCurrency(val);
    cstore.setActiveCurrency(val);
  };

  return (
    <div className={clsx(styles.CurrencySwitch, classes?.root)}>
      {!!currencies?.length && (
        <Select
          value={currency ?? currencies[0]?.tag}
          onChange={(event) => handleCurrencyChange(event)}
          className={clsx(classes?.select)}
          options={currencies.map((currency) => ({
            label: currency.tag,
            value: currency.tag,
          }))}
        />
      )}
    </div>
  );
}
