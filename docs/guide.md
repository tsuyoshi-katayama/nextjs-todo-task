### セクション4: Nextjs Project 2 (Blog + Todos編)

#### 全体構成
![](res/1.png)

#### 1. create-next-app
##### 1-1 nextjs 構築
```sh
npx create-next-app . --use-npm
```

- npxコマンド  
  - 必要なpackage.jsonを自動で作ってくれる

- create-next-appコマンド
  - nextjsのプロジェクトを作成
  - --use-npmパラメータ
    - npmを使用することを明示的に設定
  - --typescriptパラメータ
    - typescriptを利用する

##### 1-2 tailwindcss 構築

[参考URL：Install Tailwind CSS with Next.js](https://tailwindcss.com/docs/guides/nextjs)

~~~sh
$ npm install -D tailwindcss@latest postcss@latest autoprefixer@latest
~~~

-  configuration filesの作成
    ```sh
    $ npx tailwindcss init -p
    ```
- Configure Tailwind to remove unused styles in production
  ~~~diff JavaScript
  // tailwind.config.js
  module.exports = {
  - purge: [],
  + purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    darkMode: false, // or 'media' or 'class'
    theme: {
      extend: {},
    },
    variants: {
      extend: {},
    },
    plugins: [],
  }
  ~~~

- Import Tailwind directly in your JS
  ~~~diff JavaScript
    // pages/_app.js
     import '../styles/globals.css'
  +   import 'tailwindcss/tailwind.css'

    function MyApp({ Component, pageProps }) {
        return <Component {...pageProps} />
    }

    export default MyApp
  ~~~
  または
  ~~~diff CSS
  /* ./styles/globals.css */
  + @tailwind base;
  + @tailwind components;
  + @tailwind utilities;
  ~~~

  ##### 1-3 nextjs 起動

  ~~~sh
  $ npm run dev
  ~~~

  - 下記のURLで見れる
  ~~~HTML
  http://localhost:3000
  ~~~

  ##### 1-4 基本構築

  - Layout作成
    - componets/Layout.js

  - Auth（ログイン）コンポーネントの作成（事前準備）
    - componets/Auth.js