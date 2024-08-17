import { z } from "zod";

export const Gender = {
  empty: "",
  female: "female",
  male: "male",
  other: "other",
} as const;

export const NewsLetter = {
  receive: "receive",
  reject: "reject",
} as const;

// z.enumの型: [string, ...string[]]
const GenderValues = Object.values(Gender) as [string, ...string[]];
const NewsLetterValues = Object.values(NewsLetter) as [string, ...string[]];

// 1以上の整数のみ許可するスキーマ（全角可）
const NumberIntSchema = (label: string, min: number = 1) =>
  z.preprocess(
    (val) => {
      if (typeof val === "string") {
        // 全角数字を半角数字に変換
        const _half = val.replace(/[０-９]/g, (s) =>
          String.fromCharCode(s.charCodeAt(0) - 0xfee0)
        );
        return /^\d+$/.test(_half) ? Number(_half) : _half;
      }
      return val;
    },
    z.union([
      z
        .string()
        .refine((val) => val !== "", {
          message: `${label}を入力してください`,
        })
        .refine((val) => !val.includes(".") && !val.includes("．"), {
          message: "整数を入力してください",
        })
        .refine((val) => /^[0-9０-９]+$/.test(val), {
          message: "数字のみを入力してください",
        }),
      z
        .number()
        .int({
          message: "整数を入力してください",
        })
        .min(min, {
          message: `${min}以上の数値を入力してください`,
        }),
    ])
  );

export const FormSchema = z.object({
  fullName: z
    .string({
      required_error: "名前を入力してください",
      invalid_type_error: "入力が正しくないようです",
    })
    .min(2, { message: "2文字以上入力してください" }),
  age: NumberIntSchema("年齢"),
  gender: z.enum(GenderValues).refine((val) => val !== "", {
    message: "性別を選択してください",
  }),
  emails: z
    .object({
      email: z
        .string({
          required_error: "メールアドレスを入力してください",
        })
        .email({ message: "有効なメールアドレスを入力してください" }),
      confirmEmail: z
        .string({
          required_error: "確認用メールアドレスを入力してください",
        })
        .email({ message: "有効なメールアドレスを入力してください" }),
    })
    .refine((data) => data.email === data.confirmEmail, {
      message: "メールアドレスが一致しません",
      path: ["confirmEmail"],
    }),
  newsLetter: z.enum(NewsLetterValues, {
    required_error: "お知らせの受け取り方法を選択してください",
  }),
  comment: z
    .string()
    .min(3, { message: "3文字以上で入力してください" })
    .max(10, { message: "10文字以内で入力してください" })
    .optional(),
  agree: z.coerce.boolean().refine((val) => val === true, {
    message: "利用規約に同意する必要があります",
  }),
});
