import { format, parseISO } from "date-fns";
import { enGB } from "date-fns/locale";

export const toLocaleDateTimeString = (date: Date | string | undefined) => {
    if (!date) return '';
    if (typeof date === 'string') date = new Date(date);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

export const toLocaleDateString = (date: Date | string | undefined) => {
    if (!date) return '';
    if (typeof date === 'string') date = new Date(date);
    return date.toLocaleDateString();
}

export const toLocaleTimeString = (date: Date | string | undefined) => {
    if (!date) return '';
    if (typeof date === 'string') date = new Date(date);
    return date.toLocaleTimeString();
}

export const timeSince = (dateStr: string) => {
    const date = new Date(dateStr);
    const seconds = Math.floor((+new Date() - +date) / 1000);
  
    let interval = seconds / 31536000;
  
    const shouldShowDate = seconds > 4 * 60 * 60 * 24;
    if (shouldShowDate) {
      return dateFormat(dateStr);
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + "d";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + "h";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + "m";
    }
    return Math.floor(seconds) + "s";
  };
  
  export const dateFormat = function (date, formatStr = "P") {
    try {
      return format(parseISO(date), formatStr, {
        locale: enGB, // or global.__localeId__
      });
    } catch (e) {
      return "-";
    }
  };