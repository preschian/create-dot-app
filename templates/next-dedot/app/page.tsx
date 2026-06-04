import type { Metadata } from 'next'
import App from './components/app'

export const metadata: Metadata = {
  title: 'create-dot-app · Welcome',
  description:
    'Polkadot-native dapp starter with a light client, type-safe API, and wallet connection, already wired together.',
}

export default function Home() {
  return <App />
}
