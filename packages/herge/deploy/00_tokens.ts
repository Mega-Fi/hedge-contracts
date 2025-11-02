import {HardhatRuntimeEnvironment} from "hardhat/types"

async function deployment(hre: HardhatRuntimeEnvironment): Promise<void> {
  const {deployments, getNamedAccounts, network} = hre
  const {deploy, save, getArtifact} = deployments
  const {deployer} = await getNamedAccounts()

  switch (network.name) {
    case "arbitrum":
      // USDC - Main token for cover pool and profits
      save("USDC", {
        address: "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8",
        abi: await getArtifact("ERC20").then((x) => x.abi),
      })
      // HEGIC - NOT NEEDED for USDC-only model (keeping for reference only)
      // Uncomment if you want to deploy original Hegic model
      // save("HEGIC", {
      //   address: "0x431402e8b9de9aa016c743880e04e517074d8cec",
      //   abi: await getArtifact("ERC20").then((x) => x.abi),
      // })
      return
    case "arbitrum-sepolia":
      // USDC - Main token for cover pool and profits (Arbitrum Sepolia)
      save("USDC", {
        address: "0xf3C3351D6Bd0098EEb33ca8f830FAf2a141Ea2E1",
        abi: await getArtifact("ERC20").then((x) => x.abi),
      })
      save("WETH", {
        address: "0x980B62Da83eFf3D4576C647993b0c1D7faf17c73",
        abi: await getArtifact("ERC20").then((x) => x.abi),
      })
      save("WBTC", {
        address: "0x806D0637Fbbfb4EB9efD5119B0895A5C7Cbc66e7",
        abi: await getArtifact("ERC20").then((x) => x.abi),
      })
      return
    case "hardhat":
    case "localhost":
    case "hlocal":
    case "hoffice":
      // Deploy USDC mock - Main token for USDC-only model
      await deploy("USDC", {
        contract: "ERC20Mock",
        from: deployer,
        log: true,
        args: ["USDC (Mock)", "USDC", 6],
      })

      // Deploy WETH and WBTC mocks for price oracles/underlying assets
      await deploy("WETH", {
        contract: "ERC20Mock",
        from: deployer,
        log: true,
        args: ["WETH (Mock)", "WETH", 18],
      })

      await deploy("WBTC", {
        contract: "ERC20Mock",
        from: deployer,
        log: true,
        args: ["WBTC (Mock)", "WBTC", 8],
      })

      // HEGIC - NOT NEEDED for USDC-only model
      // Uncomment if you want to test original Hegic model
      // await deploy("HEGIC", {
      //   contract: "ERC20Mock",
      //   from: deployer,
      //   log: true,
      //   args: ["HEGIC (Mock)", "HEGIC", 18],
      // })
      break
    case "ropsten":
      // Deploy USDC mock for testnet
      await deploy("USDC", {
        contract: "ERC20Mock",
        from: deployer,
        log: true,
        args: ["HEGIC Playground USD", "pgUSD", 6],
      })

      // HEGIC - NOT NEEDED for USDC-only model
      // Uncomment if you want to test original Hegic model
      // await deploy("HEGIC", {
      //   contract: "ERC20Mock",
      //   from: deployer,
      //   log: true,
      //   args: ["HEGIC Playground", "HEGIC", 18],
      // })
      break
    default:
      throw new Error("Unsupported network: " + network.name)
  }
}

deployment.tags = ["test", "tokens", "arbitrum"]
export default deployment
