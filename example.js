import * as share from "./share.js";

const my_share = new share.Share("NBR");
const symbol_data = await my_share.get_historical(
    share.PERIOD_TYPE_DAY,
    10,
    share.FREQUENCY_TYPE_MINUTE,
    5
);
console.log(JSON.stringify(symbol_data, null, 2));
