# Hegic Protocol - Coding Standards

## Solidity Coding Standards

### File Structure

```solidity
// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.3;

/**
 * @title ContractName
 * @author Hegic Protocol
 * @notice High-level description of what this contract does
 * @dev Implementation details and technical notes
 */

// Imports - grouped by source
// 1. OpenZeppelin
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// 2. Chainlink
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

// 3. Internal interfaces
import "./IOperationalTreasury.sol";
import "./ICoverPool.sol";

// 4. Internal contracts
import "./ProfitCalculator.sol";

/**
 * @title OperationalTreasury
 * @notice Manages option creation and settlement
 */
contract OperationalTreasury is AccessControl, ReentrancyGuard {
    // 1. Type declarations
    using SafeERC20 for IERC20;
    
    // 2. State variables
    // 2.1 Immutable variables
    IERC20 public immutable token;
    IPositionsManager public immutable manager;
    
    // 2.2 Constants
    uint256 public constant MAX_PERIOD = 365 days;
    
    // 2.3 Storage variables (grouped by purpose)
    mapping(uint256 => LockedLiquidity) public lockedLiquidity;
    uint256 public totalLocked;
    
    // 3. Events
    event Paid(uint256 indexed id, address indexed account, uint256 amount);
    
    // 4. Modifiers
    modifier onlyValidStrategy(IHegicStrategy strategy) {
        require(acceptedStrategy[strategy], "Invalid strategy");
        _;
    }
    
    // 5. Constructor
    constructor(IERC20 _token, IPositionsManager _manager) {
        token = _token;
        manager = _manager;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    
    // 6. External functions
    function buy(...) external nonReentrant { }
    
    // 7. Public functions
    function getTotalLocked() public view returns (uint256) { }
    
    // 8. Internal functions
    function _lockLiquidity(...) internal { }
    
    // 9. Private functions
    function _calculateFee(...) private pure returns (uint256) { }
}
```

### Naming Conventions

#### Contracts and Interfaces

```solidity
// Contracts: PascalCase
contract OperationalTreasury { }
contract HegicStrategyCall { }

// Interfaces: Prefixed with 'I'
interface IHegicStrategy { }
interface ICoverPool { }

// Libraries: PascalCase
library ProfitCalculator { }
library HegicMath { }

// Abstract Contracts: PascalCase or prefixed
abstract contract HegicStrategy { }
```

#### Functions

```solidity
// External/Public: camelCase, verb-based
function buyOption(...) external { }
function calculatePremium(...) public view returns (uint256) { }

// Internal: camelCase with underscore prefix
function _lockLiquidity(...) internal { }
function _validateParameters(...) internal view { }

// Private: camelCase with underscore prefix
function _calculateFee(...) private pure returns (uint256) { }
```

#### Variables

```solidity
// State variables: camelCase
uint256 public totalLocked;
mapping(uint256 => LockedLiquidity) public lockedLiquidity;

// Constants: UPPER_SNAKE_CASE
uint256 public constant MAX_PERIOD = 365 days;
bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

// Immutable: camelCase
IERC20 public immutable token;
uint256 public immutable maxLockupPeriod;

// Local variables: camelCase
uint256 premium = calculatePremium(amount, period);
address holder = msg.sender;

// Function parameters: camelCase, descriptive
function buy(
    IHegicStrategy strategy,
    address holder,
    uint256 amount,
    uint256 period
) external { }
```

#### Events

```solidity
// PascalCase, past tense verbs
event Paid(uint256 indexed id, address indexed account, uint256 amount);
event StrategyConnected(IHegicStrategy indexed strategy);
event LimitSet(uint256 newLimit);
```

#### Modifiers

```solidity
// camelCase, descriptive
modifier onlyValidStrategy(IHegicStrategy strategy) { }
modifier withinPeriodLimits(uint256 period) { }
```

### Documentation (NatSpec)

#### Contract Documentation

```solidity
/**
 * @title OperationalTreasury
 * @author Hegic Protocol
 * @notice Manages option lifecycle from creation to settlement
 * @dev Uses AccessControl for role management and ReentrancyGuard for security
 * 
 * This contract:
 * - Creates options via strategy contracts
 * - Locks liquidity based on risk calculations
 * - Settles options and distributes payoffs
 * - Coordinates with CoverPool for additional coverage
 */
contract OperationalTreasury { }
```

#### Function Documentation

```solidity
/**
 * @notice Purchase an option using specified strategy
 * @dev Locks liquidity based on negativePNL/positivePNL from strategy
 * 
 * Requirements:
 * - Strategy must be accepted
 * - User must have approved sufficient tokens
 * - Amount must be within strategy limits
 * 
 * @param strategy The strategy contract to use
 * @param holder Address that will own the option
 * @param amount Size of the option
 * @param period Duration of the option in seconds
 * @param additional Strategy-specific additional parameters
 * 
 * Emits {LockedLiquidity} event
 */
function buy(
    IHegicStrategy strategy,
    address holder,
    uint256 amount,
    uint256 period,
    bytes[] calldata additional
) external nonReentrant { }
```

#### Parameter Documentation

```solidity
/**
 * @param strike Strike price in price provider decimals
 * @param currentPrice Current market price in price provider decimals
 * @param amount Option size in token decimals
 * @param tokenDecimals Decimals of settlement token (typically 6 for USDC)
 * @param spotDecimals Decimals of underlying asset price
 * @param priceDecimals Decimals of price feed (typically 8 for Chainlink)
 * @return profit The calculated profit in settlement token decimals
 */
function calculateCallProfit(
    uint256 strike,
    uint256 currentPrice,
    uint256 amount,
    uint8 tokenDecimals,
    uint8 spotDecimals,
    uint256 priceDecimals
) internal pure returns (uint256 profit) { }
```

#### Return Value Documentation

```solidity
/**
 * @return positionId The ERC721 token ID for the new position
 * @return premium The total premium paid in USDC
 * @return expiration The Unix timestamp when option expires
 */
function createPosition() external returns (
    uint256 positionId,
    uint256 premium,
    uint32 expiration
) { }
```

### Code Organization

#### Logical Grouping

```solidity
contract OperationalTreasury {
    // ═══════════════════════════════════════════
    //              IMMUTABLE STATE
    // ═══════════════════════════════════════════
    
    IERC20 public immutable token;
    ICoverPool public immutable coverPool;
    
    // ═══════════════════════════════════════════
    //              MUTABLE STATE
    // ═══════════════════════════════════════════
    
    mapping(uint256 => LockedLiquidity) public lockedLiquidity;
    uint256 public totalLocked;
    
    // ═══════════════════════════════════════════
    //              USER FUNCTIONS
    // ═══════════════════════════════════════════
    
    function buy(...) external { }
    function payOff(...) external { }
    
    // ═══════════════════════════════════════════
    //              ADMIN FUNCTIONS
    // ═══════════════════════════════════════════
    
    function connect(...) external onlyRole(DEFAULT_ADMIN_ROLE) { }
    function setBenchmark(...) external onlyRole(DEFAULT_ADMIN_ROLE) { }
    
    // ═══════════════════════════════════════════
    //              VIEW FUNCTIONS
    // ═══════════════════════════════════════════
    
    function totalBalance() public view returns (uint256) { }
    
    // ═══════════════════════════════════════════
    //              INTERNAL HELPERS
    // ═══════════════════════════════════════════
    
    function _lockLiquidity(...) internal { }
}
```

### Error Handling

#### Require Statements

```solidity
// Use descriptive error messages
require(amount > 0, "Amount must be greater than zero");
require(period >= minPeriod && period <= maxPeriod, "Period out of bounds");
require(acceptedStrategy[strategy], "Strategy not accepted");

// For complex conditions, add context
require(
    lockedByStrategy[strategy] + negativePNL <= strategy.lockedLimit(),
    "Strategy limit exceeded"
);
```

#### Custom Errors (Gas Efficient)

```solidity
// Define custom errors
error InvalidAmount(uint256 provided, uint256 minimum);
error StrategyNotAccepted(IHegicStrategy strategy);
error InsufficientBalance(uint256 required, uint256 available);

// Use in code
if (amount == 0) {
    revert InvalidAmount(amount, 1);
}

if (!acceptedStrategy[strategy]) {
    revert StrategyNotAccepted(strategy);
}
```

### Gas Optimization

#### Storage vs Memory

```solidity
// BAD: Multiple storage reads
function badExample() external {
    uint256 total = totalLocked;  // SLOAD (expensive)
    total += lockedByStrategy[strategy1];  // SLOAD
    total += lockedByStrategy[strategy2];  // SLOAD
    totalLocked = total;  // SSTORE (very expensive)
}

// GOOD: Cache storage variables
function goodExample() external {
    uint256 total = totalLocked;  // SLOAD once
    total += lockedByStrategy[strategy1];
    total += lockedByStrategy[strategy2];
    totalLocked = total;  // SSTORE once
}

// GOOD: Use memory for structs
function processLiquidity(uint256 id) external {
    LockedLiquidity memory liquidity = lockedLiquidity[id];  // Copy to memory
    
    // Multiple accesses from memory (cheap)
    if (liquidity.state == LockedLiquidityState.Locked) {
        uint256 total = liquidity.negativepnl + liquidity.positivepnl;
        // ... more operations
    }
}
```

#### Batch Operations

```solidity
// BAD: Multiple transactions
function withdrawMultiple(uint256[] calldata positionIds) external {
    for (uint256 i = 0; i < positionIds.length; i++) {
        withdraw(positionIds[i]);  // Multiple external calls
    }
}

// GOOD: Single transaction with validation
function withdrawBatch(uint256[] calldata positionIds) external {
    require(positionIds.length <= 50, "Too many positions");
    
    uint256 totalAmount;
    for (uint256 i = 0; i < positionIds.length; i++) {
        // Validate and accumulate
        totalAmount += _validateAndGetAmount(positionIds[i]);
    }
    
    // Single transfer at end
    token.safeTransfer(msg.sender, totalAmount);
}
```

#### Pack Storage Variables

```solidity
// BAD: Inefficient storage (3 slots)
struct LockedLiquidity {
    LockedLiquidityState state;     // 1 byte (slot 0)
    uint256 negativepnl;             // 32 bytes (slot 1)
    uint256 positivepnl;             // 32 bytes (slot 2)
    uint32 expiration;               // 4 bytes (slot 3)
}

// GOOD: Packed storage (2 slots)
struct LockedLiquidity {
    LockedLiquidityState state;     // 1 byte  \
    uint128 negativepnl;             // 16 bytes | slot 0
    uint128 positivepnl;             // 16 bytes /
    uint32 expiration;               // 4 bytes - slot 1
}
```

#### Use Immutable and Constant

```solidity
// BAD: Regular variable (SLOAD every access)
address public owner;

// GOOD: Immutable (embedded in bytecode)
address public immutable owner;

// GOOD: Constant (replaced at compile time)
uint256 public constant MAX_PERIOD = 365 days;
```

### Security Patterns

#### Checks-Effects-Interactions

```solidity
function withdraw(uint256 amount) external {
    // 1. CHECKS
    require(amount > 0, "Zero amount");
    require(balances[msg.sender] >= amount, "Insufficient balance");
    
    // 2. EFFECTS (update state)
    balances[msg.sender] -= amount;
    totalBalance -= amount;
    
    // 3. INTERACTIONS (external calls)
    token.safeTransfer(msg.sender, amount);
    emit Withdrawn(msg.sender, amount);
}
```

#### Pull Over Push

```solidity
// BAD: Push pattern (can fail and block contract)
function distributeRewards(address[] calldata recipients) external {
    for (uint256 i = 0; i < recipients.length; i++) {
        token.transfer(recipients[i], rewards[recipients[i]]);  // Can fail
    }
}

// GOOD: Pull pattern (users withdraw individually)
function claimReward() external {
    uint256 reward = rewards[msg.sender];
    require(reward > 0, "No rewards");
    
    rewards[msg.sender] = 0;  // Clear before transfer
    token.safeTransfer(msg.sender, reward);
}
```

## TypeScript/Test Coding Standards

### Test File Structure

```typescript
import { ethers, deployments } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { OperationalTreasury, CoverPool, IERC20 } from "../../typechain";

describe("OperationalTreasury", () => {
    // Declare variables
    let deployer: SignerWithAddress;
    let alice: SignerWithAddress;
    let treasury: OperationalTreasury;
    let coverPool: CoverPool;
    let usdc: IERC20;
    
    // Setup
    beforeEach(async () => {
        [deployer, alice] = await ethers.getSigners();
        await deployments.fixture(["Treasury", "CoverPool"]);
        
        treasury = await ethers.getContract("OperationalTreasury");
        coverPool = await ethers.getContract("CoverPool");
        usdc = await ethers.getContract("USDC");
    });
    
    // Group related tests
    describe("buy()", () => {
        // Test naming: "should [expected behavior] when [condition]"
        it("should create option when all parameters valid", async () => {
            // Arrange
            const amount = ethers.utils.parseEther("1");
            const period = 7 * 24 * 60 * 60;
            
            // Act
            const tx = await treasury.buy(strategy.address, alice.address, amount, period, []);
            
            // Assert
            await expect(tx)
                .to.emit(treasury, "LockedLiquidity")
                .withArgs(1, anyValue, anyValue);
        });
        
        it("should revert when strategy not accepted", async () => {
            await expect(
                treasury.buy(invalidStrategy.address, alice.address, amount, period, [])
            ).to.be.revertedWith("Strategy not accepted");
        });
    });
});
```

### Variable Naming

```typescript
// camelCase for variables and functions
const optionAmount = ethers.utils.parseEther("100");
const expirationTime = await time.latest() + 7 * 24 * 60 * 60;

// UPPER_SNAKE_CASE for constants
const MAX_UINT256 = ethers.constants.MaxUint256;
const ZERO_ADDRESS = ethers.constants.AddressZero;

// PascalCase for types/interfaces
interface OptionData {
    amount: BigNumber;
    strike: BigNumber;
    expiration: number;
}
```

### Async/Await

```typescript
// Always use async/await
async function deployContracts() {
    const Treasury = await ethers.getContractFactory("OperationalTreasury");
    const treasury = await Treasury.deploy(...);
    await treasury.deployed();
    return treasury;
}

// Use Promise.all for parallel operations
const [treasury, coverPool, strategy] = await Promise.all([
    ethers.getContract("OperationalTreasury"),
    ethers.getContract("CoverPool"),
    ethers.getContract("HegicStrategyCall")
]);
```

## Code Review Checklist

### Before Committing

- [ ] Code compiles without errors
- [ ] All tests pass
- [ ] Code formatted (prettier)
- [ ] Linter passes (solhint, eslint)
- [ ] NatSpec comments added
- [ ] Gas optimizations considered
- [ ] Security patterns followed
- [ ] No console.log statements
- [ ] No commented-out code
- [ ] Variables named descriptively

### Before Pull Request

- [ ] All checklist items above
- [ ] New tests added for new features
- [ ] Coverage maintained or increased
- [ ] Breaking changes documented
- [ ] Migration scripts (if needed)
- [ ] README updated (if needed)
- [ ] Deployment scripts updated (if needed)

## Common Antipatterns to Avoid

### ❌ Don't

```solidity
// Don't use tx.origin
require(tx.origin == owner);

// Don't use block.timestamp for randomness
uint256 random = uint256(keccak256(abi.encodePacked(block.timestamp)));

// Don't use transfer/send (use safeTransfer)
payable(user).transfer(amount);

// Don't use tight coupling
function withdraw() external {
    SpecificToken(0x123...).transfer(msg.sender, amount);
}

// Don't ignore return values
token.transfer(user, amount);  // Returns bool!

// Don't use magic numbers
if (amount > 1000000) { }
```

### ✅ Do

```solidity
// Use msg.sender
require(msg.sender == owner);

// Use Chainlink VRF for randomness
// Or accept randomness from multiple blocks

// Use SafeERC20
token.safeTransfer(msg.sender, amount);

// Use dependency injection
IERC20 public immutable token;
constructor(IERC20 _token) { token = _token; }

// Check return values or use SafeERC20
require(token.transfer(user, amount));
// Or
token.safeTransfer(user, amount);

// Use named constants
uint256 public constant MAX_AMOUNT = 1_000_000e6;  // 1M USDC
if (amount > MAX_AMOUNT) { }
```

## Tools Configuration

### Prettier Config

```json
{
  "overrides": [
    {
      "files": "*.sol",
      "options": {
        "printWidth": 100,
        "tabWidth": 4,
        "useTabs": false,
        "singleQuote": false,
        "bracketSpacing": false
      }
    }
  ]
}
```

### Solhint Config

```json
{
  "extends": "solhint:recommended",
  "rules": {
    "compiler-version": ["error", "^0.8.3"],
    "func-visibility": ["error", {"ignoreConstructors": true}],
    "max-line-length": ["error", 100],
    "not-rely-on-time": "off",
    "avoid-low-level-calls": "off"
  }
}
```

### ESLint Config

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "no-console": "error",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "error"
  }
}
```

