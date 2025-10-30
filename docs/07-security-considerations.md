# Hegic Protocol - Security Considerations

## Security Overview

The Hegic protocol handles significant value and requires robust security measures across smart contracts, deployment, and operations.

## Smart Contract Security

### 1. Access Control

#### Role-Based Access Control (RBAC)

```solidity
// Use OpenZeppelin AccessControl
contract OperationalTreasury is AccessControl {
    bytes32 public constant ADMIN_ROLE = DEFAULT_ADMIN_ROLE;
    bytes32 public constant STRATEGY_ROLE = keccak256("STRATEGY_ROLE");
    
    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    
    function criticalFunction() external onlyRole(ADMIN_ROLE) {
        // Only admin can call
    }
}
```

**Key Principles**:
- ✅ Always use role-based access
- ✅ Grant minimal necessary permissions
- ✅ Transfer admin to multisig after deployment
- ✅ Implement role renunciation
- ❌ Never hardcode addresses
- ❌ Don't use `tx.origin` for auth

#### Ownership Patterns

```solidity
// For CoverPool
mapping(uint256 => address) private _owners;

function withdraw(uint256 positionId, uint256 amount) external {
    require(
        _isApprovedOrOwner(msg.sender, positionId),
        "Not owner or approved"
    );
    // Withdraw logic
}
```

**Best Practices**:
- Verify ownership before state changes
- Use OpenZeppelin's `Ownable` or `AccessControl`
- Implement emergency admin functions
- Document all privileged functions

### 2. Reentrancy Protection

#### ReentrancyGuard Pattern

```solidity
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract OperationalTreasury is ReentrancyGuard {
    function buy(...) external nonReentrant {
        // External call to strategy
        strategy.create(...);
        
        // State changes after external call
        lockedLiquidity[id] = LockedLiquidity(...);
    }
    
    function payOff(...) external nonReentrant {
        // Calculate payout
        uint256 profit = strategy.payOffAmount(positionID);
        
        // Update state BEFORE external transfer
        lockedLiquidity[positionID].state = LockedLiquidityState.Unlocked;
        totalLocked -= amount;
        
        // External call LAST
        token.safeTransfer(account, profit);
    }
}
```

**Key Points**:
- ✅ Use `nonReentrant` on all external/public functions with external calls
- ✅ Follow Checks-Effects-Interactions pattern
- ✅ Update state before external calls
- ✅ Use `SafeERC20` for token transfers

#### Checks-Effects-Interactions Pattern

```solidity
function withdraw(uint256 amount) external {
    // CHECKS
    require(amount > 0, "Zero amount");
    require(balance[msg.sender] >= amount, "Insufficient balance");
    
    // EFFECTS (state changes)
    balance[msg.sender] -= amount;
    totalBalance -= amount;
    
    // INTERACTIONS (external calls)
    token.safeTransfer(msg.sender, amount);
    emit Withdrawn(msg.sender, amount);
}
```

### 3. Integer Overflow/Underflow

#### Use Solidity 0.8.x Built-in Checks

```solidity
// Solidity 0.8.x automatically reverts on overflow/underflow
function add(uint256 a, uint256 b) public pure returns (uint256) {
    return a + b; // Safe in 0.8.x
}
```

**However, be careful with**:
- `unchecked` blocks (use sparingly)
- Type casting (can lose precision)
- Division before multiplication

```solidity
// BAD: Division before multiplication (precision loss)
uint256 result = (amount / total) * reward;

// GOOD: Multiplication before division
uint256 result = (amount * reward) / total;

// BEST: Use library with rounding control
uint256 result = (amount * reward).ceilDiv(total);
```

### 4. Oracle Security

#### Chainlink Integration

```solidity
function _currentPrice() internal view returns (uint256) {
    (
        uint80 roundId,
        int256 price,
        ,
        uint256 updatedAt,
        uint80 answeredInRound
    ) = priceProvider.latestRoundData();
    
    // CHECKS
    require(price > 0, "Invalid price");
    require(updatedAt > 0, "Round not complete");
    require(answeredInRound >= roundId, "Stale price");
    require(block.timestamp - updatedAt < 3600, "Price too old"); // 1 hour max
    
    return uint256(price);
}
```

**Oracle Security Checklist**:
- ✅ Validate price is positive
- ✅ Check price freshness (timestamp)
- ✅ Verify round completion
- ✅ Handle oracle failures gracefully
- ✅ Consider circuit breakers for extreme prices
- ✅ Use multiple oracle sources (if possible)

#### Circuit Breaker Example

```solidity
uint256 public constant MAX_PRICE_CHANGE = 20; // 20% max change

function _validatePrice(uint256 newPrice) internal view {
    uint256 lastPrice = lastRecordedPrice;
    
    if (lastPrice > 0) {
        uint256 change = newPrice > lastPrice
            ? ((newPrice - lastPrice) * 100) / lastPrice
            : ((lastPrice - newPrice) * 100) / lastPrice;
            
        require(change <= MAX_PRICE_CHANGE, "Price change too large");
    }
}
```

### 5. DOS (Denial of Service) Attacks

#### Unbounded Loops

```solidity
// BAD: Unbounded loop
function withdrawAll(uint256[] calldata positionIds) external {
    for (uint256 i = 0; i < positionIds.length; i++) {
        withdraw(positionIds[i]);
    }
}

// GOOD: Limited iterations
function withdrawBatch(uint256[] calldata positionIds) external {
    require(positionIds.length <= 50, "Too many positions");
    for (uint256 i = 0; i < positionIds.length; i++) {
        withdraw(positionIds[i]);
    }
}

// BETTER: Pull pattern
function withdraw(uint256 positionId) external {
    // User withdraws individually
}
```

#### Gas Limits

```solidity
// Set reasonable limits
uint256 public constant MAX_STRATEGIES = 100;
uint256 public constant MAX_LOCKUP_PERIOD = 365 days;
uint256 public constant MAX_OPTION_SIZE = 1000000e6; // 1M USDC
```

### 6. Front-Running Protection

#### Commit-Reveal Pattern (if needed)

```solidity
mapping(bytes32 => uint256) public commitments;

function commit(bytes32 commitment) external {
    commitments[commitment] = block.timestamp;
}

function reveal(uint256 amount, uint256 nonce) external {
    bytes32 commitment = keccak256(abi.encodePacked(msg.sender, amount, nonce));
    require(commitments[commitment] > 0, "No commitment");
    require(
        block.timestamp > commitments[commitment] + 1 minutes,
        "Too early"
    );
    // Execute action
}
```

#### Slippage Protection

```solidity
function buy(
    IHegicStrategy strategy,
    address holder,
    uint256 amount,
    uint256 period,
    uint256 maxPremium, // Slippage protection
    bytes[] calldata additional
) external {
    uint256 premium = strategy.calculatePremium(amount, period, additional);
    require(premium <= maxPremium, "Premium too high");
    
    // Process buy
}
```

### 7. Safe Math Operations

#### Decimal Precision

```solidity
// Always be explicit about decimals
uint256 public constant PRICE_DECIMALS = 1e8;      // Chainlink uses 8 decimals
uint256 public constant TOKEN_DECIMALS = 1e6;      // USDC uses 6 decimals
uint256 public constant HEGIC_DECIMALS = 1e18;     // HEGIC uses 18 decimals
uint256 public constant INTERNAL_DECIMALS = 1e30;  // Internal calculations

// Scale properly
function convertPrice(uint256 chainlinkPrice) internal pure returns (uint256) {
    return (chainlinkPrice * TOKEN_DECIMALS) / PRICE_DECIMALS;
}
```

#### Safe Division

```solidity
// Use custom math library
library HegicMath {
    // Ceiling division
    function ceilDiv(uint256 a, uint256 b) internal pure returns (uint256) {
        return a / b + (a % b == 0 ? 0 : 1);
    }
    
    // Prevent division by zero
    function safeDiv(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0, "Division by zero");
        return a / b;
    }
}
```

### 8. Timestamp Dependence

```solidity
// OK: Using block.timestamp for longer periods (hours/days)
require(
    block.timestamp < expiration,
    "Option expired"
);

// RISKY: Using for critical randomness (miners can manipulate ~15 seconds)
// Don't use: uint256 random = uint256(keccak256(abi.encodePacked(block.timestamp)));

// BETTER: Use Chainlink VRF for randomness
```

### 9. Token Handling

#### Use SafeERC20

```solidity
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract CoverPool {
    using SafeERC20 for IERC20;
    
    function provide(uint256 amount, uint256 positionId) external {
        // SafeERC20 handles:
        // - Return value check
        // - Reverts on failure
        // - Compatible with non-standard ERC20s
        coverToken.safeTransferFrom(msg.sender, address(this), amount);
    }
}
```

#### Check Balance Changes

```solidity
function provide(uint256 amount, uint256 positionId) external {
    uint256 balanceBefore = coverToken.balanceOf(address(this));
    
    coverToken.safeTransferFrom(msg.sender, address(this), amount);
    
    uint256 balanceAfter = coverToken.balanceOf(address(this));
    uint256 actualAmount = balanceAfter - balanceBefore;
    
    // Use actualAmount (handles fee-on-transfer tokens)
    _provide(positionId, actualAmount);
}
```

## Operational Security

### 1. Key Management

#### Private Key Security

**❌ NEVER:**
- Commit private keys to Git
- Share private keys via email/chat
- Store keys in plain text
- Use same key for testnet and mainnet
- Keep large funds in hot wallets

**✅ ALWAYS:**
- Use hardware wallets for mainnet
- Use multisig for admin functions
- Rotate keys periodically
- Keep backups in secure locations
- Use separate keys for different purposes

#### Environment Variables

```bash
# .env (NEVER commit this file)
PRIVATE_KEY=0x...
MNEMONIC="twelve word seed phrase here..."

# .gitignore
.env
.env.local
.env.*.local
*.key
*.pem
```

### 2. Multisig Requirements

#### Gnosis Safe Configuration

```
Mainnet Admin:
- Threshold: 3/5 signers
- Signers: 
  1. Hardware Wallet 1
  2. Hardware Wallet 2
  3. Hardware Wallet 3
  4. Hardware Wallet 4
  5. Hardware Wallet 5
  
Critical Operations (require multisig):
- Upgrade contracts
- Change parameters
- Connect new strategies
- Withdraw funds
- Grant/revoke roles
```

#### Timelock for Critical Functions

```solidity
contract TimelockController {
    uint256 public constant TIMELOCK_DURATION = 2 days;
    
    mapping(bytes32 => uint256) public scheduledOperations;
    
    function scheduleOperation(bytes32 operationHash) external onlyRole(ADMIN_ROLE) {
        scheduledOperations[operationHash] = block.timestamp + TIMELOCK_DURATION;
    }
    
    function executeOperation(bytes32 operationHash) external onlyRole(ADMIN_ROLE) {
        require(
            scheduledOperations[operationHash] > 0 &&
            block.timestamp >= scheduledOperations[operationHash],
            "Operation not ready"
        );
        // Execute operation
    }
}
```

### 3. Monitoring and Alerts

#### Events to Monitor

```solidity
// Critical events to watch
event Paid(uint256 indexed id, address indexed account, uint256 amount);
event StrategyConnected(IHegicStrategy indexed strategy);
event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);
event LimitChanged(IHegicStrategy indexed strategy, uint256 newLimit);
event EmergencyPause();
```

#### Monitoring Setup

```javascript
// Monitor large withdrawals
coverPool.on("Withdrawn", (epoch, positionId, amount, shareOfWithdraw, shareOf, totalShare) => {
    if (amount > ethers.utils.parseEther("100000")) {
        alertAdmin("Large withdrawal detected", {
            positionId,
            amount: ethers.utils.formatEther(amount)
        });
    }
});

// Monitor suspicious activity
treasury.on("Paid", (id, account, amount) => {
    if (amount > ethers.utils.parseUnits("1000000", 6)) {
        alertAdmin("Large payout", { id, account, amount });
    }
});
```

### 4. Emergency Procedures

#### Pause Mechanism

```solidity
import "@openzeppelin/contracts/security/Pausable.sol";

contract OperationalTreasury is Pausable {
    function buy(...) external whenNotPaused nonReentrant {
        // Normal operation
    }
    
    function pause() external onlyRole(GUARDIAN_ROLE) {
        _pause();
        emit EmergencyPause();
    }
    
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
}
```

#### Circuit Breaker

```solidity
uint256 public dailyWithdrawalLimit = 1000000e6; // 1M USDC
mapping(uint256 => uint256) public dailyWithdrawals; // day => amount

function withdraw(uint256 amount) external {
    uint256 today = block.timestamp / 1 days;
    
    require(
        dailyWithdrawals[today] + amount <= dailyWithdrawalLimit,
        "Daily limit exceeded"
    );
    
    dailyWithdrawals[today] += amount;
    
    // Process withdrawal
}
```

### 5. Upgrade Safety

#### Upgrade Checklist

- [ ] Test upgrade on testnet
- [ ] Verify storage layout compatibility
- [ ] Check for breaking changes
- [ ] Audit new code
- [ ] Prepare rollback plan
- [ ] Schedule maintenance window
- [ ] Notify users
- [ ] Execute via multisig
- [ ] Monitor after upgrade

#### Storage Layout Safety

```solidity
// V1
contract TreasuryV1 {
    uint256 public totalLocked;      // Slot 0
    uint256 public lockedPremium;    // Slot 1
    mapping(uint256 => LockedLiquidity) public lockedLiquidity; // Slot 2
}

// V2 - SAFE (only adds new variables)
contract TreasuryV2 is TreasuryV1 {
    uint256 public totalLocked;      // Slot 0 (unchanged)
    uint256 public lockedPremium;    // Slot 1 (unchanged)
    mapping(uint256 => LockedLiquidity) public lockedLiquidity; // Slot 2 (unchanged)
    uint256 public newFeature;       // Slot 3 (new)
}

// V2 - UNSAFE (changes order)
contract TreasuryV2Bad {
    uint256 public newFeature;       // Slot 0 (WRONG!)
    uint256 public totalLocked;      // Slot 1 (was 0)
    uint256 public lockedPremium;    // Slot 2 (was 1)
}
```

## Audit Considerations

### Pre-Audit Preparation

1. **Clean Code**: Remove unused code, comments, TODOs
2. **Documentation**: Complete NatSpec comments
3. **Tests**: 95%+ coverage
4. **Known Issues**: Document any known limitations
5. **Dependencies**: Update to latest secure versions

### Common Vulnerabilities to Check

| Vulnerability | Check | Status |
|---------------|-------|--------|
| Reentrancy | NonReentrant on all external calls | ✅ |
| Integer Overflow | Using Solidity 0.8.x | ✅ |
| Access Control | Role-based with AccessControl | ✅ |
| Oracle Manipulation | Chainlink with validation | ✅ |
| Front-running | Slippage protection | ✅ |
| DOS | Limited loops, pull pattern | ✅ |
| Timestamp Dependence | Only for long periods | ✅ |
| Unchecked Calls | SafeERC20, checked returns | ✅ |

### Audit Findings Template

```markdown
## Finding: [Title]

**Severity**: Critical / High / Medium / Low / Informational

**Description**: 
Detailed description of the issue

**Location**:
- File: `contracts/OperationalTreasury.sol`
- Function: `buy()`
- Line: 123

**Impact**:
What could happen if exploited

**Recommendation**:
How to fix the issue

**Status**: 
- [ ] Acknowledged
- [ ] Fixed
- [ ] Won't Fix (with justification)
```

## Security Best Practices Summary

### Development
1. ✅ Use latest stable Solidity version
2. ✅ Enable optimizer with appropriate runs
3. ✅ Use OpenZeppelin contracts
4. ✅ Follow checks-effects-interactions
5. ✅ Add comprehensive tests
6. ✅ Document all functions with NatSpec
7. ✅ Use static analysis tools (Slither, Mythril)
8. ✅ Conduct peer code reviews

### Deployment
1. ✅ Test on testnet first
2. ✅ Use hardware wallet for mainnet
3. ✅ Verify contracts on Etherscan
4. ✅ Transfer admin to multisig
5. ✅ Set appropriate limits
6. ✅ Monitor deployments
7. ✅ Prepare emergency procedures
8. ✅ Document all addresses

### Operations
1. ✅ Use multisig for all admin actions
2. ✅ Implement timelocks
3. ✅ Monitor events continuously
4. ✅ Regular security reviews
5. ✅ Keep dependencies updated
6. ✅ Bug bounty program
7. ✅ Incident response plan
8. ✅ Insurance coverage

## Security Resources

### Tools
- **Slither**: Static analysis
- **Mythril**: Symbolic execution
- **Echidna**: Fuzzing
- **Hardhat**: Testing framework
- **Tenderly**: Monitoring and debugging

### Audit Firms
- Trail of Bits
- OpenZeppelin
- PeckShield
- ConsenSys Diligence
- Quantstamp

### References
- [Solidity Security Considerations](https://docs.soliditylang.org/en/latest/security-considerations.html)
- [Smart Contract Best Practices](https://consensys.github.io/smart-contract-best-practices/)
- [OpenZeppelin Security](https://docs.openzeppelin.com/contracts/security)
- [SWC Registry](https://swcregistry.io/)

