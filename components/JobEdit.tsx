"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { mutate } from "swr";

type Job = {
  id: number;
  title: string;
  category: string;
  salary: string;
};

// 求人投稿フォーム表示のためのコンポーネント
const JobEdit: React.FC = () => {
  const [category, setCategory] = useState<string>("");
  const [salary, setSalary] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const router = useRouter();
  const { id }: { id: string } = useParams(); // ルートパラメータから投稿のIDを取得

  // 既存の投稿データを取得
  useEffect(() => {
    // IDと一致する投稿データをAPIから取得する
    const fetchJob = async () => {
      const response = await fetch(`/api/jobs/${id}`);
      const data = await response.json();
      if (data) {
        setCategory(data[0].category);
        setSalary(data[0].salary);
        setTitle(data[0].title);
      }
    };
    fetchJob();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // formタグのデフォルトのアクションを無効化

    if (title && category && salary) {
      const editedJob = {
        id: id,
        title: title,
        category: category,
        salary: salary,
      };

      try {
        // 新規求人情報をDBにPOST
        const response = await fetch(`/api/jobs/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedJob),
        });

        if (!response.ok) {
          throw new Error("データの送信に失敗しました");
        }

        // 送信したデータを"api/jobs"のキャッシュに追加
        mutate(
          "api/jobs",
          (jobs: Job[] = []) => {
            jobs.forEach((job) => {
              if (job.id === parseInt(id)) {
                job.title = editedJob.title;
                job.category = editedJob.category;
                job.salary = editedJob.salary;
              }
            });
            return jobs;
          },
          false
        );
        // 求人一覧画面にリダイレクト
        router.push("/jobs");
      } catch (error) {
        console.error("エラーが発生しました: ", error);
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
            min="1"
          />
        </div>
        <div className="mb-4">
          <label className="block">求人タイトル</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 w-full border-gray-400"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 w-48 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
        >
          投稿
        </button>
      </form>
    </div>
  );
};

export default JobEdit;
