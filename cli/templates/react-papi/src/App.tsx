import Footer from './components/Footer';
import Header from './components/Header';
import TokenCollection from './components/TokenCollection';
import StatusBar from './components/StatusBar';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      {/* Main Content */}
      <main>
        <TokenCollection />
      </main>

      <Footer />
      <StatusBar />
    </div>
  );
}

export default App;