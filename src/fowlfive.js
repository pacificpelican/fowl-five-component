"use strict";

//  getFowlFiveIndexV1 index.js - ES5 version
//  This is the forumula for calculating the Fowl Five Index of Cryptos
//  http://danmckeown.info/fowlfive
//  copyright Jan-April 2018 by Dan McKeown Licensed under the ISC License
//  This function is published as part of the Paper Umbrella repo:
//  https://github.com/pacificpelican/paper-umbrella/blob/master/pages/fowlfive.js
//  The `...cryptos` argument accepts (five) objects of this shape:
//  Object.assign({"name": "Bitcoin", "price": 8867, "cap": 150689347341})

function getFowlFiveIndexV1() {

  //  expected crypto object parameters: bitcoin, ethereum, bitcoincash, litecoin, dash
  var totalCap = 0;
  var totalPrice = 0;

  for (var _len = arguments.length, cryptos = Array(_len), _key = 0; _key < _len; _key++) {
    cryptos[_key] = arguments[_key];
  }

  var capLimit = cryptos[0].cap; //  assuming for now [0] will be bitcoin
  var priceStandard = cryptos[0].price;
  var subAmount = 0;
  var runningTotal = 0;
  var subAmountArray = [];
  var refAmtTotal = 0;
  var localRebasedPriceRatioTotal = 0;
  var priceTotal = 0;

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = cryptos[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var crypto = _step.value;

      totalCap = totalCap + crypto.cap;
      totalPrice = totalPrice + crypto.price;
      var localPriceCapRatio = totalPrice / totalCap;

      priceTotal = priceTotal + crypto.price;

      var localCapPercentage = crypto.cap / capLimit;
      subAmount = localCapPercentage * crypto.price;
      var localRebasedPriceRatio = crypto.price / priceStandard;
      var localRebasedPrice = crypto.price * (localRebasedPriceRatio * crypto.cap) / 10000000000;
      if (localRebasedPriceRatio !== 1) {
        localRebasedPriceRatioTotal = localRebasedPriceRatioTotal + localRebasedPriceRatio;
      } else {
        localRebasedPriceRatioTotal = localRebasedPriceRatioTotal + crypto.price / 10000;
      }

      var refAmt = localCapPercentage * localRebasedPrice;
      refAmtTotal = refAmtTotal + refAmt;

      var localBTCbasis = crypto.price / cryptos[0].price;
      var localAdjustedRebasedPrice = crypto.price / localBTCbasis; //  this acts like a checksum
      var adjustedFowlTotal = localAdjustedRebasedPrice * localRebasedPriceRatio;

      subAmountArray.push(subAmount);

      runningTotal = localRebasedPrice / 100 + runningTotal;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var adjustedLocalRebasedPriceRatioTotal = localRebasedPriceRatioTotal * 1000;
  var fowlFiveIndex = adjustedLocalRebasedPriceRatioTotal;
  return fowlFiveIndex;
}

module.exports = getFowlFiveIndexV1;