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
import { useAuth } from "@/context/auth-context";
import profileService from "@/lib/services/profile/profile.service";
import { setCurrentUser } from "@/utils/getCurrentUser";
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
  const router = useRouter();
  const { loginSuccess } = useAuth();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (value: FormValues) => {
    try {
      const response = await login(value);
      if (response.success) {
        // Lưu token và cập nhật auth context
        loginSuccess(response.access_token);

        // Lưu thông tin user từ response vào currentUser
        if (response.user) {
          setCurrentUser(response.user);
        } else {
          // Fallback: lấy thông tin profile từ API
          try {
            const profileResponse = await profileService.getProfile();
            if (profileResponse.success && profileResponse.data) {
              setCurrentUser(profileResponse.data);
            }
          } catch (profileError) {
            console.log("Failed to fetch profile on login:", profileError);
          }
        }

        router.replace("/");
      } else {
        showErrorToast(response.message);
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
