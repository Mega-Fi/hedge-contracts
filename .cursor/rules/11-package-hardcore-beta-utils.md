# Packages: hardcore-beta & utils - Complete Reference

## Package: hardcore-beta

### Overview

**hardcore-beta** is an experimental/testing package that serves as a proving ground for new features before integration into the main protocol. It combines elements from v8888 with enhanced features.

**Location**: `packages/hardcore-beta/`

**Status**: Experimental - Not for production use

**Dependencies**:
- `@hegic/v8888`: Core protocol v8888
- `@hegic/utils`: Shared utilities
- Chainlink contracts
- OpenZeppelin contracts

### Purpose

1. **Test New Features**: Experimental strategies and mechanisms
2. **Integration Testing**: Test interactions between contracts
3. **Deployment Testing**: Practice deployment scripts
4. **Performance Testing**: Benchmark gas costs and optimizations

### Architecture

```
hardcore-beta/
├── contracts/
│   ├── Interfaces/              # Contract interfaces
│   │   ├── IHegicOperationalTreasury.sol
│   │   ├── IHegicStakeAndCover.sol
│   │   └── IHegicStrategy.sol
│   ├── Pool/                    # Pool contracts
│   │   ├── HegicOperationalTreasury.sol
│   │   ├── HegicInverseOperationalTreasury.sol
│   │   └── HegicStakeAndCover.sol
│   ├── PriceCalculators/        # Pricing logic
│   │   └── [7 pricing contracts]
│   ├── Strategies/              # Option strategies
│   │   └── [14 strategy contracts]
│   └── utils/                   # Utility contracts
│       ├── HegicPlaygroundFaucet.sol
│       ├── HegicStakeAndCoverDistributor.sol
│       └── Unlocker.sol
├── deploy/                      # Deployment scripts
├── test/                        # Test files
└── scripts/                     # Utility scripts
```

### Key Contracts

#### 1. HegicOperationalTreasury

**File**: `contracts/Pool/HegicOperationalTreasury.sol`

**Purpose**: Enhanced operational treasury with additional features

**Differences from Herge's OperationalTreasury**:
- Additional validation logic
- Enhanced event logging
- Experimental risk management
- Testing hooks

**Key Features**:
```solidity
// Similar to Herge but with enhancements
function buy(...) external;
function payOff(...) external;
function unlock(...) external;

// Additional features
function emergencyPause() external;
function setStrategyLimit(IHegicStrategy strategy, uint256 limit) external;
```

#### 2. HegicInverseOperationalTreasury

**File**: `contracts/Pool/HegicInverseOperationalTreasury.sol`

**Purpose**: Treasury specifically for inverse strategies

**Special Features**:
- Handles inverse payoff structures
- Different collateralization model
- Optimized for short volatility strategies

#### 3. HegicStakeAndCover

**File**: `contracts/Pool/HegicStakeAndCover.sol`

**Purpose**: Combined staking and coverage mechanism (prototype)

**Features**:
```solidity
// Stake HEGIC
function stake(uint256 amount) external;

// Provide coverage
function provideCoverage(uint256 amount) external;

// Claim rewards
function claimRewards() external;

// Cover losses
function coverLoss(uint256 amount) external;
```

#### 4. Experimental Strategies

**Location**: `contracts/Strategies/`

Includes testing versions of:
- Standard strategies (Call, Put, Straddle, etc.)
- Inverse strategies (Bear Call Spread, Bull Put Spread, etc.)
- Custom strategies for testing

**Example: HegicStrategyInverseBearCallSpread**
```solidity
// Profit from price staying below or declining moderately
contract HegicStrategyInverseBearCallSpread is HegicInverseStrategy {
    // Testing implementation with additional logging
    function _calculateStrategyPayOff(uint256 optionID)
        internal view override returns (uint256)
    {
        // Enhanced calculation logic
        // Additional validation
        // Testing-specific features
    }
}
```

### Deployment

**Networks**:
- Arbitrum (testnet/mainnet)
- Ropsten (deprecated)

**Deploy Command**:
```bash
cd packages/hardcore-beta

# Deploy to Arbitrum testnet
npx hardhat deploy --network arbitrumGoerli

# Deploy specific tags
npx hardhat deploy --network arbitrumGoerli --tags Treasury
```

**Deployment Scripts**: Located in `deploy/` directory, numbered 00-20

### Testing

```bash
cd packages/hardcore-beta

# Run all tests
yarn test

# Test specific contract
npx hardhat test test/HegicOperationalTreasury.ts

# Test specific strategy
npx hardhat test test/strategies/InverseBearCallSpread.ts
```

**Test Files**:
```
test/
├── HegicOperationalTreasury.ts
├── HegicStakeAndCover.ts
├── HegicStakeAndCoverDistributor.ts
└── strategies/
    ├── ATM/
    ├── OTM/
    ├── Spread/
    └── Inverse/
```

### Utility Contracts

#### HegicPlaygroundFaucet

**File**: `contracts/utils/HegicPlaygroundFaucet.sol`

**Purpose**: Testnet faucet for tokens

**Functions**:
```solidity
// Request test tokens
function requestTokens(address token, uint256 amount) external;

// Set token allowances
function setTokenAllowance(address token, uint256 amount) external;

// Check available amount
function availableAmount(address token) external view returns (uint256);
```

**Usage**:
```typescript
const faucet = await ethers.getContract("HegicPlaygroundFaucet");
await faucet.requestTokens(usdc.address, ethers.utils.parseUnits("1000", 6));
```

#### HegicStakeAndCoverDistributor

**File**: `contracts/utils/HegicStakeAndCoverDistributor.sol`

**Purpose**: Distribute profits to stakers and coverage providers

#### Unlocker

**File**: `contracts/utils/Unlocker.sol`

**Purpose**: Batch unlock expired options

**Functions**:
```solidity
// Unlock multiple expired options
function unlockMultiple(uint256[] calldata optionIds) external;

// Check if unlockable
function isUnlockable(uint256 optionId) external view returns (bool);
```

### Scripts

**Location**: `scripts/`

#### distributeProfit.ts
```typescript
// Distribute accumulated profits
await run("distributeProfit", {
    treasury: treasuryAddress,
    amount: profitAmount
});
```

#### setCoefficients.ts
```typescript
// Set pricing coefficients for strategies
await run("setCoefficients", {
    strategy: strategyAddress,
    coefficients: [...]
});
```

#### preparation.ts
Setup script for testing environment

### Configuration

**hardhat.config.ts**:
```typescript
export default {
    solidity: "0.8.3",
    
    networks: {
        arbitrumGoerli: {
            url: process.env.ARBITRUM_GOERLI_RPC_URL,
            accounts: [process.env.TESTNET_PRIVATE_KEY]
        }
    },
    
    external: {
        contracts: [
            {
                artifacts: "node_modules/@hegic/v8888/artifacts",
                deploy: "node_modules/@hegic/v8888/deploy"
            }
        ]
    }
};
```

### When to Use hardcore-beta

✅ **Use For**:
- Testing new features
- Experimenting with strategies
- Learning the protocol
- Development and debugging
- Integration testing
- Gas optimization testing

❌ **Don't Use For**:
- Production deployments
- Mainnet with real funds
- Public-facing applications
- Long-term storage of value

---

## Package: utils

### Overview

**utils** is a shared library package containing common contracts, interfaces, and utilities used across all Hegic packages.

**Location**: `packages/utils/`

**Purpose**: Provide reusable components to avoid code duplication

**Dependencies**: Minimal (only OpenZeppelin and base dependencies)

### Structure

```
utils/
└── contracts/
    ├── ERC20Recovery.sol           # Token recovery mechanism
    ├── ERC721WithURIBuilder.sol    # Enhanced ERC721
    ├── IERC721WithURIBuilder.sol   # Interface
    ├── Math.sol                    # Math utilities
    └── Mocks/                      # Testing mocks
        ├── ERC20Mock.sol
        ├── ERC721Mock.sol
        ├── PriceProviderMock.sol
        └── WETHMock.sol
```

### Core Contracts

#### 1. Math.sol

**Purpose**: Mathematical operations library

**Library**: `HegicMath`

**Functions**:

```solidity
library HegicMath {
    /**
     * @notice Ceiling division
     * @dev Returns the smallest integer greater than or equal to a/b
     * @param a Numerator
     * @param b Denominator
     * @return Result of ceiling division
     */
    function ceilDiv(uint256 a, uint256 b) 
        internal pure returns (uint256)
    {
        require(b > 0, "Division by zero");
        return a / b + (a % b == 0 ? 0 : 1);
    }
    
    /**
     * @notice Safe division with zero check
     */
    function safeDiv(uint256 a, uint256 b) 
        internal pure returns (uint256)
    {
        require(b > 0, "Division by zero");
        return a / b;
    }
    
    /**
     * @notice Percentage calculation
     * @param value Base value
     * @param percentage Percentage (with 2 decimals, e.g., 150 = 1.5%)
     * @return Result of percentage calculation
     */
    function percentage(uint256 value, uint256 percentage) 
        internal pure returns (uint256)
    {
        return (value * percentage) / 10000;
    }
}
```

**Usage Example**:
```solidity
import "@hegic/utils/contracts/Math.sol";

contract MyContract {
    using HegicMath for uint256;
    
    function calculateShare(uint256 amount, uint256 total) 
        public pure returns (uint256)
    {
        // Use ceiling division to prevent rounding errors
        return amount.ceilDiv(total);
    }
    
    function applyFee(uint256 amount) public pure returns (uint256) {
        // Apply 2.5% fee (250 basis points)
        uint256 fee = amount.percentage(250);
        return amount - fee;
    }
}
```

#### 2. ERC721WithURIBuilder

**File**: `contracts/ERC721WithURIBuilder.sol`

**Purpose**: Enhanced ERC721 with customizable URI building

**Interface**: `IERC721WithURIBuilder`

**Features**:
- Custom URI builder logic
- Base URI management
- Token-specific metadata
- Gas-efficient implementation

**Contract**:
```solidity
abstract contract ERC721WithURIBuilder is 
    ERC721, 
    IERC721WithURIBuilder 
{
    string private _baseURIValue;
    
    /**
     * @notice Set base URI for token metadata
     * @param baseURI_ New base URI
     */
    function setBaseURI(string memory baseURI_) external {
        _baseURIValue = baseURI_;
        emit SetBaseURI(baseURI_);
    }
    
    /**
     * @notice Build token URI
     * @param tokenId Token ID
     * @return Full token URI
     */
    function tokenURI(uint256 tokenId) 
        public view virtual override returns (string memory)
    {
        require(_exists(tokenId), "Token does not exist");
        
        string memory baseURI = _baseURIValue;
        return bytes(baseURI).length > 0
            ? string(abi.encodePacked(baseURI, tokenId.toString()))
            : "";
    }
    
    /**
     * @inheritdoc IERC165
     */
    function supportsInterface(bytes4 interfaceId)
        public view virtual override(ERC721, IERC165)
        returns (bool)
    {
        return
            interfaceId == type(IERC721WithURIBuilder).interfaceId ||
            super.supportsInterface(interfaceId);
    }
}
```

**Usage in Herge**:
```solidity
import "@hegic/utils/contracts/ERC721WithURIBuilder.sol";

contract CoverPool is ERC721WithURIBuilder("Hegic Stake & Cover", "HEGSC") {
    // Inherits URI building functionality
    
    function provide(uint256 amount, uint256 positionId) 
        external returns (uint256)
    {
        if (positionId == 0) {
            positionId = _nextPositionId++;
            _mint(msg.sender, positionId);  // Creates NFT with URI
        }
        // ...
    }
}
```

#### 3. ERC20Recovery

**File**: `contracts/ERC20Recovery.sol`

**Purpose**: Recover accidentally sent ERC20 tokens

**Features**:
```solidity
abstract contract ERC20Recovery is AccessControl {
    /**
     * @notice Recover ERC20 tokens sent by mistake
     * @param token Token contract address
     * @param recipient Address to receive recovered tokens
     * @param amount Amount to recover
     */
    function recoverERC20(
        address token,
        address recipient,
        uint256 amount
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(recipient != address(0), "Invalid recipient");
        require(!isProtectedToken(token), "Cannot recover protected token");
        
        IERC20(token).safeTransfer(recipient, amount);
        emit ERC20Recovered(token, recipient, amount);
    }
    
    /**
     * @notice Check if token is protected from recovery
     * @dev Override in derived contracts to protect specific tokens
     */
    function isProtectedToken(address token) 
        internal view virtual returns (bool)
    {
        return false;
    }
    
    event ERC20Recovered(
        address indexed token,
        address indexed recipient,
        uint256 amount
    );
}
```

**Usage**:
```solidity
contract MyPool is ERC20Recovery {
    IERC20 public immutable mainToken;
    
    constructor(IERC20 _mainToken) {
        mainToken = _mainToken;
    }
    
    // Protect main token from accidental recovery
    function isProtectedToken(address token) 
        internal view override returns (bool)
    {
        return token == address(mainToken);
    }
}
```

### Mock Contracts (Testing)

#### ERC20Mock

**File**: `contracts/Mocks/ERC20Mock.sol`

**Purpose**: Mock ERC20 for testing

```solidity
contract ERC20Mock is ERC20 {
    constructor(
        string memory name,
        string memory symbol,
        uint8 decimals_
    ) ERC20(name, symbol) {
        _setupDecimals(decimals_);
    }
    
    function mint(address account, uint256 amount) external {
        _mint(account, amount);
    }
    
    function burn(address account, uint256 amount) external {
        _burn(account, amount);
    }
}
```

**Usage**:
```typescript
// In test files
const ERC20Mock = await ethers.getContractFactory("ERC20Mock");
const usdc = await ERC20Mock.deploy("USD Coin", "USDC", 6);

// Mint tokens for testing
await usdc.mint(alice.address, ethers.utils.parseUnits("10000", 6));
```

#### PriceProviderMock

**File**: `contracts/Mocks/PriceProviderMock.sol`

**Purpose**: Mock Chainlink price feed

```solidity
contract PriceProviderMock {
    int256 private _price;
    uint8 private _decimals;
    
    constructor(int256 initialPrice, uint8 decimals_) {
        _price = initialPrice;
        _decimals = decimals_;
    }
    
    function setPrice(int256 price) external {
        _price = price;
    }
    
    function latestRoundData() external view returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    ) {
        return (
            1,
            _price,
            block.timestamp,
            block.timestamp,
            1
        );
    }
    
    function decimals() external view returns (uint8) {
        return _decimals;
    }
}
```

**Usage**:
```typescript
// Setup mock price feed
const PriceProviderMock = await ethers.getContractFactory("PriceProviderMock");
const priceProvider = await PriceProviderMock.deploy(
    ethers.utils.parseUnits("2000", 8),  // $2000
    8  // Chainlink uses 8 decimals
);

// Update price in tests
await priceProvider.setPrice(ethers.utils.parseUnits("2100", 8));
```

#### WETHMock

**File**: `contracts/Mocks/WETHMock.sol`

**Purpose**: Mock Wrapped ETH

```solidity
contract WETHMock is ERC20 {
    constructor() ERC20("Wrapped Ether", "WETH") {}
    
    function deposit() external payable {
        _mint(msg.sender, msg.value);
    }
    
    function withdraw(uint256 amount) external {
        _burn(msg.sender, amount);
        payable(msg.sender).transfer(amount);
    }
    
    receive() external payable {
        deposit();
    }
}
```

### Building and Using

**Build Utils Package**:
```bash
cd packages/utils

# Compile contracts
yarn build

# Run tests
yarn test

# Clean
yarn clean
```

**Import in Other Packages**:

**package.json**:
```json
{
  "dependencies": {
    "@hegic/utils": "1.0.0"
  }
}
```

**In Contracts**:
```solidity
import "@hegic/utils/contracts/Math.sol";
import "@hegic/utils/contracts/ERC721WithURIBuilder.sol";
import "@hegic/utils/contracts/ERC20Recovery.sol";
```

**In Tests**:
```typescript
import "@hegic/utils/contracts/Mocks/ERC20Mock.sol";
import "@hegic/utils/contracts/Mocks/PriceProviderMock.sol";
```

### Best Practices

1. **Keep utils minimal**: Only add truly reusable components
2. **No business logic**: Utils should be generic helpers
3. **Thoroughly test**: All utils should have comprehensive tests
4. **Document well**: Clear documentation for all functions
5. **Version carefully**: Changes affect all dependent packages

### Adding New Utilities

**Steps**:
1. Create contract in `contracts/`
2. Add tests
3. Document functions
4. Update package version
5. Test in dependent packages

**Example**:
```solidity
// contracts/StringUtils.sol
library StringUtils {
    function concat(string memory a, string memory b) 
        internal pure returns (string memory)
    {
        return string(abi.encodePacked(a, b));
    }
}
```

## Integration Between Packages

### Package Dependencies

```
hardcore-beta → v8888 → utils
herge → utils
```

### Importing Across Packages

```solidity
// In herge contracts
import "@hegic/utils/contracts/Math.sol";

// In hardcore-beta contracts
import "@hegic/v8888/contracts/Pool/HegicPool.sol";
import "@hegic/utils/contracts/Math.sol";
```

### Shared Types and Interfaces

**Define once in utils, use everywhere**:
```solidity
// In utils/contracts/Interfaces/ICommon.sol
interface ICommon {
    enum State { Active, Inactive, Expired }
    
    struct Position {
        uint256 amount;
        uint256 timestamp;
        State state;
    }
}

// Use in other packages
import "@hegic/utils/contracts/Interfaces/ICommon.sol";
contract MyContract is ICommon { }
```

