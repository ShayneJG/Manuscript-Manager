import "@/styles/globals.css";
import type { AppProps } from "next/app";
import type { Session } from "next-auth";

import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import Header from "@/components/page/header";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  //wrappers for chakra and nextAuth (SessionProvider)
  //do not add anything but wrappers
  return (
    <ChakraProvider>
      <SessionProvider session={session}>
        <div className={`min-h-screen py-16 px-24 bg-background`}>
          <Header />
          <Component {...pageProps} />
        </div>
      </SessionProvider>
    </ChakraProvider>
  );
}
