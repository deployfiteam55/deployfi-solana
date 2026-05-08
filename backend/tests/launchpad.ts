import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { PublicKey, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { assert } from "chai";

describe("launchpad", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program   = anchor.workspace.Launchpad as Program;
  const creator   = provider.wallet as anchor.Wallet;
  const mintKP    = Keypair.generate();
  let   launchPDA : PublicKey;
  let   launchBump: number;

  const TOKEN_NAME   = "TestToken";
  const TOKEN_SYMBOL = "TEST";
  const SUPPLY       = new anchor.BN(1_000_000);
  const PRICE        = new anchor.BN(1_000_000); // 0.001 SOL in lamports
  const METADATA_URI = "https://arweave.net/test-metadata";

  before(async () => {
    [launchPDA, launchBump] = await PublicKey.findProgramAddress(
      [Buffer.from("launch"), creator.publicKey.toBuffer(), Buffer.from(TOKEN_SYMBOL)],
      program.programId
    );
    console.log("Launch PDA:", launchPDA.toString());
    console.log("Mint:      ", mintKP.publicKey.toString());
  });

  it("creates a token launch", async () => {
    const tx = await program.methods
      .createToken(TOKEN_NAME, TOKEN_SYMBOL, SUPPLY, PRICE, METADATA_URI)
      .accounts({
        launch:        launchPDA,
        mint:          mintKP.publicKey,
        creator:       creator.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram:  TOKEN_PROGRAM_ID,
        rent:          anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([mintKP])
      .rpc();

    console.log("createToken tx:", tx);

    const launch = await program.account.launch.fetch(launchPDA);
    assert.equal(launch.name,         TOKEN_NAME);
    assert.equal(launch.symbol,       TOKEN_SYMBOL);
    assert.equal(launch.totalSupply.toString(), SUPPLY.toString());
    assert.equal(launch.price.toString(),       PRICE.toString());
    assert.equal(launch.sold.toString(),        "0");
    assert.isTrue(launch.isActive);
    assert.equal(launch.creator.toString(), creator.publicKey.toString());
    console.log("✅ createToken passed");
  });

  it("finalizes a launch", async () => {
    const tx = await program.methods
      .finalizeLaunch()
      .accounts({
        launch:  launchPDA,
        creator: creator.publicKey,
      })
      .rpc();

    console.log("finalizeLaunch tx:", tx);

    const launch = await program.account.launch.fetch(launchPDA);
    assert.isFalse(launch.isActive);
    console.log("✅ finalizeLaunch passed");
  });
});