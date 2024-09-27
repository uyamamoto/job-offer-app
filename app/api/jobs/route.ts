import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request: Request) {
  // リクエストから投稿フォームの内容を取得
  const { title, category, salary } = await request.json();

  // Supabaseにデータを挿入
  const { data, error } = await supabase
    .from("jobs")
    .insert([{ title, category, salary }]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "求人が投稿されました", data });
}

export async function GET() {
  // jobsテーブルからすべてのデータを取得
  const { data, error } = await supabase.from("jobs").select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  // リクエストボディから削除対象の投稿IDを取得
  const { id } = await request.json();

  if (!id) {
    return NextResponse.json({ error: "IDが不正です" }, { status: 400 });
  }

  // Supabaseからデータを削除
  const { error } = await supabase
    .from("jobs")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500});
  }

  return NextResponse.json({ message: "求人が削除されました"});
}
