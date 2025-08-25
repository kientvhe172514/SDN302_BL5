import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { addUser } from "@/lib/services/user/user.service";
import { showErrorToast, showSuccessToast } from "../toast/toast";
import { AxiosError } from "axios";
import React from "react";
import { Calendar22 } from "../calendar/calendar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
interface AddUserProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mutate: () => void;
}
const schema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z
    .string()
    .min(8, "Mật khẩu ít nhất 8 ký tự")
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
      "có ít nhất 1 kí tự đặc biệt và 1 chữ hoa và số"
    ),
  fullName: z
    .string()
    .max(30, "Tên tối thiểu 2 ký tự")
    .regex(/^[A-Za-z\s]+$/, "Tên chỉ được chứa chữ cái và khoảng trắng"),
  dateOfBirth: z.string().nonempty("Vui lòng nhập ngày sinh"),
  phoneNumber: z
    .string()
    .regex(/^0\d{9}$/, "Số điện thoại không hợp lệ")
    .max(10, "Số điện thoại phải có 10 chữ số")
    .min(10, "Số điện thoại phải có 10 chữ số"),
  role: z.string(),
});
export type FormValues = z.infer<typeof schema>;
export function AddUserModal({ open, mutate, setOpen }: AddUserProps) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      dateOfBirth: "",
      phoneNumber: "",
      role: "",
    },
  });
  const onSubmit = async (value: FormValues) => {
    try {
      debugger;
      const response = await addUser(value);
      console.log(response);
      if (response.success) {
        setOpen(false);
        showSuccessToast(response.message);
        mutate();
        return;
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
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          form.reset();
        }
        setOpen(!true);
      }}>
      <form>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add new user</DialogTitle>
            <DialogDescription>
              Add new user to your system here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Calendar22
                        value={field.value ? new Date(field.value) : undefined}
                        onChange={(date) => field.onChange(date.toISOString())}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Role</SelectLabel>
                            <SelectItem value="teacher">Teacher</SelectItem>
                            <SelectItem value="student">Student</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </form>
    </Dialog>
  );
}
