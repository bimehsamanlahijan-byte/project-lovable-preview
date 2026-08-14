import fire from "@/assets/cat-fire.jpg";
import car from "@/assets/cat-car.jpg";
import cargo from "@/assets/cat-cargo.jpg";
import health from "@/assets/cat-health.jpg";
import life from "@/assets/cat-life.jpg";
import liability from "@/assets/cat-liability.jpg";
import engineering from "@/assets/cat-engineering.jpg";
import electronics from "@/assets/cat-electronics.jpg";
import marine from "@/assets/cat-marine.jpg";
import travel from "@/assets/cat-travel.jpg";
import eservices from "@/assets/cat-eservices.jpg";

/** تصویر شاخص هر گروه از صفحات بر اساس ابتدای مسیر */
const MAP: { prefix: string; image: string }[] = [
  { prefix: "/insurance/fire", image: fire },
  { prefix: "/insurance/car", image: car },
  { prefix: "/insurance/cargo", image: cargo },
  { prefix: "/insurance/health", image: health },
  { prefix: "/insurance/life", image: life },
  { prefix: "/insurance/liability", image: liability },
  { prefix: "/insurance/engineering", image: engineering },
  { prefix: "/insurance/e-e", image: electronics },
  { prefix: "/insurance/marine-aviation", image: marine },
  { prefix: "/insurance/travel", image: travel },
  { prefix: "/insurance/special", image: engineering },
  { prefix: "/e-services", image: eservices },
];

export function pageImage(path: string): string {
  const hit = MAP.filter((m) => path.startsWith(m.prefix)).sort((a, b) => b.prefix.length - a.prefix.length)[0];
  return hit?.image ?? eservices;
}
