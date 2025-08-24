"use client";

import { useState, useEffect } from "react";
import { 
  FileText,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import applicationService, { Application } from "@/lib/services/application/application.service";

export default function ViewApplicationPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Load applications on component mount
  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await applicationService.getMyApplications();
      setApplications(data);
    } catch (error: unknown) {
      console.error('Error loading applications:', error);
      const errorMessage = error instanceof Error ? error.message : 'Không thể tải danh sách đơn';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Đã duyệt
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Từ chối
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            Chờ xử lý
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getApplicationTypeLabel = (type: string) => {
    const typeLabels: { [key: string]: string } = {
      'attendance_exemption': 'Đề nghị miễn điểm danh',
      'transcript_request': 'Đề nghị cấp bảng điểm quá trình',
      'credit_transfer': 'Đề nghị chuyển đổi tín chỉ',
      'course_switch': 'Đề nghị chuyển từ học Võ sang học Cờ',
      'grade_review': 'Đề nghị phúc khảo',
      'improvement_exam': 'Đăng ký thi cải thiện điểm',
      'other_applications': 'Các loại đơn khác',
      'withdrawal_request': 'Đơn đề nghị thôi học',
      'major_transfer': 'Đề nghị chuyển ngành',
      'campus_transfer': 'Đề nghị chuyển cơ sở',
      'online_course_assessment': 'Đăng ký thi thẩm định các môn học online',
      'money_withdrawal': 'Đơn đề nghị rút tiền',
      'course_transfer_refund': 'Đơn đề nghị hoàn tiền chuyển đổi môn học',
      'attendance_complaint': 'Đơn khiếu nại điểm danh (không bao gồm luk)',
      'topj_registration': 'Đơn đăng ký TOP-J',
      'readmission_request': 'Đơn xin nhập học trở lại',
      'luk_attendance_support': 'Đơn đề nghị hỗ trợ kiểm tra trạng thái điểm danh LUK',
      'specialized_combo_change': 'Đề nghị đổi combo chuyên sâu',
      'early_graduation': 'Đơn đề nghị xét tốt nghiệp sớm',
      'thesis_postponement': 'Xin tạm hoãn khóa luận tốt nghiệp',
      'course_withdrawal': 'Rút môn học',
      'leave_of_absence': 'Bảo lưu',
      'suspension': 'Đình chỉ học'
    };
    return typeLabels[type] || type;
  };

  const handleViewDetail = (application: Application) => {
    setSelectedApplication(application);
    setShowDetailModal(true);
  };

  const handleDeleteApplication = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa đơn này?')) {
      return;
    }

    try {
      await applicationService.deleteApplication(id);
      await loadApplications(); // Reload the list
    } catch (error: unknown) {
      console.error('Error deleting application:', error);
      alert('Có lỗi xảy ra khi xóa đơn');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Đang tải danh sách đơn...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-600" />
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadApplications}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

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
            {applications.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có đơn nào</h3>
                <p className="text-gray-500">Bạn chưa gửi đơn nào. Hãy tạo đơn mới để bắt đầu.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">LOẠI ĐƠN</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">LÝ DO</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">NGÀY TẠO</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">NGƯỜI XỬ LÝ</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">TRẠNG THÁI</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">THAO TÁC</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applications.map((app) => (
                      <tr key={app._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="max-w-xs">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200 mb-1">
                              {getApplicationTypeLabel(app.applicationType)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-md text-sm text-gray-700 leading-relaxed">
                            {app.reason}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(app.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-700">
                            {app.processedBy ? (
                              <div>
                                <div className="font-medium">{app.processedBy.name}</div>
                                <div className="text-gray-500">{app.processedBy.role}</div>
                              </div>
                            ) : (
                              <span className="text-gray-400">Chưa xử lý</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(app.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewDetail(app)}
                              className="text-blue-600 hover:text-blue-900 p-1"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {app.status === 'pending' && (
                              <>
                                <button
                                  className="text-yellow-600 hover:text-yellow-900 p-1"
                                  title="Chỉnh sửa"
                                  aria-label="Chỉnh sửa đơn"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteApplication(app._id)}
                                  className="text-red-600 hover:text-red-900 p-1"
                                  title="Xóa"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Detail Modal */}
      {showDetailModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Chi tiết đơn</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
                title="Đóng"
                aria-label="Đóng modal"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Loại đơn:</label>
                <p className="mt-1 text-sm text-gray-900">
                  {getApplicationTypeLabel(selectedApplication.applicationType)}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Lý do:</label>
                <p className="mt-1 text-sm text-gray-900">{selectedApplication.reason}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Trạng thái:</label>
                <div className="mt-1">{getStatusBadge(selectedApplication.status)}</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Ngày tạo:</label>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDateTime(selectedApplication.createdAt)}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Cập nhật lần cuối:</label>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDateTime(selectedApplication.updatedAt)}
                </p>
              </div>
              
              {selectedApplication.processedBy && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Người xử lý:</label>
                  <div className="mt-1 text-sm text-gray-900">
                    <p><strong>Tên:</strong> {selectedApplication.processedBy.name}</p>
                    <p><strong>Email:</strong> {selectedApplication.processedBy.email}</p>
                    <p><strong>Vai trò:</strong> {selectedApplication.processedBy.role}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 