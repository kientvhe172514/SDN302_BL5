"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserRound, BookOpen,AppWindow } from "lucide-react";

export default function Page() {
  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Main Content */}
      <main className="flex-1 p-8 space-y-8">
        {/* Welcome Section */}
        <div>
          <h2 className="text-2xl font-bold">Xin chào 👋</h2>
          <p className="text-gray-600">Chào mừng bạn đến với hệ thống quản lí sinh viên.</p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserRound className="w-5 h-5 text-orange-500" />
                Tổng số sinh viên
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">1,250</p>
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
              <p className="text-3xl font-bold">48</p>
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
              <p className="text-3xl font-bold">50</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button className="bg-orange-500 hover:bg-orange-600">Thêm sinh viên</Button>
            <Button className="bg-blue-500 hover:bg-blue-600">Thêm lớp học</Button>
            <Button className="bg-green-500 hover:bg-green-600">Xem lịch học</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
