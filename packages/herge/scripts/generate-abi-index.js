const fs = require("fs")
const path = require("path")

const deploymentsDir = path.join(__dirname, "../deployments/arbitrum-sepolia")
const outputPath = path.join(__dirname, "../docs/ABI_ADDRESS_INDEX.md")

function toPosix(p) {
  return p.split(path.sep).join("/")
}

function main() {
  const entries = fs
    .readdirSync(deploymentsDir)
    .filter(
      (file) =>
        file.endsWith(".json") &&
        !file.startsWith(".") &&
        file !== ".addresses.json"
    )
    .sort((a, b) => a.localeCompare(b))

  const rows = entries.map((filename) => {
    const fullPath = path.join(deploymentsDir, filename)
    const artifact = JSON.parse(fs.readFileSync(fullPath, "utf8"))

    const label = filename.replace(/\.json$/, "")
    const address = artifact.address
    let source = "N/A"
    let contractName = label

    if (artifact.metadata) {
      try {
        const metadata = JSON.parse(artifact.metadata)
        const targets = metadata.settings?.compilationTarget
        if (targets) {
          const [entry] = Object.entries(targets)
          if (entry) {
            source = entry[0]
            contractName = entry[1]
          }
        }
      } catch (err) {
        // ignore malformed metadata
      }
    }

    const abiPath =
      source === "N/A"
        ? "N/A"
        : toPosix(
            path.posix.join(
              "..",
              "abi",
              source,
              `${contractName}.json`
            )
          )

    return { label, address, source, contractName, abiPath }
  })

  const lines = []
  lines.push("# ABI Address Index")
  lines.push("")
  lines.push(
    "This file is auto-generated from `deployments/arbitrum-sepolia/*.json`. Each entry maps a deployed address to the JSON ABI artifact under `packages/herge/abi/`."
  )
  lines.push("")
  lines.push(
    "| Deployment Label | Contract | Address | ABI JSON | Source Path |"
  )
  lines.push("| --- | --- | --- | --- | --- |")

  for (const row of rows) {
    const abiLink =
      row.abiPath === "N/A"
        ? "N/A"
        : `[${row.contractName}](${row.abiPath})`
    lines.push(
      `| \`${row.label}\` | \`${row.contractName}\` | \`${row.address}\` | ${abiLink} | \`${row.source}\` |`
    )
  }

  lines.push("")
  lines.push(
    "_Generated on " + new Date().toISOString().slice(0, 10) + "._"
  )

  fs.writeFileSync(outputPath, lines.join("\n") + "\n")
  console.log(`✅ Wrote ${rows.length} entries to ${toPosix(outputPath)}`)
}

main()

