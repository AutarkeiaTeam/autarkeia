const stats = [
  { value: "2.1B", label: "people want more independence from broken systems" },
  { value: "94%", label: "of households grow none of their own food" },
  { value: "€400B", label: "self-sufficiency & preparedness market by 2030" },
]

export function StatsBar() {
  return (
    <section className="bg-[#0d1b2a] py-12">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-3xl sm:text-4xl font-light text-[#009b70]">{stat.value}</p>
              <p className="mt-2 text-sm font-light text-white/80">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
