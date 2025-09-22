import Content from './components/Content'
import Footer from './components/Footer'
import Header from './components/Header'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Content />
      </main>
      <Footer />
    </div>
  )
}

export default App
