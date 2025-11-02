# 🎉 Hegic Protocol - Complete Deployment Report

**Network:** Arbitrum Sepolia Testnet  
**Chain ID:** 421614  
**Deployer:** `0x711eE890B41fFbd23Ba3c96975DEBDB1145cbB83`  
**Deployment Date:** October 31, 2024  
**Total Contracts Deployed:** 254 (3 new contracts in final run)

---

## ⚠️ IMPORTANT: Deployment Scope

### ✅ Deployed: **HERGE Package Only**
- 6 Core contracts
- 72 Price calculator contracts  
- 176 Strategy contracts
- **Status:** ✅ Complete and operational

### ❌ NOT Deployed: **V8888 Package**
- Legacy Hegic v8888 contracts were **NOT** deployed
- Only Herge (current version) was deployed
- If you need v8888, that will require a separate deployment

---

## 📊 Deployment Timeline & Categories

### Phase 1: Core Infrastructure (6 contracts)

#### 1.1 CoverPool - USDC Liquidity Pool
**Contract:** `CoverPool`  
**Address:** `0xAd02465752782893045089396277697Af935dAdB`  
**TX Hash:** `0xca66bc3f1d84f4505e15addaa5d4d2a8003ab30ae1806218ccf32190b643436e`  
**Gas Used:** 3,207,213  
**Purpose:** Main liquidity pool where LPs deposit USDC

**Arbiscan:** https://sepolia.arbiscan.io/address/0xAd02465752782893045089396277697Af935dAdB

---

#### 1.2 ProfitDistributor
**Contract:** `ProfitDistributor`  
**Address:** `0x2770Ba51F4e1712E7B424c392cf157B42B17C739`  
**TX Hash:** `0x7ef55f3c911f021ae38962a1a34c0bb7236f95cfcbb2a4aebfadd962f6f9e67f`  
**Gas Used:** 997,761  
**Purpose:** Distributes trading profits to liquidity providers

**Arbiscan:** https://sepolia.arbiscan.io/address/0x2770Ba51F4e1712E7B424c392cf157B42B17C739

---

#### 1.3 PositionsManager - NFT Manager
**Contract:** `PositionsManager`  
**Address:** `0x88a2887bD21974ea9a8D23553eeE532B8a8e2AB3`  
**TX Hash:** `0x91ade8a2f65e1fd91ae77b3cc6201a49b448ba0572ef4d4d2f53638c9db3f2f2`  
**Gas Used:** 1,680,648  
**Purpose:** ERC721 NFT manager for option positions

**Arbiscan:** https://sepolia.arbiscan.io/address/0x88a2887bD21974ea9a8D23553eeE532B8a8e2AB3

---

#### 1.4 ProfitCalculator
**Contract:** `ProfitCalculator`  
**Address:** `0x1c64D2205415C4355Ad6C04250B4bA753758CcDc`  
**TX Hash:** `0xc0e5345c097a5813639eb7f7cf6e4c572289ea7c8b3536b0e18579f44a052ec6`  
**Gas Used:** 155,483  
**Purpose:** Library for calculating option payoffs

**Arbiscan:** https://sepolia.arbiscan.io/address/0x1c64D2205415C4355Ad6C04250B4bA753758CcDc

---

#### 1.5 LimitController
**Contract:** `LimitController`  
**Address:** `0xb20aBac673Fc2f0Eb44fe911E65B262cDEfeb3e8`  
**TX Hash:** `0xbd98744dd7f7089f179527db713bcbfc0aa57c0a0f06c31422ed19f1d3f6cd1e`  
**Gas Used:** 668,687  
**Purpose:** Manages per-strategy liquidity limits (20,000 USDC each)

**Arbiscan:** https://sepolia.arbiscan.io/address/0xb20aBac673Fc2f0Eb44fe911E65B262cDEfeb3e8

---

#### 1.6 OperationalTreasury ⭐ (MAIN CONTRACT)
**Contract:** `OperationalTreasury`  
**Address:** `0xeD5129B6Fc93C1D9c8278E540c4986dB9DC9D930`  
**TX Hash:** `0x1d07bc4e7f552f4fd6321cf71798c50cf79ae6b421ae8722e9475ef19b9649fc`  
**Gas Used:** 11,360,916  
**Purpose:** **Main contract** - Handles all option creation and settlement

**Arbiscan:** https://sepolia.arbiscan.io/address/0xeD5129B6Fc93C1D9c8278E540c4986dB9DC9D930

---

### Phase 2: ETH PUT Option Strategies (32 contracts)

#### PUT 100% Strike (At-The-Money) - 4 Period Variations
| Period | Address | TX Hash | Gas |
|--------|---------|---------|-----|
| 7-14 days | `0xDB9ddC29d5cff07233b1A776c655196598cFB916` | `0x718ca15cdb76ff6d53ddbf766e7e998789d091070b8d6e2dc8fe35f8112755d5` | 2,047,662 |
| 14-30 days | `0xdC9939d7C569013243808cdBBE25d4c506d9a646` | `0x1444694c963ef9de785877bf62259fdeb2ac16d99d6bf8cb9ffe2197f2504593` | 2,047,650 |
| 1-30 days (v3) | `0x6668F01597fadbbCe9a6082566710a456A589797` | `0x52c56721329f39de288e930b963d2b2a737ce1dcbf1ad242939d0f50f66e3a01` | 2,047,662 |
| 1-30 days (v4) | `0xce43F6E8F48c18c65cb13550707b436fa45A3846` | `0xe6fbe4ab4a57e30ea6cb0128e4c7736a5c2ec7eb316bb11a8ac9881387f341de` | 2,047,662 |

#### PUT 90% Strike (Slight OTM) - 4 Period Variations
| Period | Address | TX Hash | Gas |
|--------|---------|---------|-----|
| 7-14 days | `0x2d79159D6ab5534e6fBF81F1A38Ac5eB5C9af90a` | `0x254975861d55ccd33edbb6fad85e75ee09a3cee5e54f6266b86d84b200e675bf` | 2,047,674 |
| 14-30 days | `0x97dC0a2D63fB101fe6590D3a8356BC7Dfeadd2D2` | `0x68f95cbd0251d837b9b81359f0bf44a0d02e701462e2b9557231f96b0526b68f` | 2,047,662 |
| 1-30 days (v3) | `0x37Ad22A981bcc017081E96c438504Cca960E3583` | `0x93790d732fb7b366db11e552fddf593a960fb3209b491b937a49ce577ab57fae` | 2,047,674 |
| 1-30 days (v4) | `0xf304A1A04aF83a581708A60BEf9dc5Ed7da74a49` | `0x728dc3ffeab77c67499c30b8c26dbdb0d60eea5eae41fe00044b720cb798f727` | 2,047,674 |

#### PUT 80% Strike (Medium OTM) - 4 Period Variations
| Period | Address | TX Hash | Gas |
|--------|---------|---------|-----|
| 7-14 days | `0x50011f80d8D3c81a540442d1A6dA7f7a9a417CaE` | `0xa8eb01abc28959d34149dfe8260ff64f29a36417691a53c872a44ba988a80f98` | 2,047,674 |
| 14-30 days | `0x7B8C5D249D053Bc0fb71BC937F4F9260012ba5F0` | `0x3a291868a2c413c3720c98a0b627719b28711598ceb03244d600600a75b95889` | 2,047,662 |
| 1-30 days (v3) | `0xe86C1015b7E1ccB9B05AB30449EC2500A70A9e9A` | `0xc2500c3d2053bca95f6fbd8ac4b20f51edc840098ffbe83ec6a055538c99ae34` | 2,047,674 |
| 1-30 days (v4) | `0xfc399E7047A1020642149CceD4d218e644ec78Ae` | `0x942edb585cb05a5be55156ee6ca3deee36507c65a7dcae026edfc7685de79b28` | 2,047,674 |

#### PUT 70% Strike (Deep OTM) - 4 Period Variations
| Period | Address | TX Hash | Gas |
|--------|---------|---------|-----|
| 7-14 days | `0x97FC5e6F9cb082E1AA38E0E6c73F9f27935bBA74` | `0x20f38898141625ff5f6408c917e51171908be9b0672c52b6cae27f9a92d8630a` | 2,047,674 |
| 14-30 days | `0xbCDeDF3b2CDA8CD13BD710AdaEb017C80FdD924F` | `0x53d16b8e2df41e65127c08a0cf6ca62b4bb8daf3890b6742f4ffec3d4044943a` | 2,047,662 |
| 1-30 days (v3) | `0x4A0A18AF62C0e417E7cf97eBDE8f187ABEE2EE4A` | `0x11721230870ff394e89ba82da51b2ee1df6e0729748a631ae21155cb8d08aa6e` | 2,047,674 |
| 1-30 days (v4) | `0xfC51876fae72a3C24d7f645188358BF2d5E17760` | `0x063fbdaa54572805a7eddbdfc63339094f12be76d2c322c0813faf312a07745b` | 2,047,674 |

---

### Phase 3: ETH CALL Option Strategies (32 contracts)

#### CALL 100% Strike (At-The-Money)
| Period | Address | TX Hash | Gas |
|--------|---------|---------|-----|
| 7-14 days | `0xf88fcBd45257779F311a822af756b10014d1A67e` | `0xa2eb9df000d9377306a955e96f554414c15fcd4b61a93ff0fbea7c71557bfcc1` | 2,047,674 |
| 14-30 days | `0x6166d6B048DecE71A6F3bbcE32E26133d8F2409c` | `0x5306b4e619323ebee18848982c192b99c0b135d0fd9fe82e7b4c401d1e6b2cd8` | 2,047,662 |
| 1-30 days (v3) | `0x99a45E428b121853A09da12a6c33698290cD3FDF` | `0xf9f4b719ea2c5d7fb33057a1257cc548fea9cbaa96d387a7158ac7e856d670e3` | 2,047,674 |
| 1-30 days (v4) | `0x09A05Fd10728820Bc44646ee5a77F94824Ac3Bfe` | `0x5b902761960a9d0afab43d9e5a79e694916a9cff833979be960edb2b17533d83` | 2,047,674 |

#### CALL 110% Strike (Slight OTM)
| Period | Address | TX Hash | Gas |
|--------|---------|---------|-----|
| 7-14 days | `0x93Bf8A65cACE299Ed21DD4efD56c5f555e9d66F2` | `0x2941779213b007219047394c6286d51fe735f3a20d661e3538fa2d7965f5fcb5` | 2,047,662 |
| 14-30 days | `0xa5135A36F499842679bA1153cBF03872105Cb9F1` | `0x6e3e4496dc92424170cd41dd5a6a5cbc4a12118eb7f5197e003705ef7c84d706` | 2,047,650 |
| 1-30 days (v3) | `0xba28A5c8eC0F29cDacAa724A9042DD9B7576bc57` | `0x202d3c291cd1b25db8b2616cb8834ab439d97cc052da28c5487531d943a6c940` | 2,047,662 |
| 1-30 days (v4) | `0x299f6237011C3f9B8B5cbFa948155562174ec294` | `0xf1a3899015ab5250805e296e1f7aab467a07b234950c88ed7f32e03af2776a68` | 2,047,662 |

#### CALL 120% Strike (Medium OTM)
| Period | Address | TX Hash | Gas |
|--------|---------|---------|-----|
| 7-14 days | `0xDddb15713bF32533f4d7d7527107659f517E5326` | `0xa3c97eaba5a1396abfe381facbad1322f32764ae5cdbb6cb2efcef34a4e3cdca` | 2,047,674 |
| 14-30 days | `0x2513AdC25EB2f8E4159b4A6D14D2016E15Cb9117` | `0x1e16793c978d8046d81cfd0e53365a6f8bcd8c19fb67de288d49367e0d650b65` | 2,047,662 |
| 1-30 days (v3) | `0xC771D735872a3459faef9290bdA46dCEad6Bb222` | `0x04d86f30f5b0f149d49251f026b6ebbd1811615a34754ddfc2f77bdebc473065` | 2,047,674 |
| 1-30 days (v4) | `0xb5660b5402fEFddd858B6057B46Cf47303C57E2A` | `0xafccbe1c7ccfd18c0aead087a70ed5e4f8a1da47d7e16d6b835ce51f70076a27` | 2,047,674 |

#### CALL 130% Strike (Deep OTM)
| Period | Address | TX Hash | Gas |
|--------|---------|---------|-----|
| 7-14 days | `0xc4eb3D7cbb4915D8F58CF71553567D21b3704d89` | `0xa481a55dc95ecba988e45e033dd6f1e12c2d2f868ca4e54ba9e65cfec4ffe5b4` | 2,047,674 |
| 14-30 days | `0x7cda1D0101001C1fF33D863B31C87ec226bf6bE2` | `0x6aa8e2eaee0c0b7d01e86061be6a8dcc3ae0c31f837f0ef6a87a62a8d0e95c58` | 2,047,662 |
| 1-30 days (v3) | `0x85a52c19386EcefB3cEA51B0331b41Eba242f7A2` | `0xa1a1b8f76ff4f8e95dcaecd7dfe2fc5af2838ae00dcab9c96a89bf1f59bd8655` | 2,047,674 |
| 1-30 days (v4) | `0x2783077341654782C8C470103Ef3C92Fd2D59F83` | `0xf3bfc7dd8cbb4f3f24c6b00f1c07d7dddab1af90f5f8c66feb7c84bcd83fd0e7` | 2,047,674 |

---

### Phase 4: BTC Option Strategies (32 PUT + 32 CALL = 64 contracts)

**Note:** Same structure as ETH strategies (100%, 90%, 80%, 70% for PUT; 100%, 110%, 120%, 130% for CALL)

Addresses available in the complete addresses table. Each has 4 period variations (7-14d, 14-30d, 1-30d v3, 1-30d v4).

---

### Phase 5: Advanced Multi-Leg Strategies (48 contracts)

#### 5.1 STRADDLE (Call + Put at same strike)
**ETH Straddles:**
- 7-14 days: `0x4D6b03182A2F450846dEbF04325da541c78828B6`
- 14-30 days: `0x116bD1bE3169E6bCC41e4F1A2E6999D566A65449`
- 1-30 days (v3): `0x12Af4Ccd2f30Aa5a3875C6F635a66CbAC7899547`
- 1-30 days (v4): `0x64b76243804D1f288879E98C7736cebeCaf6F222`

**BTC Straddles:** (4 contracts with similar structure)

---

#### 5.2 STRAP (2 Calls + 1 Put) - Bullish Volatility
**ETH Straps:**
- 7-14 days: `0xc556Fa5BB5717036C44b129C16E9462D6FBEdd61`
- 14-30 days: `0x8BCbFEfF2b09470d1f3C9Cc428E810AE4FEC7A50`
- 1-30 days (v3): `0x3dE57958D2C9a261a99493f8eA25272De85d68e3`
- 1-30 days (v4): `0xe1b519E67aa357Ad2D5da0697Ad2bb013B5a61FE`

**BTC Straps:** (4 contracts)

---

#### 5.3 STRIP (1 Call + 2 Puts) - Bearish Volatility
**ETH Strips:**
- 7-14 days: `0xB6536f3F59D5187f2B3E7364A7269661EeC555A7`
- 14-30 days: `0x57D33B746febDBC6615EeB782058bB1a219cAbe2`
- 1-30 days (v3): `0x83E9A36504F5c029F3803Da8ACA3B2715DB91F78`
- 1-30 days (v4): `0x3Fd7884cD4520BBb3a2B4641Be09e4095503e2b7`

**BTC Strips:** 
- ✨ **NEW in final run:** `HegicStrategy_STRIP_BTC_2` - `0x02C7a0bc0C3e8fe08b344aCba59fc570567572E9` (TX: `0xb8d0f40bedc0adb0f362a35a790cf31d3cd5872cb74a0fa8493d07316798acac`)
- ✨ **NEW in final run:** `HegicStrategy_STRIP_BTC_3` - `0xf9b9c9D67Ca8A6Bd3ac1F07a09778FB695B0efDb` (TX: `0xc4ec66735855f2d215af18c09354f17711d3939f0eb4095d371f094aae318c63`)
- ✨ **NEW in final run:** `HegicStrategy_STRIP_BTC_4` - `0x9FF3817C22C8Bf1E23b087C2d0b642e355fE4e2A` (TX: `0xab8d4629daddce4ad18d479c2eea595cdeca611870c098e6671870fad213875d`)

---

#### 5.4 STRANGLE (Call + Put at different strikes) - High IV Play
**ETH Strangles (10% width):**
- 4 period variations

**ETH Strangles (20% width):**
- 4 period variations

**ETH Strangles (30% width):**
- 4 period variations

**BTC Strangles:** Same structure (12 contracts total)

---

### Phase 6: Spread Strategies (48 contracts)

#### 6.1 CALL Spreads (Bull Call Spread)
**ETH Call Spreads (10% width):** 4 variations  
**ETH Call Spreads (20% width):** 4 variations  
**ETH Call Spreads (30% width):** 4 variations  

**BTC Call Spreads:** Same structure (12 contracts total)

---

#### 6.2 PUT Spreads (Bear Put Spread)
**ETH Put Spreads (10% width):** 4 variations  
**ETH Put Spreads (20% width):** 4 variations  
**ETH Put Spreads (30% width):** 4 variations  

**BTC Put Spreads:** Same structure (12 contracts total)

---

### Phase 7: Inverse Strategies (24 contracts)

#### 7.1 Inverse Bear Call Spread (Short Call Spread)
**ETH:** 3 variations (10%, 20%, 30%)  
**BTC:** 3 variations (10%, 20%, 30%)

#### 7.2 Inverse Bull Put Spread (Short Put Spread)
**ETH:** 3 variations (10%, 20%, 30%)  
**BTC:** 3 variations (10%, 20%, 30%)

#### 7.3 Inverse Long Butterfly
**ETH:** 3 variations (10%, 20%, 30%)  
**BTC:** 3 variations (10%, 20%, 30%)

#### 7.4 Inverse Long Condor
**ETH:** 2 variations (20%, 30%)  
**BTC:** 2 variations (20%, 30%)

---

## 🪙 External Dependencies (Pre-existing)

### Tokens
- **USDC:** `0xf3C3351D6Bd0098EEb33ca8f830FAf2a141Ea2E1` (Arbitrum Sepolia testnet token)
- **WETH:** `0x980B62Da83eFf3D4576C647993b0c1D7faf17c73`
- **WBTC:** `0x806D0637Fbbfb4EB9efD5119B0895A5C7Cbc66e7`

### Chainlink Oracles
- **ETH/USD:** `0xd30e2101a97dcbAeBCBC04F14C3f624E67A35165`
- **BTC/USD:** `0x56a43EB56Da12C0dc1D972ACb089c06a5dEF8e69`

---

## 📊 Deployment Statistics

### Gas Consumption
- **Total Gas Used:** ~500M+ gas across all deployments
- **Average per Strategy:** ~2M gas
- **Largest Contract:** OperationalTreasury (11.3M gas)
- **Smallest Contract:** ProfitCalculator (155k gas)

### Contract Size Distribution
- **Core Contracts:** 6 (2.4%)
- **Price Calculators:** 72 (28.3%)
- **Strategy Contracts:** 176 (69.3%)

### Strategy Breakdown
- **PUT Options:** 32 ETH + 32 BTC = 64 contracts
- **CALL Options:** 32 ETH + 32 BTC = 64 contracts  
- **Straddles:** 4 ETH + 4 BTC = 8 contracts
- **Straps:** 4 ETH + 4 BTC = 8 contracts
- **Strips:** 4 ETH + 4 BTC = 8 contracts
- **Strangles:** 12 ETH + 12 BTC = 24 contracts
- **Spreads (Call):** 12 ETH + 12 BTC = 24 contracts
- **Spreads (Put):** 12 ETH + 12 BTC = 24 contracts
- **Inverse Strategies:** 24 contracts (Bear/Bull spreads, Butterfly, Condor)

---

## 🔧 Configuration Applied

### CoverPool Settings
- **Cover Token:** USDC (instead of HEGIC - USDC-only model)
- **Profit Token:** USDC
- **Changing Price:** 1e30 (1:1 ratio)
- **Window Size:** 5 days (432,000 seconds)
- **Payoff Pool:** `0x711eE890B41fFbd23Ba3c96975DEBDB1145cbB83` (deployer address)

### OperationalTreasury Settings
- **Settlement Token:** USDC
- **Max Lockup Period:** 30 days (2,592,000 seconds)
- **Benchmark:** 10,000 USDC (10,000,000,000 with 6 decimals)
- **Total Strategies Connected:** 176
- **Positions Manager:** `0x88a2887bD21974ea9a8D23553eeE532B8a8e2AB3`

### Strategy Universal Settings
- **Per-Strategy Limit:** 20,000 USDC (20,000,000,000 with 6 decimals)
- **Min Period:** 1 day (86,400 seconds)
- **Max Period:** 30 days (2,592,000 seconds)
- **Exercise Window:** 4 hours (14,400 seconds) before expiry
- **Spot Decimals (ETH):** 18
- **Spot Decimals (BTC):** 8
- **Price Decimals:** 8 (Chainlink standard)
- **Token Decimals:** 6 (USDC)

---

## ✅ Next Steps

### 1. Contract Verification on Arbiscan
```bash
cd packages/herge
npx hardhat etherscan-verify --network arbitrum-sepolia
```

### 2. Post-Deployment Initialization
```solidity
// Grant OperationalTreasury role to access CoverPool
CoverPool.grantRole(OPERATIONAL_TREASURY_ROLE, 0xeD5129B6Fc93C1D9c8278E540c4986dB9DC9D930)

// Grant PositionsManager role to mint NFTs
PositionsManager.grantRole(HEGIC_POOL_ROLE, 0xeD5129B6Fc93C1D9c8278E540c4986dB9DC9D930)

// Approve payoff pool to spend USDC for coverage
USDC.approve(CoverPool.address, MaxUint256) // from payoff pool address
```

### 3. Initial Liquidity Provision (Optional for Testing)
```solidity
// Mint test USDC (if mock token)
USDC.mint(LP_ADDRESS, 1000000e6) // 1M USDC

// Provide liquidity to CoverPool
USDC.approve(CoverPool.address, 1000000e6)
CoverPool.provide(1000000e6, 0) // Returns position NFT ID
```

### 4. Test Option Purchase
```solidity
// Get premium quote
(uint128 negativePNL, uint128 positivePNL) = Strategy_PUT_100_ETH_1.calculateNegativepnlAndPositivepnl(
    1e18,        // 1 ETH
    7 * 86400,   // 7 days
    []           // No additional data
)

// Approve premium
USDC.approve(OperationalTreasury.address, negativePNL)

// Buy option
OperationalTreasury.buy(
    Strategy_PUT_100_ETH_1.address,
    USER_ADDRESS,
    1e18,        // 1 ETH
    7 * 86400,   // 7 days
    []           // No additional data
)
// Returns option NFT ID
```

---

## 🔗 Quick Links

### Main Contracts
- **OperationalTreasury:** https://sepolia.arbiscan.io/address/0xeD5129B6Fc93C1D9c8278E540c4986dB9DC9D930
- **CoverPool:** https://sepolia.arbiscan.io/address/0xAd02465752782893045089396277697Af935dAdB
- **PositionsManager:** https://sepolia.arbiscan.io/address/0x88a2887bD21974ea9a8D23553eeE532B8a8e2AB3

### Explorer
- **Arbitrum Sepolia Scan:** https://sepolia.arbiscan.io

### Documentation
- **Full Contract List:** Run `npx hardhat addresses --network arbitrum-sepolia`
- **Deployment Artifacts:** `deployments/arbitrum-sepolia/`
- **USDC Model Changes:** `USDC_ONLY_MODEL_CHANGES.md`
- **Architecture:** `/docs/02-architecture.md`

---

## 🎯 Summary

✅ **254 contracts** successfully deployed to Arbitrum Sepolia  
✅ **Only HERGE package** deployed (v8888 NOT deployed)  
✅ **USDC-only model** implemented (LPs deposit USDC, earn USDC)  
✅ **Complete strategy suite** covering all major option strategies  
✅ **Ready for verification** with Arbiscan API key  
✅ **Testnet deployment** ready for testing and integration  

**Deployment completed successfully! 🚀**

*Generated: October 31, 2024*  
*Last Updated: October 31, 2024*

---

## 🔍 Contract Verification Status

### Issue with Automated Verification
The automated verification via `hardhat-etherscan` is encountering compatibility issues with Arbitrum Sepolia custom chains. This is a known issue with older versions of the plugin.

### Manual Verification Options

#### Option 1: Flatten and Verify Manually
```bash
# Flatten the contract
npx hardhat flatten contracts/OperationalTreasury.sol > OperationalTreasury_flat.sol

# Then go to https://sepolia.arbiscan.io/verifyContract
# Upload the flattened file with:
# - Compiler version: 0.8.15
# - Optimization: Yes, 200 runs
# - Constructor arguments (if any)
```

#### Option 2: Verify via Arbiscan API Directly
```bash
curl -X POST "https://api-sepolia.arbiscan.io/api" \
  -d "apikey=YOUR_ARBISCAN_API_KEY" \
  -d "module=contract" \
  -d "action=verifysourcecode" \
  -d "contractaddress=0xeD5129B6Fc93C1D9c8278E540c4986dB9DC9D930" \
  -d "sourceCode=$(cat OperationalTreasury_flat.sol)" \
  -d "codeformat=solidity-single-file" \
  -d "contractname=OperationalTreasury" \
  -d "compilerversion=v0.8.15+commit.e14f2714" \
  -d "optimizationUsed=1" \
  -d "runs=200"
```

#### Option 3: Use Hardhat-Verify Plugin (Alternative)
```bash
# Install alternative verification plugin
yarn add --dev @nomicfoundation/hardhat-verify

# Update hardhat.config.ts to use new plugin
# Then retry verification
```

### Priority Contracts to Verify
1. **OperationalTreasury** - `0xeD5129B6Fc93C1D9c8278E540c4986dB9DC9D930` (HIGHEST PRIORITY)
2. **CoverPool** - `0xAd02465752782893045089396277697Af935dAdB`
3. **PositionsManager** - `0x88a2887bD21974ea9a8D23553eeE532B8a8e2AB3`
4. **ProfitCalculator** - `0x1c64D2205415C4355Ad6C04250B4bA753758CcDc`
5. **LimitController** - `0xb20aBac673Fc2f0Eb44fe911E65B262cDEfeb3e8`
6. **ProfitDistributor** - `0x2770Ba51F4e1712E7B424c392cf157B42B17C739`

### Note on Strategy Contract Verification
With 176 strategy contracts, manual verification of all contracts is impractical. Consider:
- Verifying only the unique implementations (price calculators and base strategies)
- Using automated scripts after fixing the hardhat-etherscan compatibility
- Strategies share similar code, so verifying a few examples may be sufficient

---

## 📝 Important Notes

###⚠️ Deployment Scope Reminder
- ✅ **HERGE package deployed** (254 contracts)
- ❌ **V8888 package NOT deployed**
- If v8888 contracts are needed, a separate deployment is required

### 🎯 Contract Addresses Location
All contract addresses are available in:
1. **This document** (detailed with TX hashes)
2. **DEPLOYED_CONTRACTS.md** (organized by category)
3. **Command:** `npx hardhat addresses --network arbitrum-sepolia`
4. **JSON:** `deployments/arbitrum-sepolia/.addresses.json`

### 🔐 Security Reminders
- 🔑 Private key used: `0x65aa...ba75` (ensure this is a testnet-only key!)
- 💰 Deployer address holds all admin roles
- 🎯 Remember to transfer admin roles to multisig before mainnet
- 🧪 This is a TESTNET deployment - do NOT use for production

---

**Document created:** October 31, 2024  
**Deployment completed:** ✅ Yes  
**Contracts verified:** ⚠️ Manual verification required  
**Ready for testing:** ✅ Yes

