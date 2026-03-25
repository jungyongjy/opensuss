import { ArrowRight, DoorOpen } from 'lucide-react'

export default function FeaturedCard() {
  return (
    <a
      href="https://suss.libcal.com/spaces"
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between rounded-xl bg-navy dark:bg-blue-900 text-white p-6 mb-8 hover:bg-navy/90 dark:hover:bg-blue-800 transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className="rounded-lg bg-white/10 p-3">
          <DoorOpen size={24} />
        </div>
        <div>
          <h3 className="font-bold text-lg leading-snug">Discussion Room Booking</h3>
          <p className="text-white/70 text-sm mt-0.5">
            Check live availability — 5 rooms, capacity 5 each
          </p>
        </div>
      </div>
      <ArrowRight
        size={20}
        className="shrink-0 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all"
      />
    </a>
  )
}
