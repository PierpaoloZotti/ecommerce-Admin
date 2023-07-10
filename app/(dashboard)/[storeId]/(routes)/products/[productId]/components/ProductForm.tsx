"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Category, Color, Image, Product, Size } from "@prisma/client";
import { Trash } from "lucide-react";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import ImageUpload from "@/components/ui/image-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  name: z.string().min(2, { message: "Deve conter pelo menos 2 caracteres" }),
  price: z.coerce.number().min(1, { message: "Deve conter um valor diferente de 0" }),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
  image: z.object({ url: z.string() }).array(),
  categoryId: z.string().min(1, { message: "Deve conter pelo menos 1 caracter" }),
  colorId: z.string().min(1, { message: "Deve conter pelo menos 1 caracter" }),
  sizeId: z.string().min(1, { message: "Deve conter pelo menos 1 caracter" }),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData:
    | (Product & {
        image: Image[];
      })
    | null;
  categories: Category[];
  sizes: Size[];
  colors: Color[];
}
export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
  sizes,
  colors,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Editar produto" : "Criar produto";
  const description = initialData ? "Editar um produto" : "Adicionar um novo produto";
  const toastMesages = initialData ? "Produto atualizado" : "Produto criado";
  const action = initialData ? "Salvar" : "Criar";

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? { ...initialData, price: parseFloat(String(initialData?.price)) }
      : {
          name: "",
          image: [],
          price: 0,
          isFeatured: false,
          isArchived: false,
          colorId: "",
          categoryId: "",
          sizeId: "",
        },
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data);
      } else {
        await axios.post(`/api/${params.storeId}/products`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/products`);
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
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      router.refresh();
      router.push(`/${params.storeId}/products`);
      toast.success("Produto excluido");
    } catch (error: any) {
      toast.error("Ops! Algo deu errado");
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
          <FormField
            control={form.control}
            name='image'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fotos produto</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value.map((image) => image.url)}
                    disabled={loading}
                    onChange={(url) => field.onChange([...field.value, { url }])}
                    onRemove={(url) =>
                      field.onChange([
                        ...field.value.filter((current) => current.url !== url),
                      ])
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='grid grid-cols-3 gap-8'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder='Nome produto'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='price'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      disabled={loading}
                      placeholder='4.99'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='categoryId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>

                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder='Selecione uma categoria'
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='sizeId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tamanho</FormLabel>

                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder='Selecione um tamanho'
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sizes.map((size) => (
                        <SelectItem
                          key={size.id}
                          value={size.id}
                        >
                          {size.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <FormField
                control={form.control}
                name='colorId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cor</FormLabel>

                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder='Selecione uma cor'
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {colors.map((color) => (
                          <SelectItem
                            key={color.id}
                            value={color.id}
                          >
                            <div className='flex items-center gap-x-4'>
                              {color.name}
                              <div
                                className='w-8 h-8 rounded-full border'
                                style={{ backgroundColor: color.value }}
                              />
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name='isFeatured'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      //@ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel>Destaque</FormLabel>
                    <FormDescription>
                      Esse produto será fixado na homepage
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='isArchived'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      //@ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel>Arquivado</FormLabel>
                    <FormDescription>Esse produto será excluso da loja</FormDescription>
                  </div>
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
