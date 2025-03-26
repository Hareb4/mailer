import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex h-screen bg-background text-foreground">
        <div className="bg-Authimag bg-cover bg-no-repeat w-1/2 flex flex-col justify-between p-10 bg-foreground text-foreground">
          <div className="text-left">
            <div className="flex items-center text-gray-300 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <Link href="/">Back to Home</Link>
            </div>
            <h1 className="text-2xl font-semibold">Sobha Mailer</h1>
          </div>
          <div className="text-center mb-10">
            <p className="text-lg italic">
              "Empowering you, one step at a time."
            </p>
          </div>
        </div>
        <div className="w-1/2 flex items-center justify-center p-10">
          {children}
        </div>
      </div>
    </>
  );
}
