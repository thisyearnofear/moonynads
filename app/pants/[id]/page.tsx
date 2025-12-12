import { ASCIIAnimator } from "@/components/ascii/ascii-animator";
import { PANTS_IDS } from "@/lib/pants";

type PantId = (typeof PANTS_IDS)[number];
function isPantId(x: string): x is PantId {
  return (PANTS_IDS as readonly string[]).includes(x);
}

export default async function PantsLab({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const p = await params;
  const id: PantId = isPantId(p.id) ? p.id : "moon";
  const src = `/pants/${id}.txt`;
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-2">🍑</div>
          <h1 className="font-mono text-2xl font-bold text-yellow-700 dark:text-yellow-500">
            M00NAD ANIMATION LAB
          </h1>
          <p className="font-mono text-sm text-foreground/70">
            Animating: {id}
          </p>
        </div>
        <ASCIIAnimator src={src} pantId={id} />
      </div>
    </main>
  );
}
