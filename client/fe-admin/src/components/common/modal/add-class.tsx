import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { showErrorToast, showSuccessToast } from "../toast/toast";
import { addClass } from "@/lib/services/class/class.service";
interface AddClassProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mutate: () => void;
}

const schema = z.object({
  classCode: z.string().regex(/^[A-Z0-9\s-]+$/, "Tên lớp không hợp lệ"),
  semester: z.string().nonempty("Bắt buộc chọn kì học cho lớp"),
  maxSize: z.number("Sĩ số phải là số").min(30, "Sĩ số tối thiểu là 30"),
});
export type FormValues = z.infer<typeof schema>;
export function AddClassModal({ open, mutate, setOpen }: AddClassProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      classCode: "",
      semester: "",
      maxSize: 30,
    },
  });

  const onSubmit = async (value: FormValues) => {
    try {
      const response = await addClass(value);
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
        setOpen(!true)
      }}>
      <form>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add new class</DialogTitle>
            <DialogDescription>
              Add new class to your system here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="classCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số học sinh</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="semester"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kì học</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a semester" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Kì học</SelectLabel>
                            <SelectItem value="all">Tất cả học kỳ</SelectItem>
                            <SelectItem value="Fall 2023">Fall 2023</SelectItem>
                            <SelectItem value="Spring 2024">
                              Spring 2024
                            </SelectItem>
                            <SelectItem value="Summer 2024">
                              Summer 2024
                            </SelectItem>
                            <SelectItem value="Fall 2024">Fall 2024</SelectItem>
                            <SelectItem value="Spring 2025">
                              Spring 2025
                            </SelectItem>
                            <SelectItem value="Summer 2025">
                              Summer 2025
                            </SelectItem>
                            <SelectItem value="Fall 2025">Fall 2025</SelectItem>
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
