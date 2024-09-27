import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

type Params = {
  id: string;
};

export async function GET(request: Request, { params }: { params: Params }) {
  // URLから投稿のidを取得
  const { id } = params;
  // Supabaseから該当するデータを取得
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", parseInt(id));

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PUT(request: Request, { params }: { params: Params }) {
  // URLから投稿のidを取得
  const { id } = params;

  // リクエストボディをJSON形式で取得
  const { title, category, salary } = await request.json();

  // 一致するidのレコードを更新
  const { data, error } = await supabase
    .from("jobs")
    .update({
      title: title,
      category: category,
      salary: salary,
    })
    .eq("id", parseInt(id));

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "求人情報が更新されました", data });
}
