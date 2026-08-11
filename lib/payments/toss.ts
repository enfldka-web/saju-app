import "server-only";
import { SINGLE_READING_PRICE_KRW } from "./constants";

export { SINGLE_READING_PRICE_KRW };

interface TossConfirmParams {
  paymentKey: string;
  orderId: string;
  amount: number;
}

interface TossConfirmResponse {
  paymentKey: string;
  orderId: string;
  status: string;
  totalAmount: number;
  method: string;
  approvedAt: string;
}

export class TossConfirmError extends Error {
  constructor(
    message: string,
    public readonly code?: string
  ) {
    super(message);
    this.name = "TossConfirmError";
  }
}

/** 토스페이먼츠 결제 승인 API를 호출한다. 성공하면 실제로 결제가 완료됐다는 뜻이다. */
export async function confirmTossPayment({ paymentKey, orderId, amount }: TossConfirmParams): Promise<TossConfirmResponse> {
  const secretKey = process.env.TOSS_SECRET_KEY;
  if (!secretKey) {
    throw new TossConfirmError("TOSS_SECRET_KEY가 설정되지 않았습니다.");
  }

  const response = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new TossConfirmError(data.message ?? "결제 승인에 실패했습니다.", data.code);
  }

  return data as TossConfirmResponse;
}
