"use client";
import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, SubmitHandler } from "react-hook-form";

// バリデーション用スキーマ
import { Gender, NewsLetter, FormSchema } from "./schema";

type FormData = z.infer<typeof FormSchema>;

export default function Page() {
  // 初期値
  const defaultValues: FormData = {
    fullName: "",
    age: "",
    gender: Gender.empty,
    emails: { email: "", confirmEmail: "" },
    comment: "",
    newsLetter: NewsLetter.receive,
    agree: true,
  };

  // react hook from の初期設定
  const {
    control,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: {
      isDirty,
      isValid,
      isSubmitting,
      isSubmitted,
      isSubmitSuccessful,
      errors,
    },
  } = useForm<FormData>({
    defaultValues,
    mode: "all",
    resolver: zodResolver(FormSchema),
    criteriaMode: "all",
  });

  // フォーム送信処理
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    clearErrors("root");
    try {
      await new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          const isSuccess = Math.random() < 0.5;
          if (isSuccess) {
            console.log("%c送信成功%c", "color:green;font-weight:bold;", "");
            console.table(data);
            // reset(); 本来ならフォーム送信成功後はフォームをリセット
            resolve();
          } else {
            console.log("%c送信失敗%c", "color:red;font-weight:bold;", "");
            reject(new Error("送信に失敗しました"));
          }
        }, 1500);
      });
    } catch (error) {
      console.error("エラー:", error);
      setError("root.serverError", {
        type: "manual",
        message: "送信に失敗しました。もう一度お試しください。",
      });
    }
  };

  // フォームリセット処理
  const handleReset = () => {
    reset();
  };

  // フォーム保存前離脱のアラート
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        {isSubmitting && <div className="result">送信中</div>}
        {!isSubmitting && isSubmitted && (
          <div
            className={`result ${
              isSubmitSuccessful ? `is-success` : `is-failed`
            }`}
          >
            {isSubmitSuccessful ? "送信成功" : "送信失敗"}
            {errors.root?.serverError && (
              <button onClick={() => handleSubmit(onSubmit)}>リトライ</button>
            )}
          </div>
        )}
        <Controller
          name="fullName"
          control={control}
          render={({ field, fieldState }) => (
            <div
              className={`form-group ${!!fieldState.error ? `is-error` : ``}`}
            >
              <label htmlFor="fullName">名前</label>
              <div>
                <input id="fullName" type="text" {...field} />
                {fieldState.error && (
                  <span className="error-message">
                    {fieldState.error.message}
                  </span>
                )}
              </div>
            </div>
          )}
        />
        <Controller
          name="age"
          control={control}
          render={({ field, fieldState }) => (
            <div
              className={`form-group ${!!fieldState.error ? `is-error` : ``}`}
            >
              <label htmlFor="age">年齢</label>
              <div>
                <input id="age" type="text" {...field} />
                {fieldState.error && (
                  <span className="error-message">
                    {fieldState.error.message}
                  </span>
                )}
              </div>
            </div>
          )}
        />
        <Controller
          name="gender"
          control={control}
          render={({ field, fieldState }) => (
            <div
              className={`form-group ${!!fieldState.error ? `is-error` : ``}`}
            >
              <label htmlFor="gender">性別</label>
              <div>
                <select id="gender" {...field}>
                  <option value={Gender.empty}>選択してください</option>
                  <option value={Gender.female}>女性</option>
                  <option value={Gender.male}>男性</option>
                  <option value={Gender.other}>無回答</option>
                </select>
                {fieldState.error && (
                  <span className="error-message">
                    {fieldState.error.message}
                  </span>
                )}
              </div>
            </div>
          )}
        />
        <Controller
          name="emails.email"
          control={control}
          render={({ field, fieldState }) => (
            <div
              className={`form-group ${!!fieldState.error ? `is-error` : ``}`}
            >
              <label htmlFor="email">メールアドレス</label>
              <div>
                <input id="email" type="text" {...field} />
                {fieldState.error && (
                  <span className="error-message">
                    {fieldState.error.message}
                  </span>
                )}
              </div>
            </div>
          )}
        />
        <Controller
          name="emails.confirmEmail"
          control={control}
          render={({ field, fieldState }) => (
            <div
              className={`form-group ${!!fieldState.error ? `is-error` : ``}`}
            >
              <label htmlFor="confirmEmail">メールアドレス（確認用）</label>
              <div>
                <input id="confirmEmail" type="text" {...field} />
                {fieldState.error && (
                  <span className="error-message">
                    {fieldState.error.message}
                  </span>
                )}
              </div>
            </div>
          )}
        />
        <Controller
          name="newsLetter"
          control={control}
          render={({ field, fieldState }) => (
            <div
              className={`form-group ${!!fieldState.error ? `is-error` : ``}`}
            >
              <label htmlFor="newsLatter">お知らせ</label>
              <div>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      {...field}
                      value={NewsLetter.receive}
                      checked={field.value === NewsLetter.receive}
                    />
                    受け取る
                  </label>
                  <label>
                    <input
                      type="radio"
                      {...field}
                      value={NewsLetter.reject}
                      checked={field.value === NewsLetter.reject}
                    />
                    受け取らない
                  </label>
                </div>
                {fieldState.error && (
                  <span className="error-message">
                    {fieldState.error.message}
                  </span>
                )}
              </div>
            </div>
          )}
        />
        <Controller
          name="comment"
          control={control}
          render={({ field, fieldState }) => (
            <div
              className={`form-group ${!!fieldState.error ? `is-error` : ``}`}
            >
              <label htmlFor="comment">コメント</label>
              <div>
                <textarea id="comment" {...field} />
                {fieldState.error && (
                  <span className="error-message">
                    {fieldState.error.message}
                  </span>
                )}
              </div>
            </div>
          )}
        />
        <Controller
          name="agree"
          control={control}
          render={({ field: { value, ...rest }, fieldState }) => (
            <div
              className={`form-group ${!!fieldState.error ? `is-error` : ``}`}
            >
              <div>
                <label>
                  <input type="checkbox" checked={value} {...rest} />
                  <span>利用規約に同意する</span>
                </label>
                {fieldState.error && (
                  <span className="error-message">
                    {fieldState.error.message}
                  </span>
                )}
              </div>
            </div>
          )}
        />
        <div className="button-group">
          <button
            type="submit"
            disabled={!isDirty || !isValid || isSubmitSuccessful}
          >
            送信
          </button>
          <button type="button" onClick={handleReset}>
            リセット
          </button>
        </div>
      </form>
    </div>
  );
}
