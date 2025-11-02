import {HardhatRuntimeEnvironment} from "hardhat/types"
import {parseUnits, keccak256, toUtf8Bytes} from "ethers/lib/utils"
import {constants} from "ethers"

const OPERATIONAL_TRESUARY_ROLE = keccak256(
    toUtf8Bytes("OPERATIONAL_TRESUARY_ROLE"),
)
const HEGIC_POOL_ROLE = keccak256(
    toUtf8Bytes("HEGIC_POOL_ROLE"),
)

async function deployment(hre: HardhatRuntimeEnvironment) {

  const {deployments, getNamedAccounts, getUnnamedAccounts} = hre
  const {get, execute} = deployments
  const {deployer, payoffPool} = await getNamedAccounts()
  const [alice, bob, carl] = await getUnnamedAccounts()
  
  process.stdout.write("Pools...: ")
  const CoverPool = await get("CoverPool")
  const OperationalTreasury = await get("OperationalTreasury")

  // Grant roles (uncomment when ready to initialize)
  // await execute("CoverPool", {from: deployer}, "grantRole", OPERATIONAL_TRESUARY_ROLE, OperationalTreasury.address)
  // await execute("PositionsManager", {from: deployer}, "grantRole", HEGIC_POOL_ROLE, OperationalTreasury.address)
  
  // USDC-only model: Approve USDC instead of HEGIC for payoff pool
  await execute("USDC", {from: payoffPool}, "approve", CoverPool.address, constants.MaxUint256)

  
  // ============== OPTIONAL INITIALIZATION FOR TESTING ==============
  // Uncomment these when deploying to test networks with mock tokens
  
  // Mint USDC to Treasury (for zero-capital start, keep this at 0)
  // await execute("USDC", {from: deployer}, "mint", OperationalTreasury.address, parseUnits("0", 6))
  
  // Mint USDC to payoff pool (backup liquidity)
  // await execute("USDC", {from: deployer}, "mint", payoffPool, parseUnits("1000000", 6))

  // Mint USDC to test users for providing liquidity to CoverPool
  // await execute("USDC", {from: deployer}, "mint", deployer, parseUnits("1000000", 6))
  // await execute("USDC", {from: deployer}, "mint", alice, parseUnits("1000000", 6))
  // await execute("USDC", {from: deployer}, "mint", bob, parseUnits("1000000", 6))
  // await execute("USDC", {from: deployer}, "mint", carl, parseUnits("1000000", 6))
  
  // Approve CoverPool to spend USDC for all users
  // await execute("USDC", {from: deployer}, "approve", CoverPool.address, constants.MaxUint256)
  // await execute("USDC", {from: alice}, "approve", CoverPool.address, constants.MaxUint256)
  // await execute("USDC", {from: bob}, "approve", CoverPool.address, constants.MaxUint256)
  // await execute("USDC", {from: carl}, "approve", CoverPool.address, constants.MaxUint256)
  
  // Provide initial USDC liquidity to CoverPool (LPs deposit USDC, not HEGIC!)
  // await execute("CoverPool", {from: deployer}, "provide", parseUnits("10000000", 6), 0)
  // await execute("CoverPool", {from: bob}, "provide", parseUnits("100000", 6), 0)
  
  console.log("filled!")
}

deployment.tags = ["init pools"]
// deployment.dependencies = [
    // "OperationalTreasury"
  // ]
export default deployment
