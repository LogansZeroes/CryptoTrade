var KrakenClient = require('./kraken.js');
var secret = require('./secret.js');
var kraken = new KrakenClient(secret.KEY, secret.SECRET);
var ETHPAIR = 'XETHXXBT'
var XRPPAIR = 'XXRPXXBT';
var XLMPAIR = 'XXLMXXBT';
var GNOPAIR = 'GNOXBT';
var BITCOINPAIR = "XXBTZUSD";
var BITCOINPRICE;
var ETH = XRP = XLM = GNO = {"crypto" : 0, "usd" : 100};
var ALLPAIRS = "XETHXXBT,XXRPXXBT,XXLMXXBT,GNOXBT";
var numTrades = 0;
var startTime = Date.now();
var timeInterval = 1000;
var maTime = 1000 * 60 * 60;
var MA = require('moving-average');
var ma = MA(maTime);

// Display user's balance
// kraken.api('TradesHistory', null, function(error, data) {
//     if(error) {
//         console.log(error);
//     }
//     else {
//         console.log(data.result);
//     }
// });

var ethLow,ethHigh,xrpLow,xrpHigh,xlmLow,xlmHigh,gnoLow,gnoHigh;

var init = function (){
	// Get tickers' info
	kraken.api('Trades', {"pair": GNOPAIR, "since": "OGS6HI-YJGUQ-TNMALW"}, function(error, data) {
	    if(error) {
	        console.log(error);
	    }
	    else {
	    	console.log('********************   BEGIN   ***********************');
	    	// console.log(data.result)
	    	// ethLow = ethHigh = parseFloat(data.result[ETHPAIR]["c"][0]);
	    	// gnoLow = gnoHigh = parseFloat(data.result[GNOPAIR]["c"][0]);
	    	// xrpLow = xrpHigh = data.result[XRPPAIR]["c"][0];
	    	// xlmLow = xlmHigh = data.result[XLMPAIR]["c"][0];
	    	// Set starting amount of eth, xrp, xlm
	    	// data.result["GNOXBT"].forEach(function(e){
	    	// 	console.log(e);
	    	// })
	    	console.log(data.result["GNOXBT"][data.result["GNOXBT"].length-1][2])
	    	console.log(data.result["GNOXBT"][0][2])
	    	console.log(data.result["GNOXBT"][data.result["GNOXBT"].length-1][2] - data.result["GNOXBT"][0][2])
	    	console.log(Date.now()/1000)

			// console.log(data.result["GNOXBT"]);
			runTicker();
	    }
	});

	// kraken.api('ClosedOrders', null, function(error, data) {
	//     if(error) {
	//         console.log(error);
	//     }
	//     else {
	//     	console.log('********************   BEGIN   ***********************');
	//     	// console.log(data.result)
	//     	// ethLow = ethHigh = parseFloat(data.result[ETHPAIR]["c"][0]);
	//     	// gnoLow = gnoHigh = parseFloat(data.result[GNOPAIR]["c"][0]);
	//     	// xrpLow = xrpHigh = data.result[XRPPAIR]["c"][0];
	//     	// xlmLow = xlmHigh = data.result[XLMPAIR]["c"][0];
	//     	// Set starting amount of eth, xrp, xlm
	//     	// data.result["GNOXBT"].forEach(function(e){
	//     	// 	console.log(e);
	//     	// })
	//     	console.log(data.result);
	//     	// console.log(data.result["GNOXBT"][0][2])
	//     	// console.log(data.result["GNOXBT"][data.result["GNOXBT"].length-1][2] - data.result["GNOXBT"][0][2])
	//     	var timee = new Date().getTime();
	//     	console.log(timee/1000)
	// 		// console.log(data.result["GNOXBT"]);
	//     }
	// });
	

	//run crypto price ticker
	var runTicker = function(){
		setInterval(function(){
			// Get Ticker Info
			kraken.api('Ticker', {"pair": ALLPAIRS}, function(error, data) {
			    if(error) {
			        console.log(error);
			    }
			    else {
			    	// var ethPrice = data.result[ETHPAIR]["c"][0];
			    	var gnoPrice = data.result[GNOPAIR]["c"][0];
			    	// var xlmPrice = data.result[XLMPAIR]["c"][0];
			    	// var xrpPrice = data.result[XRPPAIR]["c"][0];
			    	console.log('********************' + new Date().getTime() + '***********************')
			        console.log("************ GNO at $", gnoPrice);
			        // console.log("************ XLM at $", xlmPrice);
			        // console.log("************ XRP at $", xrpPrice);
			    	// Get Ticker Info
					kraken.api('Ticker', {"pair": BITCOINPAIR}, function(error, data) {
					    if(error) {
					        console.log(error);
					    }
					    else {
					    	BITCOINPRICE = data.result[BITCOINPAIR]["c"][0];
					    	// console.log('set btc price at $' + BITCOINPRICE);

					    	if (gnoLow > gnoPrice){
					    		if((gnoLow-gnoPrice)/gnoLow > 0.05 && GNO["usd"] == 0){
					    			GNO["usd"] = GNO["crypto"] * gnoPrice * BITCOINPRICE;
						        	GNO["crypto"] = 0;
						        	gnoLow = gnoPrice;
						    		var percentDiff = (gnoLow-gnoPrice)/gnoLow;
					    			var dollarDiff = (gnoLow-gnoPrice) * BITCOINPRICE;
						    		console.log("PRICE WAS LOWER BY " + percentDiff*100 + "%")
						        	console.log("DIFFERENCE WAS $" + dollarDiff);
					    			numTrades++;
					    		}
					    		ethHigh = gnoPrice;
					    	// if (gnoLow > gnoPrice && (gnoLow-gnoPrice)/gnoLow >= 0.001){
					    	}
					    	else if(gnoHigh < gnoPrice){
					    		if((gnoPrice-gnoHigh)/gnoHigh > 0.05 && GNO["crypto"] == 0){
									GNO["crypto"] = GNO["usd"] / (BITCOINPRICE * gnoPrice);
						        	GNO["usd"] = 0;
						        	gnoHigh = gnoPrice;
						    		var percentDiff = (gnoPrice-gnoHigh)/gnoHigh;
						    		var dollarDiff = (gnoPrice-gnoHigh) * BITCOINPRICE;
						    		console.log("PRICE WAS HIGHER BY " + percentDiff*100 + "%")
						        	console.log("DIFFERENCE WAS $" + dollarDiff);
					    			numTrades++;
					    		}
					    		gnoLow = gnoPrice;
					    	// else if(ethHigh < ethPrice && (ethPrice-ethHigh)/ethHigh >= 0.001){
					    	}
			    			console.log(GNO);
			    			console.log("net worth: ", GNO["crypto"] * gnoPrice * BITCOINPRICE + GNO["usd"])
			    			console.log("num trades = " + numTrades);
			    			console.log("time lapsed =", new Date().getTime()/1000 - startTime/1000 );
			    			ma.push(Date.now(), gnoPrice);
							console.log('moving average now is', ma.movingAverage());
							console.log('moving variance now is', ma.variance());
					    }
					});

			    }
			});
		}, timeInterval);
		// }, 1000);
		// }, 3600000);
	}
}

init();