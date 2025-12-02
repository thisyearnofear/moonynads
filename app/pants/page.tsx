import Link from "next/link";
import { PANTS } from "@/lib/pants";

export const metadata = {
  title: "M00NAD Labs",
  description: "Animation labs for all M00NAD pants",
};

export default function PantsList() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="text-5xl mb-2">🍑</div>
          <h1 className="font-mono text-4xl font-bold text-yellow-700 dark:text-yellow-500 mb-2">
            M00NAD ANIMATION LABS
          </h1>
          <p className="font-mono text-sm text-foreground/70">
            Select a pants design to explore and customize animations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PANTS.map((pant) => (
            <Link
              key={pant.id}
              href={`/pants/${pant.id}`}
              className="group border border-yellow-600/30 rounded p-6 hover:bg-yellow-600/10 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="font-mono font-bold text-lg text-yellow-700 dark:text-yellow-500 group-hover:text-yellow-600 dark:group-hover:text-yellow-400">
                    {pant.name}
                  </h2>
                  <p className="font-mono text-xs text-foreground/50 mt-1">
                    {pant.id}
                  </p>
                </div>
                <span className={`font-mono text-xs px-2 py-1 rounded border ${
                  pant.rarity === 'common' ? 'border-gray-400 text-gray-400' :
                  pant.rarity === 'uncommon' ? 'border-green-400 text-green-400' :
                  pant.rarity === 'rare' ? 'border-blue-400 text-blue-400' :
                  pant.rarity === 'epic' ? 'border-purple-400 text-purple-400' :
                  'border-yellow-400 text-yellow-400'
                }`}>
                  {pant.rarity}
                </span>
              </div>
              <p className="font-mono text-sm text-foreground/70 group-hover:text-foreground transition-colors">
                {pant.description}
              </p>
              <div className="mt-4 inline-block font-mono text-xs px-3 py-1.5 border border-yellow-600/50 rounded bg-yellow-600/5 group-hover:bg-yellow-600/15 text-yellow-700 dark:text-yellow-500 transition-colors">
                Open Lab →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
