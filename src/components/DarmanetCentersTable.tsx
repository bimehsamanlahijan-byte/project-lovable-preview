import { useEffect, useMemo, useState } from "react";
import { Search, Loader2 } from "lucide-react";

type CompactData = {
  headers: string[];
  filters: { key: string; options: string[] }[];
  dictCols: number[];
  dicts: Record<string, string[]>;
  rows: (string | number)[][];
  meta: { totalRows: number; sourcePages: number; failedPages: number; columns: number };
};

type Row = string[];

const PAGE_SIZE = 10;

// column indexes as extracted from darmanet.ir/table
const COL = {
  markazDarmani: 0,
  name: 1,
  ostan: 2,
  shahrestan: 3,
  phone: 4,
  address: 5,
  moarefiname: 6,
  bimePaye: 7,
  tozihat: 8,
};

const FILTER_LABELS: Record<string, string> = {
  markazDarmani: "نوع مرکز درمانی",
  ostan: "استان",
  moarefinameDarad: "معرفی‌نامه آنلاین",
  bimePayeTarafQrardad: "بیمه پایه طرف قرارداد",
};

const FILTER_COL: Record<string, number> = {
  markazDarmani: COL.markazDarmani,
  ostan: COL.ostan,
  moarefinameDarad: COL.moarefiname,
  bimePayeTarafQrardad: COL.bimePaye,
};

function normalize(value: string) {
  return value
    .replace(/[\u064A\u0649]/g, "ی")
    .replace(/\u0643/g, "ک")
    .replace(/\u200c/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function decode(data: CompactData): Row[] {
  return data.rows.map((row) =>
    row.map((cell, index) =>
      data.dictCols.includes(index) ? data.dicts[String(index)][cell as number] : (cell as string),
    ),
  );
}

export function DarmanetCentersTable({ ostan }: { ostan?: string }) {
  const [data, setData] = useState<CompactData | null>(null);
  const [rows, setRows] = useState<Row[] | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let alive = true;
    import("@/data/darmanet-centers.json").then((mod) => {
      if (!alive) return;
      const loaded = (mod.default ?? mod) as unknown as CompactData;
      setData(loaded);
      setRows(decode(loaded));
    });
    return () => {
      alive = false;
    };
  }, []);

  // keep the province chosen in the section above in sync with the table filter
  useEffect(() => {
    setFilters((prev) => ({ ...prev, ostan: ostan ?? "" }));
    setPage(1);
  }, [ostan]);

  useEffect(() => {
    const id = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 250);
    return () => clearTimeout(id);
  }, [searchInput]);

  const filtered = useMemo(() => {
    if (!rows) return [];
    const query = normalize(search);
    return rows.filter((row) => {
      for (const key of Object.keys(FILTER_COL)) {
        const value = filters[key];
        if (value && row[FILTER_COL[key]] !== value) return false;
      }
      if (!query) return true;
      return normalize(row.join(" ")).includes(query);
    });
  }, [rows, filters, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const pageRows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const pageNumbers = useMemo(() => {
    const list: number[] = [];
    const from = Math.max(1, current - 2);
    const to = Math.min(totalPages, from + 4);
    for (let i = from; i <= to; i++) list.push(i);
    return list;
  }, [current, totalPages]);

  if (!data || !rows) {
    return (
      <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" /> در حال بارگذاری مراکز درمانی…
      </div>
    );
  }

  return (
    <div dir="rtl" className="mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {data.filters.map((filter) => (
          <div key={filter.key}>
            <label
              htmlFor={`darmanet-${filter.key}`}
              className="block text-xs font-semibold mb-1 text-muted-foreground"
            >
              {FILTER_LABELS[filter.key] ?? filter.key}
            </label>
            <select
              id={`darmanet-${filter.key}`}
              value={filters[filter.key] ?? ""}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, [filter.key]: e.target.value }));
                setPage(1);
              }}
              className="w-full bg-card border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              {filter.options.map((option) => (
                <option key={option} value={option === "-- همه --" ? "" : option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            aria-label="جستجو در مراکز درمانی"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="جستجو بر اساس نام مرکز، شهر، تلفن یا آدرس…"
            className="w-full bg-card border border-border rounded-xl pr-9 pl-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="text-xs text-muted-foreground whitespace-nowrap">
          {filtered.length.toLocaleString("fa-IR")} مرکز — صفحه {current.toLocaleString("fa-IR")} از{" "}
          {totalPages.toLocaleString("fa-IR")}
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-right text-xs md:text-sm min-w-[900px]">
          <thead className="bg-muted/70">
            <tr>
              {data.headers.map((header) => (
                <th key={header} scope="col" className="px-3 py-3 font-bold whitespace-nowrap">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row, index) => (
              <tr key={`${current}-${index}`} className="border-t border-border align-top hover:bg-muted/40">
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={`px-3 py-3 ${cellIndex === COL.address ? "min-w-[260px]" : ""} ${
                      cellIndex === COL.phone ? "whitespace-nowrap" : ""
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={data.headers.length} className="px-3 py-10 text-center text-muted-foreground">
                  موردی با این فیلترها پیدا نشد.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <nav aria-label="صفحه‌بندی مراکز درمانی" className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setPage(1)}
          disabled={current === 1}
          className="px-3 py-2 text-xs rounded-lg border border-border bg-card disabled:opacity-40"
        >
          اول
        </button>
        <button
          type="button"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={current === 1}
          className="px-3 py-2 text-xs rounded-lg border border-border bg-card disabled:opacity-40"
        >
          قبلی
        </button>
        {pageNumbers.map((number) => (
          <button
            key={number}
            type="button"
            onClick={() => setPage(number)}
            aria-current={number === current ? "page" : undefined}
            className={`px-3 py-2 text-xs rounded-lg border transition ${
              number === current
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border hover:border-primary"
            }`}
          >
            {number.toLocaleString("fa-IR")}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={current === totalPages}
          className="px-3 py-2 text-xs rounded-lg border border-border bg-card disabled:opacity-40"
        >
          بعدی
        </button>
        <button
          type="button"
          onClick={() => setPage(totalPages)}
          disabled={current === totalPages}
          className="px-3 py-2 text-xs rounded-lg border border-border bg-card disabled:opacity-40"
        >
          آخر
        </button>
      </nav>

      <p className="mt-3 text-center text-[11px] text-muted-foreground">
        مجموع {data.meta.totalRows.toLocaleString("fa-IR")} مرکز درمانی در{" "}
        {data.meta.sourcePages.toLocaleString("fa-IR")} صفحه — برگرفته از darmanet.ir
      </p>
    </div>
  );
}
