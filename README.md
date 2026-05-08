# 🚀 DeployFi — Launch · Swap · Deploy on Solana

> All-in-one DeFi launchpad: Create SPL tokens, swap via Jupiter, earn yield on Kamino, stake with Marinade.

---

## 📁 Project Structure

```
deployfi/
├── package.json                 ← root (concurrently)
├── .gitignore
├── README.md
├── frontend/                    ← React + Vite (Muskan + Vishal)
│   ├── src/
│   │   ├── main.jsx             ← Wallet provider entry
│   │   ├── App.jsx              ← Routes
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Launch.jsx
│   │   │   ├── DeFi.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── components/
│   │   │   ├── layout/          ← Navbar, Footer
│   │   │   ├── ui/              ← GlassCard, PurpleButton, InputField, ProgressBar
│   │   │   ├── token/           ← TokenCard, LaunchForm, SuccessScreen
│   │   │   └── defi/            ← GoalPicker, ActionPanel, YieldCard, PriceTicker, TxStatus
│   │   ├── hooks/               ← useSOLBalance, useLivePrice, useBestYield
│   │   ├── store/               ← Zustand global state
│   │   ├── utils/               ← jupiter, kamino, pyth, ipfs, metaplex, staking, contract
│   │   └── constants/           ← config.js, addresses.js, idl.json (auto-generated)
├── backend/                     ← Anchor + Rust (Chirayu)
│   ├── programs/launchpad/src/
│   │   ├── lib.rs               ← Program entry
│   │   ├── instructions/        ← create_token, buy_tokens, finalize
│   │   ├── state/               ← Launch account struct
│   │   └── errors/              ← Custom error codes
│   ├── tests/                   ← TypeScript test suite
│   └── scripts/                 ← deploy.sh, airdrop.sh, export_idl.sh
└── landing/                     ← Static HTML page (Pratishtha)
    ├── index.html
    ├── style.css
    └── script.js
```

---

## ⚙️ Prerequisites — Install These First

```bash
# 1. Node.js v18+ (required)
node --version   # must be >= 18

# 2. Rust + Cargo
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# 3. Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/v1.18.0/install)"
# Add to PATH (paste into ~/.bashrc or ~/.zshrc):
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
source ~/.bashrc

# 4. Anchor CLI
cargo install --git https://github.com/coral-xyz/anchor avm --locked
avm install latest
avm use latest
anchor --version   # should print anchor-cli 0.29.x

# 5. Phantom Wallet browser extension
# https://phantom.app — switch to Devnet in Settings → Developer Settings
```

---

## 🚀 Step-by-Step: First Time Setup

### Step 1 — Clone & root install

```bash
git clone https://github.com/YOUR_REPO/deployfi.git
cd deployfi
npm install          # installs concurrently at root
```

### Step 2 — Frontend install

```bash
cd frontend
npm install
cd ..
```

### Step 3 — Backend install

```bash
cd backend
npm install          # test dependencies
cd ..
```

### Step 4 — Generate Solana wallet (if you don't have one)

```bash
solana-keygen new --outfile ~/.config/solana/id.json
solana config set --url devnet
solana address       # copy this address
```

### Step 5 — Get devnet SOL (free test tokens)

```bash
cd backend
bash scripts/airdrop.sh
# OR manually:
solana airdrop 2
solana balance       # should show 2 SOL
```

---

## 🔨 Build & Deploy the Smart Contract (Chirayu)

### Step 6 — Build Anchor program

```bash
cd backend
anchor build
```

This generates:
- `target/deploy/launchpad.so` — compiled program
- `target/idl/launchpad.json` — IDL for frontend

### Step 7 — Get your Program ID

```bash
anchor keys list
# Output: launchpad: <YOUR_PROGRAM_ID>
```

### Step 8 — Update Program ID in two places

**File 1:** `backend/programs/launchpad/src/lib.rs`
```rust
declare_id!("YOUR_PROGRAM_ID_HERE");
```

**File 2:** `backend/Anchor.toml`
```toml
[programs.devnet]
launchpad = "YOUR_PROGRAM_ID_HERE"
```

**File 3:** `frontend/src/constants/addresses.js`
```js
export const PROGRAM_ID = 'YOUR_PROGRAM_ID_HERE'
```

### Step 9 — Build again after updating ID

```bash
anchor build
```

### Step 10 — Deploy to devnet

```bash
# Option A — use the deploy script (recommended):
bash scripts/deploy.sh

# Option B — manual:
anchor deploy --provider.cluster devnet
```

### Step 11 — Sync IDL to frontend

```bash
# From root:
npm run sync:idl

# OR from backend folder:
bash scripts/export_idl.sh
```

This copies `backend/target/idl/launchpad.json` → `frontend/src/constants/idl.json`

---

## 🖥️ Running the App

### Step 12 — Set environment variables (optional but recommended)

Create `frontend/.env`:
```env
VITE_NFT_STORAGE_KEY=your_nft_storage_api_key_here
```
Get a free key at https://nft.storage

### Step 13 — Switch from mock to real (after contract deployed)

Edit `frontend/src/constants/config.js`:
```js
export const USE_MOCK = false   // ← change this from true to false
```

### Step 14 — Start the full app

```bash
# From root — starts BOTH frontend and backend together:
npm run dev

# OR start individually:
npm run dev:frontend   # http://localhost:5173
npm run dev:backend    # http://localhost:8899
```

### Step 15 — Open landing page

```bash
# Just open landing/index.html in your browser directly
# OR serve it:
cd landing
npx serve .
# http://localhost:3000
```

---

## 🧪 Running Tests

```bash
cd backend
anchor test
# Runs the full TypeScript test suite on a local validator
```

---

## 🔗 Integration Checklist (before demo)

Run through this list in order:

| # | Item | Who | Command/Check |
|---|------|-----|---------------|
| 1 | Contract deployed to devnet | Chirayu | `anchor deploy` |
| 2 | IDL synced to frontend | Chirayu | `npm run sync:idl` |
| 3 | PROGRAM_ID updated in addresses.js | Vishal | edit `constants/addresses.js` |
| 4 | `USE_MOCK = false` in config.js | Vishal | edit `constants/config.js` |
| 5 | Phantom set to devnet | Everyone | Phantom → Settings → Developer |
| 6 | `npm run dev` starts without errors | Chirayu | check terminal |
| 7 | Wallet connects on frontend | Everyone | click Connect |
| 8 | Token create flow works | Chirayu | try creating a token |
| 9 | Jupiter swap returns quote | Vishal | try swapping SOL→USDC |
| 10 | Kamino pools load | Vishal | check DeFi page |
| 11 | Dashboard shows balance | Vishal | check Dashboard |
| 12 | No console errors | Muskan | browser DevTools |
| 13 | Landing page works standalone | Pratishtha | open `landing/index.html` |

---

## 🌐 APIs Used

| API | Purpose | Docs |
|-----|---------|------|
| Jupiter v6 | Token swaps | https://quote-api.jup.ag/v6 |
| Kamino Finance | Yield pools | https://api.kamino.finance |
| Pyth Hermes | Live SOL price | https://hermes.pyth.network |
| NFT.storage | IPFS metadata upload | https://nft.storage |
| Metaplex JS | Token metadata | https://docs.metaplex.com |
| Marinade SDK | Liquid staking | https://docs.marinade.finance |
| Solana Devnet | RPC | https://api.devnet.solana.com |

---

## 🐛 Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `IDL not found` | IDL not synced | Run `npm run sync:idl` |
| `Wallet not connected` | No Phantom / wrong network | Connect Phantom on Devnet |
| `insufficient funds` | No devnet SOL | Run `bash scripts/airdrop.sh` |
| `Program not found` | Wrong PROGRAM_ID | Re-check `addresses.js` |
| `CORS error on API` | Browser policy | Run via `npm run dev` not file:// |
| `anchor build fails` | Rust not installed | `rustup update stable` |
| `RPC rate limit` | Too many requests | Switch to paid RPC or wait |
| `Buffer is not defined` | Vite polyfill missing | Already fixed in `vite.config.js` |

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Blockchain | Solana (devnet) |
| Smart Contracts | Anchor Framework + Rust |
| Token Program | SPL Token |
| Frontend | React + Vite + TailwindCSS |
| State | Zustand |
| Animations | Framer Motion |
| Routing | React Router v6 |
| Wallet | @solana/wallet-adapter (Phantom) |
| Swap | Jupiter API v6 |
| Yield | Kamino Finance REST API |
| Price Feed | Pyth Network Hermes |
| Metadata | NFT.storage (IPFS) + Metaplex |
| Staking | Marinade Finance SDK |

---

## 👥 Team

| Name | Role |
|------|------|
| Chirayu | Blockchain · Smart Contracts · Devnet Deploy |
| Muskan | Frontend · UI Components · Styling |
| Vishal | API Integration · DeFi · Dashboard |
| Pratishtha | Landing Page · Demo Video · Submission |

---

*DeployFi — Solana Hackathon 2025*