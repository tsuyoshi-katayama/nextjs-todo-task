import fetch from "node-fetch";

/** 投稿一覧を取得 */
export async function getAllPostsData() {
    const res = await fetch(
        new URL(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/list-post/`)
    );
    const posts = await res.json();
    // 作成日時の降順でソートする
    const filteredPosts = posts.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    return filteredPosts;
}