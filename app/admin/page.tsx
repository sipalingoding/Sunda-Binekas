"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const AdminPage = () => {
  const [dataLokasi, setDataLokasi] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    getDataMap();
  }, []);

  const getDataMap = async () => {
    const res = await fetch("/api/dongeng", {
      method: "GET",
    });
    const { data } = await res.json();
    setDataLokasi(data || []);
  };

  return (
    <div className="flex flex-col items-start min-h-screen gap-8 px-4 py-12 sm:px-8 md:px-12 lg:px-16">
      <h1 className="text-2xl sm:text-3xl font-bold">List Dongeng</h1>

      {/* Wrapper agar tabel bisa di-scroll di mobile */}
      <div className="w-full overflow-x-auto rounded-lg border border-gray-200 shadow-sm bg-white">
        <Table className="min-w-[600px]">
          <TableCaption className="text-sm text-gray-500">
            List Dongeng Nu Aya di Database
          </TableCaption>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Judul</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Detail</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataLokasi.length > 0 ? (
              dataLokasi.map((resp, index) => (
                <TableRow key={index} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{resp.judul}</TableCell>
                  <TableCell>
                    <Button
                      className={`text-white min-w-24 capitalize px-3 py-1 rounded-md ${
                        resp.status === "pending"
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : resp.status === "rejected"
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {resp.status}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-md"
                      onClick={() => router.push(`/maos/detail/${resp.id}`)}
                    >
                      Detail
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-gray-500 py-6"
                >
                  Tidak ada data dongeng
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminPage;
