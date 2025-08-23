"use client";

import { useState } from "react";
import { 
  Apple, 
  Play, 
  LogOut, 
  Download, 
  FileText, 
  User,
  Building2,
  Mail,
  Phone
} from "lucide-react";

export default function ApplicationPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [applicationType, setApplicationType] = useState<string>("");
  const [reason, setReason] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
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
                <a href="#" className="hover:text-blue-600">Gửi đơn</a>
              </nav>
            </div>

            {/* Right side - App links, Support, User info */}
            <div className="flex items-center space-x-6">
              {/* Mobile App Links */}
              <div className="text-sm text-gray-600">
                <p className="mb-2">FAP mobile app (myFAP) is ready at</p>
                <div className="flex space-x-2">
                  <button className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <Apple className="w-4 h-4 mr-1" />
                    Available on the App Store
                  </button>
                  <button className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <Play className="w-4 h-4 mr-1" />
                    GET IT ON Google play
                  </button>
                </div>
              </div>

              {/* Technical Support */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Hỗ trợ kỹ thuật FAP</p>
                <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto"></div>
              </div>

              {/* User Info */}
              <div className="text-right">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-1">
                  <User className="w-3 h-3 mr-1" />
                  thangnmhe176363
                </span>
                <div className="flex items-center space-x-2 text-sm">
                  <button className="inline-flex items-center text-red-600 hover:text-red-700 focus:outline-none">
                    <LogOut className="w-3 h-3 mr-1" />
                    logout
                  </button>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                    <Building2 className="w-3 h-3 mr-1" />
                    CAMPUS: FPTU-Hòa Lạc
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">
              Send an application to Academic Administration dept (Gửi đơn cho Phòng quản lý đào tạo)
            </h2>
          </div>
          <div className="p-6 space-y-6">
            {/* Note Section */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">Lưu ý</h3>
              <div className="text-sm text-yellow-700 space-y-1">
                <p>• Processing within 48 hours (except for withdrawal, re-examination, transfer applications).</p>
                <p>• SPAM policy: If a student sends N applications/emails (N&gt;1) for the same request, the response time will be Nx48h.</p>
                <p>• Students should consider carefully before sending applications/emails with the same content to ensure the quickest resolution.</p>
              </div>
            </div>

            {/* Account Balance */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 font-medium">
                Account balance (Số dư tài khoản): <span className="font-bold">0 VNĐ</span>
              </p>
            </div>

            {/* Application Form */}
            <div className="space-y-6">
              {/* Application Type */}
              <div className="space-y-2">
                <label htmlFor="application-type" className="block text-base font-medium text-gray-700">
                  Application type:
                </label>
                <select
                  id="application-type"
                  value={applicationType}
                  onChange={(e) => setApplicationType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose Application Type (Chọn loại đơn)</option>
                  <option value="withdrawal">Withdrawal Application</option>
                  <option value="reexamination">Re-examination Application</option>
                  <option value="transfer">Transfer Application</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Reason */}
              <div className="space-y-2">
                <label htmlFor="reason" className="block text-base font-medium text-gray-700">
                  Reason (Lý do):
                </label>
                <textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter your reason here..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px] resize-y"
                />
              </div>

              {/* File Attachment */}
              <div className="space-y-3">
                <label className="block text-base font-medium text-gray-700">File Attach:</label>
                <div className="flex items-center space-x-3">
                  <label htmlFor="file-upload" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
                    Chọn tệp
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".xlsx,.pdf,.docx,.doc,.xls,.jpg,.png,.zip"
                  />
                  <span className="text-sm text-gray-500">
                    {selectedFile ? selectedFile.name : "Không có tệp nào được chọn"}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Extension File: &quot;xlsx&quot;, &quot;pdf&quot;, &quot;docx&quot;, &quot;doc&quot;, &quot;xls&quot;, &quot;jpg&quot;, &quot;png&quot;,&quot;zip&quot;.</p>
                </div>
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <Download className="w-4 h-4 mr-2" />
                  Tải mẫu đơn tại đây
                </button>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  <FileText className="w-4 h-4 mr-2" />
                  Submit Application
                </button>
              </div>
            </div>
          </div>
        </div>
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
            <hr className="border-gray-200" />
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