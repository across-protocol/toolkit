import { Header, BridgeOrAction } from "./viem/components";
import { Providers } from "./viem/providers";

export default function Home() {
  return (
    <Providers>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-start px-3 sm:px-6 py-36">
        <BridgeOrAction />
      </main>
    </Providers>
  );
}
