import { Header } from "./viem/components";
import { Providers } from "./viem/providers";

export default function Home() {
  return (
    <Providers>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div></div>
      </main>
    </Providers>
  );
}
