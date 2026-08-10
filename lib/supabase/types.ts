/**
 * supabase/migrations/0001_init.sql 과 1:1 대응하는 수기 타입.
 * 실제 Supabase 프로젝트 연결 후에는 `supabase gen types typescript`로 자동 생성된
 * 타입으로 교체하는 것을 권장한다 (지금은 프로젝트 미연결 상태라 수기로 유지).
 */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          phone: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          phone?: string | null;
          created_at?: string;
        };
        Update: Partial<{
          phone: string | null;
        }>;
        Relationships: [];
      };
      readings: {
        Row: {
          id: string;
          input_hash: string;
          input: unknown;
          chart: unknown;
          interpretation: unknown | null;
          user_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          input_hash: string;
          input: unknown;
          chart: unknown;
          interpretation?: unknown | null;
          user_id?: string | null;
        };
        Update: Partial<{
          interpretation: unknown | null;
        }>;
        Relationships: [];
      };
      payments: {
        Row: {
          id: string;
          reading_id: string | null;
          user_id: string | null;
          guest_phone: string | null;
          product_type: "single_reading" | "monthly_subscription";
          amount: number;
          currency: string;
          status: "pending" | "succeeded" | "failed" | "canceled";
          toss_payment_key: string | null;
          toss_order_id: string;
          raw_response: unknown | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          reading_id?: string | null;
          user_id?: string | null;
          guest_phone?: string | null;
          product_type: "single_reading" | "monthly_subscription";
          amount: number;
          currency?: string;
          status: "pending" | "succeeded" | "failed" | "canceled";
          toss_payment_key?: string | null;
          toss_order_id: string;
          raw_response?: unknown | null;
        };
        Update: Partial<{
          status: "pending" | "succeeded" | "failed" | "canceled";
          toss_payment_key: string | null;
          raw_response: unknown | null;
        }>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
