import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const contractsRoot = path.join(here, '..')
const outDir = path.join(contractsRoot, '..', 'lib', 'contracts')

const artifactPath = path.join(contractsRoot, 'artifacts/contracts/Flipper.sol/Flipper.json')
const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'))
fs.writeFileSync(path.join(outDir, 'flipper.json'), `${JSON.stringify(artifact.abi, null, 2)}\n`)
