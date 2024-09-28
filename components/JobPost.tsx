"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { mutate } from "swr";

type Job = {
  id: number;
  title: string;
  category: string;
  salary: string;
};

// 求人投稿フォーム表示のためのコンポーネント
const JobPost: React.FC = () => {
  const [category, setCategory] = useState<string>("");
  const [salary, setSalary] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // salaryの数値の範囲に関するメッセージ

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // formタグのデフォルトのアクションを無効化

    // salaryが範囲内の数値であるかを判定する関数
    const isSalaryValid = (salary: string) => {
      const temp = Number(salary);
      return !isNaN(temp) && temp >= 1 && temp <= 9999;
    };

    if (title && category && isSalaryValid(salary)) {
      const newJob = {
        id: Math.floor(Math.random() * 1000000), // ランダムなIDを生成
        title: title,
        category: category,
        salary: salary,
      };

      // 既存のエラーメッセージをクリア
      setErrorMessage(null);

      try {
        // 新規求人情報をDBにPOST
        const response = await fetch("/api/jobs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newJob),
        });

        if (!response.ok) {
          throw new Error("データの送信に失敗しました");
        }

        // 送信したデータを"api/jobs"のキャッシュに追加
        mutate("api/jobs", (jobs: Job[] = []) => [...jobs, newJob], false);
        // 求人一覧画面にリダイレクト

        router.push("/jobs");
      } catch (error) {
        console.error("エラーが発生しました: ", error);
      }
    } else {
      // salaryが無効な場合の警告メッセージ
      if (!isSalaryValid(salary)) {
        setErrorMessage("年収は1〜9999万円の範囲で指定してください");
      } else {
        setErrorMessage(null); // salaryが有効な場合は警告をクリア
      }
    }
  };

  return (
    <div className="p-10 dark:text-black dark:bg-white">
      <h2 className="font-bold mb-4 text-2xl">求人投稿</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block">求人カテゴリ</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border w-64 p-2 w-full border-gray-400"
            required
          >
            <option value="">カテゴリを選択▼</option>
            <option value="事務">事務</option>
            <option value="エンジニア">エンジニア</option>
            <option value="営業">営業</option>
            <option value="デザイン">デザイン</option>
            <option value="マーケティング">マーケティング</option>
            <option value="財務・経理">財務・経理</option>
            <option value="人事">人事</option>
            <option value="カスタマーサポート">カスタマーサポート</option>
            <option value="製造">製造</option>
            <option value="医療・介護">医療・介護</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block">年収 (万円)</label>
          <input
            type="number"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="border w-64 p-2 w-full border-gray-400"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block">求人タイトル (100字以内)</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 w-full border-gray-400"
            required
            maxLength={100}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 w-48 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
        >
          投稿
        </button>
        {/* エラーメッセージの表示 */}
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default JobPost;
