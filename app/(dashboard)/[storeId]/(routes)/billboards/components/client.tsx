"use client";

import { useParams, useRouter } from "next/navigation";

import { Plus } from "lucide-react";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BillboardColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";
interface BillboardClientProps {
  data: BillboardColumn[];
}
export const BillboardClient: React.FC<BillboardClientProps> = async ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading
          title={
            data.length > 1 ? `Billboards (${data.length})` : `Billboard (${data.length})`
          }
          description='Gerencie os billboards do seu negocio'
        />
        <Button onClick={() => router.push(`/${params.storeId}/billboards/new}`)}>
          <Plus className='mr-2 h-4 w-4' />
          Adicionar Novo
        </Button>
      </div>
      <Separator />
      <DataTable
        searchKey='label'
        columns={columns}
        data={data}
      />
      <Heading
        title='API'
        description='API calls para as Billboards'
      />
      <Separator />
      <ApiList
        entityName='billboards'
        entityIdName='billboardId'
      />
    </>
  );
};
