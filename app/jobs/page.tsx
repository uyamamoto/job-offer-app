"use client";

import JobList from "../../components/JobList";
import useSWR from "swr";

// データ取得のための関数
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function JobListPage() {
  // useSWRでデータをキャッシュして取得
  const { data: jobs, error } = useSWR("/api/jobs", fetcher);

  if (error) return <div>エラーが発生しました: {error.message}</div>;
  if (!jobs) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin">a</div>
      </div>
    );
  }

  return (
    <div>
      <JobList jobs={jobs} />
    </div>
  );
}
