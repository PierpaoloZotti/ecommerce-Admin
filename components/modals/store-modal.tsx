"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import axios from "axios";

import { useStoreModal } from "@/hooks/use-store-model";
import { Modal } from "@/components/ui/modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "O nome da loja deve conter pelo menos 2 caracteres",
  }),
});

export const StoreModal = () => {
  const storeModal = useStoreModal();

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      const response = await axios.post("/api/stores", values);

      //We will use the next method to ensure that my database will be ready and modal will not appear
      //when we redirect
      //With redirect method there is the posibility of this happens

      window.location.assign(`/${response.data.id}`);
    } catch (error) {
      console.log(error);
      toast.error("Algo não ocorreu como planejado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title='Criar loja'
      description='Adicione uma nova loja para administrar produtos e categorias'
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div className='space-y-4 py-2 pb-4'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da loja:</FormLabel>

                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder='E-commerce'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='pt-6 space-x-2 flex items-center justify-end w-full'>
              <Button
                disabled={loading}
                variant='outline'
                onClick={storeModal.onClose}
              >
                Cancel
              </Button>
              <Button
                disabled={loading}
                type='submit'
              >
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};
