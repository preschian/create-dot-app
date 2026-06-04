'use client'

import type { NetworkInfo } from '../networks'
import { BlockPanel } from './BlockPanel'
import { WritePanel } from './WritePanel'

interface Props {
  net: NetworkInfo
}

export function LiveDemo({ net }: Props) {
  return (
    <div className="grid grid-cols-2 border-b border-(--line) welcome-md:grid-cols-1">
      {/* Keyed by chain so switching networks remounts each panel, clearing the
          previous chain's block height and any in-flight transaction state. */}
      <BlockPanel key={net.key} net={net} />
      <WritePanel key={net.key} net={net} />
    </div>
  )
}
