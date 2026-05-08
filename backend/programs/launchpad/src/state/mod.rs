pub mod launch;
pub use launch::*;
use anchor_lang::prelude::*;

#[error_code]
pub enum LaunchpadError {
    #[msg("Launch is not active")]
    LaunchNotActive,
    #[msg("Insufficient funds")]
    InsufficientFunds,
    #[msg("Exceeds total supply")]
    ExceedsSupply,
    #[msg("Amount must be greater than zero")]
    ZeroAmount,
    #[msg("Unauthorized: only creator can finalize")]
    Unauthorized,
    #[msg("Symbol too long (max 5 chars)")]
    SymbolTooLong,
}