import { redirect } from "next/navigation";

export default function Home() {
  // ユーザーが"/"にアクセスしたら/jobsにリダイレクト
  redirect("/jobs");
}
