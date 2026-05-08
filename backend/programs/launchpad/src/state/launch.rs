use anchor_lang::prelude::*;

#[account]
pub struct Launch {
    pub creator:      Pubkey,   // 32
    pub mint:         Pubkey,   // 32
    pub name:         String,   // 4 + 32
    pub symbol:       String,   // 4 + 8
    pub total_supply: u64,      // 8
    pub price:        u64,      // 8 — lamports per token
    pub sold:         u64,      // 8
    pub is_active:    bool,     // 1
    pub metadata_uri: String,   // 4 + 128
    pub bump:         u8,       // 1
}

impl Launch {
    // 8 (discriminator) + 32 + 32 + (4+32) + (4+8) + 8 + 8 + 8 + 1 + (4+128) + 1
    pub const LEN: usize = 8 + 32 + 32 + 36 + 12 + 8 + 8 + 8 + 1 + 132 + 1 + 32;
}