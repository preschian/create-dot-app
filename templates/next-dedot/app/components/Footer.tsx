export default function Footer() {
  return (
    <footer className="footer footer-center bg-base-200 text-base-content p-4">
      <aside className="flex items-center gap-4">
        <p>Copyright © 2025</p>
        <a href="https://x.com/" target="_blank" rel="noopener noreferrer" className="size-5 text-gray-600 hover:text-gray-900 transition-colors">
          <span className="icon-[mdi--twitter] size-5" />
        </a>
        <a href="https://github.com/preschian/create-dot-app" target="_blank" rel="noopener noreferrer" className="size-5 text-gray-600 hover:text-gray-900 transition-colors">
          <span className="icon-[mdi--github] size-5" />
        </a>
      </aside>
    </footer>
  )
}
