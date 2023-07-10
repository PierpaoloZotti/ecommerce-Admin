"use client";

import { Heading } from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";
import { OrderColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

interface OrderClientProps {
  data: OrderColumn[];
}
export const OrderClient: React.FC<OrderClientProps> = async ({ data }) => {
  return (
    <>
      <Heading
        title={data.length > 1 ? `Pedidos (${data.length})` : `Pedido (${data.length})`}
        description='Consulte os pedidos da sua loja'
      />

      <Separator />
      <DataTable
        searchKey='phone'
        columns={columns}
        data={data}
      />
    </>
  );
};
