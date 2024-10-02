import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { SUPPORTED_CHAINS } from "./across";

export const config = getDefaultConfig({
  appName: "Across toolkit demo",
  projectId: "YOUR_PROJECT_ID",
  chains: SUPPORTED_CHAINS,
  ssr: true,
});
