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
import { useEffect, useState } from "react";
import { User } from "@/models/user/user.model";
import axiosService from "@/lib/services/config/axios.service";
import useSWR from "swr";
import { Endpoints } from "@/lib/endpoints";
import { showErrorToast } from "@/components/common/toast/toast";
import { Constants } from "@/lib/constants";
import Spinner from "@/components/common/spinner/spinner";
import PaginationConfig from "@/components/common/paging/pagination";
import { AddUserModal } from "@/components/common/modal/add-user";

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const limit = 10;

  useEffect(() => {
    const t = localStorage.getItem(Constants.API_TOKEN_KEY);
    setToken(t);
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

  const { data, error, isLoading,mutate } = useSWR(
    `${Endpoints.User.GET_ALL}?page=${page}&limit=${limit}&search=${debouncedSearch}`,
    fetcher
  );

  useEffect(() => {
    if (data) {
      setUsers(data.users);
    }
  }, [data]);


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
          <h1 className="text-2xl font-semibold">Manage Users</h1>
          <p className="text-sm text-muted-foreground">
            You can share reports and data (tables) only to active users listed
            here.
          </p>
        </div>
        <Button
          className="bg-green-600 hover:bg-green-700"
          onClick={() => setIsOpen(true)}>
          Add New Users
        </Button>
      </div>

      {/* Search bar */}
      <div className="flex justify-end">
        <Input
          placeholder="Search Email ..."
          className="w-[260px]"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // reset về page 1 khi search mới
          }}
        />
      </div>

      {/* Table */}
      <Table className="w-full border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead className="w-[250px] text-gray-700 font-semibold px-4 py-3">
              Email
            </TableHead>
            <TableHead className="text-gray-700 font-semibold px-4 py-3">
              FullName
            </TableHead>
            <TableHead className="text-gray-700 font-semibold px-4 py-3">
              Date Of Birth
            </TableHead>
            <TableHead className="text-gray-700 font-semibold px-4 py-3">
              Phone
            </TableHead>
            <TableHead className="text-gray-700 font-semibold px-4 py-3">
              Roles
            </TableHead>
            <TableHead className="text-gray-700 font-semibold px-4 py-3">
              Join System
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, i) => (
            <TableRow
              key={user._id}
              className={`${
                i % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-orange-50 transition-colors`}>
              <TableCell className="px-4 py-3 text-sm font-medium text-neutral-900">
                {user.email}
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-600 text-sm">
                {user.fullName}
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-600 text-sm">
                {new Date(user.dateOfBirth).toLocaleDateString()}
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-600 text-sm">
                {user.phoneNumber}
              </TableCell>
              <TableCell className="px-4 py-3">
                {user.role === "student" ? (
                  <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
                    {user.role}
                  </span>
                ) : (
                  <span className="text-xs font-medium text-orange-700 bg-orange-100 px-2 py-1 rounded-full">
                    {user.role}
                  </span>
                )}
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-600 text-sm">
                {new Date(user.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <PaginationConfig
        total={data.pagination.total}
        skip={(page - 1) * limit}
        limit={limit}
        onPageChange={(newSkip) => {
          setPage(newSkip / limit + 1);
        }}
      />
      <AddUserModal open={isOpen} setOpen={setIsOpen} mutate={mutate}/>
    </div>
  );
}
