import { getStoreItem, setStoreItem, isServer } from '@cromwell/core';

export const getPriceWithCurrency = (price: number | undefined | null): string => {
    if (price === undefined || price === null)
        return '';
        //return 'Not available';
    let priceStr = price + '';
    const cmsconfig = getStoreItem('cmsconfig');
    const currency = getGlobalCurrency();
    const defaultCurrency = getDafaultCurrency();

    if (currency && defaultCurrency) {

        const priceRatio = cmsconfig?.currencyRatio;
        if (priceRatio) {
            const convertPrice = (price: number, from: string, to: string) => {
                return (price * (priceRatio[to] / priceRatio[from])).toFixed(2);
            }
            priceStr = convertPrice(price, defaultCurrency, currency);
        }

        const currencySymbols = cmsconfig?.currencySymbols;
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

export const getGlobalCurrencySymbol = (): string | undefined => {
    let symb;
    const currency = getGlobalCurrency();
    const cmsconfig = getStoreItem('cmsconfig');
    const currencySymbols = cmsconfig?.currencySymbols;
    if (currencySymbols && currency) {
        symb = currencySymbols[currency];
    }
    return symb;
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

const getDafaultCurrency = (): string | undefined => {
    const cmsconfig = getStoreItem('cmsconfig');
    let defaultCurrency;
    if (cmsconfig && cmsconfig.currencyOptions && Array.isArray(cmsconfig.currencyOptions) && cmsconfig.currencyOptions.length > 0) {
        defaultCurrency = cmsconfig.currencyOptions[0];
    }
    return defaultCurrency;
}
