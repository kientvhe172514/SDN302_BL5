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
import { addClass, updateClass } from "@/lib/services/class/class.service";
import { useEffect, useState } from "react";
import { Class } from "@/models/class/class.model";
import axiosService from "@/lib/services/config/axios.service";
import useSWR from "swr";
import { Endpoints } from "@/lib/endpoints";
import { Subject } from "@/models/subject";
interface AddClassProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mutate: () => void;
  id: string;
}

const schema = z.object({
  classCode: z.string().regex(/^[A-Z0-9\s-]+$/, "Tên lớp không hợp lệ"),
  semester: z.string().nonempty("Bắt buộc chọn kì học cho lớp"),
  subject: z.string().nonempty("Bắt buộc chọn môn học cho lớp"),
  maxSize: z.number("Sĩ số phải là số").min(30, "Sĩ số tối thiểu là 30").max(70,"Sĩ số tối đa là 70"),
});
export type FormValues = z.infer<typeof schema>;
export function EditClassModal({ open, mutate, setOpen, id }: AddClassProps) {
  const [classEdit, setClassEdit] = useState<Class | null>(null);
  const [subjects, setSubject] = useState<Subject[]>([]);
  const fetcher = async (url: string) => {
    const res = await axiosService.getAxiosInstance().get(url);
    return res.data.data;
  };
  const { data, error, isLoading } = useSWR(
    `${Endpoints.Class.GET_BY_ID(id)}`,
    fetcher
  );

  const {
    data: dataSubject,
    error: errSubject,
    isLoading: isLoadingSubject,
  } = useSWR(`${Endpoints.Subject.GET_ALL}`, fetcher);

  useEffect(() => {
    if (data) {
      setClassEdit(data);
    }
  }, [data]);

  useEffect(() => {
    if (dataSubject) {
      setSubject(dataSubject.subjects);
    }
  }, [dataSubject]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      classCode: "",
      semester: "",
      subject: "",
      maxSize: 30,
    },
  });

  useEffect(() => {
    if (classEdit) {
      form.reset({
        classCode: classEdit.classCode,
        maxSize: classEdit.maxSize,
        subject: classEdit.subject?._id ?? "", // lấy _id của subject
        semester: classEdit.semester ?? "",
      });
    }
  }, [classEdit]);

  const onSubmit = async (value: FormValues) => {
    try {
      const response = await updateClass(value,id);
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
            <DialogTitle>Edit Class</DialogTitle>
            <DialogDescription>
              Edit class to your system here. Click save when you&apos;re done.
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
                      <Input
                        {...field}
                        value={field.value}
                      />
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
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Môn học</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a semester" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Môn học</SelectLabel>
                            {Array.isArray(subjects) &&
                              subjects.map((e) => (
                                <SelectItem value={e._id} key={e._id}>
                                  {e.subjectCode}
                                </SelectItem>
                              ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
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
