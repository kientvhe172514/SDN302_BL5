"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getMyWishlist, removeSubjectFromWishlist, Wishlist } from "@/lib/services/wishlist/wishlist.service";
import { useAuth } from "@/context/auth-context";

export default function ViewWishlistPage() {
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userInfo } = useAuth();

  useEffect(() => {
    if (userInfo?.userId) {
      console.log('User info found:', userInfo);
      fetchWishlist();
    } else {
      console.log('No user info available:', userInfo);
      setLoading(false);
    }
  }, [userInfo]);

  const fetchWishlist = async () => {
    if (!userInfo?.userId) {
      console.log('Client - No user info available, skipping fetch');
      setLoading(false);
      return;
    }

    console.log('Client - Fetching wishlist for user:', userInfo.userId);
    setLoading(true);
    setError(null);
    
    try {
      const response = await getMyWishlist(userInfo.userId);
      console.log('Client - Full API response:', JSON.stringify(response, null, 2));
      
      if (response && response.success) {
        console.log('Client - Wishlist data received:', JSON.stringify(response.data, null, 2));
        console.log('Client - Subjects array:', response.data?.subjects);
        console.log('Client - Subjects length:', response.data?.subjects?.length);
        
        // Check if subjects array exists and has items
        if (response.data?.subjects && Array.isArray(response.data.subjects)) {
          console.log('Client - Each subject:', response.data.subjects.map((s: any, i: number) => ({
            index: i,
            subject: s,
            hasSubjectCode: !!s?.subjectCode,
            hasName: !!s?.name
          })));
        }
        
        setWishlist(response.data);
      } else {
        console.log('Client - API response not successful:', response);
        setError(response?.message || "Không thể tải danh sách wishlist");
      }
    } catch (err: any) {
      console.error('Client - Error fetching wishlist:', err);
      setError(err?.message || "Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSubject = async (subjectId: string) => {
    if (!userInfo?.userId) return;
    
    try {
      const response = await removeSubjectFromWishlist(userInfo.userId, subjectId);
      
      if (response && response.success) {
        // Refresh the wishlist
        await fetchWishlist();
      } else {
        setError(response?.message || "Không thể xóa môn học");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi xóa môn học");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Đang tải...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Danh sách môn chờ xếp lớp</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <AlertDescription>
              Chú ý: Thao tác hủy môn trong danh sách chờ sinh viên chỉ nhận được 1/2 số tiền đăng ký
            </AlertDescription>
          </Alert>

          {wishlist && wishlist.subjects && wishlist.subjects.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SUBJECTCODE</TableHead>
                  <TableHead>STATUS</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wishlist.subjects.map((subject) => (
                  <TableRow key={subject._id}>
                    <TableCell className="font-medium">{subject.subjectCode}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Đã xếp lớp
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveSubject(subject._id)}
                      >
                        Hủy môn
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Chưa có môn học nào trong wishlist</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
