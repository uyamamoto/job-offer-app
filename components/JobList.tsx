"use client";

import React, { useState } from "react";
import { mutate } from "swr";
import { useRouter } from "next/navigation";

type Job = {
  id: number;
  title: string;
  category: string;
  salary: string;
};

interface JobListPageProps {
  jobs: Job[];
}

// 求人リスト表示のためのコンポーネント
const JobList: React.FC<JobListPageProps> = ({ jobs }) => {
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [salaryFilter, setSalaryFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const jobsPerPage = 5; // 1ページあたりに表示する求人の件数
  const router = useRouter();

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCategoryFilter(
      (prev) =>
        prev.includes(value)
          ? prev.filter((category) => category !== value) // 選択解除
          : [...prev, value] // 新たに追加
    );
    paginate(1);
  };

  const handleSalaryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSalaryFilter(value);
    paginate(1);
  };

  const handleDelete = async (jobId: number): Promise<void> => {
    const confirmed = window.confirm("本当にこの投稿を削除しますか？");

    if (!confirmed) return;

    try {
      const response = await fetch("/api/jobs", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: jobId }),
      });

      if (!response.ok) {
        throw new Error("データの削除に失敗しました");
      }
      // 削除したデータを"api/jobs"のキャッシュから削除
      mutate(
        "api/jobs",
        (jobs: Job[] = []) => jobs.filter((j) => j.id !== jobId),
        false
      );
      // リロード
      window.location.reload();
    } catch (error) {
      console.error("エラーが発生しました: ", error);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    return (
      (categoryFilter.length === 0 || categoryFilter.includes(job.category)) &&
      Number(job.salary) >= Number(salaryFilter)
    );
  });

  // 求人投稿をid順に並べる
  filteredJobs.sort((a, b) => a.id - b.id);

  // 現在のページに表示する求人のリスト
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  // 総ページ数を計算
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  // ページ番号の変更
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="flex dark:bg-white">
      <div className="w-400 p-4 border-r bg-gray-300 dark:text-black">
        <h2 className="font-bold mb-2 text-xl">求人カテゴリ</h2>
        <div className="mb-4">
          <input type="checkbox" value="事務" onChange={handleCategoryChange} />
          <label className="ml-2">事務</label>
        </div>
        <div className="mb-4">
          <input
            type="checkbox"
            value="エンジニア"
            onChange={handleCategoryChange}
          />
          <label className="ml-2">エンジニア</label>
        </div>
        <div className="mb-4">
          <input type="checkbox" value="営業" onChange={handleCategoryChange} />
          <label className="ml-2">営業</label>
        </div>
        <div className="mb-4">
          <input
            type="checkbox"
            value="デザイン"
            onChange={handleCategoryChange}
          />
          <label className="ml-2">デザイン</label>
        </div>
        <div className="mb-4">
          <input
            type="checkbox"
            value="マーケティング"
            onChange={handleCategoryChange}
          />
          <label className="ml-2">マーケティング</label>
        </div>
        <div className="mb-4">
          <input
            type="checkbox"
            value="財務・経理"
            onChange={handleCategoryChange}
          />
          <label className="ml-2">財務・経理</label>
        </div>
        <div className="mb-4">
          <input type="checkbox" value="人事" onChange={handleCategoryChange} />
          <label className="ml-2">人事</label>
        </div>
        <div className="mb-4">
          <input
            type="checkbox"
            value="カスタマーサポート"
            onChange={handleCategoryChange}
          />
          <label className="ml-2">カスタマーサポート</label>
        </div>
        <div className="mb-4">
          <input type="checkbox" value="製造" onChange={handleCategoryChange} />
          <label className="ml-2">製造</label>
        </div>
        <div className="mb-4">
          <input
            type="checkbox"
            value="医療・介護"
            onChange={handleCategoryChange}
          />
          <label className="ml-2">医療・介護</label>
        </div>
        <h2 className="font-bold mb-2">年収</h2>
        <select onChange={handleSalaryChange} className="border p-2">
          <option value="0">条件なし</option>
          <option value="300">300万円以上</option>
          <option value="500">500万円以上</option>
          <option value="700">700万円以上</option>
        </select>
      </div>
      <div className="flex-grow p-4 dark:text-black">
        <h2 className="font-bold mb-2 text-2xl">求人一覧</h2>
        <p>該当件数: {filteredJobs.length}件</p>
        {filteredJobs.length > 0 ? (
          currentJobs.map((job) => (
            <div
              key={job.id}
              className="relative border p-4 mb-2 border-gray-400 rounded-lg"
            >
              <h3 className="font-bold">{job.title}</h3>
              <p>カテゴリ: {job.category}</p>
              <p>年収: {job.salary}万円</p>
              <button
                onClick={() => router.push(`/edit/${job.id}`)}
                className="absolute bottom-2 right-32 px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                投稿を編集
              </button>
              <button
                onClick={() => handleDelete(job.id)} // 削除処理のハンドラ関数
                className="absolute bottom-2 right-2 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                投稿を削除
              </button>
            </div>
          ))
        ) : (
          <p>条件に合う求人が見つかりませんでした。</p>
        )}

        <div className="flex justify-center mt-4">
          <button
            className="px-2 py-1 border mx-1"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ◀
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              className={`px-2 py-1 border mx-1 ${
                currentPage === index + 1 ? "bg-blue-900 text-white" : ""
              }`}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className="px-2 py-1 border mx-1"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobList;
