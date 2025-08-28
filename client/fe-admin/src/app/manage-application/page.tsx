"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { Application } from "@/models/application/application.model";
import axiosService from "@/lib/services/config/axios.service";
import useSWR from "swr";
import { Endpoints } from "@/lib/endpoints";
import { showErrorToast, showSuccessToast } from "@/components/common/toast/toast";
import { Constants } from "@/lib/constants";
import Spinner from "@/components/common/spinner/spinner";
import PaginationConfig from "@/components/common/paging/pagination";
import { NoData } from "@/components/common/nodata/no-data";
import { processApplication } from "@/lib/services/application/application.service";
import { FileText, CheckCircle, XCircle, Clock } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Page() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [token, setToken] = useState<string | null>(null);
  
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [applicationTypes, setApplicationTypes] = useState<{value: string, label: string}[]>([]);
  const limit = 10;

  // Alert dialog states
  const [alertOpen, setAlertOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    id: string;
    status: 'approved' | 'rejected';
    actionText: string;
  } | null>(null);

  useEffect(() => {
    const t = localStorage.getItem(Constants.API_TOKEN_KEY);
    setToken(t);
  }, []);

  // Fetch application types
  useEffect(() => {
    const fetchApplicationTypes = async () => {
      try {
        const response = await axiosService.getAxiosInstance().get(Endpoints.Application.GET_TYPES_ALL);
        if (response.data.success) {
          setApplicationTypes(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching application types:', error);
      }
    };
    
    fetchApplicationTypes();
  }, []);

  const [debouncedSearch, setDebouncedSearch] = useState<string>(search);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetcher = async (url: string) => {
    const res = await axiosService.getAxiosInstance().get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data;
  };

  const buildQueryParams = () => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    if (debouncedSearch) params.append('search', debouncedSearch);
    if (statusFilter) params.append('status', statusFilter);
    if (typeFilter) params.append('applicationType', typeFilter);
    
    return params.toString();
  };

  const { data, error, isLoading, mutate } = useSWR(
    token ? `${Endpoints.Application.GET_ALL}?${buildQueryParams()}` : null,
    fetcher
  );

  useEffect(() => {
    if (data) {
      setApplications(data.applications || []);
    }
  }, [data]);

  const totalPages = data ? Math.ceil((data.total || 0) / limit) : 0;

  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(1);
    }
  }, [totalPages]);

  const handleProcessApplication = (id: string, status: 'approved' | 'rejected') => {
    const actionText = status === 'approved' ? 'phê duyệt' : 'từ chối';
    setPendingAction({ id, status, actionText });
    setAlertOpen(true);
  };

  const confirmProcessApplication = async () => {
    if (!pendingAction) return;
    
    try {
      const response = await processApplication(pendingAction.id, pendingAction.status);
      if (response.success) {
        showSuccessToast(`Đã ${pendingAction.actionText} đơn thành công`);
        mutate();
      } else {
        showErrorToast(response.message || `Lỗi khi ${pendingAction.actionText} đơn`);
      }
    } catch (error) {
      showErrorToast(`Lỗi khi ${pendingAction.actionText} đơn`);
    } finally {
      setAlertOpen(false);
      setPendingAction(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="text-yellow-700 border-yellow-300 bg-yellow-50">
            <Clock className="w-3 h-3 mr-1" />
            Chờ xử lý
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50">
            <CheckCircle className="w-3 h-3 mr-1" />
            Đã phê duyệt
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="text-red-700 border-red-300 bg-red-50">
            <XCircle className="w-3 h-3 mr-1" />
            Đã từ chối
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (error) {
    showErrorToast(error.message);
  }

  if (isLoading || !data) {
    return <Spinner />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-500" />
            Quản lý đơn từ
          </h1>
          <p className="text-sm text-muted-foreground">
            Xem và xử lý các đơn từ của sinh viên trong hệ thống
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1">
          <Input
            placeholder="Tìm kiếm theo tên sinh viên, email..."
            className="w-full"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value === "all" ? "" : value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="pending">Chờ xử lý</SelectItem>
            <SelectItem value="approved">Đã phê duyệt</SelectItem>
            <SelectItem value="rejected">Đã từ chối</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={typeFilter}
          onValueChange={(value) => {
            setTypeFilter(value === "all" ? "" : value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Loại đơn" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại đơn</SelectItem>
            {applicationTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Table className="w-full border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead className="text-gray-700 font-semibold px-4 py-3">
              Sinh viên
            </TableHead>
            <TableHead className="text-gray-700 font-semibold px-4 py-3">
              Loại đơn
            </TableHead>
            <TableHead className="text-gray-700 font-semibold px-4 py-3">
              Lý do
            </TableHead>
            <TableHead className="text-gray-700 font-semibold px-4 py-3">
              Trạng thái
            </TableHead>
            <TableHead className="text-gray-700 font-semibold px-4 py-3">
              Ngày tạo
            </TableHead>
            <TableHead className="text-gray-700 font-semibold px-4 py-3">
              Thao tác
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application, i) => (
            <TableRow
              key={application._id}
              className={`${
                i % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-orange-50 transition-colors`}
            >
              <TableCell className="px-4 py-3">
                <div>
                  <div className="font-medium text-neutral-900">
                    {application.student.fullName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {application.student.email}
                  </div>
                </div>
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-600 text-sm">
                {applicationTypes.find(type => type.value === application.applicationType)?.label || application.applicationType}
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-600 text-sm max-w-xs">
                <div className="truncate" title={application.reason}>
                  {application.reason}
                </div>
              </TableCell>
              <TableCell className="px-4 py-3">
                {getStatusBadge(application.status)}
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-600 text-sm">
                {new Date(application.createdAt).toLocaleDateString('vi-VN')}
              </TableCell>
              <TableCell className="px-4 py-3">
                {application.status === 'pending' ? (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600 border-green-300 hover:bg-green-50"
                      onClick={() => handleProcessApplication(application._id, 'approved')}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Phê duyệt
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                      onClick={() => handleProcessApplication(application._id, 'rejected')}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Từ chối
                    </Button>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">
                    {application.processedBy ? (
                      <div>
                        <div>Xử lý bởi:</div>
                        <div className="font-medium">{application.processedBy.fullName}</div>
                      </div>
                    ) : (
                      'Đã xử lý'
                    )}
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {applications.length > 0 && (
        <PaginationConfig
          total={data.pagination?.total || data.total || 0}
          skip={(page - 1) * limit}
          limit={limit}
          onPageChange={(newSkip) => {
            setPage(newSkip / limit + 1);
          }}
        />
      )}

      {applications.length === 0 && <NoData />}

      {/* Confirmation Dialog */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận {pendingAction?.actionText}</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn {pendingAction?.actionText} đơn này không? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setAlertOpen(false);
              setPendingAction(null);
            }}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmProcessApplication}
              className={pendingAction?.status === 'approved' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
            >
              Có, {pendingAction?.actionText}!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}