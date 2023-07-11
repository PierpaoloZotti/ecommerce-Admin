import prismadb from "@/lib/prismadb";

export const getTotalRenvenue = async (storeId: string) => {
  const paidOrders = await prismadb.order.findMany({
    where: {
      storeId,
      isPaid: true,
    },
    include: {
      orderItems: {
        include: { product: true },
      },
    },
  });
  const totalRenvenue = paidOrders.reduce((total, order) => {
    const orderTotal = order.orderItems.reduce((sum, item) => {
      return sum + item.product.price.toNumber();
    }, 0);
    return total + orderTotal;
  }, 0);
  return totalRenvenue;
};
