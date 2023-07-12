import prismadb from '@/lib/prismadb';

export const getStockProduct = async (storeId: string) => {
  const stockQty = await prismadb.product.count({
    where: { storeId, isArchived: false },
  });
  return stockQty;
};
