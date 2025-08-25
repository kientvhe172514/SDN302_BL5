"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Calendar, GraduationCap } from "lucide-react";
import subjectService from "@/lib/services/subject/subject.service";
import { Subject, SubjectQuery } from "@/models/subject";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSubjects, setTotalSubjects] = useState(0);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const query: SubjectQuery = {
        page: currentPage,
        limit: 10,
        search: searchTerm || undefined,
        sortBy,
        sortOrder,
      };

      const response = await subjectService.getAllSubjects(query);
      setSubjects(response.data.subjects);
      setTotalPages(response.data.totalPages);
      setTotalSubjects(response.data.total);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [currentPage, searchTerm, sortBy, sortOrder]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Curriculum</h1>
          <p className="text-gray-600 mt-2">Khung chương trình đào tạo</p>
        </div>
        <div className="flex items-center space-x-2">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <GraduationCap className="h-8 w-8 text-green-600" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Subjects
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalSubjects}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <GraduationCap className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Current Page
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {currentPage} / {totalPages}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Items per Page
                </p>
                <p className="text-2xl font-bold text-gray-900">10</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search subjects by name or code..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={sortBy === "name" ? "default" : "outline"}
                onClick={() => handleSort("name")}
                className="flex items-center gap-2"
              >
                Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
              </Button>
              <Button
                variant={sortBy === "credits" ? "default" : "outline"}
                onClick={() => handleSort("credits")}
                className="flex items-center gap-2"
              >
                Credits{" "}
                {sortBy === "credits" && (sortOrder === "asc" ? "↑" : "↓")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subjects Table */}
      <Card>
        <CardHeader>
          <CardTitle>Subject List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : subjects.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No subjects found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">
                      Subject Code
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">Name</th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Description
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Credits
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((subject) => (
                    <tr key={subject._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <Badge variant="secondary">{subject.subjectCode}</Badge>
                      </td>
                      <td className="py-3 px-4 font-medium">{subject.name}</td>
                      <td className="py-3 px-4 text-gray-600 max-w-xs truncate">
                        {subject.description}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">
                          {subject.credits} credits
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {formatDate(subject.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing page {currentPage} of {totalPages} ({totalSubjects}{" "}
                total subjects)
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
