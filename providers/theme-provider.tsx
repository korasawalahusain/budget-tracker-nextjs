import { ThemeProvider } from "next-themes";
import React, { PropsWithChildren } from "react";

type Props = {};

export default function Provider({ children }: PropsWithChildren<Props>) {
  return (
    <ThemeProvider
      enableSystem
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange={false}
    >
      {children}
    </ThemeProvider>
  );
}
