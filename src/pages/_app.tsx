import '../styles/globals.css';
import type { AppType } from 'next/app';
import Head from 'next/head';
import { trpc } from '../utils/trpc';

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Discord dashboard</title>
        <link
          type="image/png"
          sizes="16x16"
          rel="icon"
          href="/discord-favicon.png"
        ></link>
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default trpc.withTRPC(MyApp);
