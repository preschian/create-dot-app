import { useEffect, useMemo, useState } from 'react'
import { formatAddress, getInitials } from '../utils/formatters'
import { getIdentity } from '../utils/sdk-interface'

export interface UseProfileParams {
  name?: string
  address?: string
}

export function useProfile(params: UseProfileParams) {
  const [resolvedName, setResolvedName] = useState<string>()

  useEffect(() => {
    if (params.address && !params.name) {
      getIdentity(params.address).then(setResolvedName)
    }
  }, [params.address, params.name])

  const displayName = useMemo(() => {
    return params.name || resolvedName
  }, [params.name, resolvedName])

  const displayAddress = useMemo(() => {
    if (!params.address)
      return undefined
    return formatAddress(params.address)
  }, [params.address])

  return {
    displayName,
    displayAddress,
    getInitials,
  }
}
