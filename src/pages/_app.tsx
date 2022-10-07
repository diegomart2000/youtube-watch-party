import "styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "components/Session";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <div className="container flex mx-auto h-screen p-6">
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
}

export default MyApp;
