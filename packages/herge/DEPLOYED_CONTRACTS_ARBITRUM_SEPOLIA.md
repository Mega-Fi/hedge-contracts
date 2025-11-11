# Hegic Protocol - Deployed Contracts on Arbitrum Sepolia

**Deployment Date:** 2025-11-05
**Network:** Arbitrum Sepolia Testnet (Chain ID: 421614)
**Deployer:** 0x711eE890B41fFbd23Ba3c96975DEBDB1145cbB83
**Model:** USDC-Only (LPs deposit USDC, earn USDC)
**USDC Token:** `0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d`

---

## ✅ Deployment Summary

- **Total Contracts Deployed:** 255
- **Core Contracts:** 6
- **Price Calculators:** 62
- **Strategy Contracts:** 182
- **Deployment Status:** ✅ Complete

---

## 🛠️ Post-Deployment Actions (Must Run Before Production)

- **Seed the CoverPool (Position 0)**  
  - Only the contract owner/admin (`0x711eE890B41fFbd23Ba3c96975DEBDB1145cbB83`) can create position ID `0`.  
  - Run `npx hardhat --network arbitrum-sepolia run scripts/initialize-coverpool.js` (or replicate on mainnet) to deposit the first 10 USDC and keep the entry window open for LPs.

- **Grant `HEGIC_POOL_ROLE` to OperationalTreasury**  
  - `PositionsManager` and every deployed strategy expect the treasury (`0x3B026eD677615aDD2aC32aa5D1D5453051551EfB`) to hold the `HEGIC_POOL_ROLE` (`0x985c…be6f`).  
  - After each deployment, run `npx hardhat --network arbitrum-sepolia run scripts/grant-role.js` (or the mainnet equivalent) so option purchases don’t revert with `AccessControl` errors.

> ✅ These steps have been executed on Arbitrum Sepolia (tx hashes logged in the deployment scripts). Repeat them during any future/mainnet deployment.

---

## 🔑 Core Contracts (Chronological Order)

| # | Contract Name | Address | Purpose |
|---|---------------|---------|---------|
| 1 | **CoverPool** | `0x7174db190fF9D9AD136B39EdeEffBC2451FC1C5b` | USDC liquidity pool for backstop coverage |
| 2 | **ProfitDistributor** | `0xFF9031382D9cdd44A95FC6e5EbE74BF2C3591069` | Distributes profits to LPs |
| 3 | **PositionsManager** | `0x143c34DD579Ea5737284f06f4e4Ad581d4C42662` | ERC721 NFT manager for options |
| 4 | **ProfitCalculator** | `0xDb7D577F1345AD74B125501F4B68240F44ed7e60` | Calculates option payoffs |
| 5 | **LimitController** | `0x6147765312700A1aaFe4Aee9c6469091C6A3F4Ac` | Controls strategy limits |
| 6 | **OperationalTreasury** | `0x3B026eD677615aDD2aC32aa5D1D5453051551EfB` | ⭐ **Main contract** - Creates and settles options |

---

## 🪙 Token & Oracle Contracts

| Contract Name | Address | Type |
|---------------|---------|------|
| **USDC** | `0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d` | Settlement Token |
| **WETH** | `0x980B62Da83eFf3D4576C647993b0c1D7faf17c73` | Underlying Asset |
| **WBTC** | `0x806D0637Fbbfb4EB9efD5119B0895A5C7Cbc66e7` | Underlying Asset |
| **PriceProviderBTC** | `0x56a43EB56Da12C0dc1D972ACb089c06a5dEF8e69` | Chainlink BTC/USD Oracle |
| **PriceProviderETH** | `0xd30e2101a97dcbAeBCBC04F14C3f624E67A35165` | Chainlink ETH/USD Oracle |

---

## 📊 Strategy Contracts by Type

### PUT Options - ETH (100% Strike)
| Period | Address |
|--------|---------|
| Variant 1 | `0xE9066E3f9B46560E9B343A65b19f2848B48d7c39` |
| Variant 2 | `0x0C69820D54cA46A799b104Ca9f4AF463F33e1096` |
| Variant 3 | `0xE4139D3D0819DE24826Fa697084f8622D99Ba3a8` |
| Variant 4 | `0x5200fA9552Fda18B0A64c157a909C57Cb6B1B86d` |

### PUT Options - ETH (90% Strike)
| Period | Address |
|--------|---------|
| Variant 1 | `0x5C031a9147aA150f2BEEBE4317fb5f494850Df1A` |
| Variant 2 | `0x14eFb9a4ecDa5c4733Ed3420295941f8C09543b1` |
| Variant 3 | `0x9e43587F399e7d65b5eA427874564B7576bCd959` |
| Variant 4 | `0x5B1e146b9fdB6c59F7E5656a1b2DD0E98de5216e` |

### PUT Options - ETH (80% Strike)
| Period | Address |
|--------|---------|
| Variant 1 | `0x99cE148472f4a7F6256459fB96A6ef65281325EF` |
| Variant 2 | `0xeBA8460cEC7B444Ff0a825E0488b11885A33f069` |
| Variant 3 | `0x7D95FEdD30537bADA9afAFdE363607d098ad8FEA` |
| Variant 4 | `0xA52E861Cd3230c63484E55FD728f7A2ad5F55D0a` |

### PUT Options - ETH (70% Strike)
| Period | Address |
|--------|---------|
| Variant 1 | `0x0b2366Bd95E90EB1c2078C637A6A1f54EdFc40ca` |
| Variant 2 | `0x4c164817691eBBCb1F5ed6cdC13218689443C105` |
| Variant 3 | `0xCFe77AA40E7C42E743B378515B1DaE51C70f7542` |
| Variant 4 | `0xbFC1D1671b66E94392F93e2d495A050fcb9C14d8` |

### CALL Options - ETH (100% Strike)
| Period | Address |
|--------|---------|
| Variant 1 | `0x2F3afA85386BFdd1c2b173c28719a17Acba8667F` |
| Variant 2 | `0x077B0014fD8F741D7800A14446c6583FD30877E1` |
| Variant 3 | `0x5F06dDcec60c9723E3Af3fcb77eA96b4306684E2` |
| Variant 4 | `0x2B8186f251e529c01c194dFE2b5e1FAa96d98C7d` |

### CALL Options - ETH (110% Strike)
| Period | Address |
|--------|---------|
| Variant 1 | `0x542830818bfA144143c4aaf0b2F37A99405ac9B6` |
| Variant 2 | `0x40c1eb84cEED5F665D4962130e39f008C60707aB` |
| Variant 3 | `0xdBeC43592C7BAaA6e161566a82985c10dCD468c0` |
| Variant 4 | `0x62233E6eBe0126D9869f04F0bDD21A86676B4558` |

### CALL Options - ETH (120% Strike)
| Period | Address |
|--------|---------|
| Variant 1 | `0x85935D8CcDE6BF52f35132066941274b3bDf51E5` |
| Variant 2 | `0x8F97f3Fec1AD9388224EB62B96cC2cA0d5C29A2F` |
| Variant 3 | `0xa04A5028ff0015B49df270099311628d9392A289` |
| Variant 4 | `0x018fc527e50123FC9fCC1c0642c0BbFaA5E22E45` |

### CALL Options - ETH (130% Strike)
| Period | Address |
|--------|---------|
| Variant 1 | `0x60098c02477CCcd6892A906760eFA366c55e2102` |
| Variant 2 | `0x50DD57b48f6a6F7FF1355B107864A7bD80CA20d3` |
| Variant 3 | `0x230806C60d5BC0151564614daD8A2E2D9CF4d66e` |
| Variant 4 | `0x6F31B65C43c64eb0aAE169ddc16FabFFF5Ee5046` |

### STRADDLE - ETH
| Period | Address |
|--------|---------|
| Variant 1 | `0xd1f4c4340e4ea46F2A496083516b13c766B9acfe` |
| Variant 2 | `0x63C07110C40355745053a705Cbd2756D074c174c` |
| Variant 3 | `0xFD6137ee7F0006BA27a010d0284EddDA50836a91` |
| Variant 4 | `0x665Cd8B69E553Dfaa97d5E43aA3545c4E8BBf13F` |

### STRANGLE - ETH (10%)
| Period | Address |
|--------|---------|
| Variant 1 | `0xF051f4c88a568fBCc1ABe011277b81ea986Db187` |
| Variant 2 | `0x4c23cb6b9aB402036eFdC64321176e441c5D6339` |
| Variant 3 | `0x54D545E1c47274B4a8Fbf7A705D042200956b4E1` |
| Variant 4 | `0x600ca6C524b73A68f2589c9B61637701868285d4` |

### STRANGLE - ETH (20%)
| Period | Address |
|--------|---------|
| Variant 1 | `0x886f7E890dD6c04A543fc5925861bF6744A74c30` |
| Variant 2 | `0x5fa149EB34a878d04bebD37b336ee19D10a4199e` |
| Variant 3 | `0xcF76731054c2303C465F372197bc4B8d8F9deCf9` |
| Variant 4 | `0x9DbCb3155d011156dAE9Fa6A74057CE222715769` |

### STRANGLE - ETH (30%)
| Period | Address |
|--------|---------|
| Variant 1 | `0xC5a4091575a034A2E04c2E68aaf791132e10473c` |
| Variant 2 | `0xBFdcDc436d50Ba97ee888AE1c71FD5373d1EEa90` |
| Variant 3 | `0xD91cf23411140945bE894a88ca69Edf53723bac9` |
| Variant 4 | `0x1952094F7D02a8d827aFfE805Ca9c06f8C1ef228` |

### STRAP - ETH
| Period | Address |
|--------|---------|
| Variant 1 | `0xaF6EAB8217C781fBf7b490d632e5aA92A45dEE32` |
| Variant 2 | `0xBFCf05135c3d4507e69E22260C2Bc73e15c1B358` |
| Variant 3 | `0xF4C2638E1a98192297A392fe9c276DF801aDa413` |
| Variant 4 | `0x67df3B40BbF58437BB20b09Fa35487B3F97F9584` |

### STRIP - ETH
| Period | Address |
|--------|---------|
| Variant 1 | `0xd73b0cd71B61a29FC733Dd7249aF551eDa2c39F8` |
| Variant 2 | `0x6131dcEFfD44bA688D0ed4cB19fE2d4603Ef1ade` |
| Variant 3 | `0x8E6f5c90fa8D831f739F56567E85Ca3A6b8a2453` |
| Variant 4 | `0x029a65E77786Ad1a690548baFD53216478B78B1a` |

### SPREAD CALL - ETH (10%)
| Period | Address |
|--------|---------|
| Variant 1 | `0x16A20433b4364f1a2B06B24C1a45068384C485fB` |
| Variant 2 | `0x4fd057Dfd23121B83aAc8f35FD9E379d7a5a0f0D` |
| Variant 3 | `0x7cE6a9016CD5EE92dA4d975188E16558203F63dA` |
| Variant 4 | `0xE42dE000a14075d5f516D3EAacC30384f1c3F4fe` |

### SPREAD CALL - ETH (20%)
| Period | Address |
|--------|---------|
| Variant 1 | `0x21964f93A2445fC4aDC8e307a4dE17e9aB83B222` |
| Variant 2 | `0xbC337313b348cA6EFC0472b5127FA0a6507ea18F` |
| Variant 3 | `0x5fa65A4C0C923Da2A3511A31d4CcE8A8f8785Bac` |
| Variant 4 | `0x132Ce291DC0a50B4d326ed07728BaCD5C1227275` |

### SPREAD CALL - ETH (30%)
| Period | Address |
|--------|---------|
| Variant 1 | `0xdB6B18ceEC956Ac945b6bdf598eBA5F943019b7E` |
| Variant 2 | `0x59bf8102973D49753332bB7238821ABcDd59F3aE` |
| Variant 3 | `0x03F4442e193D8D329E3555a1cC701b2b69A17b77` |
| Variant 4 | `0x01287e9c3F72a4Ba600079Cd17894C56DB5bcEd7` |

### SPREAD PUT - ETH (10%)
| Period | Address |
|--------|---------|
| Variant 1 | `0x07723FB80783ea3dB8fE7BB5f174E634feF6b124` |
| Variant 2 | `0x86f2517F837fB94128D1cB974d4bB3035d388A23` |
| Variant 3 | `0xDA7b5495701705AFE1EF58E5F0ef24b57356C381` |
| Variant 4 | `0x50b7e53149aBddD7ebB25C85e47dE5e32fF52567` |

### SPREAD PUT - ETH (20%)
| Period | Address |
|--------|---------|
| Variant 1 | `0xD73916b0906f0Ad6dad4FC33Cd017E97E41680F8` |
| Variant 2 | `0xeeD5d1d1351324b1EE2E3035df0BbB22BDa96D4B` |
| Variant 3 | `0x5831c59C6C738B567a998EA0CE5432C5Da78A419` |
| Variant 4 | `0xAEd3BaFaaBb01c17a00E28d428159e1d4c71db92` |

### SPREAD PUT - ETH (30%)
| Period | Address |
|--------|---------|
| Variant 1 | `0x6A9fE94E4e8EA28f34B5888c25f789877dd1828D` |
| Variant 2 | `0x8872D7B37ea9870b4c3682eeF015a851beEc1B04` |
| Variant 3 | `0x9A8DD588c90D202ac54957B68B97793E2FBe528f` |
| Variant 4 | `0x7b07564cb1f189c78Fd31c99c0d75e626192EbCf` |

### PUT Options - BTC (100% Strike)
| Period | Address |
|--------|---------|
| Variant 1 | `0xb2B0f4BdFE5aebD4E78611eB7B76be640d230a06` |
| Variant 2 | `0x45921D09CDEca4D3b97279395174882D553e827D` |
| Variant 3 | `0xB6273ce1311Dbd19307CCa255cAB211427Fd7F2D` |
| Variant 4 | `0x2cDA86120f4aC0958B1c9058Ded91F2f974fcB69` |

### PUT Options - BTC (90% Strike)
| Period | Address |
|--------|---------|
| Variant 1 | `0x33BCC71568477Dc8f3EfcDD1FCF23240e1be21c2` |
| Variant 2 | `0x6d972D78641E6980d7E809b0A9D1C5F8862513bF` |
| Variant 3 | `0x81bF85756133F0195a828914b0A9D589e2cd2f51` |
| Variant 4 | `0xF3FA4E28601ee1356D6085cE680397abBe60077D` |

### PUT Options - BTC (80% Strike)
| Period | Address |
|--------|---------|
| Variant 1 | `0x177bC1CA4C744A98C15B2665d1Ee5fbB1658a879` |
| Variant 2 | `0x27Da39f7EC7cf5fF831908BeD2Da105448C07Ef7` |
| Variant 3 | `0x68d5611219dbC24b75aF97AbA34161a420b5bc46` |
| Variant 4 | `0x032223f453fB0112eb2FEd94c901AcD7ea7D76D3` |

### PUT Options - BTC (70% Strike)
| Period | Address |
|--------|---------|
| Variant 1 | `0xf78b45b050761B1C42Ffd5f92ED9C0A91cd6f21f` |
| Variant 2 | `0xadE12183201D61a01C8536AB57c33dcf3D6ba047` |
| Variant 3 | `0x16FBE21f385894837FF3754e03Ce9988f89749ec` |
| Variant 4 | `0xAe36ec80F1e83ebB413B579b0555Be5b5910d64d` |

### CALL Options - BTC (100% Strike)
| Period | Address |
|--------|---------|
| Variant 1 | `0xA48aD9F7EbC2e7b4D6BafA4F2E7C21739807710f` |
| Variant 2 | `0x50178Eb4099b9B23748c0dD5c031d5ec56AdaD6A` |
| Variant 3 | `0xCd8d2Ede17F1A04799715d12fe2Ca99d7459453b` |
| Variant 4 | `0x0dc63ea141F3c249131CD5aEb5563D560EEfdc8D` |

### CALL Options - BTC (110% Strike)
| Period | Address |
|--------|---------|
| Variant 1 | `0xF3bE997D6966cB24279EABA13172b4f3Ce0eaE37` |
| Variant 2 | `0x0271581252DAAC48Ab70dabbD54F4845456AD621` |
| Variant 3 | `0x1A3019A6fE5bae82e5A9a6E71b8fA833E876C52F` |
| Variant 4 | `0x632E4F4c3b1F6536e27E322235fD39C9642caF4b` |

### CALL Options - BTC (120% Strike)
| Period | Address |
|--------|---------|
| Variant 1 | `0xC2A8Fa66F13B5a41De15aeD713296997B0A7A59a` |
| Variant 2 | `0x09e9ECD40a405B90a33D14622d4727DF1f643718` |
| Variant 3 | `0xc1E897fA9C113D8e13EA916B8b261A614A394324` |
| Variant 4 | `0xa43f71b5fbA749da98666151a59df67BdE2f2841` |

### CALL Options - BTC (130% Strike)
| Period | Address |
|--------|---------|
| Variant 1 | `0xb2b61E935d43643647d97F4D80Ca55579a7A7746` |
| Variant 2 | `0x819CA1481c5829d8539a742A1A695f81570EB6bf` |
| Variant 3 | `0x9414C76527BB288881e354Beb2d310c50F18c0F8` |
| Variant 4 | `0xaA914837D7faA63123098605DdFC08447524Fc47` |

### STRADDLE - BTC
| Period | Address |
|--------|---------|
| Variant 1 | `0x067873b9DE2CC715D4eD57173A1f045560785832` |
| Variant 2 | `0x981186dD22005213519D85a9A78a8F3AA3682836` |
| Variant 3 | `0xcE60993945DB7fA1afCc30d5b0Bb3aC32e4F99A9` |
| Variant 4 | `0x015511Be398C6FdA473a31e068F6F34F279012c2` |

### STRANGLE - BTC (10%)
| Period | Address |
|--------|---------|
| Variant 1 | `0xf620bC90001D843Fb9f3A264C77473A0127A775e` |
| Variant 2 | `0xcFd77Ca218737dBD90a25fa96Ce1169fFEA7a58E` |
| Variant 3 | `0x7477A816C5598C90cC2F659924597D358151b831` |
| Variant 4 | `0x422c0875768CE676779AACb0756B438ba74F1d70` |

### STRANGLE - BTC (20%)
| Period | Address |
|--------|---------|
| Variant 1 | `0xb92a070F0ea36Fc07921c09C544a7d036B82bf92` |
| Variant 2 | `0xA3536cbAa8a30910C31997B41EC726e0BbfDfe25` |
| Variant 3 | `0x15Bf9884b2e435083a6EbC562bED8FbbcB72c6c7` |
| Variant 4 | `0xDa74139Ae2f1ed209A7a9d9D24BBC62EA37a2D4D` |

### STRANGLE - BTC (30%)
| Period | Address |
|--------|---------|
| Variant 1 | `0xCD589eCF98E1bbe4D11d63cFc8fE9710aedFBB0E` |
| Variant 2 | `0x625890Cf93Ee5619EE9F88A31CB64D8fa8eD5e3E` |
| Variant 3 | `0xF2550BBDb7dD2D8c997CF56Ee4587Bb2d4E29C83` |
| Variant 4 | `0x0B9B9642fa9a7B67c1c994341d1863B78617364e` |

### STRAP - BTC
| Period | Address |
|--------|---------|
| Variant 1 | `0x9f6dfdD43CD3cD4357893b44efeF8F10901183b8` |
| Variant 2 | `0xb692E0d278De3dDd4b5FC4b23730C7176606604b` |
| Variant 3 | `0x35838d696B229b27a77Df7D71fC5a62A14784EC5` |
| Variant 4 | `0xBc6a1A20C2c0f6D1Ca14a5B3179f70e12B5A9f07` |

### STRIP - BTC
| Period | Address |
|--------|---------|
| Variant 1 | `0x4b60DC1597F9362778C5b28EC937177C95A80c29` |
| Variant 2 | `0xf3759Eb2Fe56F7dED53E8e1D03A98f2946bd652d` |
| Variant 3 | `0xD7f0dc52282608740C0DA98aB9026cf6dC64B367` |
| Variant 4 | `0x98a8Fb3dD40357C61088e8E5c47157294654F190` |

### SPREAD CALL - BTC (10%)
| Period | Address |
|--------|---------|
| Variant 1 | `0x29405E5fD624065c8Fe665243122613bf2f1F8bD` |
| Variant 2 | `0x12C97C817c786F0a9F4b3A793F1c40846f8A46a5` |
| Variant 3 | `0x7F2d65658e183f2bB2fcbAbB45B3d28DA5e8c6Ba` |
| Variant 4 | `0x27Ff61c058aDB1C489505F207b49c76cd935F067` |

### SPREAD CALL - BTC (20%)
| Period | Address |
|--------|---------|
| Variant 1 | `0xf3681B583a8fD3680fC29B4D74d66eD6106D9E44` |
| Variant 2 | `0xa708B056881dF5aAffF915ac839DA285E7aa7EA7` |
| Variant 3 | `0x72A3345cf5d86c10865e30b78190f569BaA01548` |
| Variant 4 | `0x370fDf1dc815e916581A3F9aB7972013d3C7e9EF` |

### SPREAD CALL - BTC (30%)
| Period | Address |
|--------|---------|
| Variant 1 | `0xf4f4d29FE6F6a2b9fc3325715cEf14f9d6F7890C` |
| Variant 2 | `0xA894ac6817B56DAbd9e26B5E328BDf092f5144E9` |
| Variant 3 | `0xc9CFB511Cf64060B3F633665C1ed2E374dfac61B` |
| Variant 4 | `0xF0263E9e6d9e39761BbfB393225340D57AD38614` |

### SPREAD PUT - BTC (10%)
| Period | Address |
|--------|---------|
| Variant 1 | `0x3854480836bd3180f81E702d384F4F908074C253` |
| Variant 2 | `0x02BdE70041f6BFc8bD3Ff235DB268d5fE80188EF` |
| Variant 3 | `0x4ef6C1bD377164eDfa63E9091b07d8A7Af7Cd700` |
| Variant 4 | `0xa6984382456368df40177f286523C64552Db4380` |

### SPREAD PUT - BTC (20%)
| Period | Address |
|--------|---------|
| Variant 1 | `0x6a7A57eBAfeC1Cc52bf93C2CadbA8F22a921A920` |
| Variant 2 | `0x67C8585fd4309c399bC518A21cB519989db3584a` |
| Variant 3 | `0xCd2bd8D55865FD50670cCDAB3c7b5F76B9D3Bc6A` |
| Variant 4 | `0x387064D5AAA7f1aB35244d97beb0E698746d5466` |

### SPREAD PUT - BTC (30%)
| Period | Address |
|--------|---------|
| Variant 1 | `0xCD7346dAc45Da75A2574eE5fbF4E6F2606Fa10ea` |
| Variant 2 | `0x8C174f406C47409BA95C4258176596C2509722C9` |
| Variant 3 | `0x57ECBD8e7f0998c047DD1041C206B2d4aCfeB1b9` |
| Variant 4 | `0x29174885456e3793c743ca6EF7ae25fc144Ad257` |

### INVERSE Bear Call Spread - ETH (10%)
| Period | Address |
|--------|---------|
| Single | `0xffcBCBC12DE5fc8C34c4037C0B357bB2C99d4F57` |

### INVERSE Bear Call Spread - ETH (20%)
| Period | Address |
|--------|---------|
| Single | `0x8D26C7737617Ed69ccd91d0Ca7Ed81e34BC6cB10` |

### INVERSE Bear Call Spread - ETH (30%)
| Period | Address |
|--------|---------|
| Single | `0x8D3dE7A93b8a08277d5a770ADA3E51BA29dcF04d` |

### INVERSE Bull Put Spread - ETH (10%)
| Period | Address |
|--------|---------|
| Single | `0x57924f2225D5aa1825299844412e265fF4618bec` |

### INVERSE Bull Put Spread - ETH (20%)
| Period | Address |
|--------|---------|
| Single | `0x15fcCBf5520076B513006e7b1903b31deDcF0Bd7` |

### INVERSE Bull Put Spread - ETH (30%)
| Period | Address |
|--------|---------|
| Single | `0xd7F2097f32d81Ce25eACb0b650c093668A0AEaAB` |

### INVERSE Long Butterfly - ETH (10%)
| Period | Address |
|--------|---------|
| Single | `0x3024C06579c4E448C13A979a22db93d13cA5784f` |

### INVERSE Long Butterfly - ETH (20%)
| Period | Address |
|--------|---------|
| Single | `0x3c1A069936090Caad0fAfb59B7A10B1C9B8b4E19` |

### INVERSE Long Butterfly - ETH (30%)
| Period | Address |
|--------|---------|
| Single | `0x5f24Eb218eD9ac4EC86fdfD2B5a9bC11870DC5BE` |

### INVERSE Long Condor - ETH (20%)
| Period | Address |
|--------|---------|
| Single | `0x1a00D85D7fbea66951B22524EEF78891B5EC96BB` |

### INVERSE Long Condor - ETH (30%)
| Period | Address |
|--------|---------|
| Single | `0x76e3D130375B066d802B6C300873113400c8223F` |

### INVERSE Bear Call Spread - BTC (10%)
| Period | Address |
|--------|---------|
| Single | `0x7844757f39c2f63D024C33A01b9a579B12B2E0A6` |

### INVERSE Bear Call Spread - BTC (20%)
| Period | Address |
|--------|---------|
| Single | `0x908B40aa8c4AC9F6aE6a5bE2d36dBce145e3D79A` |

### INVERSE Bear Call Spread - BTC (30%)
| Period | Address |
|--------|---------|
| Single | `0xfD3d35A6aC4d2F97447ff4F247331217591c2Ad2` |

### INVERSE Bull Put Spread - BTC (10%)
| Period | Address |
|--------|---------|
| Single | `0xB22f77b0F9d65E2b05414B19332d1BB09340ab62` |

### INVERSE Bull Put Spread - BTC (20%)
| Period | Address |
|--------|---------|
| Single | `0xB58279F541Bb37792082Ac43367728799AbcEb28` |

### INVERSE Bull Put Spread - BTC (30%)
| Period | Address |
|--------|---------|
| Single | `0xb26C45E5515D57c42aE5c04Db789E5B188B19DBe` |

### INVERSE Long Butterfly - BTC (10%)
| Period | Address |
|--------|---------|
| Single | `0x8Da78bF47f6E6beA514f43940ddAC351A37070cE` |

### INVERSE Long Butterfly - BTC (20%)
| Period | Address |
|--------|---------|
| Single | `0x88363f33388BccEf18fefa330Cfbf809519074ac` |

### INVERSE Long Butterfly - BTC (30%)
| Period | Address |
|--------|---------|
| Single | `0x13e11f8F86fCB4732D9a47c4A5B2a8C6E3fC8F9a` |

### INVERSE Long Condor - BTC (20%)
| Period | Address |
|--------|---------|
| Single | `0xAE9EE9146Db37c3F05545d950415aEDb0c3f9362` |

### INVERSE Long Condor - BTC (30%)
| Period | Address |
|--------|---------|
| Single | `0x7d3281a8b9ECfFD97c4eFeff02Cb0f032Fc060b5` |

---

## 💰 Price Calculator Contracts

| Calculator Type | Address |
|----------------|---------|
| **CALL_100_BTC** | `0x2D7458e92BCE3793cEd81cCd26ccC7fFf0b384B5` |
| **CALL_100_ETH** | `0xA59180C506A9C89DB47E49A332d2363F8288c1Af` |
| **CALL_110_BTC** | `0x1E22a31FBd726Dfa1Cac3889017C2719d2266cFc` |
| **CALL_110_ETH** | `0x903E122119F53F87c8017B23EEC2C3496A9F05c6` |
| **CALL_120_BTC** | `0x9FB35CECFA48fB27fa10887f99131913E1ed37f3` |
| **CALL_120_ETH** | `0xb59476b53351Cd1b26ead70835E5ED7B8929b409` |
| **CALL_130_BTC** | `0x19a79FBB6c219197bA108960800c435A99F59e25` |
| **CALL_130_ETH** | `0xFfBae80a2D49BeF876509fad228cC6DAC582934E` |
| **INVERSE_BEAR_CALL_SPREAD_10_BTC** | `0x5d176081802596Beec2eCD558FADE54B9e73350D` |
| **INVERSE_BEAR_CALL_SPREAD_10_ETH** | `0x83F8F7BcCBDd0083eAC2b8BdD89f460794E51ae9` |
| **INVERSE_BEAR_CALL_SPREAD_20_BTC** | `0x83DF310e473EB36F8f1dB6CE70Fa3f7Ce2ae3724` |
| **INVERSE_BEAR_CALL_SPREAD_20_ETH** | `0xE984986327b0fBA63E0e65361E4937176014a970` |
| **INVERSE_BEAR_CALL_SPREAD_30_BTC** | `0xBB48b85F484D82973A57B8798682CBbb72544888` |
| **INVERSE_BEAR_CALL_SPREAD_30_ETH** | `0xCE52F7DC25897F398eB5Bf65f5366E9ABc7C4784` |
| **INVERSE_BULL_PUT_SPREAD_10_BTC** | `0x62203E3Ebdf14f55c6e872C1dF936207cC267F58` |
| **INVERSE_BULL_PUT_SPREAD_10_ETH** | `0xd0cf4Bfa6889BE64EbdFF9F5Dc5C20a4bf264a95` |
| **INVERSE_BULL_PUT_SPREAD_20_BTC** | `0xF8644c2f0134e131f9e2743173e36715a9484648` |
| **INVERSE_BULL_PUT_SPREAD_20_ETH** | `0x00985F243315D1CBB37aDD6Db044d4c002D99321` |
| **INVERSE_BULL_PUT_SPREAD_30_BTC** | `0x07fF89DabbEe17cB4ce848Ed198BDdd10F255dba` |
| **INVERSE_BULL_PUT_SPREAD_30_ETH** | `0xaEe44c4af01dbBd50b7bE594157Df0246B1b5E02` |
| **INVERSE_LONG_BUTTERFLY_10_BTC** | `0x3Ed0C1F3ed6C0F962Fc0d2c369c12F27BFA24c50` |
| **INVERSE_LONG_BUTTERFLY_10_ETH** | `0xd98Ed2EeB4269ee68b9352e7A9d69EE2E5d33263` |
| **INVERSE_LONG_BUTTERFLY_20_BTC** | `0x276bB2BB3778486d7de948B72dc7ae30539038D1` |
| **INVERSE_LONG_BUTTERFLY_20_ETH** | `0x7c65246Ae2E98eaeb37E829B2a515F852D9254F8` |
| **INVERSE_LONG_BUTTERFLY_30_BTC** | `0x4df2bCd432F2555088ACe690b4f8ec21cdE9B2A5` |
| **INVERSE_LONG_BUTTERFLY_30_ETH** | `0x0164749a4e2FA201E674E600f2222fe896576e21` |
| **INVERSE_LONG_CONDOR_20_BTC** | `0x25EA47eD1cC3d7CDa8E257D4055806a90e3F70a1` |
| **INVERSE_LONG_CONDOR_20_ETH** | `0xF5b10DF54E67617F07E902322B14ED634709Cf3A` |
| **INVERSE_LONG_CONDOR_30_BTC** | `0x4E204A12C1Ad5BE4F26679f0f327B20E008B48f8` |
| **INVERSE_LONG_CONDOR_30_ETH** | `0x9aff563976a843AFc386795F8335099308868BBD` |
| **PUT_100_BTC** | `0x1183171BA330B61D9515a676e8d6b5EbAA65E736` |
| **PUT_100_ETH** | `0xDCCd37e49123071fcb0396299Bbe8544d0FB7b43` |
| **PUT_70_BTC** | `0x0722D247102ef1dc39249d460a01486B0b5c5e33` |
| **PUT_70_ETH** | `0x626fBdc6E45414b7Ca0f2013b705f0e25040a14D` |
| **PUT_80_BTC** | `0x32323b6f0DA864040230142c56BE9a275A4525A0` |
| **PUT_80_ETH** | `0x34434b4d4e2b69241562e1fd16968acA05e921c0` |
| **PUT_90_BTC** | `0x4c9FEcd67c06129e91Cd8640C7CE61E32a4B0b8d` |
| **PUT_90_ETH** | `0x7aA123BE6d53d8A7431a45AFfEB29C50896847d8` |
| **SPREAD_CALL_10_BTC** | `0xB6d695b79ab3a2579B1384A9bB04D56154De0275` |
| **SPREAD_CALL_10_ETH** | `0x5Ab67BE448665B4f896841EebEe7326A014d9F86` |
| **SPREAD_CALL_20_BTC** | `0xf25827667c356f65da7AEaab424d4AB945Cc41cA` |
| **SPREAD_CALL_20_ETH** | `0x01D9850A9177C2c04d9fc46f0FE66c12025d971c` |
| **SPREAD_CALL_30_BTC** | `0xA3cE37a6c7bBb6110F488BdfDf382065A7C90Ba5` |
| **SPREAD_CALL_30_ETH** | `0x1Cd8d9262F276D3eE6242d8F79A62a1C9d97676F` |
| **SPREAD_PUT_10_BTC** | `0x5Bab468d304e32517707BF736B4Fc43bdF5F9075` |
| **SPREAD_PUT_10_ETH** | `0xB04810003F042ea6E74Fc36baC36E457622A64e1` |
| **SPREAD_PUT_20_BTC** | `0x6C696cedFcee046Aaab5aE230A9A02AecA43a96c` |
| **SPREAD_PUT_20_ETH** | `0x7810bffe15e804c6ae2fF297e970b8b24E7A22B7` |
| **SPREAD_PUT_30_BTC** | `0x307e7aD691BE138458b6475140d2B5F5570B3090` |
| **SPREAD_PUT_30_ETH** | `0x10e7354044eCA213dFeC49F016440b78aE411C4A` |
| **STRADDLE_BTC** | `0xaf57e61fe757C615b3162129946B7FaC8d6D8B92` |
| **STRADDLE_ETH** | `0xf3EA3c0F140897eC95e5c180AC4159F98cd2B091` |
| **STRANGLE_10_BTC** | `0x4F9A4CB3ee96ab665eB321dC604cfE04C1EB740D` |
| **STRANGLE_10_ETH** | `0xDf2Ef095766Af5157D4eCfBd9f6297FcEDcBE55B` |
| **STRANGLE_20_BTC** | `0x57D01a93E9A0B41B5EA125d290C06bA064575010` |
| **STRANGLE_20_ETH** | `0x217C55376DFAD7263e969D50c61dD6B4aCd2c7d0` |
| **STRANGLE_30_BTC** | `0x0a89d1bd77bB8c7da60bE9bFbfFF4D700b748D6f` |
| **STRANGLE_30_ETH** | `0xF3FD216DC9657C450910862BFF1C5DF2267Eb063` |
| **STRAP_BTC** | `0xd9b055384C5DA6dCFA24403E5713d5C525E588C1` |
| **STRAP_ETH** | `0xbCF62eFfDc93770fc0abA394A12d0445Ca87d6C1` |
| **STRIP_BTC** | `0x0A047A4F1C0b536f12EBa4d8e0701538674A11Ab` |
| **STRIP_ETH** | `0x72e9E311210FA6A921cb8Ad27824D7cb60d04202` |

---

## ✅ Code Verification Status

**Verified:** All 250 deployed contracts have code at their addresses ✅

**Verification Method:** RPC `getCode()` check via ethers.js

**Results:**
- ✅ **250 contracts** - Code deployed and verified
- ⏭️ **5 external contracts** - Skipped (USDC, WETH, WBTC, PriceProviders)
- ❌ **0 contracts** - No code found
- ⚠️ **0 errors** - All addresses valid

**Verification Script:** `scripts/verify-addresses-code.js`

**Note:** This confirms all addresses have deployed contracts. Source code verification on Arbiscan is separate and pending due to API limitations.

---

## 🔧 Source Code Verification Status

**Status:** ⚠️ Pending - Manual verification required

**Reason:** Arbiscan API migration (V1 deprecated, V2 endpoint unavailable) blocks automated verification.

**Manual Verification:**
- Use `MANUAL_VERIFICATION_GUIDE.md` for step-by-step instructions
- Use `VERIFICATION_PACKAGE.md` for all flattened files and constructor args
- Use `scripts/flatten-for-verification.sh` to regenerate flattened files

---

## 🔗 Explorer Links

- **Arbitrum Sepolia Explorer:** https://sepolia.arbiscan.io
- **CoverPool:** https://sepolia.arbiscan.io/address/0x7174db190fF9D9AD136B39EdeEffBC2451FC1C5b
- **OperationalTreasury:** https://sepolia.arbiscan.io/address/0x3B026eD677615aDD2aC32aa5D1D5453051551EfB

---

## 📦 Artifacts

- **Addresses JSON:** `packages/herge/deployments/arbitrum-sepolia/.addresses.json`
- **Deployment Artifacts:** `packages/herge/deployments/arbitrum-sepolia/`

---

## 📋 Complete Contract List (Alphabetical)

For a complete machine-readable list, see:
`packages/herge/deployments/arbitrum-sepolia/.addresses.json`

Total: 255 deployed contracts across:
- 🎯 Core infrastructure: 6 contracts
- 📊 Price calculators: 62 contracts  
- 🎲 Strategy contracts: 182 contracts

---

**Deployment completed successfully! 🎉**

*Generated: 2025-11-05T14:12:55.753Z*
