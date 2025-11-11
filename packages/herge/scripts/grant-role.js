const {ethers, deployments} = require("hardhat")

async function main() {
  const ROLE = "0x985cb37a5a8b8be3316b4239830f14f158762f12abaae14c979a055dd9bbee6f"
  const TREASURY = "0x3B026eD677615aDD2aC32aa5D1D5453051551EfB"

  const {address: positionsManagerAddress} = await deployments.get("PositionsManager")

  console.log("Granting HEGIC_POOL_ROLE to OperationalTreasury...")
  console.log(`  PositionsManager: ${positionsManagerAddress}`)
  console.log(`  Treasury:         ${TREASURY}`)
  console.log(`  Role:             ${ROLE}`)

  const positionsManager = await ethers.getContractAt(
    "PositionsManager",
    positionsManagerAddress
  )

  const tx = await positionsManager.grantRole(ROLE, TREASURY)
  console.log("  Tx sent:", tx.hash)
  await tx.wait()
  console.log("✅ Role granted successfully")
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

