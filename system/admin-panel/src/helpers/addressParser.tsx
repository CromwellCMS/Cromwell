export const getValueView = (value: any): string => {
  if (!value) return '';
  // Support old and new address format
  let addressJson;
  try {
    addressJson = JSON.parse(value);
  } catch (error) {}
  if (!addressJson) return value;
  let addressStr = '';
  for (const [key, value] of Object.entries(addressJson)) {
    if (!value || !key) continue;
    addressStr += value + ', ';
  }
  return addressStr;
};

export const getTooltipValueView = (value: any): string => {
  if (!value) return '';
  // Support old and new address format
  let addressJson;
  try {
    addressJson = JSON.parse(value);
  } catch (error) {}
  if (!addressJson) return value;
  let addressStr = '';
  for (const [key, value] of Object.entries(addressJson)) {
    if (!value || !key) continue;
    addressStr += `${key}: ${value}\n`;
  }
  return addressStr;
};

/**
 * Support old and new address format
 */
export const parseAddress = (
  address?: string | null,
): {
  addressString?: string;
  addressJson?: Record<string, string>;
} => {
  let addressString;
  let addressJson;
  if (address) {
    try {
      addressJson = JSON.parse(address);
    } catch (error) {}
    if (!addressJson) addressString = address;
    if (addressJson && typeof addressJson !== 'object') {
      addressString = addressJson;
      addressJson = undefined;
    }
  }
  return { addressString, addressJson };
};
