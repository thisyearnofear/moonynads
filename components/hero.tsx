interface HeroProps {
  data: {
    title: string
    subtitle: string
  }
}

export default function Hero({ data }: HeroProps) {
  return (
    <section className="container mx-auto px-4 py-12 md:py-18 relative">
      <div className="flex flex-col items-center justify-center gap-6 md:gap-8">
        {/* ASCII Art Header - Complex but clean */}
        <div className="font-mono leading-4 md:leading-5 text-center overflow-x-auto">
          <pre className="text-[6px] sm:text-[7px] md:text-[9px] lg:text-[11px] text-yellow-600 dark:text-yellow-500">
           {`
   ███╗   ███╗ ██████╗  ██████╗ ███╗   ██╗██╗   ██╗███╗   ██╗ █████╗ ██████╗ 
   ████╗ ████║██╔═══██╗██╔═══██╗████╗  ██║╚██╗ ██╔╝████╗  ██║██╔══██╗██╔══██╗
   ██╔████╔██║██║   ██║██║   ██║██╔██╗ ██║ ╚████╔╝ ██╔██╗ ██║███████║██║  ██║
   ██║╚██╔╝██║██║   ██║██║   ██║██║╚██╗██║  ╚██╔╝  ██║╚██╗██║██╔══██║██║  ██║
   ██║ ╚═╝ ██║╚██████╔╝╚██████╔╝██║ ╚████║   ██║   ██║ ╚████║██║  ██║██████╔╝
   ╚═╝     ╚═╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═══╝╚═╝  ╚═╝╚═════╝ 
`}
          </pre>
        </div>

        {/* Simple divider */}
        <div className="w-24 h-px bg-yellow-600/40 dark:bg-yellow-500/30"></div>

        {/* Subtitle */}
        <div className="text-center space-y-2">
          <div className="font-mono text-[10px] md:text-xs lg:text-sm text-yellow-700 dark:text-yellow-600 tracking-wider">
            {data.subtitle}
          </div>
          <h1 className="font-mono text-lg md:text-xl lg:text-2xl font-bold text-yellow-600 dark:text-yellow-500">
            {data.title}
          </h1>
        </div>
      </div>
    </section>
  )
}