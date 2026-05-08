use anchor_lang::prelude::*;
use crate::state::Launch;
use crate::errors::LaunchpadError;

#[derive(Accounts)]
pub struct Finalize<'info> {
    #[account(
        mut,
        seeds = [b"launch", launch.creator.as_ref(), launch.symbol.as_bytes()],
        bump = launch.bump,
    )]
    pub launch: Account<'info, Launch>,

    #[account(mut)]
    pub creator: Signer<'info>,
}

pub fn handler(ctx: Context<Finalize>) -> Result<()> {
    let launch = &mut ctx.accounts.launch;

    require!(
        ctx.accounts.creator.key() == launch.creator,
        LaunchpadError::Unauthorized
    );
    require!(launch.is_active, LaunchpadError::LaunchNotActive);

    launch.is_active = false;
    msg!("Launch finalized: {} tokens sold out of {}", launch.sold, launch.total_supply);
    Ok(())
}