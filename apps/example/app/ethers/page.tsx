import { Providers } from "./providers";
import { Header } from "./components/Header";
import { Bridge } from "./components/Bridge";

export default function Ethers() {
  return (
    <Providers>
      <Header />
      <main className="flex gap-2 text-sm min-h-screen max-w-[800px] min-w-[600px] mx-auto flex-col items-center justify-start p-24">
        <Bridge />
      </main>
    </Providers>
  );
}
