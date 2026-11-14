import { cn } from "@/lib/utils";

/*
 * Tables in the dashboards' `table-unified` style (globals.css): a plain
 * header row in muted text over a hairline, soft row rules and a hover tint.
 * The cell classes are exported for tables that lay out their own rows.
 */

export function TableWrap({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div data-slot="table-container" className={cn("minimal-scrollbar relative -mx-1 w-[calc(100%+0.5rem)] overflow-x-auto px-1", className)}>
      {children}
    </div>
  );
}

export const tableCls = "table-unified w-full text-left text-sm";
export const thCls = "text-left align-bottom";
export const tdCls = "text-foreground align-middle";

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
        {caption && <caption className="text-muted-foreground mb-2 caption-top text-left text-body">{caption}</caption>}
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
                  <th key={i} scope="row" className={cn(tdCls, "text-muted-foreground! font-medium whitespace-nowrap")}>
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
