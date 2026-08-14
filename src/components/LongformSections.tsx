import { ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";

import { insuranceLongform, type Block } from "./insurance-longform";
import { hubLongform } from "./insurance-hubs";
import { pageImage } from "./page-media";

const allLongform: Record<string, Block[]> = { ...insuranceLongform, ...hubLongform };

export function hasLongform(path: string) {
  return Boolean(allLongform[path]?.length);
}

/** رندر محتوای تکمیلی (بادی) صفحات با طراحی تصویری و رنگی */
export function LongformSections({ path }: { path: string }) {
  const blocks = allLongform[path];
  if (!blocks || blocks.length === 0) return null;
  const image = pageImage(path);

  return (
    <div className="relative">
      {/* نوار تصویری تمام‌عرض */}
      <section className="relative overflow-hidden">
        <img
          src={image}
          alt=""
          width={1280}
          height={720}
          loading="lazy"
          className="w-full h-[220px] md:h-[340px] object-cover"
        />
        <div className="absolute inset-0 gradient-hero opacity-80 mix-blend-multiply" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-8 md:pb-12">
            <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur text-primary-foreground border border-white/25 rounded-full px-4 py-1.5 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" /> راهنمای کامل و تخصصی
            </span>
          </div>
        </div>
      </section>

      <section className="relative container mx-auto px-4 py-12 md:py-16">
        <div className="space-y-8 md:space-y-10">
          {blocks.map((block, i) => renderBlock(block, i))}
        </div>
      </section>
    </div>
  );
}

function renderBlock(block: Block, i: number) {
  switch (block.type) {
    case "h2":
      return (
        <h2 key={i} className="text-2xl md:text-3xl font-extrabold flex items-center gap-3">
          <span className="w-2.5 h-8 rounded-full gradient-primary" />
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3 key={i} className="text-lg md:text-xl font-extrabold text-primary">
          {block.text}
        </h3>
      );
    case "p":
      return (
        <p key={i} className="text-sm md:text-base leading-8 text-muted-foreground text-justify max-w-4xl">
          {block.text}
        </p>
      );
    case "list":
      return (
        <ul key={i} className="grid sm:grid-cols-2 gap-3">
          {block.items.map((item, j) => (
            <li
              key={j}
              className="flex items-start gap-2.5 bg-card border border-border rounded-2xl p-4 text-sm leading-7 shadow-soft hover:shadow-glow transition"
            >
              <CheckCircle2 className="w-4.5 h-4.5 text-primary mt-1 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "chips":
      return (
        <div key={i} className="flex flex-wrap gap-2">
          {block.items.map((item, j) => (
            <span
              key={j}
              className="bg-primary/10 text-foreground border border-primary/25 rounded-full px-4 py-2 text-xs md:text-sm font-semibold"
            >
              {item}
            </span>
          ))}
        </div>
      );
    case "stats":
      return (
        <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {block.items.map((s, j) => (
            <div
              key={j}
              className="rounded-3xl p-6 text-center gradient-primary text-primary-foreground shadow-soft"
            >
              <div className="text-2xl md:text-3xl font-extrabold mb-1">{s.value}</div>
              <div className="text-xs md:text-sm opacity-90 leading-6">{s.label}</div>
            </div>
          ))}
        </div>
      );
    case "cards":
      return (
        <div key={i} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {block.items.map((c, j) => (
            <div
              key={j}
              className="group bg-card border border-border rounded-3xl p-6 shadow-soft hover:shadow-glow hover:-translate-y-1 transition"
            >
              <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center mb-4 text-primary-foreground font-extrabold">
                {j + 1}
              </div>
              <h3 className="font-extrabold text-sm md:text-base mb-2">{c.title}</h3>
              <p className="text-xs md:text-sm text-muted-foreground leading-7">{c.text}</p>
            </div>
          ))}
        </div>
      );
    case "steps":
      return (
        <div key={i} className="grid sm:grid-cols-3 gap-4">
          {block.items.map((s, j) => (
            <div key={j} className="relative bg-primary-soft border border-primary/20 rounded-3xl p-6">
              <h3 className="font-extrabold text-sm mb-2 text-primary">{s.title}</h3>
              <p className="text-xs md:text-sm text-muted-foreground leading-7">{s.text}</p>
            </div>
          ))}
        </div>
      );
    case "highlight":
      return (
        <div
          key={i}
          className="rounded-3xl border-r-4 border-primary bg-primary-soft p-6 md:p-8 shadow-soft"
        >
          <h3 className="font-extrabold mb-2 text-base md:text-lg">{block.title}</h3>
          <p className="text-sm md:text-base text-muted-foreground leading-8 text-justify">{block.text}</p>
        </div>
      );
    case "links":
      return (
        <div key={i} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {block.items.map((l, j) => (
            <a
              key={j}
              href={l.href}
              className="flex items-center justify-between gap-2 bg-card border border-border rounded-2xl px-5 py-4 text-sm font-bold shadow-soft hover:border-primary hover:text-primary hover:shadow-glow transition"
            >
              <span>{l.label}</span>
              <ArrowLeft className="w-4 h-4" />
            </a>
          ))}
        </div>
      );
    case "faq":
      return (
        <div key={i} className="space-y-3">
          <h2 className="text-2xl md:text-3xl font-extrabold flex items-center gap-3">
            <span className="w-2.5 h-8 rounded-full gradient-primary" />
            سؤالات متداول
          </h2>
          {block.items.map((f, j) => (
            <details
              key={j}
              className="group bg-card border border-border rounded-2xl p-5 shadow-soft open:border-primary/40"
            >
              <summary className="font-extrabold text-sm cursor-pointer list-none flex items-center justify-between gap-3">
                <span>{f.q}</span>
                <span className="text-primary text-lg leading-none group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-sm text-muted-foreground leading-8 text-justify mt-3">{f.a}</p>
            </details>
          ))}
        </div>
      );
    default:
      return null;
  }
}
