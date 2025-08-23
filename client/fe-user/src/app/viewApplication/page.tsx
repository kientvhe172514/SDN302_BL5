"use client";

import { useState } from "react";
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
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">Approved</span>;
      case "Rejected":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">Rejected</span>;
      case "Pending":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">Pending</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <FileText className="w-6 h-6 mr-2" />
              Thông tin xử lý đơn từ
            </h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">TYPE</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">PURPOSE</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">CREATEDATE</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">PROCESSNOTE</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">FILE</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">STATUS</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">...</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="max-w-xs">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200 mb-1">
                            {app.type}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-md text-sm text-gray-700 leading-relaxed">
                          {app.purpose}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-1" />
                          {app.createDate}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-md text-sm text-gray-700 leading-relaxed">
                          {app.processNote}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {app.file || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(app.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs text-gray-500">
                          {app.timestamp}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Stats */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600">Approved</p>
                    <p className="text-2xl font-bold text-green-800">
                      {applications.filter(app => app.status === "Approved").length}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">✓</span>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-600">Rejected</p>
                    <p className="text-2xl font-bold text-red-800">
                      {applications.filter(app => app.status === "Rejected").length}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">✗</span>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-yellow-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-800">
                      {applications.filter(app => app.status === "Pending").length}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">⏳</span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600">Total</p>
                    <p className="text-2xl font-bold text-blue-800">
                      {applications.length}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <FileText className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-between items-center">
              <div className="flex space-x-2">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Contact Support
                </button>
              </div>
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <FileText className="w-4 h-4 mr-2" />
                Submit New Application
              </button>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
} 