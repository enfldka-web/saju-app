import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type { SajuResult } from "@/lib/saju";
import { serializeChartForPrompt } from "./serialize-chart";
import type { SajuInterpretation } from "./types";

const SYSTEM_PROMPT = `당신은 한국의 20~40대 대상 프리미엄 사주 서비스의 해석 작가입니다.

역할의 경계 (반드시 지킬 것):
- 사용자 메시지에 주어진 사주 원국(연/월/일/시주 간지, 오행 분포, 대운)은 이미 정확한 만세력 계산 라이브러리로 계산이 끝난 결과입니다.
- 당신은 이 데이터를 절대 다시 계산하거나, 수정하거나, 없는 간지·오행을 지어내지 않습니다. 오직 주어진 데이터를 "해석"만 합니다.
- 주어진 데이터와 모순되는 내용(예: 존재하지 않는 오행을 언급)을 쓰지 않습니다.

문체:
- 존댓말, 따뜻하지만 담백한 톤. "~하실 거예요", "~한 편이에요"처럼 단정적이지 않게.
- 옛날 점집 말투(~하리라, 대박, 조심하라)나 어려운 명리학 전문용어(용신/격국/십신 등)를 남발하지 않고, 일반인이 바로 이해할 수 있는 현대적인 언어로 풀어씁니다.
- 건강 카테고리는 의학적 진단이나 단정적 질병 예측을 하지 않고, 체질적 경향과 생활 습관 제안 정도로만 씁니다.
- 각 카테고리 body는 2~4문장, 너무 길지 않게 — 모바일에서 짧은 문단으로 읽힙니다.
- headline은 8~16자 내외의 짧은 한 문장으로, 그 카테고리의 핵심을 요약합니다.

이제 submit_saju_interpretation 도구를 사용해 career(커리어), wealth(재물), love(연애·인간관계), health(건강) 4개 카테고리의 해석을 제출하세요.`;

const INTERPRETATION_TOOL: Anthropic.Tool = {
  name: "submit_saju_interpretation",
  description: "계산된 사주 원국을 바탕으로 카테고리별 해석을 제출한다.",
  input_schema: {
    type: "object",
    properties: {
      career: {
        type: "object",
        properties: { headline: { type: "string" }, body: { type: "string" } },
        required: ["headline", "body"],
      },
      wealth: {
        type: "object",
        properties: { headline: { type: "string" }, body: { type: "string" } },
        required: ["headline", "body"],
      },
      love: {
        type: "object",
        properties: { headline: { type: "string" }, body: { type: "string" } },
        required: ["headline", "body"],
      },
      health: {
        type: "object",
        properties: { headline: { type: "string" }, body: { type: "string" } },
        required: ["headline", "body"],
      },
    },
    required: ["career", "wealth", "love", "health"],
  },
};

let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

export async function generateInterpretation(result: SajuResult): Promise<SajuInterpretation> {
  const chartDescription = serializeChartForPrompt(result);

  const response = await getClient().messages.create({
    model: "claude-sonnet-5",
    max_tokens: 1500,
    system: SYSTEM_PROMPT,
    tools: [INTERPRETATION_TOOL],
    tool_choice: { type: "tool", name: "submit_saju_interpretation" },
    messages: [
      {
        role: "user",
        content: `다음은 이미 계산이 끝난 사주 원국입니다. 이 데이터만 근거로 해석해주세요.\n\n${chartDescription}`,
      },
    ],
  });

  const toolUse = response.content.find((block) => block.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error("AI 응답에서 해석 결과를 찾을 수 없습니다.");
  }

  return toolUse.input as SajuInterpretation;
}
