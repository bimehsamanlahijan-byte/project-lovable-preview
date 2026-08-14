import { CheckCircle2 } from "lucide-react";

import { insuranceLongform } from "./insurance-longform";

/** رندر محتوای تکمیلی (بادی) صفحات بیمه بر اساس مسیر صفحه */
export function LongformSections({ path }: { path: string }) {
  const blocks = insuranceLongform[path];
  if (!blocks || blocks.length === 0) return null;

  return (
    <section className="container mx-auto px-4 pb-14">
      <article className="bg-card border border-border rounded-3xl shadow-soft p-6 md:p-10 space-y-5">
        {blocks.map((block, i) => {
          switch (block.type) {
            case "h2":
              return (
                <h2 key={i} className="text-xl md:text-2xl font-extrabold flex items-center gap-2 pt-2">
                  <span className="w-2 h-6 bg-gradient-to-b from-primary to-primary-glow rounded-full" />
                  {block.text}
                </h2>
              );
            case "h3":
              return (
                <h3 key={i} className="text-base md:text-lg font-bold text-primary pt-1">
                  {block.text}
                </h3>
              );
            case "p":
              return (
                <p key={i} className="text-sm md:text-base leading-8 text-muted-foreground text-justify">
                  {block.text}
                </p>
              );
            case "list":
              return (
                <ul key={i} className="space-y-2">
                  {block.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm md:text-base leading-7">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-1.5 flex-shrink-0" />
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
                      className="bg-primary/10 text-foreground border border-primary/20 rounded-full px-4 py-2 text-xs md:text-sm font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              );
            case "faq":
              return (
                <div key={i} className="space-y-3 pt-2">
                  <h3 className="text-lg font-extrabold">سؤالات متداول</h3>
                  {block.items.map((f, j) => (
                    <div key={j} className="border border-border rounded-2xl p-5 bg-background/60">
                      <h4 className="font-bold text-sm mb-2">{f.q}</h4>
                      <p className="text-sm text-muted-foreground leading-7 text-justify">{f.a}</p>
                    </div>
                  ))}
                </div>
              );
            default:
              return null;
          }
        })}
      </article>
    </section>
  );
}
