const solanaWeb3 = require("@solana/web3.js");
const bs58 = require("bs58");

async function transferSOLToken(recipientPublicKeyString, amount) {
  try {
    // Connect to the network provider
    const connection = new solanaWeb3.Connection(
      solanaWeb3.clusterApiUrl("devnet")
    );
    // Load your wallet

    const senderPrivatekey = bs58.decode(
      "4K58LGorRhKfuLrFAFNCaA274eC5uyuMNDH4Ak8XzR7P"
    );
    const senderKeypair = solanaWeb3.Keypair.fromSecretKey(senderPrivatekey);

    // Public key of the recipient
    const recipientPublicKey = new solanaWeb3.PublicKey(
      recipientPublicKeyString
    );

    //
    // Amount of tokens to send
    const lamportsToSend = amount * solanaWeb3.LAMPORTS_PER_SOL;

    // Create a token transfer transaction
    const transaction = new solanaWeb3.Transaction().add(
      solanaWeb3.SystemProgram.transfer({
        fromPubkey: senderKeypair.publicKey,
        toPubkey: recipientPublicKey,
        lamports: lamportsToSend,
      })
    );
    transaction.feePayer = senderKeypair.publicKey;
    transaction.recentBlockhash = (
      await connection.getRecentBlockhash()
    ).blockhash;
    transaction.sign(senderKeypair);

    // Sign and send the transaction
    const signature = await solanaWeb3.sendAndConfirmTransaction(
      connection,
      transaction,
      [senderKeypair]
    );
    console.log("Transaction successful!", lamportsToSend);
    return signature;
  } catch (e) {
    return false;
  }
}

module.exports = {
  transferSOLToken,
};
