import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail } from "lucide-react";
import Image from "next/image";

export default function Page() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex justify-center items-center">
        <Image alt="FPT" src={"/2021-FPTU-Eng.jpg"} width={200} height={20} />
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2 relative w-full">
              <Label htmlFor="email">Email</Label>
              <Mail className="absolute left-3 top-10 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="email"
                type="email"
                required
                placeholder="Nhập email"
                className="pl-10" // chừa khoảng trống để icon không đè chữ
              />
            </div>
            <div className="grid gap-2 relative w-full">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Lock className="absolute left-3 top-10 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input id="password" type="password" placeholder="Nhập password" required className="pl-10" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full">
          Login
        </Button>
      </CardFooter>
    </Card>
  );
}
