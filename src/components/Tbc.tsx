import type { ReactNode } from "react";

export default function Tbc({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="tbc">
      <p className="tbc-label">TBC &mdash; {title}</p>
      <div>{children}</div>
    </div>
  );
}
