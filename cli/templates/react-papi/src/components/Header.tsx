import WalletConnect from './WalletConnect'

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <a href="https://polkadot.network" target="_blank" className="block group">
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center group-hover:bg-gray-800 transition-colors">
                <span className="text-white font-bold text-sm">DOT</span>
              </div>
            </a>
            <h1 className="text-2xl font-light text-black tracking-wide">
              NFT Showcase
            </h1>
          </div>
          <WalletConnect />
        </div>
      </div>
    </header>
  )
}