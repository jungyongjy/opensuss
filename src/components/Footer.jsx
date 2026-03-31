import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-navy dark:bg-gray-900 text-white mt-12">
      <div className="max-w-6xl mx-auto px-4 pt-10 pb-28 md:pb-10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          <div className="space-y-2 max-w-xs">
            <p className="font-display font-bold text-xl tracking-tight">
              OpenS<span className="text-suss-red">U</span>SS
            </p>
            <p className="text-white/50 text-sm leading-relaxed">
              One less thing to hunt for. An unofficial student project — not affiliated with SUSS.
            </p>
          </div>
          <div className="flex gap-12 text-sm">
            <div>
              <p className="text-white/30 text-xs uppercase tracking-widest font-medium mb-3">Pages</p>
              <div className="space-y-2.5">
                <Link to="/" className="block text-white/60 hover:text-white transition-colors">Home</Link>
                <Link to="/tools" className="block text-white/60 hover:text-white transition-colors">Academic Tools</Link>
                <Link to="/academic-calendar" className="block text-white/60 hover:text-white transition-colors">Calendar</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <p className="text-white/30 text-xs">Built by Wong Jung Yong, FTBSBA · SUSS Student</p>
          <p className="text-white/30 text-xs">&copy; {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
