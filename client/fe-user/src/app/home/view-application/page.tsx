"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Apple, 
  Play, 
  LogOut, 
  User,
  Building2,
  Mail,
  Phone,
  Eye,
  FileText,
  Calendar,
  MessageSquare
} from "lucide-react";

// Mock data for applications
const mockApplications = [
  {
    id: 1,
    type: "Đơn khiếu nại điểm danh( không bao gồm luk)",
    purpose: "Em đã tham gia seminar nhưng do lỗi hệ thống không thể điểm danh trên FAP, em xin được kiểm tra lại",
    createDate: "15/03/2025",
    processNote: "Đơn đề nghị điểm danh của em đã được đồng ý, phòng Tổ chức và Quản lý Đào tạo đã cập nhập trên FAP",
    file: "",
    status: "Approved",
    timestamp: "15/03/2025 20:54:11"
  },
  {
    id: 2,
    type: "Đề nghị phúc khảo",
    purpose: "Em đã hoàn thành bài tập nhưng không đạt điểm đậu môn học, đã học lại 2 lần, em xin được phúc khảo",
    createDate: "30/03/2024",
    processNote: "Điểm không đổi: 3.List all projects (1.5đ) và click on a link..(1.5₫)",
    file: "",
    status: "Rejected",
    timestamp: "09/04/2024 15:55:36"
  },
  {
    id: 3,
    type: "Các loại đơn khác",
    purpose: "Em muốn đăng kí mua bảo hiểm y tế",
    createDate: "12/10/2023",
    processNote: "Em liên hệ với phòng DVSV để được tư vấn, hỗ trợ nhé: dichvusinhvien@fe.edu.vn (024)7308.13.13",
    file: "",
    status: "Rejected",
    timestamp: "16/10/2023 09:11:32"
  }
];

export default function ViewApplicationPage() {
  const [applications] = useState(mockApplications);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
      case "Rejected":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      case "Pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-start">
            {/* Left side - Title and Navigation */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                FPT University Academic Portal
              </h1>
              <nav className="text-sm text-gray-600">
                <a href="#" className="hover:text-blue-600">Home</a>
                <span className="mx-2">|</span>
                <a href="#" className="hover:text-blue-600">View Application</a>
              </nav>
            </div>

            {/* Right side - App links, Support, User info */}
            <div className="flex items-center space-x-6">
              {/* Mobile App Links */}
              <div className="text-sm text-gray-600">
                <p className="mb-2">FAP mobile app (myFAP) is ready at</p>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="h-8">
                    <Apple className="w-4 h-4 mr-1" />
                    Available on the App Store
                  </Button>
                  <Button variant="outline" size="sm" className="h-8">
                    <Play className="w-4 h-4 mr-1" />
                    GET IT ON Google play
                  </Button>
                </div>
              </div>

              {/* Technical Support */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Hỗ trợ kỹ thuật FAP</p>
                <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto"></div>
              </div>

              {/* User Info */}
              <div className="text-right">
                <Badge variant="secondary" className="mb-1 bg-green-100 text-green-800">
                  <User className="w-3 h-3 mr-1" />
                  thangnmhe176363
                </Badge>
                <div className="flex items-center space-x-2 text-sm">
                  <Button variant="ghost" size="sm" className="h-6 text-red-600 hover:text-red-700">
                    <LogOut className="w-3 h-3 mr-1" />
                    logout
                  </Button>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    <Building2 className="w-3 h-3 mr-1" />
                    CAMPUS: FPTU-Hòa Lạc
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
              <FileText className="w-6 h-6 mr-2" />
              Thông tin xử lý đơn từ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-blue-50">
                    <TableHead className="font-semibold text-blue-900">TYPE</TableHead>
                    <TableHead className="font-semibold text-blue-900">PURPOSE</TableHead>
                    <TableHead className="font-semibold text-blue-900">CREATEDATE</TableHead>
                    <TableHead className="font-semibold text-blue-900">PROCESSNOTE</TableHead>
                    <TableHead className="font-semibold text-blue-900">FILE</TableHead>
                    <TableHead className="font-semibold text-blue-900">STATUS</TableHead>
                    <TableHead className="font-semibold text-blue-900">...</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow key={app.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-gray-900">
                        <div className="max-w-xs">
                          <Badge variant="outline" className="mb-1">
                            {app.type}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <div className="text-sm text-gray-700 leading-relaxed">
                          {app.purpose}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-1" />
                          {app.createDate}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <div className="text-sm text-gray-700 leading-relaxed">
                          {app.processNote}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-500">
                          {app.file || "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(app.status)}
                      </TableCell>
                      <TableCell>
                        <div className="text-xs text-gray-500">
                          {app.timestamp}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Summary Stats */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600">Approved</p>
                      <p className="text-2xl font-bold text-green-800">
                        {applications.filter(app => app.status === "Approved").length}
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">✓</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-red-600">Rejected</p>
                      <p className="text-2xl font-bold text-red-800">
                        {applications.filter(app => app.status === "Rejected").length}
                      </p>
                    </div>
                    <Badge className="bg-red-100 text-red-800">✗</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-yellow-600">Pending</p>
                      <p className="text-2xl font-bold text-yellow-800">
                        {applications.filter(app => app.status === "Pending").length}
                      </p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">⏳</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600">Total</p>
                      <p className="text-2xl font-bold text-blue-800">
                        {applications.length}
                      </p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">
                      <FileText className="w-3 h-3" />
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-between items-center">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Contact Support
                </Button>
              </div>
              <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
                <FileText className="w-4 h-4 mr-2" />
                Submit New Application
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Mọi góp ý, thắc mắc xin liên hệ: Phòng dịch vụ sinh viên:{" "}
              <a href="mailto:dichvusinhvien@fe.edu.vn" className="text-blue-600 hover:text-blue-800">
                <Mail className="w-3 h-3 inline mr-1" />
                dichvusinhvien@fe.edu.vn
              </a>
              .{" "}
              <a href="tel:02473081313" className="text-blue-600 hover:text-blue-800">
                <Phone className="w-3 h-3 inline mr-1" />
                Điện thoại: (024)7308.13.13
              </a>
            </p>
            <Separator />
            <p className="text-xs text-gray-500">
              © Powered by FPT University |{" "}
              <a href="#" className="hover:text-blue-600">CMS</a> |{" "}
              <a href="#" className="hover:text-blue-600">library</a> |{" "}
              <a href="#" className="hover:text-blue-600">books24x7</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 