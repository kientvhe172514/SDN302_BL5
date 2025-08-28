"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserRound, BookOpen, AppWindow } from "lucide-react";
import { useEffect, useState } from "react";
import { Dashboard } from "@/models/dashboard/dashboard.model";
import useSWR from "swr";
import { Endpoints } from "@/lib/endpoints";
import axiosService from "@/lib/services/config/axios.service";
import { url } from "inspector";
import { showErrorToast } from "@/components/common/toast/toast";
import Spinner from "@/components/common/spinner/spinner";
import Link from "next/link";

export default function Page() {
  const [statistical, setStatistical] = useState<Dashboard | null>(null);
  const fetcher = async (url: string) => {
    const res = await axiosService.getAxiosInstance().get(url);
    return res.data.data;
  };
  const { data, error, isLoading } = useSWR(
    `${Endpoints.Dashboard.GET_STATISTICAL}`,
    fetcher
  );

  useEffect(() => {
    if (data) {
      setStatistical(data);
    }
  }, [data]);

  if (error) {
    showErrorToast(error.message);
  }

  if (isLoading || !data) {
    <Spinner />;
  }
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="flex-1 p-8 space-y-8">
        {/* Welcome Section */}
        <div>
          <h2 className="text-2xl font-bold">Xin chào 👋</h2>
          <p className="text-gray-600">
            Chào mừng bạn đến với hệ thống quản lí sinh viên.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserRound className="w-5 h-5 text-orange-500" />
                Tổng số sinh viên và giảng viên
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{statistical?.userStatistic}</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-500" />
                Số lớp học
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{statistical?.classStatistic}</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AppWindow className="w-5 h-5 text-green-500" />
                Số đơn yêu cầu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{statistical?.applicationStatistic}</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Link href='/manage-user'>Thêm sinh viên</Link>
            </Button>
            <Button className="bg-blue-500 hover:bg-blue-600">
              <Link href='/manage-class'>Thêm lớp học</Link>
            </Button>
            <Button className="bg-green-500 hover:bg-green-600">
              <Link href='/timeschedule'>Xem lịch học</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
