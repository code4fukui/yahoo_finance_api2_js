# Yahoo Finance API for Deno/JavaScript

Minimal API to interact with Yahoo Finance for Deno/JavaScript (forked from [pkout/yahoo_finance_api2](https://github.com/pkout/yahoo_finance_api2))

## Usage

The following example retrieves 10 days of 5 minute frequency Microsoft (MSFT) stock data.

```
import * as share from "./yahoo_finance_api2/share.js";

const my_share = new share.Share('NBR');
let symbol_data = null;

try {
    symbol_data = await my_share.get_historical(share.PERIOD_TYPE_DAY,
                                          10,
                                          share.FREQUENCY_TYPE_MINUTE,
                                          5);
} catch (e) {
    console.log(e.message);
    Deno.exit(1);
}
console.log(JSON.stringify(symbol_data, null, 2));
```

The output format:

```
{
  "timestamp": [...],
  "open": [...],
  "high": [...],
  "low": [...],
  "close": [...],
  "adj_close": [...],
  "volume": [...]
}
```

## API

* class `Share`:
  * `get_historical(period_type, period, frequency_type, frequency)`
    * Returns historical data for the given period type (`share.PERIOD_TYPE_DAY`, `share.PERIOD_TYPE_WEEK`, `share.PERIOD_TYPE_MONTH`, `share.PERIOD_TYPE_YEAR`), period (1, 5, 10, etc.), frequency_type (`share.FREQUENCY_TYPE_MINUTE`, `share.FREQUENCY_TYPE_DAY`, `share.FREQUENCY_TYPE_MONTH`, `share.FREQUENCY_TYPE_YEAR`), and frequency (1, 5, 10, etc.). Only certain combinations of these parameters are allowed.
