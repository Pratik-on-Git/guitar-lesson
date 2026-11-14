import { cn } from "@/lib/utils";

/* Hairline tables in the design system: fog rules, slate headers, no fills. */

export function TableWrap({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("-mx-1 overflow-x-auto px-1", className)}>{children}</div>;
}

export const tableCls = "w-full border-collapse text-left text-caption";
export const thCls = "border-b border-border py-2.5 pr-4 align-bottom text-[13px] font-medium whitespace-nowrap text-muted-foreground";
export const tdCls = "border-b border-border/70 py-2.5 pr-4 align-top text-foreground";

export function SimpleTable({
  columns,
  rows,
  caption,
  firstColumnHeader,
  className,
}: {
  columns: string[];
  rows: React.ReactNode[][];
  caption?: string;
  firstColumnHeader?: boolean;
  className?: string;
}) {
  return (
    <TableWrap className={className}>
      <table className={tableCls}>
        {caption && <caption className="mb-2 text-left text-caption text-muted-foreground">{caption}</caption>}
        <thead>
          <tr>
            {columns.map((c, i) => (
              <th key={i} scope="col" className={thCls}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r}>
              {row.map((cell, i) =>
                i === 0 && firstColumnHeader ? (
                  <th key={i} scope="row" className={cn(tdCls, "font-medium text-muted-foreground")}>
                    {cell}
                  </th>
                ) : (
                  <td key={i} className={cn(tdCls, i === 0 && "font-medium")}>
                    {cell}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrap>
  );
}
