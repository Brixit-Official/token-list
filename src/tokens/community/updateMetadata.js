const fs = require('fs');
const bs58 = require('bs58');
const { Connection, Keypair, PublicKey, clusterApiUrl } = require('@solana/web3.js');
const { programs, actions } = require('@metaplex-foundation/mpl-token-metadata');

async function main() {
  const mintAddress = new PublicKey('FbMR5Le1Dq1paWPDqBGook3BEDsfsnqHzSukXha294KD');
  const metadataUri = 'https://gateway.pinata.cloud/ipfs/'bafkreicp44eoyfvu4gra2ets27dxcja56gn3yrtz7drt2v5nrppussmedq';
  const keypairPath = '/root/.config/solana/id.json';

  const secret = JSON.parse(fs.readFileSync(keypairPath, 'utf8'));
  const keypair = Keypair.fromSecretKey(Buffer.from(secret));

  const connection = new Connection(clusterApiUrl('mainnet-beta'));

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
    }
  });

  console.log('Metadata update verzonden!');
}

main().catch(err => {
  console.error('Fout bij updaten:', err);
});
