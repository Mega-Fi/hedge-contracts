const {ethers} = require("hardhat")

const STRATEGY_ADDRESS = "0x2F3afA85386BFdd1c2b173c28719a17Acba8667F"

async function main() {
  const strategy = await ethers.getContractAt(
    ["function lockedLimit() view returns (uint256)"],
    STRATEGY_ADDRESS
  )
  const limit = await strategy.lockedLimit()
  console.log(
    "Strategy lockedLimit:",
    ethers.utils.formatUnits(limit, 6),
    "USDC"
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

