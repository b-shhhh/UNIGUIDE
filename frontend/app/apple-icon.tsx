import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(135deg, #0E6F86 0%, #1F6F8B 60%, #60A5FA 100%)",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "#FFFFFF",
            display: "flex",
            fontSize: 78,
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
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: "0.22em",
            marginTop: 4,
            paddingLeft: 5,
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
