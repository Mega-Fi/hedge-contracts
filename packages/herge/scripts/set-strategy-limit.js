const {ethers} = require("hardhat")

const STRATEGY_ADDRESS = "0x2F3afA85386BFdd1c2b173c28719a17Acba8667F"
const LIMIT_USDC = "100" // set 100 USDC for testing

async function main() {
  const [deployer] = await ethers.getSigners()
  console.log("Setting strategy limit via strategy contract")
  console.log("  Deployer:", deployer.address)
  console.log("  Strategy:", STRATEGY_ADDRESS)
  console.log("  New limit:", LIMIT_USDC, "USDC")

  const limitWei = ethers.utils.parseUnits(LIMIT_USDC, 6)

  const strategy = await ethers.getContractAt(
    ["function lockedLimit() view returns (uint256)", "function setLimit(uint256)"],
    STRATEGY_ADDRESS
  )

  const current = await strategy.lockedLimit()
  console.log(
    "  Current limit:",
    ethers.utils.formatUnits(current, 6),
    "USDC"
  )

  if (current.eq(limitWei)) {
    console.log("Limit already set to desired value. Skipping transaction.")
    return
  }

  const tx = await strategy.setLimit(limitWei)
  console.log("  Tx sent:", tx.hash)
  await tx.wait()
  console.log("✅ Strategy limit updated.")
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

