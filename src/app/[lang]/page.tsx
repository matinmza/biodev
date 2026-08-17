import { i18n } from "@/i18n/config";
import Desktop from "@/components/desktop/desktop";
import Wallpaper from "@/components/desktop/wallpaper";
import BootScreen from "@/components/desktop/boot-screen";

export async function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <BootScreen />
      <Wallpaper />
      <Desktop />
    </main>
  );
}
