"use client";
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AxiosError } from "axios";
import { showErrorToast } from "@/components/common/toast/toast";
import { Constants } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { login } from "@/lib/services/auth/auth.service";
const schema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z
    .string()
    .min(8, "Mật khẩu ít nhất 8 ký tự")
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
      "có ít nhất 1 kí tự đặc biệt và 1 chữ hoa và số"
    ),
});

export type FormValues = z.infer<typeof schema>;
export default function Page() {
  const router = useRouter()
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (value: FormValues) => {
    try {
      debugger
      const response = await login(value);
      if(response.success){
        localStorage.setItem(Constants.API_TOKEN_KEY,response.access_token)
        router.replace('/')
      }else{
        showErrorToast(response.message)
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        showErrorToast(error.response?.data?.message || error.message);
      } else {
        showErrorToast("Lỗi không xác định");
      }
    }
  };
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex justify-center items-center">
        <Image alt="FPT" src={"/2021-FPTU-Eng.jpg"} width={200} height={20} />
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="example@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full mt-4">
              Login
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
