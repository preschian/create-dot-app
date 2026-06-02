import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const contractsRoot = path.join(here, '..')
const outDir = path.join(contractsRoot, '..', 'lib', 'contracts')

for (const name of ['Flipper', 'Remark']) {
  const artifactPath = path.join(contractsRoot, 'artifacts/contracts', `${name}.sol`, `${name}.json`)
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'))
  fs.writeFileSync(path.join(outDir, `${name.toLowerCase()}.json`), `${JSON.stringify(artifact.abi, null, 2)}\n`)
}
