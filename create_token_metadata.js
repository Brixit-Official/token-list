import { Connection, Keypair, clusterApiUrl } from "@solana/web3.js";
import { Metaplex, keypairIdentity } from "@metaplex-foundation/js"; 
import fs from "fs";

// CommonJS fix voor mpl-token-metadata
import pkg from "@metaplex-foundation/mpl-token-metadata";
const { PROGRAM_ID: TOKEN_METADATA_PROGRAM_ID } = pkg;

// --- Config ---
const SOLANA_CLUSTER = "mainnet-beta";
const connection = new Connection(clusterApiUrl(SOLANA_CLUSTER));

// Keypair inladen uit jouw JSON
const WALLET = Keypair.fromSecretKey(
  Uint8Array.from(JSON.parse(fs.readFileSync("/root/brixit-wallet.json", "utf8")))
);

// Mint adres van jouw token
const MINT_ADDRESS = "EqPfniBbr2NT6gwH6yMnrAArH9tNiFKAXFR2DiS2bDUA";

// Metadata
const metadata = {
  name: "Brixit",
  symbol: "BXT",
  uri: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EqPfniBbr2NT6gwH6yMnrAArH9tNiFKAXFR2DiS2bDUA/brixit.json",
  sellerFeeBasisPoints: 0,
  creators: null,
  collection: null,
  uses: null,
};

async function main() {
  const metaplex = Metaplex.make(connection).use(keypairIdentity(WALLET));

  try {
    const { nft } = await metaplex.nfts().create({
      mintAddress: MINT_ADDRESS,
      name: metadata.name,
      symbol: metadata.symbol,
      uri: metadata.uri,
      sellerFeeBasisPoints: metadata.sellerFeeBasisPoints,
    });

    console.log("✅ Metadata succesvol aangemaakt!");
    console.log("Transaction:", nft);
  } catch (err) {
    console.error("❌ Fout bij aanmaken metadata:", err);
  }
}

main();

