"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import subjectService from "@/lib/services/subject/subject.service";
import {
  Subject,
  SubjectStats,
  SubjectFilterByCredits,
} from "@/models/subject";

// Import components
import SubjectStatsCards from "@/components/subject/SubjectStatsCards";

export default function SubjectStatsPage() {
  const [stats, setStats] = useState<SubjectStats | null>(null);
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [filter, setFilter] = useState<SubjectFilterByCredits>({
    minCredits: undefined,
    maxCredits: undefined,
  });

  // Load stats on mount
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await subjectService.getSubjectsStats();
      setStats(response.data);
    } catch (error) {
      toast.error("Không thể tải thống kê");
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadFilteredSubjects = async () => {
    try {
      setFilterLoading(true);
      const response = await subjectService.getSubjectsByCredits(filter);
      setFilteredSubjects(response.data.subjects);
    } catch (error) {
      toast.error("Không thể tải danh sách môn học");
      console.error("Error loading filtered subjects:", error);
    } finally {
      setFilterLoading(false);
    }
  };

  const handleFilterChange = (
    field: keyof SubjectFilterByCredits,
    value: string
  ) => {
    const numValue = value ? parseInt(value) : undefined;
    setFilter((prev) => ({ ...prev, [field]: numValue }));
  };

  const handleApplyFilter = () => {
    loadFilteredSubjects();
  };

  const handleResetFilter = () => {
    setFilter({ minCredits: undefined, maxCredits: undefined });
    setFilteredSubjects([]);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">Đang tải thống kê...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Thống kê Môn học</h1>
        <Button onClick={loadStats} variant="outline">
          <TrendingUp className="w-4 h-4 mr-2" />
          Làm mới
        </Button>
      </div>

      {/* Stats Overview */}
      {stats && <SubjectStatsCards stats={stats} />}

      {/* Credits Distribution */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>Phân bố theo số tín chỉ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {stats.subjectsByCredits.map((item) => (
                <div
                  key={item._id}
                  className="text-center p-4 border rounded-lg"
                >
                  <div className="text-2xl font-bold text-primary">
                    {item.count}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {item._id} tín chỉ
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Lọc theo tín chỉ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label htmlFor="minCredits" className="text-sm font-medium">
                Tín chỉ tối thiểu
              </label>
              <input
                id="minCredits"
                type="number"
                min="0"
                placeholder="VD: 2"
                value={filter.minCredits || ""}
                onChange={(e) =>
                  handleFilterChange("minCredits", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="maxCredits" className="text-sm font-medium">
                Tín chỉ tối đa
              </label>
              <input
                id="maxCredits"
                type="number"
                min="0"
                placeholder="VD: 5"
                value={filter.maxCredits || ""}
                onChange={(e) =>
                  handleFilterChange("maxCredits", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleApplyFilter} disabled={filterLoading}>
                {filterLoading ? "Đang tải..." : "Áp dụng"}
              </Button>
              <Button variant="outline" onClick={handleResetFilter}>
                Đặt lại
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtered Results */}
      {filteredSubjects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Kết quả lọc ({filteredSubjects.length} môn học)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium">Mã môn học</th>
                    <th className="text-left p-2 font-medium">Tên môn học</th>
                    <th className="text-left p-2 font-medium">Mô tả</th>
                    <th className="text-left p-2 font-medium">Số tín chỉ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubjects.map((subject) => (
                    <tr key={subject._id} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {subject.subjectCode}
                        </span>
                      </td>
                      <td className="p-2 font-medium">{subject.name}</td>
                      <td className="p-2 max-w-xs truncate">
                        {subject.description}
                      </td>
                      <td className="p-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-gray-300">
                          {subject.credits} TC
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {filteredSubjects.length === 0 &&
        (filter.minCredits || filter.maxCredits) &&
        !filterLoading && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">
                Không tìm thấy môn học nào phù hợp với bộ lọc
              </p>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
