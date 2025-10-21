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
    <div className="flex flex-col items-start h-screen p-16 gap-10">
      <h1 className="text-3xl font-bold">List Dongeng</h1>
      <Table>
        <TableCaption></TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Judul</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Detail</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataLokasi.map((resp, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{resp.judul}</TableCell>
              <TableCell className="text-white">
                <Button
                  className={`${
                    resp.status == "pending"
                      ? "bg-yellow-500"
                      : resp.status == "rejected"
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                >
                  {resp.status}
                </Button>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  className="bg-[#fafafa]px-2 py-1"
                  onClick={() => router.replace(`/maos/detail/${resp.id}`)}
                >
                  Detail
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminPage;
