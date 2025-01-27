import Hero from "@/components/home/hero";
import HeaderAuth from "@/components/home/header-auth";
import { ThemeSwitcher } from "@/components/sidebar/theme-switcher";
import MongoDataPage from "@/components/mongo/mongodata";

export default async function Index() {
  return (
    <>
      <div className="h-dvh flex flex-col justify-stretch">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <h1 className="text-lg font-bold">Mailxl</h1>
            {/* <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
              @radix-ui/react-alert-dialog
            </code> */}
            <div>
              <HeaderAuth />
            </div>
          </div>
        </nav>
        {/* <MongoDataPage /> */}
        <Hero />

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-4">
          <p>
            Powered by{" "}
            <a
              href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Supabase
            </a>
          </p>
          <ThemeSwitcher />
        </footer>
      </div>
    </>
  );
}
