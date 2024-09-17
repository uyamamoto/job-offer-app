import React, { useState } from "react";
import { BrowserRouter as Router, Route, Link, Routes} from "react-router-dom";
import JobListPage from "./components/JobListPage";
import JobPostPage from "./components/JobPostPage";

type Job = {
  id: number;
  title: string;
  category: string;
  salary: string;
}

const App: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([
    { id: 1, title: '経験者歓迎！大手企業でのWebエンジニア募集', category: 'エンジニア', salary: "600" },
    { id: 2, title: '未経験OK！営業アシスタント急募', category: '営業', salary: "350" },
    { id: 3, title: 'グローバル企業でのマーケティングマネージャー', category: 'マーケティング', salary: "800" },
    { id: 4, title: 'UI/UXデザイナー募集！急成長中のスタートアップ', category: 'デザイン', salary: "550" },
    { id: 5, title: '大手製造業での生産管理スペシャリスト', category: '製造', salary: "650" },
    { id: 6, title: '急成長ベンチャーでの経理マネージャー募集', category: '財務・経理', salary: "700" },
    { id: 7, title: '大手IT企業での人事担当者募集', category: '人事', salary: "500" },
    { id: 8, title: '外資系企業でのカスタマーサポート担当募集', category: 'カスタマーサポート', salary: "400" },
    { id: 9, title: '看護師募集！大学病院での勤務', category: '医療・介護', salary: "550" },
    { id: 10, title: '一般事務スタッフ募集！週3日からOK', category: '事務', salary: "300" },
  ]);

  // 新しい求人を追加する関数
  const addJob = (newJob: Job) => {
    setJobs([...jobs, newJob]);
  }

  return (
    <Router>
      <div>
        <nav className="p-4 bg-gray-800 text-white flex">
          <h1 className="text-2xl font-bold">求人検索アプリ</h1>
          <div className="ml-auto">
            <Link to="/" className="mr-4">求人検索</Link>
            <Link to="/post">求人投稿</Link>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<JobListPage jobs={jobs} />} />
          <Route path="/post" element={<JobPostPage addJob={ addJob } />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App;