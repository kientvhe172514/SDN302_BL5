"use client";
import { AddClassModal } from "@/components/common/modal/add-class";
import { EditClassModal } from "@/components/common/modal/edit-class";
import { NoData } from "@/components/common/nodata/no-data";
import PaginationConfig from "@/components/common/paging/pagination";
import Spinner from "@/components/common/spinner/spinner";
import { showErrorToast } from "@/components/common/toast/toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Endpoints } from "@/lib/endpoints";
import axiosService from "@/lib/services/config/axios.service";
import { Class } from "@/models/class/class.model";
import { BookOpen, GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";
import useSWR from "swr";

export default function Page() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [page, setPage] = useState<number>(1);
  const [filterSemester, setFilterSemester] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [idEdit, setIdEdit] = useState<string>("");
  const limit = 10;

  const fetcher = async (url: string) => {
    const res = await axiosService.getAxiosInstance().get(url);
    return res.data.data;
  };
  const { data, error, isLoading, mutate } = useSWR(
    `${Endpoints.Class.GET_ALL}?page=${page}&limit=${limit}&filter=${filterSemester}`,
    fetcher
  );

  useEffect(() => {
    if (data) {
      setClasses(data.classes);
    }
  }, [data]);

  const totalPages = data ? Math.ceil((data.total || 0) / limit) : 0;

  // Nếu filter thay đổi mà page > totalPages thì reset về 1
  useEffect(() => {
    if (page > totalPages) {
      setPage(1);
    }
  }, [filterSemester, totalPages]);

  if (error) {
    showErrorToast(error.message);
  }

  if (isLoading || !data) {
    return <Spinner />;
  }
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-blue-500" /> Quản lý lớp học
        </h1>
        <div className="flex items-center gap-3">
          {/* Add Class */}
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={() => setIsOpen(true)}>
            Add New Class
          </Button>

          {/* Filter semester */}
          <Select
            onValueChange={(value) => {
              if (value === "all") {
                setFilterSemester("");
              }
              setFilterSemester(value);
            }}
            value={filterSemester}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Kì học</SelectLabel>
                <SelectItem value="all">Tất cả học kỳ</SelectItem>
                <SelectItem value="Fall 2023">Fall 2023</SelectItem>
                <SelectItem value="Spring 2024">Spring 2024</SelectItem>
                <SelectItem value="Summer 2024">Summer 2024</SelectItem>
                <SelectItem value="Fall 2024">Fall 2024</SelectItem>
                <SelectItem value="Spring 2025">Spring 2025</SelectItem>
                <SelectItem value="Summer 2025">Summer 2025</SelectItem>
                <SelectItem value="Fall 2025">Fall 2025</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid danh sách lớp */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(classes) &&
          classes.map((cls) => (
            <Card
              key={cls._id}
              className="shadow-md hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  {cls.classCode}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Học kỳ:</span>
                  <p className="rounded-md border-1 bg-green-100">
                    {cls.semester}
                  </p>
                </div>
                <p>
                  <span className="font-semibold">Sĩ số tối đa:</span>{" "}
                  {cls.maxSize}
                </p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsEdit(true);
                    setIdEdit(cls._id);
                  }}>
                  Sửa
                </Button>
                <Button variant="destructive" size="sm">
                  Xóa
                </Button>
              </CardFooter>
            </Card>
          ))}
      </div>
      {classes.length > 0 && (
        <PaginationConfig
          total={filterSemester ? data.classes.length : data.pagination.total}
          skip={(page - 1) * limit}
          limit={limit}
          onPageChange={(newSkip) => {
            setPage(newSkip / limit + 1);
          }}
        />
      )}

      {!data && <NoData />}

      <AddClassModal open={isOpen} setOpen={setIsOpen} mutate={mutate} />

      <EditClassModal open={isEdit} setOpen={setIsEdit} mutate={mutate} id={idEdit}/>
    </div>
  );
}
