# Hegic Protocol - Testing Guidelines

## Test Structure

### Directory Organization

```
packages/herge/test/
├── contracts/               # Contract unit tests
│   ├── OperationalTreasury.test.ts
│   ├── CoverPool.test.ts
│   └── strategies/
│       ├── Call.test.ts
│       ├── Put.test.ts
│       └── ...
├── library/                 # Library function tests
│   ├── payoff.test.ts
│   └── strikes.test.ts
└── utils/                   # Test utilities
    ├── fixtures.ts
    └── helpers.ts
```

### Test File Template

```typescript
import { ethers, deployments } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { 
    OperationalTreasury,
    CoverPool,
    HegicStrategyCall 
} from "../../typechain";

describe("ContractName", () => {
    let deployer: SignerWithAddress;
    let alice: SignerWithAddress;
    let bob: SignerWithAddress;
    
    let treasury: OperationalTreasury;
    let coverPool: CoverPool;
    let strategy: HegicStrategyCall;
    
    beforeEach(async () => {
        // Get signers
        [deployer, alice, bob] = await ethers.getSigners();
        
        // Deploy contracts
        await deployments.fixture(["Treasury", "CoverPool", "Strategies"]);
        
        // Get contract instances
        treasury = await ethers.getContract("OperationalTreasury");
        coverPool = await ethers.getContract("CoverPool");
        strategy = await ethers.getContract("HegicStrategyCall");
    });
    
    describe("functionName()", () => {
        it("should perform expected action", async () => {
            // Arrange
            const amount = ethers.utils.parseEther("100");
            
            // Act
            const tx = await treasury.someFunction(amount);
            
            // Assert
            await expect(tx)
                .to.emit(treasury, "EventName")
                .withArgs(expectedArg1, expectedArg2);
        });
        
        it("should revert with error", async () => {
            await expect(
                treasury.someFunction(0)
            ).to.be.revertedWith("Expected error message");
        });
    });
});
```

## Testing Patterns

### 1. Arrange-Act-Assert (AAA)

```typescript
it("should transfer tokens correctly", async () => {
    // Arrange - Setup test conditions
    const amount = ethers.utils.parseEther("100");
    await token.mint(alice.address, amount);
    
    // Act - Execute the action
    await token.connect(alice).transfer(bob.address, amount);
    
    // Assert - Verify results
    expect(await token.balanceOf(bob.address)).to.equal(amount);
    expect(await token.balanceOf(alice.address)).to.equal(0);
});
```

### 2. Test Fixtures (Reusable Setup)

```typescript
// test/utils/fixtures.ts
import { deployments } from "hardhat";

export async function basicFixture() {
    await deployments.fixture([
        "Tokens",
        "PriceProviders",
        "Treasury",
        "CoverPool"
    ]);
    
    const treasury = await ethers.getContract("OperationalTreasury");
    const coverPool = await ethers.getContract("CoverPool");
    const usdc = await ethers.getContract("USDC");
    const hegic = await ethers.getContract("HEGIC");
    
    return { treasury, coverPool, usdc, hegic };
}

// In test file
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { basicFixture } from "../utils/fixtures";

describe("Test", () => {
    it("should work", async () => {
        const { treasury, coverPool } = await loadFixture(basicFixture);
        // Test logic
    });
});
```

### 3. Time-based Testing

```typescript
import { time } from "@nomicfoundation/hardhat-network-helpers";

it("should expire after period", async () => {
    // Create option with 7 day period
    const period = 7 * 24 * 60 * 60;
    await treasury.buy(strategy.address, alice.address, amount, period, []);
    
    // Fast forward 7 days
    await time.increase(period);
    
    // Verify option expired
    expect(await strategy.positionExpiration(1)).to.be.lte(await time.latest());
});

it("should allow exercise within window", async () => {
    // Create option
    await treasury.buy(strategy.address, alice.address, amount, period, []);
    
    // Fast forward to exercise window
    const expiration = await strategy.positionExpiration(1);
    await time.increaseTo(expiration - 3600); // 1 hour before expiration
    
    // Should be exercisable
    expect(await strategy.isPayoffAvailable(1, alice.address, alice.address))
        .to.be.true;
});
```

### 4. Event Testing

```typescript
it("should emit correct event", async () => {
    await expect(treasury.buy(strategy.address, alice.address, amount, period, []))
        .to.emit(strategy, "Acquired")
        .withArgs(
            1,                    // option ID
            anyValue,             // amount
            anyValue,             // premium
            anyValue,             // strike
            anyValue              // expiration
        );
});

it("should emit multiple events", async () => {
    const tx = await treasury.buy(...);
    
    await expect(tx)
        .to.emit(treasury, "LockedLiquidity")
        .and.to.emit(manager, "Transfer");
});
```

### 5. Revert Testing

```typescript
it("should revert with specific message", async () => {
    await expect(
        treasury.buy(strategy.address, alice.address, 0, period, [])
    ).to.be.revertedWith("Amount must be greater than 0");
});

it("should revert with custom error", async () => {
    await expect(
        treasury.buy(...)
    ).to.be.revertedWithCustomError(treasury, "InvalidStrategy");
});

it("should revert without message", async () => {
    await expect(
        treasury.buy(...)
    ).to.be.reverted;
});
```

### 6. Balance and State Testing

```typescript
it("should update balances correctly", async () => {
    const initialBalance = await usdc.balanceOf(alice.address);
    const premium = await strategy.calculatePremium(amount, period, []);
    
    await treasury.connect(alice).buy(
        strategy.address,
        alice.address,
        amount,
        period,
        []
    );
    
    // Check balance decreased by premium
    expect(await usdc.balanceOf(alice.address))
        .to.equal(initialBalance.sub(premium));
    
    // Check treasury balance increased
    expect(await usdc.balanceOf(treasury.address))
        .to.equal(premium);
});

it("should track locked liquidity", async () => {
    const initialLocked = await treasury.totalLocked();
    
    await treasury.buy(strategy.address, alice.address, amount, period, []);
    
    const [state, , negativePNL, , ] = await treasury.lockedLiquidity(1);
    
    expect(state).to.equal(1); // Locked
    expect(await treasury.totalLocked())
        .to.equal(initialLocked.add(negativePNL));
});
```

### 7. Access Control Testing

```typescript
it("should only allow admin to call", async () => {
    await expect(
        treasury.connect(alice).connect(strategy.address)
    ).to.be.revertedWith(
        `AccessControl: account ${alice.address.toLowerCase()} ` +
        `is missing role ${await treasury.DEFAULT_ADMIN_ROLE()}`
    );
    
    // Should work for admin
    await expect(
        treasury.connect(deployer).connect(strategy.address)
    ).to.not.be.reverted;
});
```

### 8. Edge Case Testing

```typescript
describe("Edge Cases", () => {
    it("should handle zero amount", async () => {
        await expect(
            treasury.buy(strategy.address, alice.address, 0, period, [])
        ).to.be.revertedWith("Amount must be greater than 0");
    });
    
    it("should handle max uint256", async () => {
        const maxUint = ethers.constants.MaxUint256;
        // Test behavior with max values
    });
    
    it("should handle empty arrays", async () => {
        await treasury.buy(strategy.address, alice.address, amount, period, []);
        // Should work with empty additional data
    });
    
    it("should handle boundary values", async () => {
        const minPeriod = await strategy.periodLimits(0);
        const maxPeriod = await strategy.periodLimits(1);
        
        // Test minimum
        await treasury.buy(strategy.address, alice.address, amount, minPeriod, []);
        
        // Test maximum
        await treasury.buy(strategy.address, alice.address, amount, maxPeriod, []);
        
        // Test just below minimum
        await expect(
            treasury.buy(strategy.address, alice.address, amount, minPeriod - 1, [])
        ).to.be.reverted;
    });
});
```

## Testing Strategies

### Unit Tests
Test individual functions in isolation

```typescript
describe("ProfitCalculator", () => {
    it("should calculate call profit correctly", () => {
        const strike = ethers.utils.parseEther("2000");
        const currentPrice = ethers.utils.parseEther("2100");
        const amount = ethers.utils.parseEther("1");
        
        const profit = calculateCallProfit(
            strike,
            currentPrice,
            amount,
            18, // token decimals
            18, // spot decimals
            8   // price decimals
        );
        
        // Profit should be (2100 - 2000) * 1 = 100
        expect(profit).to.equal(ethers.utils.parseEther("100"));
    });
});
```

### Integration Tests
Test multiple contracts working together

```typescript
describe("Option Purchase Flow", () => {
    it("should complete full purchase flow", async () => {
        // Setup
        const amount = ethers.utils.parseEther("1");
        const period = 7 * 24 * 60 * 60;
        
        // Approve USDC
        await usdc.connect(alice).approve(treasury.address, ethers.constants.MaxUint256);
        
        // Buy option
        await treasury.connect(alice).buy(
            strategy.address,
            alice.address,
            amount,
            period,
            []
        );
        
        // Verify NFT minted
        expect(await manager.ownerOf(1)).to.equal(alice.address);
        
        // Verify liquidity locked
        const [state, , negativePNL, positivePNL, expiration] = 
            await treasury.lockedLiquidity(1);
        expect(state).to.equal(1); // Locked
        expect(negativePNL).to.be.gt(0);
        expect(positivePNL).to.be.gt(0);
        
        // Fast forward to exercise window
        await time.increaseTo(expiration - 3600);
        
        // Exercise option
        const initialBalance = await usdc.balanceOf(alice.address);
        await treasury.connect(alice).payOff(1, alice.address);
        
        // Verify payout
        const finalBalance = await usdc.balanceOf(alice.address);
        expect(finalBalance).to.be.gt(initialBalance);
    });
});
```

### Scenario Tests
Test real-world scenarios

```typescript
describe("Multi-User Scenario", () => {
    it("should handle multiple users providing and withdrawing", async () => {
        // Alice provides 1000 HEGIC
        await hegic.mint(alice.address, ethers.utils.parseEther("1000"));
        await hegic.connect(alice).approve(coverPool.address, ethers.constants.MaxUint256);
        await coverPool.connect(alice).provide(ethers.utils.parseEther("1000"), 0);
        
        // Bob provides 500 HEGIC
        await hegic.mint(bob.address, ethers.utils.parseEther("500"));
        await hegic.connect(bob).approve(coverPool.address, ethers.constants.MaxUint256);
        await coverPool.connect(bob).provide(ethers.utils.parseEther("500"), 0);
        
        // Simulate profit
        await usdc.mint(coverPool.address, ethers.utils.parseEther("150"));
        await coverPool.fixProfit();
        
        // Check profit distribution
        const aliceProfit = await coverPool.availableToClaim(1);
        const bobProfit = await coverPool.availableToClaim(2);
        
        // Alice should get 2/3 of profit (1000/1500)
        // Bob should get 1/3 of profit (500/1500)
        expect(aliceProfit).to.be.closeTo(
            ethers.utils.parseEther("100"),
            ethers.utils.parseEther("0.1")
        );
        expect(bobProfit).to.be.closeTo(
            ethers.utils.parseEther("50"),
            ethers.utils.parseEther("0.1")
        );
    });
});
```

## Test Coverage Requirements

### Coverage Targets
- **Statements**: >95%
- **Branches**: >90%
- **Functions**: >95%
- **Lines**: >95%

### Running Coverage

```bash
cd packages/herge
npx hardhat coverage

# View report
open coverage/index.html
```

### What to Test

#### ✅ Must Test
- All public/external functions
- All modifiers
- Access control
- Error conditions
- Edge cases
- State changes
- Event emissions
- Integration flows

#### ⚠️ Nice to Test
- Internal functions (via public wrappers)
- View functions with complex logic
- Library functions
- Gas optimization paths

#### ❌ Don't Need to Test
- Simple getters/setters
- OpenZeppelin imported contracts
- External library calls (mock them)

## Mocking and Stubbing

### Mock Contracts

```typescript
// test/mocks/MockPriceProvider.sol
contract MockPriceProvider {
    int256 private _price;
    
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
        return (0, _price, 0, block.timestamp, 0);
    }
}
```

```typescript
// In tests
let mockPriceProvider: MockPriceProvider;

beforeEach(async () => {
    const MockPriceProvider = await ethers.getContractFactory("MockPriceProvider");
    mockPriceProvider = await MockPriceProvider.deploy();
    await mockPriceProvider.setPrice(ethers.utils.parseUnits("2000", 8));
});
```

### Mock ERC20 Tokens

```typescript
import { MockContract } from "@ethereum-waffle/mock-contract";
import ERC20Artifact from "@openzeppelin/contracts/build/contracts/ERC20.json";

let mockToken: MockContract;

beforeEach(async () => {
    mockToken = await deployMockContract(deployer, ERC20Artifact.abi);
    
    await mockToken.mock.transfer.returns(true);
    await mockToken.mock.balanceOf.returns(ethers.utils.parseEther("1000"));
});
```

## Test Helpers

### Common Helpers

```typescript
// test/utils/helpers.ts

export async function buyOption(
    treasury: OperationalTreasury,
    strategy: IHegicStrategy,
    buyer: SignerWithAddress,
    amount: BigNumber,
    period: number
) {
    return await treasury.connect(buyer).buy(
        strategy.address,
        buyer.address,
        amount,
        period,
        []
    );
}

export async function provideToPool(
    coverPool: CoverPool,
    provider: SignerWithAddress,
    token: IERC20,
    amount: BigNumber
) {
    await token.connect(provider).approve(coverPool.address, amount);
    return await coverPool.connect(provider).provide(amount, 0);
}

export function calculateExpectedProfit(
    strike: BigNumber,
    currentPrice: BigNumber,
    amount: BigNumber,
    isCall: boolean
): BigNumber {
    if (isCall) {
        return currentPrice.gt(strike) 
            ? currentPrice.sub(strike).mul(amount).div(ethers.utils.parseEther("1"))
            : BigNumber.from(0);
    } else {
        return strike.gt(currentPrice)
            ? strike.sub(currentPrice).mul(amount).div(ethers.utils.parseEther("1"))
            : BigNumber.from(0);
    }
}
```

## Gas Testing

```typescript
describe("Gas Optimization", () => {
    it("should use reasonable gas for buy", async () => {
        const tx = await treasury.buy(
            strategy.address,
            alice.address,
            amount,
            period,
            []
        );
        
        const receipt = await tx.wait();
        expect(receipt.gasUsed).to.be.lt(500000); // Under 500k gas
    });
    
    it("should batch operations efficiently", async () => {
        // Compare gas for individual vs batched operations
    });
});
```

## Best Practices

### ✅ Do's
- Test one thing per test
- Use descriptive test names
- Setup fixtures for reusable state
- Test both success and failure cases
- Use constants for magic numbers
- Clean up state between tests
- Test events and state changes
- Use `beforeEach` for common setup
- Group related tests with `describe`
- Comment complex test logic

### ❌ Don'ts
- Don't test external libraries
- Don't duplicate test logic
- Don't use random values (unless testing randomness)
- Don't skip tests (fix or remove)
- Don't make tests dependent on each other
- Don't test internal implementation details
- Don't use overly complex assertions
- Don't forget to clean up resources

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '14'
          
      - name: Install Dependencies
        run: yarn install
        
      - name: Compile Contracts
        run: yarn workspace @hegic/herge compile
        
      - name: Run Tests
        run: yarn workspace @hegic/herge test
        
      - name: Generate Coverage
        run: yarn workspace @hegic/herge coverage
        
      - name: Upload Coverage
        uses: codecov/codecov-action@v2
        with:
          files: ./packages/herge/coverage/lcov.info
```

## Debugging Tests

### Enable Hardhat Console

```solidity
import "hardhat/console.sol";

function someFunction() public {
    console.log("Value:", someValue);
}
```

### Verbose Output

```bash
npx hardhat test --verbose

# Or with stack traces
npx hardhat test --stack-traces
```

### Debug Specific Test

```bash
npx hardhat test test/contracts/OperationalTreasury.test.ts --grep "should buy option"
```

### Interactive Debugging

```typescript
// Add debugger in test
it("should work", async () => {
    debugger; // Breakpoint here
    await treasury.buy(...);
});
```

```bash
# Run with Node inspector
node --inspect-brk node_modules/.bin/hardhat test
```

