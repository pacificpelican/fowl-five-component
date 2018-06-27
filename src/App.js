import React, { Component } from 'react';

import getFowlFiveIndexV1 from 'fowlfive';
import styled from 'styled-components';

//  fowlfive.js crypto calulation component by Dan McKeown copyright 2018
//  http://danmckeown.info

//  import './App.css'; Local CSS deprecated - using styled-components

const Fowlcomponentdiv = styled.div`
border-style: none;
width: 18vw;
background-color: #4c8df7;
`;

const Fowlcontainer = styled.div`
  padding-left: 0.2em;
  border-style: dotted;
  width: 20vw;
  background-color: #4c8df7;
`;

const Fowltotalspan = styled.span`
  font-size: 18px;
  font-family: "Hack", "Fira Code", "Menlo", monospace;
  color: FloralWhite;
`;

const Ffheadspan = styled.span`
  font-size: 20px;
  font-family: "Lucida Grande", "Helvetica", "Roboto", "Ubuntu Sans", sans-serif;
  color: AliceBlue;
  text-decoration: none;
`

const Creatorcreditspan = styled.span`
  font-size: 14px;
  font-family: "Opens Sans", "Roboto", "Ubuntu Sans", "Helvetica", sans-serif;
  color: Gainsboro;
`;

const Creatorcreditspana = styled.a`
  font-size: 14px;
  font-family: "Opens Sans", "Roboto", "Ubuntu Sans", "Helvetica", sans-serif;
  color: Gainsboro;
`;

const Ffaboutspan = styled.span`
  margin-left: 0.6em;
  font-size: 10px;
  color: silver;
`;

const Ffaboutspana = styled.a`
  margin-left: 0.6em;
  font-size: 10px;
  color: silver;
`;

const Sourcecspan = styled.span`
  font-size: 12px;
  color: darkgray;
`;

const Sourcecspana = styled.span`
  font-size: 12px;
  color: darkgray;
`;

const cryptoURLbase = "https://api.coinmarketcap.com/v2/"; //  this is the URL for the CoinMarketCap API server
const cryptoURLExt = "ticker/";

const dataSource = "CoinMarketCap";
const dataSourceWebUrl = "https://" + dataSource + ".com";

const cryptoURLformat = cryptoURLbase + cryptoURLExt;

class crypto {
  constructor(name, price, cap) {
    this.name = name;
    this.price = price;
    this.cap = cap;
  }
}

var bitcoinP = new crypto();
var ethP = new crypto();
var bchP = new crypto();
var ltcP = new crypto();
var dshP = new crypto();

let totalCap = 0;
let totalPrice = 0;

var capLimit = 0;
var priceStandard = 0;
let subAmount = 0;
let runningTotal = 0;
let subAmountArray = [];
let refAmtTotal = 0;
var localRebasedPriceRatioTotal = 0;
let priceTotal = 0;

var adjustedLocalRebasedPriceRatioTotal = localRebasedPriceRatioTotal * 1000;
var fowlFiveIndex = adjustedLocalRebasedPriceRatioTotal;

let forCount = 0;

class App extends Component {
  state = { Ok: true, marketCapTotal: 0, cryptoValTotal: 0, pricesAndCaps: [] };

  constructor() {
    super();
  }

  getCryptoData(crypto) {
    let dest = cryptoURLbase + cryptoURLExt + crypto + "/";
    let that = this;
    let ret = [];

    fetch(dest, {})
      .then(function (response) {
        if (response.ok) {
          console.log("response ok");
          console.log(response.json);
          for (var e in response.json) {
            console.log(e.toString());
          }
          console.log(response.text);
          return response.json();
        }
        throw new Error("Network did not respond.");
        return response.blob();
      })
      .then(function (myReturn) {
        console.log(myReturn);
        let cryptoValSubTotal = myReturn.data.quotes.USD.price;
        let marketCapSubTotal = myReturn.data.quotes.USD.market_cap;
        console.log(
          "market cap: " + marketCapSubTotal + " | price: " + cryptoValSubTotal
        );
        ret = [marketCapSubTotal, cryptoValSubTotal];
        let oldArr = that.state.pricesAndCaps;
        console.log("adding " + ret + " to " + oldArr);
        ret.push(myReturn.data.name.toLowerCase());

        oldArr[oldArr.length] = ret;
        that.setState({ pricesAndCaps: oldArr });
      });
  }

  buildTuples(reducedArray, iteratorCount) {
    console.log("current buildTuples iteration: " + reducedArray);
    let outCount = 0;
    let retArray = [];
    let mutableArray = [];
    for (let i = 0; i < reducedArray.length; i++) {
      console.log("__tuple state:");
      console.log(i, outCount, iteratorCount, reducedArray[i]);
      if (reducedArray[i][2] === "bitcoin") {
        bitcoinP.cap = reducedArray[i][0];
        bitcoinP.price = reducedArray[i][1];
        bitcoinP.name = reducedArray[i][2];
      }
      if (reducedArray[i][2] === "ethereum") {
        ethP.cap = reducedArray[i][0];
        ethP.price = reducedArray[i][1];
        ethP.name = reducedArray[i][2];
      }
      if (reducedArray[i][2] === "bitcoin cash") {
        bchP.cap = reducedArray[i][0];
        bchP.price = reducedArray[i][1];
        bchP.name = reducedArray[i][2];
      }
      if (reducedArray[i][2] === "litecoin") {
        ltcP.cap = reducedArray[i][0];
        ltcP.price = reducedArray[i][1];
        ltcP.name = reducedArray[i][2];
      }
      if (reducedArray[i][2] === "dash") {
        dshP.cap = reducedArray[i][0];
        dshP.price = reducedArray[i][1];
        dshP.name = reducedArray[i][2];
      }

      if (outCount % iteratorCount !== 0) {
        mutableArray.push(reducedArray[i]);
      } else {
        retArray.push(mutableArray);
        console.log("^^^ adding " + mutableArray + " to " + retArray);
        mutableArray = [];
      }
      outCount++;
    }
    return retArray;
  }

  processCoinTuple(bitcoinTuple) {
    console.log(
      "running processCoinTuple wih " +
      bitcoinTuple[2] +
      " at forCount:" +
      forCount
    );
    if (capLimit < bitcoinTuple[0]) {
      capLimit = bitcoinTuple[0];
    }
    if (priceStandard < bitcoinTuple[1]) {
      priceStandard = bitcoinTuple[1];
    }

    totalCap = totalCap + bitcoinTuple[0];
    totalPrice = totalPrice + bitcoinTuple[1];
    let localPriceCapRatio = totalPrice / totalCap;
    console.log("#local Price Cap Ratio: " + localPriceCapRatio);

    priceTotal = priceTotal + bitcoinTuple[1];

    let localCapPercentage = bitcoinTuple[0] / capLimit;
    console.log("#local cap percentage: " + localCapPercentage);
    subAmount = localCapPercentage * bitcoinTuple[1];
    let localRebasedPriceRatio = bitcoinTuple[1] / priceStandard;
    let localRebasedPrice =
      bitcoinTuple[1] *
      (localRebasedPriceRatio * bitcoinTuple[0]) /
      10000000000;
    console.log("#local Rebased Price Ratio: " + localRebasedPriceRatio);
    if (localRebasedPriceRatio !== 1) {
      console.log(
        "adding " +
        localRebasedPriceRatio +
        " to localRebasedPriceRatioTotal " +
        localRebasedPriceRatioTotal
      );
      localRebasedPriceRatioTotal =
        localRebasedPriceRatioTotal + localRebasedPriceRatio;
    } else {
      localRebasedPriceRatioTotal =
        localRebasedPriceRatioTotal + bitcoinTuple[1] / 10000;
    }

    console.log("#local Rebased Price: &&&&&  " + localRebasedPrice);

    let refAmt = localCapPercentage * localRebasedPrice;
    console.log("#refAmt: " + refAmt);
    refAmtTotal = refAmtTotal + refAmt;

    let localBTCbasis = bitcoinTuple[1] / priceStandard;
    console.log("#localBTCbasis: " + localBTCbasis);
    let localAdjustedRebasedPrice = bitcoinTuple[1] / localBTCbasis; //  this acts like a checksum
    console.log("#localAdjustedRebasedPrice: " + localAdjustedRebasedPrice);
    let adjustedFowlTotal = localAdjustedRebasedPrice * localRebasedPriceRatio;
    console.log("#adjustedFowlTotal: " + adjustedFowlTotal);

    subAmountArray.push(subAmount);

    runningTotal = localRebasedPrice / 100 + runningTotal;
    console.log("#current running total: " + runningTotal);
    console.log("#ref amt total: " + refAmtTotal);
    console.log(
      localRebasedPriceRatio,
      adjustedFowlTotal,
      runningTotal,
      refAmtTotal
    );
    return [
      localRebasedPriceRatio,
      adjustedFowlTotal,
      runningTotal,
      refAmtTotal
    ];
  }

  componentWillMount() { }
  componentDidMount() {
    const fetch = window.fetch;

    const obvParam = this.props.cryptocurrency;

    var that = this;
    let dest = cryptoURLformat + obvParam + "/";

    var abitcoinArry = this.getCryptoData(1);   //  bitcoin
    var ethereumArray = this.getCryptoData(1027); //  ethereum
    var bitcoincashArray = this.getCryptoData(1831);  //  bitcoin-cash
    var litecoinArray = this.getCryptoData(2);  //  litecoin
    var dashArray = this.getCryptoData(131);  //  dash
  }
  render() {
    console.log("CryptoCoins array (of arrays)--: " + this.state.pricesAndCaps);
    console.log("array 0--: " + this.state.pricesAndCaps[0]);
    console.log("array 1--: " + this.state.pricesAndCaps[1]);
    console.log(
      "CryptoCoins array (of arrays) length: " + this.state.pricesAndCaps.length
    );

    var bitcoinData,
      ethereumData,
      bitcoincashData,
      litecoinData,
      dashData = [];

    var globalLocalRebasedPriceRatio = 0;

    let iterArray = this.state.pricesAndCaps;

    const repackedData = this.buildTuples(iterArray, 3);

    for (let i = 0; i < iterArray.length; i++) {
      console.log("forCount:" + forCount);
      forCount++;
      console.log("------name-" + iterArray[i][2]);
      console.log("------cap-" + iterArray[i][0]);
      console.log("------price-" + iterArray[i][1]);
      if (this.state.pricesAndCaps[i][2] === "bitcoin") {
        let bitcoinTuple = this.state.pricesAndCaps[i];
        //   bitcoinTuple[1] = 20000; //  literal price data can be injected like this in testing
        bitcoinData = this.processCoinTuple(bitcoinTuple);
        globalLocalRebasedPriceRatio =
          globalLocalRebasedPriceRatio + bitcoinData[0];
      } else if (this.state.pricesAndCaps[i][2] === "ethereum") {
        let ethereumTuple = this.state.pricesAndCaps[i];
        ethereumData = this.processCoinTuple(ethereumTuple);
        globalLocalRebasedPriceRatio =
          globalLocalRebasedPriceRatio + ethereumData[0];
      } else if (this.state.pricesAndCaps[i][2] === "bitcoin-cash") {
        let thiscoinTuple = this.state.pricesAndCaps[i];
        bitcoincashData = this.processCoinTuple(thiscoinTuple);
        globalLocalRebasedPriceRatio =
          globalLocalRebasedPriceRatio + bitcoincashData[0];
      } else if (this.state.pricesAndCaps[i][2] === "litecoin") {
        let thiscoinTuple = this.state.pricesAndCaps[i];
        litecoinData = this.processCoinTuple(thiscoinTuple);
        globalLocalRebasedPriceRatio =
          globalLocalRebasedPriceRatio + litecoinData[0];
      } else if (this.state.pricesAndCaps[i][2] === "dash") {
        let thiscoinTuple = this.state.pricesAndCaps[i];
        dashData = this.processCoinTuple(thiscoinTuple);
        globalLocalRebasedPriceRatio =
          globalLocalRebasedPriceRatio + dashData[0];
      }
    }

    adjustedLocalRebasedPriceRatioTotal = globalLocalRebasedPriceRatio * 1000;
    fowlFiveIndex = adjustedLocalRebasedPriceRatioTotal;

    console.log("**FOWL FIVE INDEX: " + fowlFiveIndex);
    console.log("bitcoinP.name is " + bitcoinP.name);
    console.log("ethP.name is " + ethP.name);
    console.log("bchP.id is " + bchP.id);
    console.log("ltcP.name is " + ltcP.name);
    console.log("dshP.name is " + dshP.name);

    var ffindex = getFowlFiveIndexV1(bitcoinP, ethP, bchP, ltcP, dshP);
    console.log("ffindex calculated by function: " + ffindex);

    return (
      <Fowlcontainer>
        <Ffheadspan>
          Fowl Five Index
        </Ffheadspan>
        <Ffaboutspan>
          <Ffaboutspana href="https://djmblog.com/page/Fowl-Five-Index">about</Ffaboutspana>
        </Ffaboutspan>
        <br />
        <Creatorcreditspan>
          by <Creatorcreditspana href="http://danmckeown.info">Dan McKeown</Creatorcreditspana>
        </Creatorcreditspan>
        <Fowlcomponentdiv>
          <span id="info" />
          <Fowltotalspan>{ffindex.toFixed(4)}</Fowltotalspan>
        </Fowlcomponentdiv>
        <aside id="sourceInfo">
          <Sourcecspan>price data via <Sourcecspana href={dataSourceWebUrl}>{dataSource}</Sourcecspana></Sourcecspan>
        </aside>
       
      </Fowlcontainer>
    );
  }
}

export default App;
