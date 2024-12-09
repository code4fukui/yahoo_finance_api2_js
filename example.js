import * as share from "./yahoo_finance_api2/share.js";

const my_share = new share.Share('NBR');
let symbol_data = null;

try {
    symbol_data = my_share.get_historical(share.PERIOD_TYPE_DAY,
                                          10,
                                          share.FREQUENCY_TYPE_MINUTE,
                                          5);
} catch (e) {
    console.log(e.message);
    Deno.exit(1);
}
console.log(JSON.stringify(symbol_data, null, 2));
