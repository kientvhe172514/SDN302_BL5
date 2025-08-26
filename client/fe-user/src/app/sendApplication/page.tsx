"use client";

import { useState, useEffect } from "react";
import { 
  Download, 
  FileText, 
  AlertCircle,
  CheckCircle,
  Loader2
} from "lucide-react";
import { getApplicationCategories, createApplication, ApplicationCategory } from "@/lib/services/application/application.service";

export default function ApplicationPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [applicationType, setApplicationType] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [categories, setCategories] = useState<ApplicationCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load application categories on component mount
  useEffect(() => {
    loadApplicationCategories();
  }, []);

  const loadApplicationCategories = async () => {
    try {
      setIsLoading(true);
      const response = await getApplicationCategories();
      if (response.success && response.data) {
        setCategories(response.data);
      } else {
        setMessage({ type: 'error', text: 'Không thể tải danh sách loại đơn' });
      }
    } catch (error) {
      console.error('Error loading application categories:', error);
      setMessage({ type: 'error', text: 'Không thể tải danh sách loại đơn' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setApplicationType(""); // Reset application type when category changes
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!applicationType || !reason.trim()) {
      setMessage({ type: 'error', text: 'Vui lòng chọn loại đơn và nhập lý do' });
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage(null);
      debugger
      
      const response = await createApplication({
        applicationType,
        reason: reason.trim()
      });

      if (response.success) {
        setMessage({ type: 'success', text: 'Đơn đã được gửi thành công!' });
        
        // Reset form
        setApplicationType("");
        setReason("");
        setSelectedFile(null);
      } else {
        setMessage({ 
          type: 'error', 
          text: response.message || 'Có lỗi xảy ra khi gửi đơn. Vui lòng thử lại.' 
        });
      }
      
    } catch (error: any) {
      console.error('Error submitting application:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Có lỗi xảy ra khi gửi đơn. Vui lòng thử lại.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentCategoryTypes = () => {
    if (selectedCategory === 'ALL') {
      const all = categories.flatMap(c => c.types);
      const dedup = Array.from(new Map(all.map(t => [t.value, t])).values());
      return dedup;
    }
    const category = categories.find(cat => cat.category === selectedCategory);
    return category ? category.types : [];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">

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

            {/* Message Display */}
            {message && (
              <div className={`rounded-lg p-4 ${
                message.type === 'success' 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center">
                  {message.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  )}
                  <span className={`text-sm font-medium ${
                    message.type === 'success' ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {message.text}
                  </span>
                </div>
              </div>
            )}

            {/* Application Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Selector */}
              <div className="space-y-2">
                <label htmlFor="category" className="block text-base font-medium text-gray-700">
                  Danh mục đơn:
                </label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                >
                  <option value="ALL">Tất cả danh mục</option>
                  {isLoading ? (
                    <option>Đang tải...</option>
                  ) : (
                    categories.map(category => (
                      <option key={category.category} value={category.category}>
                        {category.label}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Application Type */}
              <div className="space-y-2">
                <label htmlFor="application-type" className="block text-base font-medium text-gray-700">
                  Loại đơn:
                </label>
                <select
                  id="application-type"
                  value={applicationType}
                  onChange={(e) => setApplicationType(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                >
                  <option value="">Chọn loại đơn</option>
                  {getCurrentCategoryTypes().map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reason */}
              <div className="space-y-2">
                <label htmlFor="reason" className="block text-base font-medium text-gray-700">
                  Lý do:
                </label>
                <textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Nhập lý do của bạn..."
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px] resize-y disabled:bg-gray-100"
                />
              </div>

              {/* File Attachment */}
              <div className="space-y-3">
                <label className="block text-base font-medium text-gray-700">File đính kèm:</label>
                <div className="flex items-center space-x-3">
                  <label htmlFor="file-upload" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                    Chọn tệp
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".xlsx,.pdf,.docx,.doc,.xls,.jpg,.png,.zip"
                    disabled={isSubmitting}
                  />
                  <span className="text-sm text-gray-500">
                    {selectedFile ? selectedFile.name : "Không có tệp nào được chọn"}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Định dạng file: &quot;xlsx&quot;, &quot;pdf&quot;, &quot;docx&quot;, &quot;doc&quot;, &quot;xls&quot;, &quot;jpg&quot;, &quot;png&quot;,&quot;zip&quot;.</p>
                </div>
                <button 
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Tải mẫu đơn tại đây
                </button>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      Gửi đơn
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

    </div>
  );
}