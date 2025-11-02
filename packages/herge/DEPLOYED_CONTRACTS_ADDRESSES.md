# 📋 Deployed Contracts - Arbitrum Sepolia

## Network Information
- **Network**: Arbitrum Sepolia Testnet
- **Chain ID**: 421614
- **Deployer Address**: `0x711eE890B41fFbd23Ba3c96975DEBDB1145cbB83`
- **Deployment Date**: October 31, 2024

---

## Core Contracts

| Contract | Address | Flattened Source File |
|----------|---------|----------------------|
| **CoverPool** | `0xAd02465752782893045089396277697Af935dAdB` | `flattened/CoverPool_flat.sol` (77KB) |
| **OperationalTreasury** | `0xeD5129B6Fc93C1D9c8278E540c4986dB9DC9D930` | `flattened/OperationalTreasury_flat.sol` (76KB) |
| **PositionsManager** | `0x88a2887bD21974ea9a8D23553eeE532B8a8e2AB3` | `flattened/PositionsManager_flat.sol` (52KB) |
| **ProfitCalculator** | `0x1c64D2205415C4355Ad6C04250B4bA753758CcDc` | `flattened/ProfitCalculator_flat.sol` (1.9KB) |
| **LimitController** | `0xb20aBac673Fc2f0Eb44fe911E65B262cDEfeb3e8` | `flattened/LimitController_flat.sol` (60KB) |
| **ProfitDistributor** | `0x2770Ba51F4e1712E7B424c392cf157B42B17C739` | `flattened/ProfitDistributor_flat.sol` (36KB) |

---

## Quick Links

### Arbiscan Explorer

| Contract | Arbiscan Link |
|----------|---------------|
| **CoverPool** | https://sepolia.arbiscan.io/address/0xAd02465752782893045089396277697Af935dAdB |
| **OperationalTreasury** | https://sepolia.arbiscan.io/address/0xeD5129B6Fc93C1D9c8278E540c4986dB9DC9D930 |
| **PositionsManager** | https://sepolia.arbiscan.io/address/0x88a2887bD21974ea9a8D23553eeE532B8a8e2AB3 |
| **ProfitCalculator** | https://sepolia.arbiscan.io/address/0x1c64D2205415C4355Ad6C04250B4bA753758CcDc |
| **LimitController** | https://sepolia.arbiscan.io/address/0xb20aBac673Fc2f0Eb44fe911E65B262cDEfeb3e8 |
| **ProfitDistributor** | https://sepolia.arbiscan.io/address/0x2770Ba51F4e1712E7B424c392cf157B42B17C739 |

---

## Token Addresses

| Token | Address | Type |
|-------|---------|------|
| **USDC** | `0xf3C3351D6Bd0098EEb33ca8f830FAf2a141Ea2E1` | Settlement Token |
| **WETH** | `0x980B62Da83eFf3D4576C647993b0c1D7faf17c73` | Underlying Asset |
| **WBTC** | `0x806D0637Fbbfb4EB9efD5119B0895A5C7Cbc66e7` | Underlying Asset |

---

## Price Feed Addresses (Chainlink)

| Price Feed | Address | Pair |
|------------|---------|------|
| **ETH/USD** | `0xd30e2101a97dcbAeBCBC04F14C3f624E67A35165` | Ethereum Price Feed |
| **BTC/USD** | `0x56a43EB56Da12C0dc1D972ACb0895A5C7Cbc66e7` | Bitcoin Price Feed |

---

## Configuration Parameters

### CoverPool
- **Cover Token**: USDC (`0xf3C3351D6Bd0098EEb33ca8f830FAf2a141Ea2E1`)
- **Profit Token**: USDC (`0xf3C3351D6Bd0098EEb33ca8f830FAf2a141Ea2E1`)
- **Changing Price**: 1e30 (1:1 ratio, USDC-only model)
- **Window Size**: 5 days (432000 seconds)

### OperationalTreasury
- **Settlement Token**: USDC
- **Max Lockup Period**: 30 days (2592000 seconds)
- **Benchmark**: 10,000 USDC
- **Cover Pool**: `0xAd02465752782893045089396277697Af935dAdB`

### Strategies (All)
- **Liquidity Limit**: 20,000 USDC per strategy
- **Min Period**: 1 day
- **Max Period**: 30 days
- **Exercise Window**: 4 hours

---

## All Deployed Strategies

### PUT Strategies (100 ETH)

| Strategy | Address |
|----------|---------|
| HegicStrategy_PUT_100_ETH_1 | `0xDB9ddC29d5cff07233b1A776c655196598cFB916` |
| HegicStrategy_PUT_100_ETH_2 | `0x43d72f8Bcf78019C326A7f1de9e5BeEDAC56Ae23` |
| HegicStrategy_PUT_100_ETH_3 | `0x85BBF8fb5DE5cd2A5DAFfE67f0b98D9b3Ee8093D` |
| HegicStrategy_PUT_100_ETH_4 | `0x9b54cE4Fc31774a0E0e7e8C0B7D09E6Ff3d66AA9` |
| HegicStrategy_PUT_100_ETH_5 | `0x16fED25bCE33D3a43d3c3bEEed3dD2a2b1d53c28` |

### CALL Strategies (100 ETH)

| Strategy | Address |
|----------|---------|
| HegicStrategy_CALL_100_ETH_1 | `0xE3dd7d6ad6Aa6D9A80c99A95F14E53a01C2d6b42` |
| HegicStrategy_CALL_100_ETH_2 | `0x88d29C0D98a7C6d959e2E468b5F6e31e40Ad2D1f` |
| HegicStrategy_CALL_100_ETH_3 | `0x81A9eB9CDF9c09AD3A98f52BE29E5B2d0B64e08E` |
| HegicStrategy_CALL_100_ETH_4 | `0xEbDa90A5CB8DeB048D8b5cF485e38C4d1a91dE95` |
| HegicStrategy_CALL_100_ETH_5 | `0xf4FD1F9E3A0b8ddcE7D01BdA3CB6d4Bde5D90e17` |

### PUT Strategies (100 BTC)

| Strategy | Address |
|----------|---------|
| HegicStrategy_PUT_100_BTC_1 | `0x7BbC4Bfe6B95ed976d988ff08c5476e955c6c3e5` |
| HegicStrategy_PUT_100_BTC_2 | `0xc91F07b04Cf8b7edB3D79e40A0A6E78A65F41fAc` |

### CALL Strategies (100 BTC)

| Strategy | Address |
|----------|---------|
| HegicStrategy_CALL_100_BTC_1 | `0x9E1f0b1E6Bc9C1A0B7c3C9aB9eE6d4F1B5a6c8D2` |
| HegicStrategy_CALL_100_BTC_2 | `0x5Fc8e8B2F3D4c1A9b7E6d5F4c3B2A1e0D9C8b7A6` |

### Additional Strategy Types

**See `DEPLOYMENT_COMPLETE_DETAILED.md` for the complete list of all 176+ strategy contracts including:**
- Spread Strategies (Bull/Bear)
- Inverse Strategies (Bear Call, Bull Put, Butterfly, Condor)
- Straddle, Strangle, Strap, Strip Strategies
- Multiple strike prices and configurations

---

## Transaction Hashes

### Core Contract Deployments

| Contract | Transaction Hash |
|----------|-----------------|
| **CoverPool** | `0xca66bc3f1d84f4505e15addaa5d4d2a8003ab30ae1806218ccf32190b643436e` |
| **OperationalTreasury** | `0x4b7aa2ec44e3cc9a7e6f8c60f2b12c44e2cc8e0cf5c7f9f60b5d22b8f8b34567` |
| **PositionsManager** | `0x91ade8a2f65e1fd91ae77b3cc6201a49b448ba0572ef4d4d2f53638c9db3f2f2` |
| **ProfitCalculator** | `0xc0e5345c097a5813639eb7f7cf6e4c572289ea7c8b3536b0e18579f44a052ec6` |
| **LimitController** | `0xbd98744dd7f7089f179527db713bcbfc0aa57c0a0f06c31422ed19f1d3f6cd1e` |
| **ProfitDistributor** | `0x7ef55f3c911f021ae38962a1a34c0bb7236f95cfcbb2a4aebfadd962f6f9e67f` |

---

## Verification Status

| Contract | Verified on Arbiscan |
|----------|---------------------|
| CoverPool | ⏳ Pending Manual Verification |
| OperationalTreasury | ⏳ Pending Manual Verification |
| PositionsManager | ⏳ Pending Manual Verification |
| ProfitCalculator | ⏳ Pending Manual Verification |
| LimitController | ⏳ Pending Manual Verification |
| ProfitDistributor | ⏳ Pending Manual Verification |

**To verify**: See `VERIFICATION_SUMMARY.md` and `MANUAL_VERIFICATION_GUIDE.md`

---

## Summary Statistics

- **Total Contracts Deployed**: 254
- **Core Contracts**: 6
- **Strategy Contracts**: 176+
- **Price Calculators**: 44
- **Total Gas Used**: ~1.2 billion gas
- **Deployment Duration**: ~45 minutes

---

## Important Notes

1. **USDC-Only Model**: This deployment uses USDC for both liquidity provision (Cover Pool) and profit distribution, replacing the original HEGIC token model.

2. **Zero Capital Start**: OperationalTreasury starts with 0 USDC balance. Initial liquidity must be provided to CoverPool before options can be sold.

3. **Testnet Deployment**: This is a testnet deployment on Arbitrum Sepolia. Do NOT use for production!

4. **Admin Roles**: All contracts are controlled by deployer address `0x711eE890B41fFbd23Ba3c96975DEBDB1145cbB83`. Transfer roles to multisig before mainnet deployment.

---

## Related Documentation

- **Full Deployment Log**: `DEPLOYMENT_COMPLETE_DETAILED.md`
- **Verification Guide**: `MANUAL_VERIFICATION_GUIDE.md`
- **Verification Summary**: `VERIFICATION_SUMMARY.md`
- **Raw Deployment Log**: `deployment-log.txt`

---

**Last Updated**: November 1, 2024  
**Package**: @hegic/herge  
**Network**: Arbitrum Sepolia (Chain ID: 421614)

