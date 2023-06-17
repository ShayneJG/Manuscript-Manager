import "@/styles/globals.css";
import type { AppProps } from "next/app";
import type { Session } from "next-auth";

import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <ChakraProvider>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </ChakraProvider>
  );
}
