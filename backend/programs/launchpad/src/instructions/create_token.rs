use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};
use crate::state::Launch;
use crate::errors::LaunchpadError;

#[derive(Accounts)]
#[instruction(name: String, symbol: String, supply: u64, price: u64)]
pub struct CreateToken<'info> {
    #[account(
        init,
        payer = creator,
        space = Launch::LEN,
        seeds = [b"launch", creator.key().as_ref(), symbol.as_bytes()],
        bump
    )]
    pub launch: Account<'info, Launch>,

    #[account(
        init,
        payer = creator,
        mint::decimals = 6,
        mint::authority = creator,
    )]
    pub mint: Account<'info, Mint>,

    #[account(mut)]
    pub creator: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub token_program:  Program<'info, Token>,
    pub rent:           Sysvar<'info, Rent>,
}

pub fn handler(
    ctx: Context<CreateToken>,
    name: String,
    symbol: String,
    supply: u64,
    price: u64,
    metadata_uri: String,
) -> Result<()> {
    require!(symbol.len() <= 5, LaunchpadError::SymbolTooLong);
    require!(supply > 0,        LaunchpadError::ZeroAmount);
    require!(price  > 0,        LaunchpadError::ZeroAmount);

    let launch  = &mut ctx.accounts.launch;
    let bump    = ctx.bumps.launch;

    launch.creator      = ctx.accounts.creator.key();
    launch.mint         = ctx.accounts.mint.key();
    launch.name         = name;
    launch.symbol       = symbol;
    launch.total_supply = supply;
    launch.price        = price;
    launch.sold         = 0;
    launch.is_active    = true;
    launch.metadata_uri = metadata_uri;
    launch.bump         = bump;

    msg!("Token launch created: {}", launch.name);
    Ok(())
}