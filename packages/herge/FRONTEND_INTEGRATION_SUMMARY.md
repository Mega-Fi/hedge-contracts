# ⚡ Quick Reference: Frontend Integration Contracts

## 🎯 You Only Need These 3 Contracts!

### 1. OperationalTreasury ⭐ 
**Address:** `0xeD5129B6Fc93C1D9c8278E540c4986dB9DC9D930`  
**What it does:** Buy options, exercise options, view positions

### 2. PositionsManager
**Address:** `0x88a2887bD21974ea9a8D23553eeE532B8a8e2AB3`  
**What it does:** Manage ERC721 NFTs for option positions

### 3. CoverPool
**Address:** `0xAd02465752782893045089396277697Af935dAdB`  
**What it does:** LP deposits, withdrawals, profit claims

---

## 🪙 Token Addresses

| Token | Address | Decimals | Use |
|-------|---------|----------|-----|
| **USDC** | `0xf3C3351D6Bd0098EEb33ca8f830FAf2a141Ea2E1` | 6 | Settlement, Premiums |
| **WETH** | `0x980B62Da83eFf3D4576C647993b0c1D7faf17c73` | 18 | ETH options |
| **WBTC** | `0x806D0637Fbbfb4EB9efD5119B0895A5C7Cbc66e7` | 8 | BTC options |

---

## 📡 Price Feeds

| Feed | Address | Decimals |
|------|---------|----------|
| **ETH/USD** | `0xd30e2101a97dcbAeBCBC04F14C3f624E67A35165` | 8 |
| **BTC/USD** | `0x56a43EB56Da12C0dc1D972ACb0895A5C7Cbc66e7` | 8 |

---

## 🎲 Strategy Addresses (176 total)

**Location:** `deployments/arbitrum-sepolia/.addresses.json`

**Naming:** `HegicStrategy_[TYPE]_[STRIKE]_[ASSET]_[INDEX]`

Examples:
- `HegicStrategy_PUT_100_ETH_1` - ETH PUT at current price
- `HegicStrategy_CALL_110_BTC_2` - BTC CALL at 110%  
- `HegicStrategy_STRADDLE_ETH_1` - ETH Straddle
- `HegicStrategy_INVERSE_BEAR_CALL_SPREAD_10_ETH` - Inverse spread

---

## 📚 Full Documentation

See `FRONTEND_INTEGRATION_GUIDE.md` for complete workflows and code examples!

