'use client';

import clsx from "clsx";
import { SlideContent, SlideSection } from "@/data/slides";

function SectionRenderer({ section }: { section: SlideSection }) {
  switch (section.type) {
    case "bullets":
      return (
        <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-white/20 px-3 py-1 text-sm uppercase tracking-wide text-white">
              Core Ideas
            </span>
            <h3 className="text-xl font-semibold text-white">{section.title}</h3>
          </div>
          <ul className="mt-4 space-y-3 text-base text-sky-100">
            {section.items.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-1 inline-flex h-2.5 w-2.5 flex-none rounded-full bg-cyan-300" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    case "dualColumn":
      return (
        <div className="rounded-3xl bg-gradient-to-br from-white/15 to-white/5 p-6 shadow-lg shadow-black/30 backdrop-blur">
          <h3 className="text-xl font-semibold text-white">{section.title}</h3>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {section.columns.map((column) => (
              <div
                key={column.heading}
                className="rounded-2xl border border-white/15 bg-white/5 p-4"
              >
                <h4 className="text-lg font-semibold text-cyan-100">{column.heading}</h4>
                <ul className="mt-3 space-y-3 text-sm text-sky-100/90">
                  {column.points.map((point) => (
                    <li key={point} className="flex gap-2">
                      <span className="mt-1 inline-flex h-2 w-2 flex-none rounded-full bg-cyan-200" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      );
    case "timeline":
      return (
        <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">
          <h3 className="text-xl font-semibold text-white">{section.title}</h3>
          <ol className="mt-6 space-y-6">
            {section.steps.map((step, index) => (
              <li key={step.label} className="relative pl-12">
                <span className="absolute left-0 top-1 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-lg font-semibold text-slate-900 shadow-lg shadow-cyan-500/40">
                  {index + 1}
                </span>
                <div className="rounded-2xl border border-cyan-300/30 bg-cyan-900/20 p-4 text-sky-100">
                  <p className="font-semibold text-cyan-100">{step.label}</p>
                  <p className="mt-1 text-sm text-cyan-100/80">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      );
    case "statBlock":
      return (
        <div className="grid gap-4 md:grid-cols-3">
          {section.stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl bg-white/95 p-5 text-slate-900 shadow-xl shadow-cyan-500/20"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-cyan-600">
                {stat.label}
              </p>
              <p className="mt-3 text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="mt-2 text-sm text-slate-600">{stat.description}</p>
            </div>
          ))}
        </div>
      );
    case "imageCallout":
      return (
        <div className="grid items-center gap-6 rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur md:grid-cols-[1.2fr_1fr]">
          <div>
            <h3 className="text-xl font-semibold text-white">{section.title}</h3>
            <p className="mt-2 text-sm uppercase tracking-wide text-cyan-200">
              {section.caption}
            </p>
            <p className="mt-4 text-base text-sky-100">{section.description}</p>
          </div>
          <div className="relative h-48 overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500/70 via-amber-400/60 to-sky-500/70 shadow-lg shadow-rose-500/40">
            <div className="absolute inset-0 grid place-items-center">
              <div className="flex h-32 w-32 rotate-6 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                <div className="-rotate-6 text-center text-sm font-semibold uppercase tracking-widest text-white">
                  Acid-Fast
                  <br />
                  Bacilli
                </div>
              </div>
            </div>
            <div className="absolute inset-0 opacity-40">
              <div className="absolute -left-6 top-6 h-32 w-32 rounded-full bg-rose-500/60 blur-3xl" />
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-amber-400/60 blur-3xl" />
              <div className="absolute bottom-0 left-10 h-36 w-36 rounded-full bg-sky-500/50 blur-3xl" />
            </div>
          </div>
        </div>
      );
    case "comparison":
      return (
        <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur">
          <h3 className="text-xl font-semibold text-white">{section.title}</h3>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {[section.left, section.right].map((side) => (
              <div
                key={side.heading}
                className="rounded-2xl border border-white/15 bg-white/5 p-5 text-sky-100"
              >
                <h4 className="text-lg font-semibold text-cyan-100">{side.heading}</h4>
                <ul className="mt-3 space-y-2 text-sm">
                  {side.points.map((point) => (
                    <li key={point} className="flex gap-2">
                      <span className="mt-1 inline-flex h-2 w-2 flex-none rounded-full bg-cyan-200" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      );
    case "checklist":
      return (
        <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
          <h3 className="text-xl font-semibold text-white">{section.title}</h3>
          <ul className="mt-4 space-y-4 text-sm text-sky-100">
            {section.checklist.map((entry) => (
              <li key={entry.item} className="flex gap-3">
                <span className="mt-1 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 text-xs font-semibold text-slate-900 shadow-lg shadow-emerald-500/40">
                  ✓
                </span>
                <div>
                  <p className="font-semibold text-cyan-100">{entry.item}</p>
                  <p className="text-sky-100/80">{entry.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      );
    case "quote":
      return (
        <div className="rounded-3xl border border-white/10 bg-white/15 p-6 text-slate-900 shadow-xl shadow-cyan-500/20">
          <p className="text-lg italic leading-relaxed">&ldquo;{section.text}&rdquo;</p>
          <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-cyan-600">
            {section.source}
          </p>
        </div>
      );
    default:
      return null;
  }
}

export function SlideCard({ slide, index }: { slide: SlideContent; index: number }) {
  return (
    <article
      className={clsx(
        "relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br p-10 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)] transition-transform duration-500",
        slide.background,
      )}
    >
      <div className="absolute inset-0 opacity-70">
        <div className="absolute -left-10 top-10 h-48 w-48 rounded-full bg-gradient-to-br from-white/10 to-transparent blur-3xl" />
        <div className="absolute right-0 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-gradient-to-tr from-cyan-400/30 to-transparent blur-3xl" />
      </div>
      <div className="relative flex flex-col gap-8">
        <header className="flex flex-wrap items-baseline gap-4">
          <span
            className={clsx(
              "rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em]",
              `bg-gradient-to-r ${slide.accent} text-slate-950`,
            )}
          >
            Slide {index + 1}
          </span>
          {slide.subtitle && (
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-100">
              {slide.subtitle}
            </p>
          )}
        </header>
        <h2 className="text-4xl font-semibold text-white drop-shadow-xl">{slide.title}</h2>
        <div className="grid gap-6">
          {slide.sections.map((section, sectionIndex) => (
            <SectionRenderer key={`${slide.id}-${section.type}-${sectionIndex}`} section={section} />
          ))}
        </div>
      </div>
    </article>
  );
}

