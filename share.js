import { YahooFinanceError } from "./exceptions.js";

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

    async get_historical(period_type, period, frequency_type, frequency) {
        const data = await this._download_symbol_data(period_type, period, frequency_type, frequency);
        //console.log(data);

        const valid_frequency_types = [
            FREQUENCY_TYPE_MINUTE, FREQUENCY_TYPE_HOUR, FREQUENCY_TYPE_DAY,
            FREQUENCY_TYPE_WEEK, FREQUENCY_TYPE_MONTH
        ]

        if (!valid_frequency_types.some(i => i == frequency_type)) {
            throw new Error('Invalid frequency type: ' + frequency_type);
        }

        // for i in range(len(data['timestamp'])):
        //     if i < (len(data['timestamp']) - 1):
        //        print(datetime.datetime.utcfromtimestamp(
        //                data['timestamp'][i + 1]
        //            ).strftime('%Y-%m-%d %H:%M:%S'),
        //            data['timestamp'][i + 1] - data['timestamp'][i]
        //        )

        if (!data.timestamp) {
            return null;
        }

        const return_data = {
            timestamp: data.timestamp.map(x => x * 1000),
            open: data['indicators']['quote'][0]['open'],
            high: data['indicators']['quote'][0]['high'],
            low: data['indicators']['quote'][0]['low'],
            close: data['indicators']['quote'][0]['close'],
            volume: data['indicators']['quote'][0]['volume']
        };

        return return_data;
    }

    _set_time_frame(period_type, period) {
        const now = new Date().getTime() / 1000;
        let start_time;

        const timedelta = (days) => days * 24 * 60 * 60;

        if (period_type == PERIOD_TYPE_DAY) {
            period = Math.min(period, 59);
            start_time = now - timedelta(period);
        } else if (period_type == PERIOD_TYPE_WEEK) {
            period = min(period, 59);
            start_time = now - timedelta(period * 7);
        } else if (period_type == PERIOD_TYPE_MONTH) {
            period = min(period, 59); // why 59?
            start_time = now - timedelta(period * 30); // 30 fixed??
        } else if (period_type == PERIOD_TYPE_YEAR) {
            period = min(period, 59); // why 59?
            start_time = now - timedelta(period * 365); // 365 fixed??
        } else {
            throw new Error('Invalid period type: ' + period_type);
        }

        const end_time = now

        return [Math.floor(start_time), Math.floor(end_time)];
    }

    async _download_symbol_data(period_type, period, frequency_type, frequency) {
        const interval = this._frequency_str(frequency_type, frequency);
        const [start_time, end_time] = this._set_time_frame(period_type, period);
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${this.symbol}?symbol=${this.symbol}` +
            `&period1=${start_time}&period2=${end_time}&interval=${interval}&` +
            `includePrePost=true&events=div%7Csplit%7Cearn&lang=en-US&` +
            `region=US&crumb=t5QZMhgytYZ&corsDomain=finance.yahoo.com`;

        const resp_json = await (await fetch(url)).json();

        if (this._is_yf_response_error(resp_json)) {
            this._raise_yf_response_error(resp_json);
            return;
        }

        const data_json = resp_json.chart.result[0];

        return data_json;
    }

    _is_yf_response_error(resp) {
        return resp.chart.error;
    }

    _raise_yf_response_error(resp) {
        throw new YahooFinanceError(resp.chart.error.code + ": " + resp.chart.error.description);
    }

    _frequency_str(frequency_type, frequency) {
      return frequency + frequency_type;
    }
}
