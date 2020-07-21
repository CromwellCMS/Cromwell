import { getStoreItem, setStoreItem, isServer } from '@cromwell/core';

export const getPriceWithCurrency = (price: number | undefined | null): string => {
    if (!price) return 'Not available';
    let priceStr = price + '';
    const appConfig = getStoreItem('appConfig');
    const currency = getGlobalCurrency();
    const defaultCurrency = getDafaultCurrency();

    if (currency && defaultCurrency) {

        const priceRatio = appConfig?.currencyRatio;
        if (priceRatio) {
            const convertPrice = (price: number, from: string, to: string) => {
                return (price * (priceRatio[to] / priceRatio[from])).toFixed(2);
            }
            priceStr = convertPrice(price, defaultCurrency, currency);
        }

        const currencySymbols = appConfig?.currencySymbols;
        if (currencySymbols && currencySymbols[currency]) {
            priceStr = currencySymbols[currency] + priceStr;
        }
    }
    return priceStr;
}

export const getGlobalCurrency = (): string | undefined => {
    let currency = getStoreItem('currency');
    if (!currency) {
        let _currency: string | null | undefined = !isServer() ? window.localStorage.getItem('storeCurrency') : null;
        if (!_currency || _currency === "") {
            _currency = getDafaultCurrency();;
        }
        if (_currency) {
            setStoreItem('currency', _currency);
            currency = _currency;
        }
    }
    return currency;
}

export const setGlobalCurrency = (currency: string) => {
    if (currency) {
        setStoreItem('currency', currency);

        if (!isServer()) {
            window.localStorage.setItem('storeCurrency', currency);
        }

        // Re-render page
        const onCurrencyChange = getStoreItem('onCurrencyChange');
        if (onCurrencyChange) onCurrencyChange(currency);

    }
}

export const getDafaultCurrency = (): string | undefined => {
    const appConfig = getStoreItem('appConfig');
    let defaultCurrency;
    if (appConfig && appConfig.currencyOptions && Array.isArray(appConfig.currencyOptions) && appConfig.currencyOptions.length > 0) {
        defaultCurrency = appConfig.currencyOptions[0];
    }
    return defaultCurrency;
}
