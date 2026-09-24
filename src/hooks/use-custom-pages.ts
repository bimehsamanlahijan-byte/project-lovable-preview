import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listCustomPages } from "@/lib/custom-pages.functions";
import type { EditorPage } from "@/lib/editor-pages";

/**
 * Exposes custom (page-builder) pages as editor page entries, so they appear
 * in the Visual Editor and Inspector page dropdowns alongside built-in pages.
 */
export function useCustomPageEntries(): EditorPage[] {
  const fetchList = useServerFn(listCustomPages);
  const { data } = useQuery({
    queryKey: ["custom-pages-list"],
    queryFn: () => fetchList(),
    staleTime: 30_000,
  });
  return (data ?? []).map((p) => ({
    path: `/p/${p.slug}`,
    label: `صفحه‌ساز: ${p.title || p.slug}`,
  }));
}
