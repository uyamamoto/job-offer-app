import JobList from "../../components/JobList";

type Job = {
  id: number;
  title: string;
  category: string;
  salary: string;
};

// データベースからすべての求人投稿を取得する関数
async function fetchJobs(): Promise<Job[]> {
  try {
    const response = await fetch("http://localhost:3000/api/jobs", {
      cache: "no-store", // キャッシュを無効化し、常に最新データを取得
    });

    if (!response.ok) {
      throw new Error("データの取得に失敗しました");
    }
    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("エラーが発生しました: ", error);
    return [];
  }
}

// サーバーサイドでデータを取得
export default async function JobListPage() {
  const jobs = await fetchJobs();

  return (
    <div>
      <JobList jobs={jobs} />
    </div>
  );
}
