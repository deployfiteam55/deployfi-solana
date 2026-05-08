use anchor_lang::prelude::*;
use anchor_lang::system_program;
use anchor_spl::token::{self, Mint, Token, TokenAccount, MintTo};
use crate::state::Launch;
use crate::errors::LaunchpadError;

#[derive(Accounts)]
pub struct BuyTokens<'info> {
    #[account(
        mut,
        seeds = [b"launch", launch.creator.as_ref(), launch.symbol.as_bytes()],
        bump = launch.bump,
    )]
    pub launch: Account<'info, Launch>,

    #[account(
        mut,
        address = launch.mint,
    )]
    pub mint: Account<'info, Mint>,

    /// CHECK: creator receives SOL payment
    #[account(mut, address = launch.creator)]
    pub creator: AccountInfo<'info>,

    #[account(
        init_if_needed,
        payer = buyer,
        associated_token::mint      = mint,
        associated_token::authority = buyer,
    )]
    pub buyer_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub buyer: Signer<'info>,

    pub system_program:           Program<'info, System>,
    pub token_program:            Program<'info, Token>,
    pub associated_token_program: Program<'info, anchor_spl::associated_token::AssociatedToken>,
    pub rent:                     Sysvar<'info, Rent>,
}

pub fn handler(ctx: Context<BuyTokens>, amount: u64) -> Result<()> {
    let launch = &mut ctx.accounts.launch;

    require!(launch.is_active,                              LaunchpadError::LaunchNotActive);
    require!(amount > 0,                                    LaunchpadError::ZeroAmount);
    require!(launch.sold + amount <= launch.total_supply,   LaunchpadError::ExceedsSupply);

    let cost = launch.price
        .checked_mul(amount)
        .ok_or(LaunchpadError::InsufficientFunds)?;

    // Transfer SOL from buyer to creator
    system_program::transfer(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.buyer.to_account_info(),
                to:   ctx.accounts.creator.to_account_info(),
            },
        ),
        cost,
    )?;

    // Mint tokens to buyer's token account
    token::mint_to(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint:      ctx.accounts.mint.to_account_info(),
                to:        ctx.accounts.buyer_token_account.to_account_info(),
                authority: ctx.accounts.creator.to_account_info(),
            },
        ),
        amount * 1_000_000, // 6 decimals
    )?;

    launch.sold += amount;
    msg!("Bought {} tokens for {} lamports", amount, cost);
    Ok(())
}