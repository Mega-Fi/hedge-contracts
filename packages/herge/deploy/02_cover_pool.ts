import {HardhatRuntimeEnvironment} from "hardhat/types"
import {parseUnits} from "ethers/lib/utils"

export const params = {
  changingPrice: {
    // USDC-only model: 1:1 ratio since coverToken = profitToken = USDC
    arbitrum: parseUnits("1", 30),
    "arbitrum-sepolia": parseUnits("1", 30),
    default: parseUnits("1", 30)
  },
}

async function deployment(hre: HardhatRuntimeEnvironment): Promise<void> {
  const {deployments, getNamedAccounts} = hre
  const {deploy, get} = deployments
  const {deployer, payoffPool} = await getNamedAccounts()

  // USDC-only model: Only need USDC, no HEGIC token
  const USDC = await get("USDC")

  const changingPrice = params.changingPrice[hre.network.name as "arbitrum"] || params.changingPrice.default

  await deploy("CoverPool", {
    from: deployer,
    log: true,
    // coverToken = USDC, profitToken = USDC, changingPrice = 1e30 (1:1 ratio)
    args: [USDC.address, USDC.address, payoffPool, changingPrice],
  })
}

deployment.tags = ["test", "cover-pool", "arbitrum"]
export default deployment
