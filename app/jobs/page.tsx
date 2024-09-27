"use client";

import JobList from "../../components/JobList";
import useSWR from "swr";

// データ取得のための関数
const fetcher = (url: string) => fetch(url).then((res) => res.json());


// サーバーサイドでデータを取得
export default function JobListPage() {
  // useSWRでデータをキャッシュして取得
  const { data: jobs, error } = useSWR("/api/jobs", fetcher);

  if (error) return <div>エラーが発生しました: {error.message}</div>;
  if (!jobs) return <div>読み込み中</div>;

  return (
    <div>
      <JobList jobs={jobs} />
    </div>
  );
}
