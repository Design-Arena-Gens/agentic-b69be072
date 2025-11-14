'use client';

import { useState } from "react";
import clsx from "clsx";
import type PptxGenJS from "pptxgenjs";
import { slides } from "@/data/slides";
import { SlideCard } from "@/components/SlideCard";

const accentHexMap: Record<string, string> = {
  "from-cyan-400 via-sky-500 to-purple-500": "6A5EF5",
  "from-pink-500 via-rose-500 to-rose-600": "EC4899",
  "from-emerald-400 via-teal-400 to-cyan-500": "34D399",
  "from-indigo-400 via-sky-500 to-sky-500": "6366F1",
  "from-orange-400 via-amber-400 to-amber-500": "F97316",
  "from-purple-400 via-fuchsia-500 to-fuchsia-500": "A855F7",
  "from-rose-500 via-pink-500 to-red-500": "F43F5E",
  "from-sky-400 via-sky-500 to-indigo-500": "38BDF8",
};

const backgroundHex = "0B1120";

const heroShapes = [
  { x: 8.4, y: 0.2, w: 1.1, h: 1.1, fill: "22D3EE", rotate: 12 },
  { x: 8.9, y: 0.9, w: 0.6, h: 0.6, fill: "A855F7", rotate: -24 },
  { x: 7.6, y: 0.3, w: 0.7, h: 0.7, fill: "F472B6", rotate: 35 },
];

export function PresentationBuilder() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const pptxModule = (await import("pptxgenjs")) as typeof import("pptxgenjs");
      const pptx = new pptxModule.default();
      const shapeType = pptx.ShapeType;
      pptx.layout = "LAYOUT_16x9";

      slides.forEach((slideData, slideIndex) => {
        const slide = pptx.addSlide();
        slide.background = { fill: backgroundHex };

        const accentColor = accentHexMap[slideData.accent] ?? "22D3EE";

        slide.addShape(shapeType.rect, {
          x: 0,
          y: 0,
          w: 10,
          h: 1.2,
          fill: { color: accentColor },
          line: { color: accentColor },
        });

        heroShapes.forEach((config) => {
          slide.addShape(shapeType.ellipse, {
            ...config,
            fill: { color: config.fill },
            line: { color: config.fill },
            rotate: config.rotate,
          });
        });

        slide.addText(`Slide ${slideIndex + 1}`, {
          x: 0.6,
          y: 0.25,
          color: "0B1120",
          fontSize: 16,
          bold: true,
          fontFace: "Calibri",
        });

        slide.addText(slideData.title, {
          x: 0.6,
          y: 1.0,
          color: "FFFFFF",
          fontSize: 32,
          bold: true,
          fontFace: "Calibri",
        });

        if (slideData.subtitle) {
          slide.addText(slideData.subtitle, {
            x: 0.6,
            y: 1.55,
            color: "BFDBFE",
            fontSize: 14,
            fontFace: "Calibri",
            italic: true,
          });
        }

        let currentY = slideData.subtitle ? 2.0 : 1.8;
        const marginX = 0.6;
        const contentWidth = 10 - marginX * 2;

        slideData.sections.forEach((section) => {
          const containerHeight = calculateSectionHeight(section);
          const boxY = currentY;

          slide.addShape(shapeType.roundRect, {
            x: marginX,
            y: boxY,
            w: contentWidth,
            h: containerHeight,
            fill: { color: "152033" },
            line: { color: "1F2937" },
            rectRadius: 0.3,
          });

          renderSectionContent(
            slide,
            section,
            {
              x: marginX + 0.3,
              y: boxY + 0.3,
              w: contentWidth - 0.6,
              h: containerHeight - 0.6,
              accentColor,
            },
            shapeType,
          );

          currentY += containerHeight + 0.3;
        });
      });

      await pptx.writeFile({
        fileName: "Acid-Fast-Staining-Showcase.pptx",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section className="relative mx-auto flex w-full max-w-6xl flex-col gap-16 pb-20 pt-24">
      <header className="text-center text-white">
        <p className="text-sm uppercase tracking-[0.4em] text-cyan-200">
          Microbiology Showcase
        </p>
        <h1 className="mt-4 text-5xl font-semibold">
          Acid-Fast Staining Masterclass Deck
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-sky-100/80">
          Explore a designer-crafted slide collection covering principles, reagents, workflow,
          troubleshooting, and clinical insight into the Ziehl-Neelsen acid-fast staining method.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button
            type="button"
            onClick={handleDownload}
            className={clsx(
              "rounded-full px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] transition-all duration-300",
              "bg-gradient-to-r from-cyan-400 via-sky-500 to-purple-500 text-slate-950 shadow-[0_20px_45px_-20px_rgba(56,189,248,0.9)] hover:scale-[1.02]",
            )}
            disabled={isDownloading}
          >
            {isDownloading ? "Preparing Deck…" : "Download PPTX"}
          </button>
          <a
            href="#slide-preview"
            className="rounded-full border border-white/20 px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-sky-100 transition-colors hover:border-white/40"
          >
            Preview Slides
          </a>
        </div>
      </header>

      <div
        id="slide-preview"
        className="grid gap-12 md:grid-cols-2"
      >
        {slides.map((slide, index) => (
          <SlideCard key={slide.id} slide={slide} index={index} />
        ))}
      </div>
    </section>
  );
}

function calculateSectionHeight(section: (typeof slides)[number]["sections"][number]): number {
  switch (section.type) {
    case "bullets":
      return Math.max(1.8, 1.1 + section.items.length * 0.45);
    case "dualColumn": {
      const maxPoints = Math.max(...section.columns.map((col) => col.points.length));
      return Math.max(2.4, 1.4 + maxPoints * 0.4);
    }
    case "timeline":
      return Math.max(2.8, 1.3 + section.steps.length * 0.5);
    case "statBlock":
      return 2.4;
    case "imageCallout":
      return 2.4;
    case "comparison":
      return Math.max(2.2, 1.3 + Math.max(section.left.points.length, section.right.points.length) * 0.4);
    case "checklist":
      return Math.max(2.2, 1.1 + section.checklist.length * 0.5);
    case "quote":
      return 1.6;
    default:
      return 2;
  }
}

type BoxDimensions = {
  x: number;
  y: number;
  w: number;
  h: number;
  accentColor: string;
};

function renderSectionContent(
  slide: PptxGenJS.Slide,
  section: (typeof slides)[number]["sections"][number],
  box: BoxDimensions,
  shapeType: PptxGenJS["ShapeType"],
) {
  const headingStyle = {
    color: "E0F2FE",
    fontSize: 16,
    bold: true,
    fontFace: "Calibri",
  } satisfies PptxGenJS.TextPropsOptions;

  const bodyStyle = {
    color: "93C5FD",
    fontSize: 13,
    fontFace: "Calibri",
  } satisfies PptxGenJS.TextPropsOptions;

  switch (section.type) {
    case "bullets": {
      slide.addText(section.title, {
        ...headingStyle,
        x: box.x,
        y: box.y,
        w: box.w,
      });
      const bulletText = section.items.map((item) => `• ${item}`).join("\n");
      slide.addText(bulletText, {
        ...bodyStyle,
        x: box.x,
        y: box.y + 0.5,
        w: box.w,
        h: box.h - 0.7,
        lineSpacingMultiple: 1.2,
      });
      break;
    }
    case "dualColumn": {
      slide.addText(section.title, {
        ...headingStyle,
        x: box.x,
        y: box.y,
        w: box.w,
      });
      const columnWidth = (box.w - 0.5) / 2;
      section.columns.forEach((col, idx) => {
        const columnX = box.x + idx * (columnWidth + 0.5);
        slide.addShape(shapeType.roundRect, {
          x: columnX,
          y: box.y + 0.6,
          w: columnWidth,
          h: box.h - 1.0,
          fill: { color: "111827" },
          line: { color: "1F2937" },
          rectRadius: 0.2,
        });
        slide.addText(col.heading, {
          ...headingStyle,
          x: columnX + 0.2,
          y: box.y + 0.8,
          w: columnWidth - 0.4,
          color: "7DD3FC",
        });
        slide.addText(col.points.map((point) => `• ${point}`).join("\n"), {
          ...bodyStyle,
          x: columnX + 0.2,
          y: box.y + 1.2,
          w: columnWidth - 0.4,
          h: box.h - 1.6,
          lineSpacingMultiple: 1.1,
        });
      });
      break;
    }
    case "timeline": {
      slide.addText(section.title, {
        ...headingStyle,
        x: box.x,
        y: box.y,
        w: box.w,
      });
      const stepHeight = (box.h - 0.8) / section.steps.length;
      section.steps.forEach((step, idx) => {
        const stepY = box.y + 0.5 + idx * stepHeight;
        slide.addShape(shapeType.ellipse, {
          x: box.x,
          y: stepY,
          w: 0.45,
          h: 0.45,
          fill: { color: box.accentColor },
          line: { color: box.accentColor },
        });
        slide.addText(String(idx + 1).padStart(2, "0"), {
          x: box.x,
          y: stepY + 0.1,
          w: 0.45,
          align: "center",
          color: "0B1120",
          fontSize: 12,
          bold: true,
        });
        slide.addText(step.label, {
          ...headingStyle,
          x: box.x + 0.6,
          y: stepY,
          w: box.w - 0.7,
        });
        slide.addText(step.detail, {
          ...bodyStyle,
          x: box.x + 0.6,
          y: stepY + 0.3,
          w: box.w - 0.7,
          fontSize: 11,
          color: "BFDBFE",
        });
      });
      break;
    }
    case "statBlock": {
      const cardWidth = (box.w - 0.6) / section.stats.length;
      section.stats.forEach((stat, idx) => {
        const statX = box.x + idx * (cardWidth + 0.3);
        slide.addShape(shapeType.roundRect, {
          x: statX,
          y: box.y,
          w: cardWidth,
          h: box.h,
          fill: { color: "F8FAFC" },
          line: { color: "CBD5F5" },
          rectRadius: 0.25,
        });
        slide.addText(stat.label, {
          x: statX + 0.2,
          y: box.y + 0.3,
          w: cardWidth - 0.4,
          color: "0F172A",
          fontSize: 11,
          bold: true,
          fontFace: "Calibri",
        });
        slide.addText(stat.value, {
          x: statX + 0.2,
          y: box.y + 0.9,
          w: cardWidth - 0.4,
          color: "0F172A",
          fontSize: 18,
          bold: true,
          fontFace: "Calibri",
        });
        slide.addText(stat.description, {
          x: statX + 0.2,
          y: box.y + 1.4,
          w: cardWidth - 0.4,
          color: "1E293B",
          fontSize: 11,
          fontFace: "Calibri",
        });
      });
      break;
    }
    case "imageCallout": {
      const leftWidth = box.w * 0.58;
      const rightWidth = box.w - leftWidth - 0.4;
      slide.addText(section.title, {
        ...headingStyle,
        x: box.x,
        y: box.y,
        w: leftWidth,
      });
      slide.addText(section.caption, {
        x: box.x,
        y: box.y + 0.5,
        w: leftWidth,
        color: box.accentColor,
        fontSize: 12,
        fontFace: "Calibri",
        bold: true,
        italic: true,
      });
      slide.addText(section.description, {
        ...bodyStyle,
        x: box.x,
        y: box.y + 0.9,
        w: leftWidth,
        h: box.h - 1.1,
        lineSpacingMultiple: 1.2,
      });
      slide.addShape(shapeType.ellipse, {
        x: box.x + leftWidth + 0.4,
        y: box.y,
        w: rightWidth,
        h: rightWidth,
        fill: { color: box.accentColor },
        line: { color: box.accentColor },
      });
      slide.addShape(shapeType.rect, {
        x: box.x + leftWidth + 0.6,
        y: box.y + 0.4,
        w: rightWidth - 0.4,
        h: box.h - 0.8,
        fill: { color: "1E293B" },
        line: { color: "1E293B" },
      });
      slide.addText("Stylized\nAFB", {
        x: box.x + leftWidth + 0.6,
        y: box.y + 0.9,
        w: rightWidth - 0.4,
        h: 1.4,
        align: "center",
        fontSize: 18,
        bold: true,
        color: "F8FAFC",
      });
      slide.addText("Hot pink bacilli\nCool blue background", {
        x: box.x + leftWidth + 0.6,
        y: box.y + 2.1,
        w: rightWidth - 0.4,
        fontSize: 11,
        color: "E0F2FE",
        align: "center",
      });
      break;
    }
    case "comparison": {
      slide.addText(section.title, {
        ...headingStyle,
        x: box.x,
        y: box.y,
        w: box.w,
      });
      const columnWidth = (box.w - 0.5) / 2;
      const columns = [section.left, section.right];
      columns.forEach((column, idx) => {
        const columnX = box.x + idx * (columnWidth + 0.5);
      slide.addShape(shapeType.roundRect, {
        x: columnX,
        y: box.y + 0.6,
        w: columnWidth,
          h: box.h - 0.8,
          fill: { color: idx % 2 === 0 ? "1E293B" : "111827" },
          line: { color: "1F2937" },
          rectRadius: 0.2,
        });
        slide.addText(column.heading, {
          ...headingStyle,
          x: columnX + 0.2,
          y: box.y + 0.8,
          w: columnWidth - 0.4,
        });
        slide.addText(column.points.map((point) => `• ${point}`).join("\n"), {
          ...bodyStyle,
          x: columnX + 0.2,
          y: box.y + 1.2,
          w: columnWidth - 0.4,
          h: box.h - 1.6,
          lineSpacingMultiple: 1.1,
        });
      });
      break;
    }
    case "checklist": {
      slide.addText(section.title, {
        ...headingStyle,
        x: box.x,
        y: box.y,
        w: box.w,
      });
      const entryHeight = (box.h - 0.7) / section.checklist.length;
      section.checklist.forEach((entry, idx) => {
        const entryY = box.y + 0.5 + idx * entryHeight;
        slide.addShape(shapeType.roundRect, {
          x: box.x,
          y: entryY,
          w: 0.6,
          h: 0.6,
          fill: { color: box.accentColor },
          line: { color: box.accentColor },
          rectRadius: 0.2,
        });
        slide.addText("✓", {
          x: box.x,
          y: entryY + 0.1,
          w: 0.6,
          align: "center",
          color: "0B1120",
          fontSize: 20,
          bold: true,
        });
        slide.addText(entry.item, {
          ...headingStyle,
          x: box.x + 0.8,
          y: entryY,
          w: box.w - 1.0,
        });
        slide.addText(entry.detail, {
          ...bodyStyle,
          x: box.x + 0.8,
          y: entryY + 0.3,
          w: box.w - 1.0,
          fontSize: 11,
          color: "BFDBFE",
        });
      });
      break;
    }
    case "quote": {
      slide.addShape(shapeType.roundRect, {
        x: box.x,
        y: box.y,
        w: box.w,
        h: box.h,
        fill: { color: "F8FAFC" },
        line: { color: "CBD5F5" },
        rectRadius: 0.3,
      });
      slide.addText(`“${section.text}”`, {
        x: box.x + 0.4,
        y: box.y + 0.3,
        w: box.w - 0.8,
        h: box.h - 1.1,
        fontSize: 18,
        fontFace: "Calibri",
        color: "0F172A",
        italic: true,
      });
      slide.addText(section.source, {
        x: box.x + 0.4,
        y: box.y + box.h - 0.9,
        w: box.w - 0.8,
        fontSize: 12,
        fontFace: "Calibri",
        color: "2563EB",
        bold: true,
      });
      break;
    }
  }
}
