"use client";

import { useParams, useRouter } from "next/navigation";

import { Plus } from "lucide-react";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CategoryColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

interface CategoryClientProps {
  data: CategoryColumn[];
}
export const CategoryClient: React.FC<CategoryClientProps> = async ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading
          title={
            data.length > 1 ? `Categorias (${data.length})` : `Categoria (${data.length})`
          }
          description='Gerencie as categorias dos seus produtos'
        />
        <Button onClick={() => router.push(`/${params.storeId}/categories/new}`)}>
          <Plus className='mr-2 h-4 w-4' />
          Adicionar Nova
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
        description='API calls para as Categorias'
      />
      <Separator />
      <ApiList
        entityName='categories'
        entityIdName='categoryId'
      />
    </>
  );
};
