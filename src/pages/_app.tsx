import '../styles/globals.css';
import '../styles/styles.css';
import 'tailwindcss/tailwind.css';
import type { AppProps } from 'next/app';

import Head from 'next/head';
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>異種シミュレーション比較サイト（益城）</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
