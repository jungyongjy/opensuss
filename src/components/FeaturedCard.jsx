import { ArrowRight, DoorOpen } from 'lucide-react'

export default function FeaturedCard() {
  return (
    <div className="rounded-xl bg-navy dark:bg-blue-950 text-white p-6 mb-8 border border-navy/20 dark:border-blue-800">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="rounded-lg bg-white/10 p-3 shrink-0">
            <DoorOpen size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-lg leading-snug">Discussion Room Booking</h3>
              <span className="inline-flex items-center gap-1 bg-green-500/20 text-green-300 text-xs font-medium px-2 py-0.5 rounded-full border border-green-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                Available
              </span>
            </div>
            <p className="text-white/70 text-sm">
              5 rooms available, capacity 5 each. Check live availability before booking.
            </p>
          </div>
        </div>
        <a
          href="https://suss.libcal.com/spaces"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 bg-white text-navy text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-100 transition-colors shrink-0 self-start sm:self-auto"
        >
          Check Availability
          <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>
    </div>
  )
}
