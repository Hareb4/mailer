import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function AuthButton() {
  return (
    <>
      <div className="flex gap-4 items-center">
        {/* <div>
          <Badge variant={"default"} className="font-normal">
            Please update .env.local file with anon key and url
          </Badge>
        </div> */}
        <div className="flex gap-2">
          <Button size="sm" variant={"outline"}>
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button size="sm" variant={"default"}>
            <Link href="/sign-up">Sign up</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
