import { useState } from "react";
import { useRouter } from "next/router";
import Cookie from "universal-cookie";

/** cokkieのインスタンス */
const cookie = new Cookie();

export default function Auth() {

  /** routerを使用可能にする：関数の中からルーティングできる */
  const router = useRouter();

  /** ユーザ名のローカルstate */
  const [username, setUsername] = useState("");
  /** パスワードののローカルstate */
  const [password, setPassword] = useState("");
  
  /** モード：ログイン or レジスタ*/
  const [isLogin, setIsLogin] = useState(true);

  /** apiレスポンス待ち　*/
  const [isResponced, setIsResponced] = useState(false);

  /** ログイン関数 */
  const login = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/auth/jwt/create/`,
        {
          method: "POST",
          body: JSON.stringify({ username: username, password: password }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.status === 400) {
          // 認証失敗の場合
          throw "authentication failed";
        }
        else if (res.status === 401) {
          // 認証失敗の場合
          throw "ユーザ名またはパスワードが違っています";
        } 
        else if (res.ok) {
          // 認証成功の場合
          return res.json();
        }
      })
      .then((data) => {
        // accessトークンをcokkieに設定する
        const options = { path: "/" };
        cookie.set("access_token", data.access, options);
      });

      // 認証が成功したらmain-pageに遷移するようにする
      router.push("/main-page");
    } catch (err) {
      // 何らかの例外の場合にアラートを表示
      // 例） ログイン失敗：authentication failed
      alert(err);
    }
  };

  /** submitが押された時の処理 */
  const authUser = async (e) => {
    // ブラウザがリロードされるのを防ぐ
    e.preventDefault();

    // submitボタンを押せなくする
    setIsResponced(true);

    if (isLogin) {
      // モードがloginの場合：ログイン処理を行う
      login();
    } else {
      // モードがregistore=登録の場合：ユーザ登録
      try {
        await fetch(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/register/`, {
          method: "POST",
          body: JSON.stringify({ username: username, password: password }),
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => {
          if (res.status === 400) {
            throw `authentication register failed \n reason => ${res.statusText}`;
          }
        });
        // 登録に成功すればそのままログインする
        login();
      } catch (err) {
        alert(err);
      }
    }

    // submitボタンを押せるようにする
    setIsResponced(false);
  };

  return (
    <div className="max-w-md w-full space-y-8">
      <div>
        <img className="mx-auto h-12 w-auto" 
          src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg" alt="Workflow" />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white-900">
          {isLogin ? "Sign in to your account" : "regist your account"}
        </h2>
      </div>
      <form className="mt-8 space-y-6" onSubmit={authUser}>
        <input type="hidden" name="remember" value="true" />
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <input 
              name="username" 
              type="text" 
              autoComplete="username" 
              required 
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
              placeholder="enter user name" 
              value={username}
              onChange={(e) => {
                // usernameステートに結びつける
                setUsername(e.target.value);
              }}
            />
          </div>
          <div>
            <input id="password" 
              ame="password" 
              type="password" 
              autoComplete="current-password" 
              required 
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
              placeholder="enter password" 
              value={password}
              onChange={(e) => {
                // passwordステートに結びつける
                setPassword(e.target.value);
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="text-sm">
            <span 
              onClick={() => { 
                // クリックによりモードを反転させる
                setIsLogin(!isLogin)
              } }
              className="cursor-pointer font-medium text-white hover:text-indigo-500"
            >
              change mode ?
            </span>
          </div>
        </div>

        <div>
          <button type="submit"
            disabled={isResponced}
            className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isResponced? " bg-gray-300" : " bg-indigo-600"}'
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              { /*<!-- Heroicon name: solid/lock-closed --> */ }
              <svg className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" 
                  clipRule="evenodd" />
              </svg>
            </span>
            {isLogin ? "Login with JWT" : "Create new user"}
          </button>
        </div>
      </form>
    </div>
    );
  }
