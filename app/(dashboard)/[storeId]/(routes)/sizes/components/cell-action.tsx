"use client";

import { toast } from "react-hot-toast";
import { useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SizeColumn } from "./columns";

import { Copy, Edit, MoreVertical, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/modals/alert-modal";

interface CellActionProps {
  data: SizeColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Id Tamanho copiado");
  };
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/sizes/${data.id}`);
      router.refresh();
      toast.success("Tamanho excluido");
    } catch (error: any) {
      toast.error("Por favor, remova todas as categorias usando esse billboard");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className='h-8 w-8 p-0'
            variant='ghost'
          >
            <span className='sr-only'>Abrir menu</span>
            <MoreVertical className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className='h-4 w-4 mr-2' />
            Copiar Id
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/${params.storeId}/sizes/${data.id}`)}
          >
            <Edit className='h-4 w-4 mr-2' />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className='h-4 w-4 mr-2' />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
