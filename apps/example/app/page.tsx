import { Header, Bridge } from "./viem/components";
import { Providers } from "./viem/providers";

export default function Home() {
  return (
    <Providers>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-start px-3 sm:px-6 pt-36">
        <Bridge />
      </main>
    </Providers>
  );
}
