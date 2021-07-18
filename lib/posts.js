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

/** 掲示板のIDの一覧を取得 */
export async function getAllPostIds() {
    const res = await fetch(
        new URL(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/list-post/`)
    );
    const posts = await res.json();
    return posts.map((post) => {
        return {
            params: {
                id: String(post.id),
            },
        };
    });
    
}

/**
 * 指定IDの掲示板詳細を取得
 * @param {*} id 取得する掲示板ID
 * @returns 掲示板詳細
 */
export async function getPostData(id) {
    const res = await fetch(
      new URL(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/detail-post/${id}/`)
    );
    const post = await res.json();
    // return {
    //   post,
    // };
    return post;
}