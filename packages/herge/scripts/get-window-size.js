const {ethers} = require("hardhat")

const COVER_POOL_ADDRESS = "0x7174db190fF9D9AD136B39EdeEffBC2451FC1C5b"

async function main() {
  const coverPool = await ethers.getContractAt("CoverPool", COVER_POOL_ADDRESS)
  const windowSize = await coverPool.windowSize()
  console.log("CoverPool windowSize:", windowSize.toString(), "seconds")
  console.log(
    "≈",
    (Number(windowSize.toString()) / (60 * 60 * 24)).toFixed(2),
    "days"
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

