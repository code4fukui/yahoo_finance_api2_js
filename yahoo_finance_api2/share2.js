import { YahooFinanceError } from "./excceptions.js";

export const PERIOD_TYPE_DAY = 'day';
export const PERIOD_TYPE_WEEK = 'week';
export const PERIOD_TYPE_MONTH = 'month';
export const PERIOD_TYPE_YEAR = 'year';

// Valid frequencies: [1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo]
export const FREQUENCY_TYPE_MINUTE = 'm';
export const FREQUENCY_TYPE_HOUR = 'h';
export const FREQUENCY_TYPE_DAY = 'd';
export const FREQUENCY_TYPE_WEEK = 'wk';
export const FREQUENCY_TYPE_MONTH = 'mo';

export class Share {
  constructor(symbol) {
    this.symbol = symbol;
  }
  get_historical() {
    return { data: "json"};
  }
}
