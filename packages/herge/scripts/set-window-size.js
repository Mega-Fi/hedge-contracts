const {ethers} = require("hardhat")

const COVER_POOL_ADDRESS = "0x7174db190fF9D9AD136B39EdeEffBC2451FC1C5b"
const NEW_WINDOW_SECONDS = 30 * 24 * 60 * 60 // 30 days

async function main() {
  const [deployer] = await ethers.getSigners()
  console.log("Setting CoverPool windowSize")
  console.log("  Deployer:", deployer.address)
  console.log("  CoverPool:", COVER_POOL_ADDRESS)
  console.log("  New window:", NEW_WINDOW_SECONDS, "seconds")

  const coverPool = await ethers.getContractAt("CoverPool", COVER_POOL_ADDRESS)
  const current = ethers.BigNumber.from(await coverPool.windowSize())
  console.log("  Current window:", current.toString(), "seconds")

  if (current.eq(NEW_WINDOW_SECONDS)) {
    console.log("Window already set to desired value. Skipping transaction.")
    return
  }

  const tx = await coverPool.setWindowSize(NEW_WINDOW_SECONDS)
  console.log("  Tx sent:", tx.hash)
  await tx.wait()
  console.log("✅ windowSize updated to 30 days.")
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

