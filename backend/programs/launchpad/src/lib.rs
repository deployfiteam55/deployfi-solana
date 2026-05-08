use anchor_lang::prelude::*;

pub mod errors;
pub mod instructions;
pub mod state;

use instructions::*;

declare_id!("REPLACE_WITH_YOUR_PROGRAM_ID");

#[program]
pub mod launchpad {
    use super::*;

    /// Create a new token launch
    pub fn create_token(
        ctx: Context<CreateToken>,
        name: String,
        symbol: String,
        supply: u64,
        price: u64,
        metadata_uri: String,
    ) -> Result<()> {
        instructions::create_token::handler(ctx, name, symbol, supply, price, metadata_uri)
    }

    /// Buy tokens from an active launch
    pub fn buy_tokens(ctx: Context<BuyTokens>, amount: u64) -> Result<()> {
        instructions::buy_tokens::handler(ctx, amount)
    }

    /// Finalize (close) a launch — only creator can call
    pub fn finalize_launch(ctx: Context<Finalize>) -> Result<()> {
        instructions::finalize::handler(ctx)
    }
}