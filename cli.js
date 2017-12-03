#!/usr/bin/env node
const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2));
const os = require('os');
var Q = require('q');
const moment = require('moment');
const cryptoFetch = require('./index.js');
// cryptocompare api
global.fetch = require('node-fetch');
var cryptocompare = require('cryptocompare');

// parse parameter
var start = argv.start || argv.s;
var end = argv.end || argv.e;
var market = argv.market || argv.m;
var fromsymbol = argv.fromsymbol || argv.f;
var tosymbol = argv.tosymbol || argv.t;
var output = argv.output || argv.o;

// initial parameter
if(fromsymbol == null || tosymbol == null) return console.log("symbol cannot be null");
var startTimestamp = 0;
if(start != null) startTimestamp = moment.utc(start).toDate().getTime();
if(end != null) endTimestamp = moment.utc(end).toDate().getTime();
fromsymbol = fromsymbol.toUpperCase();
tosymbol = tosymbol.toUpperCase();
market = market.toUpperCase();

var params = {
    fromsymbol: fromsymbol,
    tosymbol: tosymbol,
    startTime: startTimestamp,
    endTime: endTimestamp,
    market: market,
    output: output
};

// get historical data
cryptoFetch.getDailyHistoricalPrice(params)
.then(result => {
    var ticket = result.symbol;
    var lines = [];
    for(let data of result.datas) {
        var info = [];
        info.push(ticket);
        info.push(moment.utc(data.date).format("YYYY-MM-DD"));
        info.push(data.open);
        info.push(data.high);
        info.push(data.low);
        info.push(data.close);
        info.push(data.volume);
        var line = info.join(",");
        lines.push(line);
    }
    var resultText = lines.join(os.EOL);
    if(output != null) {
        return fs.writeFileSync(ticket + ".txt", resultText);
    } else return console.log(resultText);
}).catch(err => {
    return console.log(err);
});

/*
function getHistoricalData(fromsymbol, tosymbol, options) {
    var deferred = Q.defer();
    cryptocompare.histoDay(fromsymbol,tosymbol,{limit:'none', allData:false})
      .then(datas => {
        deferred.resolve(datas);
      }).catch(error => {
        deferred.reject(error);
      });
    return deferred.promise;
  }
  */