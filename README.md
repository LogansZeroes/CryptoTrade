Price Ticker for Cryptocurrencies on Kraken
===========

This uses an asynchronous node js client for the kraken.com API.

Set the time interval and coins to monitor. The app prints out the last trade and any change from previous lows and highs.

It uses the API methods found here: https://www.kraken.com/help/api through the 'api' method:

Example Usage:

```javascript
var KrakenClient = require('kraken-api');
var kraken = new KrakenClient('apiKey', 'apiSecret');

// Display user's balance
kraken.api('Balance', null, function(error, data) {
    if(error) {
        console.log(error);
    }
    else {
        console.log(data.result);
    }
});

// Get Ticker Info
kraken.api('Ticker', {"pair": 'XBTCXLTC'}, function(error, data) {
    if(error) {
        console.log(error);
    }
    else {
        console.log(data.result);
    }
});
```

Credit:

I used the example from https://github.com/nothingisdead/npm-kraken-api