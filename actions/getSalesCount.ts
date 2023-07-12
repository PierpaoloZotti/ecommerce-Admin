import prismadb from '@/lib/prismadb';

export const getSalesCount = async (storeId: string) => {
  const count = await prismadb.order.count({ where: { storeId } });
  return count;
};
