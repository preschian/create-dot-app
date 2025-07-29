import AccountCard from './components/AccountCard'
import Footer from './components/Footer'
import Header from './components/Header'
import { useConnect } from './hooks/useConnect'
import { unifyAddress } from './utils/formatters'
import { chainKeys } from './utils/sdk'

function App() {
  const { selectedAccount } = useConnect()

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />

      {/* Hero Section */}
      <section className="bg-white py-16 hidden sm:block">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            <span>App Starter</span>
          </h1>
          <p className="text-xl text-gray-600 font-mono flex items-center justify-center gap-2">
            <span>Powered by</span>
            <span className="icon-[token-branded--polkadot] animate-spin" style={{ animationDuration: '16s' }} />
          </p>
        </div>
      </section>

      {/* Account Cards */}
      <main className="container mx-auto py-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {chainKeys.map(chainKey => (
            <div key={chainKey}>
              <AccountCard
                key={chainKey}
                chainKey={chainKey}
                address={selectedAccount?.address ? unifyAddress(selectedAccount.address) : undefined}
              />
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default App
