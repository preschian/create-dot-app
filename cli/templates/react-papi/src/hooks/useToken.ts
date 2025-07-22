import { useEffect, useState } from 'react'
import { getTokenDetail } from '../utils/sdk-interface'

export interface TokenMetadata {
  name: string
  image: string
}

export interface UseTokenParams {
  metadata?: string
  collection: number
  token?: number
}

export function useToken(params: UseTokenParams) {
  const [metadata, setMetadata] = useState<TokenMetadata>()
  const [price, setPrice] = useState<string>()
  const [owner, setOwner] = useState<string>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!params.metadata || !params.token) {
      return
    }

    let ignore = false

    async function fetchTokenDetails() {
      try {
        const { tokenMetadata, tokenPrice, tokenOwner } = await getTokenDetail(params.collection, params.token!, params.metadata!)
        if (!ignore) {
          setMetadata(tokenMetadata)
          setPrice(tokenPrice || '')
          setOwner(tokenOwner || '')
          setLoading(false)
        }
      }
      catch {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    fetchTokenDetails()

    return () => {
      ignore = true
    }
  }, [params.metadata, params.token, params.collection])

  return {
    metadata,
    price,
    owner,
    loading,
  }
}
