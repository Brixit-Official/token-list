const fs = require('fs');
const bs58 = require('bs58');
const { Connection, Keypair, PublicKey, clusterApiUrl } = require('@solana/web3.js');
const { programs, actions } = require('@metaplex-foundation/mpl-token-metadata');

async function main() {
  // Vul hier je waarden in
  const mintAddress = new PublicKey('<jouw_mint_adres>');
  const metadataUri = 'https://gateway.pinata.cloud/ipfs/<jouw_json_hash>';
  const keypairPath = '<pad_naar_keypair_json>';

  // Lees je keypair in
  const secret = JSON.parse(fs.readFileSync(keypairPath, 'utf8'));
  const keypair = Keypair.fromSecretKey(Buffer.from(secret));

  // Maak verbinding met devnet/mainnet (pas aan indien nodig)
  const connection = new Connection(clusterApiUrl('mainnet-beta'));

  // Update metadata via Metaplex SDK
  await actions.updateMetadata({
    connection,
    wallet: {
      publicKey: keypair.publicKey,
      payer: keypair,
      signTransaction: async (tx) => {
        tx.partialSign(keypair);
        return tx;
      },
      signAllTransactions: async (txs) => {
        txs.forEach(tx => tx.partialSign(keypair));
        return txs;
      }
    },
    metadata: new PublicKey(mintAddress),
    metadataData: {
      uri: metadataUri,
      // Vul eventueel meer metadata velden in als je wil
    }
  });

  console.log('Metadata update verzonden!');
}

main().catch(err => {
  console.error('Fout bij updaten:', err);
});
