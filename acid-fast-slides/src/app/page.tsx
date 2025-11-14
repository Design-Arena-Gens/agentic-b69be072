import { PresentationBuilder } from "@/components/PresentationBuilder";

export default function Home() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,116,144,0.25),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(168,85,247,0.18),_transparent_45%)] bg-slate-950 text-white">
      <div className="relative mx-auto min-h-screen w-full px-6 pb-20 sm:px-10 lg:px-20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />
          <div className="absolute bottom-10 left-1/4 h-64 w-64 rounded-full bg-emerald-400/10 blur-[120px]" />
        </div>
        <main className="relative">
          <PresentationBuilder />
        </main>
      </div>
    </div>
  );
}
