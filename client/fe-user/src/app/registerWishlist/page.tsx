"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createOrUpdateWishlist, addSubjectsToWishlist, getMyWishlist } from "@/lib/services/wishlist/wishlist.service";
import { useAuth } from "@/context/auth-context";
import subjectService from "@/lib/services/subject/subject.service";
import { Subject } from "@/models/subject";

export default function RegisterWishlistPage() {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [semester, setSemester] = useState("");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const { userInfo } = useAuth();

  useEffect(() => {
    console.log('RegisterWishlist - User info:', userInfo);
    loadSubjects();
  }, [userInfo]);

  const loadSubjects = async () => {
    try {
      setLoadingSubjects(true);
      const response = await subjectService.getAllSubjects({ limit: 1000 }); // Load all subjects
      if (response.status === 'success' && response.data?.subjects) {
        setSubjects(response.data.subjects);
      } else {
        setMessage({ type: "error", text: "Không thể tải danh sách môn học" });
      }
    } catch (error) {
      console.error('Error loading subjects:', error);
      setMessage({ type: "error", text: "Có lỗi xảy ra khi tải danh sách môn học" });
    } finally {
      setLoadingSubjects(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userInfo?.userId) {
      setMessage({ type: "error", text: "Vui lòng đăng nhập để sử dụng tính năng này" });
      return;
    }

    if (!selectedSubject || !semester.trim()) {
      setMessage({ type: "error", text: "Vui lòng chọn môn học và nhập học kỳ" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      console.log('Attempting to register wishlist for user:', userInfo.userId);
      console.log('Selected subject:', selectedSubject);
      console.log('Semester:', semester.trim());

      // Check if subject already exists in wishlist for the same semester
      const existingWishlist = await getMyWishlist(userInfo.userId);
      console.log('Existing wishlist:', existingWishlist);
      
      if (existingWishlist && existingWishlist.success && existingWishlist.data) {
        const wishlist = existingWishlist.data;
        console.log('Wishlist data:', wishlist);
        console.log('Current semester:', semester.trim());
        console.log('Wishlist semester:', wishlist.semester);
        console.log('Selected subject ID:', selectedSubject);
        console.log('Wishlist subjects:', wishlist.subjects);
        
        // Check if same semester and subject already exists
        if (wishlist.semester === semester.trim()) {
          const subjectExists = wishlist.subjects.some((subject: any) => {
            console.log('Comparing subject:', subject._id, 'with selected:', selectedSubject);
            return subject._id === selectedSubject;
          });
          
          if (subjectExists) {
            setMessage({ 
              type: "error", 
              text: "Môn học này đã được đăng ký trong wishlist cho học kỳ này!" 
            });
            setLoading(false);
            return;
          }
        }
        
      }
      
      // First, try to add the subject to existing wishlist
      const addResponse = await addSubjectsToWishlist(userInfo.userId, {
        subjectIds: [selectedSubject]
      });
      
      console.log('Add subjects response:', addResponse);

      if (addResponse && addResponse.success) {
        setMessage({ type: "success", text: "Đăng ký môn học thành công!" });
        setSelectedSubject("");
      } else {
        // If adding fails, try to create a new wishlist
        console.log('Adding failed, trying to create new wishlist...');
        const createResponse = await createOrUpdateWishlist({
          student: userInfo.userId,
          subjects: [selectedSubject],
          semester: semester.trim()
        });
        
        console.log('Create wishlist response:', createResponse);

        if (createResponse && createResponse.success) {
          setMessage({ type: "success", text: "Đăng ký môn học thành công!"});
          setSelectedSubject("");
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
              <label htmlFor="subject" className="text-sm font-medium">
                Môn học
              </label>
              <Select 
                value={selectedSubject} 
                onValueChange={setSelectedSubject}
                disabled={loadingSubjects}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={loadingSubjects ? "Đang tải..." : "Chọn môn học"} />
                </SelectTrigger>
                <SelectContent 
                  className="max-h-[280px] overflow-y-auto"
                  position="popper"
                  sideOffset={4}
                >
                  {subjects.map((subject) => (
                    <SelectItem key={subject._id} value={subject._id} className="py-2">
                      <div className="flex flex-col w-full">
                        <span className="font-medium text-left">{subject.subjectCode}</span>
                        <span className="text-sm text-gray-500 text-left">{subject.name} ({subject.credits} tín chỉ)</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
