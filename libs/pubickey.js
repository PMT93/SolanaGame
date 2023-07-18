const solanaWeb3 = require("@solana/web3.js");

function check(pb) {
    try {
        new solanaWeb3.PublicKey(pb);
        return true
    }
    catch (e) {
        return false;
    }
}
module.exports = {
    check,
  };