import prismadb from "@/lib/prismadb";

export const getStockProduct = async (storeId: string) => {
  const stockQty = await prismadb.product.findMany({
    where: { storeId, isArchived: false },
  });
  return stockQty.length;
};
