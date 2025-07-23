import Footer from './components/Footer'
import Header from './components/Header'
import StatusBar from './components/StatusBar'
import TokenCollection from './components/TokenCollection'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 pb-12">
      <Header />

      {/* Main Content */}
      <main>
        <TokenCollection />
      </main>

      <Footer />
      <StatusBar />
    </div>
  )
}

export default App
