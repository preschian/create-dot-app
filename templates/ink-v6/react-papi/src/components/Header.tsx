import Connect from './Connect'

export default function Header() {
  return (
    <div className="navbar bg-base-100 border-b border-gray-200">
      <div className="container mx-auto flex items-center">
        <div className="navbar-start">
          <a href="https://polkadot.com" target="_blank" className="flex items-center" rel="noopener noreferrer">
            <span className="icon-[token-branded--polkadot] text-2xl" />
            <span className="text-xl font-bold font-mono text-black tracking-wide ml-1">
              Dapp
            </span>
          </a>
        </div>
        <div className="navbar-end">
          <Connect />
        </div>
      </div>
    </div>
  )
}
