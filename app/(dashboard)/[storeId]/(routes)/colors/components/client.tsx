"use client";

import { useParams, useRouter } from "next/navigation";

import { Plus } from "lucide-react";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ColorColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";
interface ColorClientProps {
  data: ColorColumn[];
}
export const ColorClient: React.FC<ColorClientProps> = async ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading
          title={data.length > 1 ? `Cores (${data.length})` : `Cor (${data.length})`}
          description='Gerencie as Cores dos seus produtos'
        />
        <Button onClick={() => router.push(`/${params.storeId}/colors/new}`)}>
          <Plus className='mr-2 h-4 w-4' />
          Adicionar Novo
        </Button>
      </div>
      <Separator />
      <DataTable
        searchKey='name'
        columns={columns}
        data={data}
      />
      <Heading
        title='API'
        description='API calls para as Cores'
      />
      <Separator />
      <ApiList
        entityName='colors'
        entityIdName='colorId'
      />
    </>
  );
};
