import { useEffect, useRef, useState } from "react";
import type { Data, Layout } from "plotly.js";

interface Props {
  data: Data[];
  layout?: Partial<Layout>;
  caption?: string;
}

const baseLayout: Partial<Layout> = {
  autosize: true,
  margin: { t: 24, r: 24, b: 40, l: 48 },
  paper_bgcolor: "transparent",
  plot_bgcolor: "transparent",
  font: { family: "Inter, ui-sans-serif, system-ui", color: "#2a211a", size: 13 },
  xaxis: { gridcolor: "#e4d5be", zerolinecolor: "#e4d5be" },
  yaxis: { gridcolor: "#e4d5be", zerolinecolor: "#e4d5be" },
};

// plotly.js references browser globals (`self`, `window`) at import time, so it
// can only be loaded client-side — dynamically imported here rather than at
// module scope, which would otherwise crash the Astro/MDX server-side build.
export default function PlotlyChart({ data, layout, caption }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const plotlyRef = useRef<typeof import("plotly.js-dist-min").default | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let disposed = false;

    import("plotly.js-dist-min").then(({ default: Plotly }) => {
      if (disposed || !containerRef.current) return;
      plotlyRef.current = Plotly;
      Plotly.newPlot(
        containerRef.current,
        data,
        { ...baseLayout, ...layout },
        { displaylogo: false, responsive: true }
      ).then(() => !disposed && setReady(true));
    });

    const handleResize = () => {
      if (containerRef.current && plotlyRef.current) {
        plotlyRef.current.Plots.resize(containerRef.current);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      disposed = true;
      window.removeEventListener("resize", handleResize);
      if (containerRef.current && plotlyRef.current) {
        plotlyRef.current.purge(containerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <figure className="my-8 not-prose">
      <div className="rounded-lg border border-rule bg-white/40 p-2">
        <div ref={containerRef} style={{ width: "100%", height: "360px" }} />
        {!ready && (
          <p className="text-center font-sans text-sm text-ink-soft py-4">Loading chart…</p>
        )}
      </div>
      {caption && (
        <figcaption className="mt-2 text-center font-sans text-sm text-ink-soft">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
