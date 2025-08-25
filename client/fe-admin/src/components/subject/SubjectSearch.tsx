"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import subjectService from "@/lib/services/subject/subject.service";
import { Subject } from "@/models/subject";

interface SubjectSearchProps {
  onSubjectSelect?: (subject: Subject) => void;
}

export default function SubjectSearch({ onSubjectSelect }: SubjectSearchProps) {
  const [searchCode, setSearchCode] = useState("");
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchCode.trim()) {
      toast.error("Vui lòng nhập mã môn học");
      return;
    }

    try {
      setLoading(true);
      const response = await subjectService.getSubjectByCode(searchCode.trim());
      setSubject(response.data);
      toast.success("Tìm thấy môn học");
    } catch (error) {
      setSubject(null);
      toast.error("Không tìm thấy môn học với mã này");
      console.error("Error searching subject:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearchCode("");
    setSubject(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSubjectClick = () => {
    if (subject && onSubjectSelect) {
      onSubjectSelect(subject);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-4 h-4" />
          Tìm kiếm môn học
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Nhập mã môn học..."
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10"
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={loading || !searchCode.trim()}
          >
            {loading ? "Đang tìm..." : "Tìm kiếm"}
          </Button>
          {searchCode && (
            <Button variant="outline" size="icon" onClick={handleClear}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {subject && (
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{subject.name}</h3>
              <Badge variant="secondary">{subject.subjectCode}</Badge>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Số tín chỉ:</span>
                <Badge variant="outline" className="ml-2">
                  {subject.credits} TC
                </Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Ngày tạo:</span>
                <span className="ml-2">
                  {new Date(subject.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
            </div>
            <div>
              <span className="text-muted-foreground text-sm">Mô tả:</span>
              <p className="text-sm mt-1">{subject.description}</p>
            </div>
            {onSubjectSelect && (
              <Button
                onClick={handleSubjectClick}
                className="w-full"
                variant="outline"
              >
                Chọn môn học này
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
