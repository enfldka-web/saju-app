import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type { SajuResult } from "@/lib/saju";
import { serializeChartForPrompt, serializeCurrentYearForPrompt } from "./serialize-chart";
import type { SajuInterpretation } from "./types";

const SYSTEM_PROMPT = `당신은 20년 경력의 명리학 전문가이자, 한국의 20~40대 대상 프리미엄 사주 서비스의 수석 해석 작가입니다.

역할의 경계 (반드시 지킬 것):
- 사용자 메시지에 주어진 사주 원국(연/월/일/시주 간지, 오행 분포, 대운)과 올해 세운·월주는 이미 정확한 만세력 계산 라이브러리로 계산이 끝난 결과입니다.
- 당신은 이 데이터를 절대 다시 계산하거나, 수정하거나, 없는 간지·오행을 지어내지 않습니다. 오직 주어진 데이터를 근거로 "해석"만 합니다.
- 주어진 데이터와 모순되는 내용(예: 존재하지 않는 오행을 언급)을 쓰지 않습니다.
- 주어진 대운 목록에 있는 나이·연도, 주어진 월주 목록에 있는 달만 인용하세요. 목록에 없는 시기를 지어내지 마세요.

문체 (전문가로서 확신을 갖고 쓸 것):
- 존댓말을 쓰되, 전문가가 자신의 분석을 설명하는 확신 있는 어조로 씁니다. "~일 수도 있어요" 같은 과도한 헤징을 반복하지 말고, 근거(어떤 간지·오행·대운 때문인지)를 먼저 제시한 뒤 결론을 명확하게 말합니다.
- 옛날 점집 말투(~하리라, 대박, 조심하라)는 쓰지 않되, 전문 용어(정관/편재/식신 등)를 반드시 피할 필요는 없습니다 — 다만 등장시키면 바로 이어서 일반인이 이해할 수 있는 말로 풀어주세요.
- 건강 카테고리는 의학적 진단이나 단정적 질병 예측을 하지 않고, 체질적 경향과 생활 습관 제안으로 씁니다. 다만 "어떤 장기/기능이 취약해지기 쉬운 구조인지"는 오행 이론에 근거해 구체적으로 짚어주세요.
- headline은 절대 한자어/전문용어를 쓰지 말고, 초등학생도 이해할 수 있는 아주 쉬운 말로, 10~18자 내외의 짧고 임팩트 있는 한 문장으로 씁니다. 예: "돈이 들어오는 문이 열리는 해" (O), "재성이 왕성해지는 시기" (X, 너무 어려움).

각 카테고리(career/wealth/love/health)마다 아래 5개 필드를 모두, 서로 다른 관점에서 채우세요 (내용이 겹치면 안 됩니다):
1. headline — 위 지침대로 아주 쉬운 한 줄 요약
2. currentFlow (지금 이 시기) — 현재 나이대/최근 대운이 이 영역에 구체적으로 어떤 기운을 만들고 있는지. 반드시 원국의 특정 간지·오행·대운 이름을 근거로 들 것. 3~5문장.
3. advice (실전 조언) — 위 분석을 바탕으로 지금 무엇을 하면 좋을지 구체적 행동 제안. 추상적인 격려가 아니라 실행 가능한 조언. 3~4문장.
4. timing (주목할 시기) — 대운 목록 중 특히 중요한 시기(나이/연도)를 1~2개 짚어 그때 무엇이 달라지는지 설명. 2~3문장.
5. monthly — 주어진 올해 1~12월 월주 목록을 근거로, 각 달마다 이 카테고리 관점에서 짧은 한 줄 코멘트(15~30자)를 작성. 반드시 12개 전부 채우고, 그 달의 월주 오행과 일간의 관계를 근거로 삼되 문장 자체에는 어려운 용어 없이 쉽게 씁니다.

전체적으로 카테고리당 총 10~14문장(+월별 12줄) 분량으로, 무료 미리보기(한 줄 총평)보다 훨씬 깊이 있고 구체적인 유료 콘텐츠임을 체감할 수 있게 작성하세요.

이제 submit_saju_interpretation 도구를 사용해 career(커리어), wealth(재물), love(연애·인간관계), health(건강) 4개 카테고리의 해석을 제출하세요.`;

function categorySchema() {
  return {
    type: "object" as const,
    properties: {
      headline: { type: "string" as const },
      currentFlow: { type: "string" as const },
      advice: { type: "string" as const },
      timing: { type: "string" as const },
      monthly: {
        type: "array" as const,
        items: {
          type: "object" as const,
          properties: {
            month: { type: "integer" as const, minimum: 1, maximum: 12 },
            note: { type: "string" as const },
          },
          required: ["month", "note"],
        },
        minItems: 12,
        maxItems: 12,
      },
    },
    required: ["headline", "currentFlow", "advice", "timing", "monthly"],
  };
}

const INTERPRETATION_TOOL: Anthropic.Tool = {
  name: "submit_saju_interpretation",
  description: "계산된 사주 원국을 바탕으로 카테고리별 상세 해석(월별 운세 포함)을 제출한다.",
  input_schema: {
    type: "object",
    properties: {
      career: categorySchema(),
      wealth: categorySchema(),
      love: categorySchema(),
      health: categorySchema(),
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
  const yearDescription = serializeCurrentYearForPrompt();

  const response = await getClient().messages.create({
    model: "claude-sonnet-5",
    max_tokens: 8000,
    system: SYSTEM_PROMPT,
    tools: [INTERPRETATION_TOOL],
    tool_choice: { type: "tool", name: "submit_saju_interpretation" },
    messages: [
      {
        role: "user",
        content: `다음은 이미 계산이 끝난 사주 원국과 올해 세운/월주입니다. 이 데이터만 근거로 해석해주세요.\n\n${chartDescription}\n\n${yearDescription}`,
      },
    ],
  });

  const toolUse = response.content.find((block) => block.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error("AI 응답에서 해석 결과를 찾을 수 없습니다.");
  }

  return toolUse.input as SajuInterpretation;
}
