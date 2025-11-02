# Hegic Protocol - Deployed Contracts on Arbitrum Sepolia

**Deployment Date:** October 31, 2024
**Network:** Arbitrum Sepolia Testnet (Chain ID: 421614)
**Deployer:** 0x711eE890B41fFbd23Ba3c96975DEBDB1145cbB83
**Model:** USDC-Only (LPs deposit USDC, earn USDC)

---

## ✅ Deployment Summary

- **Total Contracts Deployed:** 254
- **Core Contracts:** 6
- **Price Calculators:** 72
- **Strategy Contracts:** 176
- **Deployment Status:** ✅ Complete

---

## 🔑 Core Contracts (Chronological Order)

| # | Contract Name | Address | Purpose |
|---|---------------|---------|---------|
| 1 | **CoverPool** | `0xAd02465752782893045089396277697Af935dAdB` | USDC liquidity pool for backstop coverage |
| 2 | **ProfitDistributor** | `0x2770Ba51F4e1712E7B424c392cf157B42B17C739` | Distributes profits to LPs |
| 3 | **PositionsManager** | `0x88a2887bD21974ea9a8D23553eeE532B8a8e2AB3` | ERC721 NFT manager for options |
| 4 | **ProfitCalculator** | `0x1c64D2205415C4355Ad6C04250B4bA753758CcDc` | Calculates option payoffs |
| 5 | **LimitController** | `0xb20aBac673Fc2f0Eb44fe911E65B262cDEfeb3e8` | Controls strategy limits |
| 6 | **OperationalTreasury** | `0xeD5129B6Fc93C1D9c8278E540c4986dB9DC9D930` | ⭐ **Main contract** - Creates and settles options |

---

## 🪙 Token & Oracle Contracts

| Contract Name | Address | Type |
|---------------|---------|------|
| **USDC** | `0xf3C3351D6Bd0098EEb33ca8f830FAf2a141Ea2E1` | Settlement Token |
| **WETH** | `0x980B62Da83eFf3D4576C647993b0c1D7faf17c73` | Underlying Asset |
| **WBTC** | `0x806D0637Fbbfb4EB9efD5119B0895A5C7Cbc66e7` | Underlying Asset |
| **PriceProviderETH** | `0xd30e2101a97dcbAeBCBC04F14C3f624E67A35165` | Chainlink ETH/USD Oracle |
| **PriceProviderBTC** | `0x56a43EB56Da12C0dc1D972ACb089c06a5dEF8e69` | Chainlink BTC/USD Oracle |

---

## 📊 Strategy Contracts by Type

### PUT Options - ETH (100% Strike)
| Period | Address |
|--------|---------|
| 7-14 days | `0xDB9ddC29d5cff07233b1A776c655196598cFB916` |
| 14-30 days | `0xdC9939d7C569013243808cdBBE25d4c506d9a646` |
| 1-30 days (3) | `0x6668F01597fadbbCe9a6082566710a456A589797` |
| 1-30 days (4) | `0xce43F6E8F48c18c65cb13550707b436fa45A3846` |

### PUT Options - ETH (90% Strike)
| Period | Address |
|--------|---------|
| 7-14 days | `0x2d79159D6ab5534e6fBF81F1A38Ac5eB5C9af90a` |
| 14-30 days | `0x97dC0a2D63fB101fe6590D3a8356BC7Dfeadd2D2` |
| 1-30 days (3) | `0x37Ad22A981bcc017081E96c438504Cca960E3583` |
| 1-30 days (4) | `0xf304A1A04aF83a581708A60BEf9dc5Ed7da74a49` |

### PUT Options - ETH (80% Strike)
| Period | Address |
|--------|---------|
| 7-14 days | `0x50011f80d8D3c81a540442d1A6dA7f7a9a417CaE` |
| 14-30 days | `0x7B8C5D249D053Bc0fb71BC937F4F9260012ba5F0` |
| 1-30 days (3) | `0xe86C1015b7E1ccB9B05AB30449EC2500A70A9e9A` |
| 1-30 days (4) | `0xfc399E7047A1020642149CceD4d218e644ec78Ae` |

### PUT Options - ETH (70% Strike)
| Period | Address |
|--------|---------|
| 7-14 days | `0x97FC5e6F9cb082E1AA38E0E6c73F9f27935bBA74` |
| 14-30 days | `0xbCDeDF3b2CDA8CD13BD710AdaEb017C80FdD924F` |
| 1-30 days (3) | `0x4A0A18AF62C0e417E7cf97eBDE8f187ABEE2EE4A` |
| 1-30 days (4) | `0xfC51876fae72a3C24d7f645188358BF2d5E17760` |

### CALL Options - ETH (100% Strike)
| Period | Address |
|--------|---------|
| 7-14 days | `0xf88fcBd45257779F311a822af756b10014d1A67e` |
| 14-30 days | `0x6166d6B048DecE71A6F3bbcE32E26133d8F2409c` |
| 1-30 days (3) | `0x99a45E428b121853A09da12a6c33698290cD3FDF` |
| 1-30 days (4) | `0x09A05Fd10728820Bc44646ee5a77F94824Ac3Bfe` |

### CALL Options - ETH (110% Strike)
| Period | Address |
|--------|---------|
| 7-14 days | `0x93Bf8A65cACE299Ed21DD4efD56c5f555e9d66F2` |
| 14-30 days | `0xa5135A36F499842679bA1153cBF03872105Cb9F1` |
| 1-30 days (3) | `0xba28A5c8eC0F29cDacAa724A9042DD9B7576bc57` |
| 1-30 days (4) | `0x299f6237011C3f9B8B5cbFa948155562174ec294` |

### CALL Options - ETH (120% Strike)
| Period | Address |
|--------|---------|
| 7-14 days | `0xDddb15713bF32533f4d7d7527107659f517E5326` |
| 14-30 days | `0x2513AdC25EB2f8E4159b4A6D14D2016E15Cb9117` |
| 1-30 days (3) | `0xC771D735872a3459faef9290bdA46dCEad6Bb222` |
| 1-30 days (4) | `0xb5660b5402fEFddd858B6057B46Cf47303C57E2A` |

### CALL Options - ETH (130% Strike)
| Period | Address |
|--------|---------|
| 7-14 days | `0xc4eb3D7cbb4915D8F58CF71553567D21b3704d89` |
| 14-30 days | `0x7cda1D0101001C1fF33D863B31C87ec226bf6bE2` |
| 1-30 days (3) | `0x85a52c19386EcefB3cEA51B0331b41Eba242f7A2` |
| 1-30 days (4) | `0x2783077341654782C8C470103Ef3C92Fd2D59F83` |

### BTC Strategies
*(Similar structure for PUT_100_BTC, PUT_90_BTC, PUT_80_BTC, PUT_70_BTC, CALL_100_BTC, CALL_110_BTC, CALL_120_BTC, CALL_130_BTC)*

See full list in the addresses table output.

### Advanced Strategies

**STRADDLE (ETH):**
- 7-14 days: `0x4D6b03182A2F450846dEbF04325da541c78828B6`
- 14-30 days: `0x116bD1bE3169E6bCC41e4F1A2E6999D566A65449`
- 1-30 days (3): `0x12Af4Ccd2f30Aa5a3875C6F635a66CbAC7899547`
- 1-30 days (4): `0x64b76243804D1f288879E98C7736cebeCaf6F222`

**STRAP (ETH):**
- 7-14 days: `0xc556Fa5BB5717036C44b129C16E9462D6FBEdd61`
- 14-30 days: `0x8BCbFEfF2b09470d1f3C9Cc428E810AE4FEC7A50`
- 1-30 days (3): `0x3dE57958D2C9a261a99493f8eA25272De85d68e3`
- 1-30 days (4): `0xe1b519E67aa357Ad2D5da0697Ad2bb013B5a61FE`

**STRIP (ETH):**
- 7-14 days: `0xB6536f3F59D5187f2B3E7364A7269661EeC555A7`
- 14-30 days: `0x57D33B746febDBC6615EeB782058bB1a219cAbe2`
- 1-30 days (3): `0x83E9A36504F5c029F3803Da8ACA3B2715DB91F78`
- 1-30 days (4): `0x3Fd7884cD4520BBb3a2B4641Be09e4095503e2b7`

**Inverse Strategies:** (Bear Call Spread, Bull Put Spread, Long Butterfly, Long Condor)
- Multiple variants deployed for both ETH and BTC
- See full addresses table for complete list

---

## 📋 Complete Contract List (Alphabetical)

Full address table available via: `npx hardhat addresses --network arbitrum-sepolia`

Total: 254 deployed contracts across:
- 🎯 Core infrastructure: 6 contracts
- 📊 Price calculators: 72 contracts  
- 🎲 Strategy contracts: 176 contracts

---

## 🔧 Configuration Summary

### CoverPool Settings
- Cover Token: USDC
- Profit Token: USDC
- Changing Price: 1e30 (1:1 ratio)
- Window Size: 5 days (432,000 seconds)

### OperationalTreasury Settings
- Settlement Token: USDC
- Max Lockup Period: 30 days (2,592,000 seconds)
- Benchmark: 10,000 USDC
- Total Strategies Connected: 176

### Strategy Settings
- Per-Strategy Limit: 20,000 USDC (20,000,000,000 with 6 decimals)
- Min Period: 1 day (86,400 seconds)
- Max Period: 30 days (2,592,000 seconds)
- Exercise Window: 4 hours (14,400 seconds)

---

## 🔗 Block Explorer Links

- **Arbitrum Sepolia Explorer:** https://sepolia.arbiscan.io
- **OperationalTreasury:** https://sepolia.arbiscan.io/address/0xeD5129B6Fc93C1D9c8278E540c4986dB9DC9D930
- **CoverPool:** https://sepolia.arbiscan.io/address/0xAd02465752782893045089396277697Af935dAdB

---

## ✅ Next Steps

### 1. Post-Deployment Initialization
```bash
# Grant necessary roles
npx hardhat run scripts/grantRoles.ts --network arbitrum-sepolia

# Verify contracts (requires Arbiscan API key)
npx hardhat etherscan-verify --network arbitrum-sepolia
```

### 2. Provide Initial Liquidity
LPs can now deposit USDC to CoverPool:
```solidity
// Approve USDC
USDC.approve(CoverPool.address, amount);

// Provide liquidity
CoverPool.provide(amount, 0);
```

### 3. Start Trading
Users can purchase options through OperationalTreasury:
```solidity
// Approve USDC for premium
USDC.approve(OperationalTreasury.address, premium);

// Buy option
OperationalTreasury.buy(strategy, holder, amount, period, additionalData);
```

---

## 📞 Support & Documentation

- **Full Documentation:** `/docs` directory
- **USDC-Only Model Guide:** `USDC_ONLY_MODEL_CHANGES.md`
- **Deployment Checklist:** `DEPLOYMENT_CHECKLIST.md`
- **Architecture Overview:** `docs/02-architecture.md`

---

**Deployment completed successfully! 🎉**

*Generated: October 31, 2024*
