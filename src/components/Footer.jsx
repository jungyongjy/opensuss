export default function Footer() {
  return (
    <footer className="bg-navy dark:bg-gray-900 text-white/60 text-sm text-center py-6 px-4 mt-12 space-y-1">
      <p>One less thing to hunt for. Built by a SUSS student. This is an unofficial student project and is not affiliated with SUSS.</p>
      <p className="text-white/40 text-xs">&copy; {new Date().getFullYear()} Wong Jung Yong, FTBSBA. All rights reserved.</p>
    </footer>
  )
}
