import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { ImageResponse } from "next/og";
import { calculateSaju, getCurrentSewoon, generateSewoonSummary, parseSajuSearchParams } from "@/lib/saju";
import { generateFreeSummary } from "@/lib/ai/free-summary";

const COLOR = {
  ink950: "#17130f",
  ink900: "#1c1611",
  paper100: "#ece3d2",
  paper500: "#a08e6f",
  gold400: "#c9a06e",
  parchment100: "#f4ecda",
  parchmentInk: "#2c2418",
  parchmentInkSoft: "#8a7a5c",
  seal: "#a7402f",
};

async function loadFonts() {
  const [regular, bold] = await Promise.all([
    readFile(fileURLToPath(new URL("./Pretendard-Regular.ttf", import.meta.url))),
    readFile(fileURLToPath(new URL("./Pretendard-Bold.ttf", import.meta.url))),
  ]);
  return [
    { name: "Pretendard", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Pretendard", data: bold, weight: 700 as const, style: "normal" as const },
  ];
}

export async function GET(request: Request) {
  const { searchParams, host } = new URL(request.url);
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  const parsed = parseSajuSearchParams(params);
  const fonts = await loadFonts();

  if (!parsed) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: COLOR.ink950,
            color: COLOR.paper100,
            fontFamily: "Pretendard",
            fontSize: 40,
          }}
        >
          干支
        </div>
      ),
      { width: 1200, height: 630, fonts }
    );
  }

  const result = calculateSaju(parsed.input);
  const summary = generateFreeSummary(result);
  const sewoon = getCurrentSewoon();
  const yearSummary = generateSewoonSummary(result.chart.day.ohaeng[0], sewoon);
  const pillars = [
    { label: "년주", p: result.chart.year },
    { label: "월주", p: result.chart.month },
    { label: "일주", p: result.chart.day },
    { label: "시주", p: result.chart.time },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: `linear-gradient(135deg, ${COLOR.ink900}, ${COLOR.ink950})`,
          padding: 64,
          fontFamily: "Pretendard",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: 420 }}>
          <span style={{ fontSize: 20, color: COLOR.gold400, letterSpacing: 4 }}>干支 · 사주 원국 증서</span>
          <span style={{ display: "flex", fontSize: 40, fontWeight: 700, color: COLOR.paper100, marginTop: 20, lineHeight: 1.3 }}>
            {summary}
          </span>
          <span style={{ display: "flex", fontSize: 20, color: COLOR.paper500, marginTop: 28, lineHeight: 1.6 }}>
            {yearSummary}
          </span>
          <span style={{ display: "flex", fontSize: 22, color: COLOR.gold400, fontWeight: 700, marginTop: "auto" }}>
            나도 확인하기 → {host}
          </span>
        </div>

        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div
            style={{
              position: "relative",
              display: "flex",
              background: COLOR.parchment100,
              borderRadius: 4,
              padding: "36px 28px",
              boxShadow: "0 30px 60px rgba(0,0,0,0.45)",
            }}
          >
            {pillars.map(({ label, p }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: 110,
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 14, color: COLOR.parchmentInkSoft }}>{label}</span>
                {p ? (
                  <span style={{ display: "flex", flexDirection: "column", alignItems: "center", fontSize: 30, fontWeight: 700, color: COLOR.parchmentInk }}>
                    <span>{p.gan.hangul}</span>
                    <span>{p.zhi.hangul}</span>
                  </span>
                ) : (
                  <span style={{ fontSize: 14, color: COLOR.parchmentInkSoft }}>미상</span>
                )}
              </div>
            ))}

            <div
              style={{
                position: "absolute",
                bottom: -20,
                right: -16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 84,
                height: 84,
                borderRadius: 999,
                background: COLOR.seal,
                color: COLOR.parchment100,
                fontSize: 15,
                fontWeight: 700,
                transform: "rotate(-9deg)",
              }}
            >
              印
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts }
  );
}
