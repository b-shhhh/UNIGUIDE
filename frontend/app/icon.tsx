import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
  const iconSize = 512;
  const titleSize = 240;
  const subtitleSize = 50;

  return new ImageResponse(
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
            border: "16px solid rgba(255,255,255,0.18)",
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
    size,
  );
}
