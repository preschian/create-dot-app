import Footer from './components/Footer'
import Header from './components/Header'
import NFTCollection from './components/NFTCollection'
import SignTransaction from './components/SignTransaction'

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      {/* Main Content */}
      <main>
        <NFTCollection />
      </main>

      {/* Transaction Testing Section - Above Footer */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-light text-black tracking-wide mb-4">
                Transaction Testing
              </h2>
              <p className="text-gray-600 font-light">
                Test blockchain interactions on Asset Hub
              </p>
            </div>

            {/* Transaction Card with NFTCard styling */}
            <div className="group">
              <div className="bg-white border border-gray-200 overflow-hidden hover:border-black transition-all duration-300 hover:shadow-lg">
                <SignTransaction />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default App
