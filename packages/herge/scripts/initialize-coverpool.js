const {ethers, deployments} = require("hardhat")

// Configuration for Arbitrum Sepolia deployment
const COVER_POOL_ADDRESS = "0x7174db190fF9D9AD136B39EdeEffBC2451FC1C5b"
const USDC_ADDRESS = "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d"
const INITIAL_DEPOSIT_USDC = "10" // 10 USDC
const POSITION_ID_ZERO = 0

async function main() {
  const [deployer] = await ethers.getSigners()

  console.log("Initializing CoverPool position #0")
  console.log("  Deployer:", deployer.address)
  console.log("  CoverPool:", COVER_POOL_ADDRESS)
  console.log("  USDC:", USDC_ADDRESS)
  console.log(`  Deposit: ${INITIAL_DEPOSIT_USDC} USDC`)

  const usdc = await ethers.getContractAt("IERC20", USDC_ADDRESS)
  const coverPool = await ethers.getContractAt("CoverPool", COVER_POOL_ADDRESS)
  const amount = ethers.utils.parseUnits(INITIAL_DEPOSIT_USDC, 6)

  const allowance = await usdc.allowance(deployer.address, COVER_POOL_ADDRESS)
  if (allowance.lt(amount)) {
    console.log("Approving USDC to CoverPool...")
    const approveTx = await usdc.approve(COVER_POOL_ADDRESS, amount)
    console.log("  Approve tx:", approveTx.hash)
    await approveTx.wait()
  } else {
    console.log("Existing allowance sufficient, skipping approval.")
  }

  const currentWindow = ethers.BigNumber.from(await coverPool.windowSize())
  const expandedWindow = ethers.BigNumber.from(60 * 60 * 24 * 30) // 30 days

  let windowAdjusted = false
  if (currentWindow.lt(expandedWindow)) {
    console.log(
      `Temporarily expanding window from ${currentWindow.toString()} to ${expandedWindow.toString()}`
    )
    const expandTx = await coverPool.setWindowSize(expandedWindow)
    console.log("  Expand tx:", expandTx.hash)
    await expandTx.wait()
    windowAdjusted = true
  }

  const expectedPositionId = await coverPool.callStatic.provide(
    amount,
    POSITION_ID_ZERO
  )
  console.log(
    `Providing liquidity to create position ${expectedPositionId.toString()}...`
  )
  const provideTx = await coverPool.provide(amount, POSITION_ID_ZERO)
  console.log("  Provide tx:", provideTx.hash)
  const receipt = await provideTx.wait()
  console.log("✅ Position 0 created. Gas used:", receipt.gasUsed.toString())

  const balance = ethers.BigNumber.from(
    await coverPool.coverTokenBalance(expectedPositionId)
  )
  console.log(
    `Position ${expectedPositionId.toString()} balance:`,
    ethers.utils.formatUnits(balance, 6),
    "USDC"
  )

  if (windowAdjusted) {
    console.log(`Restoring window size back to ${currentWindow.toString()}`)
    const restoreTx = await coverPool.setWindowSize(currentWindow)
    console.log("  Restore tx:", restoreTx.hash)
    await restoreTx.wait()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

