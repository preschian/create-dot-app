import AccountCard from './components/AccountCard'
import Footer from './components/Footer'
import Header from './components/Header'
import { useConnect } from './hooks/useConnect'
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
      <main className="container mx-auto py-8 flex justify-center">
        <div className="flex flex-col gap-4 w-full max-w-2xl">
          {chainKeys.map(chainKey => (
            <AccountCard
              key={chainKey}
              chainKey={chainKey}
              address={selectedAccount?.address || undefined}
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default App
