"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Color } from "@prisma/client";
import { Trash } from "lucide-react";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";

const formSchema = z.object({
  name: z.string().min(1, { message: "Deve conter pelo menos 1 caracter" }),
  value: z.string().min(1, { message: "Deve conter pelo menos 1 caracter" }),
});

type ColorFormValues = z.infer<typeof formSchema>;

interface ColorFormProps {
  initialData: Color | null;
}
export const ColorForm: React.FC<ColorFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Editar cor" : "Criar cor";
  const description = initialData ? "Editar um cor" : "Adicionar um novo cor";
  const toastMesages = initialData ? "Cor atualizada" : "Cor criada";
  const action = initialData ? "Salvar" : "Criar";

  const form = useForm<ColorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  });

  const onSubmit = async (data: ColorFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, data);
      } else {
        await axios.post(`/api/${params.storeId}/colors `, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/colors`);
      toast.success(toastMesages);
    } catch (error: any) {
      toast.error("Algo deu errado");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);
      router.refresh();
      router.push(`/${params.storeId}/colors`);
      toast.success("Cor excluida");
    } catch (error: any) {
      toast.error("Por favor, remova todas os produtos usando essas cores");
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
      <div className='flex items-center justify-between'>
        <Heading
          title={title}
          description={description}
        />
        {initialData && (
          <Button
            variant='destructive'
            size='icon'
            onClick={() => setOpen(true)}
            disabled={loading}
          >
            <Trash className='h-4 w-4' />
          </Button>
        )}
      </div>
      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-8 w-full'
        >
          <div className='grid grid-cols-3 gap-8'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Cor</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder='Nome da cor'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='value'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <div className='flex items-center gap-x-4'>
                      <Input
                        disabled={loading}
                        placeholder='Codigo cor em HEX'
                        {...field}
                      />
                      <div
                        className='h-8 w-8 rounded-full border'
                        style={{ backgroundColor: field.value }}
                      ></div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            disabled={loading}
            className='ml-auto'
            type='submit'
          >
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
