"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createOrUpdateWishlist, addSubjectsToWishlist } from "@/lib/services/wishlist/wishlist.service";
import { useAuth } from "@/context/auth-context";

export default function RegisterWishlistPage() {
  const [subjectCode, setSubjectCode] = useState("");
  const [semester, setSemester] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const { userInfo } = useAuth();

  useEffect(() => {
    console.log('RegisterWishlist - User info:', userInfo);
  }, [userInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userInfo?.userId) {
      setMessage({ type: "error", text: "Vui lòng đăng nhập để sử dụng tính năng này" });
      return;
    }

    if (!subjectCode.trim() || !semester.trim()) {
      setMessage({ type: "error", text: "Vui lòng nhập đầy đủ thông tin" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      console.log('Attempting to register wishlist for user:', userInfo.userId);
      console.log('Subject code:', subjectCode.trim());
      console.log('Semester:', semester.trim());
      
      // First, try to add the subject to existing wishlist
      const addResponse = await addSubjectsToWishlist(userInfo.userId, {
        subjectIds: [subjectCode.trim()]
      });
      
      console.log('Add subjects response:', addResponse);

      if (addResponse && addResponse.success) {
        setMessage({ type: "success", text: "Đăng ký môn học thành công!" });
        setSubjectCode("");
      } else {
        // If adding fails, try to create a new wishlist
        console.log('Adding failed, trying to create new wishlist...');
        const createResponse = await createOrUpdateWishlist({
          student: userInfo.userId,
          subjects: [subjectCode.trim()],
          semester: semester.trim()
        });
        
        console.log('Create wishlist response:', createResponse);

        if (createResponse && createResponse.success) {
          setMessage({ type: "success", text: "Đăng ký môn học thành công!" });
          setSubjectCode("");
          setSemester("");
        } else {
          setMessage({ type: "error", text: createResponse?.message || "Không thể đăng ký môn học" });
        }
      }
    } catch (err: any) {
      console.error('Error in wishlist registration:', err);
      setMessage({ type: "error", text: err?.message || "Có lỗi xảy ra khi đăng ký môn học" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Đăng ký wishlist</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="subjectCode" className="text-sm font-medium">
                Mã môn học (SubjectCode)
              </label>
              <Input
                id="subjectCode"
                type="text"
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
                placeholder="Nhập mã môn học..."
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="semester" className="text-sm font-medium">
                Học kỳ
              </label>
              <Input
                id="semester"
                type="text"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                placeholder="Ví dụ: Fall 2025"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? "Đang đăng ký..." : "Đăng ký"}
            </Button>
          </form>

          <Alert className="mt-6">
            <AlertDescription className="text-sm">
              <div className="space-y-2">
                <p>
                  Từ ngày 14/8/2023, sinh viên muốn rút khỏi danh sách chờ học lại (Wish list-WL) sẽ chỉ được hoàn 50% phí đã đăng ký.
                </p>
                <p>
                  Sinh viên cần cân nhắc kỹ trước khi đăng ký vào WL.
                </p>
              </div>
            </AlertDescription>
          </Alert>

          {message && (
            <Alert variant={message.type === "error" ? "destructive" : "default"} className="mt-4">
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
