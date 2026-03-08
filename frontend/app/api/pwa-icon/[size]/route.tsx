import { ImageResponse } from "next/og";

type RouteContext = {
  params: Promise<{
    size: string;
  }>;
};

function normalizeSize(input: string) {
  const parsed = Number(input);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 192;
  }

  return Math.min(Math.max(Math.round(parsed), 64), 1024);
}

export async function GET(_request: Request, context: RouteContext) {
  const { size } = await context.params;
  const iconSize = normalizeSize(size);
  const titleSize = iconSize < 256 ? 72 : 240;
  const subtitleSize = iconSize < 256 ? 16 : 50;
  const borderWidth = iconSize < 256 ? 6 : 16;

  const image = new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(135deg, #0E6F86 0%, #1F6F8B 55%, #60A5FA 100%)",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            border: `${borderWidth}px solid rgba(255,255,255,0.18)`,
            borderRadius: iconSize * 0.22,
            height: iconSize * 0.78,
            position: "absolute",
            width: iconSize * 0.78,
          }}
        />
        <div
          style={{
            color: "#FFFFFF",
            display: "flex",
            fontSize: titleSize,
            fontWeight: 800,
            letterSpacing: "-0.08em",
            lineHeight: 1,
            textTransform: "uppercase",
          }}
        >
          UG
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.92)",
            display: "flex",
            fontSize: subtitleSize,
            fontWeight: 700,
            letterSpacing: "0.24em",
            marginTop: iconSize * 0.02,
            paddingLeft: subtitleSize * 0.24,
            textTransform: "uppercase",
          }}
        >
          GUIDE
        </div>
      </div>
    ),
    {
      width: iconSize,
      height: iconSize,
    },
  );

  image.headers.set("content-type", "image/png");
  return image;
}
