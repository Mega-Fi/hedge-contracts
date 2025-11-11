const {ethers} = require("hardhat")

const COVER_POOL_ADDRESS = "0x7174db190fF9D9AD136B39EdeEffBC2451FC1C5b"

async function main() {
  const coverPool = await ethers.getContractAt("CoverPool", COVER_POOL_ADDRESS)

  try {
    const owner = await coverPool.ownerOf(1)
    const balance = await coverPool.coverTokenBalance(1)
    console.log("Position 1 owner:", owner)
    console.log(
      "Position 1 balance:",
      ethers.utils.formatUnits(balance, 6),
      "USDC"
    )
  } catch (error) {
    console.error("Unable to read position 1:", error.message)
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

