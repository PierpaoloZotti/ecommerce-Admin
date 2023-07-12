import prismadb from '@/lib/prismadb';

interface GraphData {
  name: string;
  total: number;
}

export const getGraphRenvenue = async (storeId: string) => {
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
  const monthlyRenvenue: { [key: number]: number } = {};

  for (const order of paidOrders) {
    const month = order.createdAt.getMonth();
    let renvenueForOrder = 0;
    for (const item of order.orderItems) {
      renvenueForOrder += item.product.price.toNumber();
    }
    monthlyRenvenue[month] = (monthlyRenvenue[month] || 0) + renvenueForOrder;
  }

  const graphData: GraphData[] = [
    { name: 'Jan', total: 0 },
    { name: 'Feb', total: 0 },
    { name: 'Mar', total: 0 },
    { name: 'Apr', total: 0 },
    { name: 'May', total: 0 },
    { name: 'Jun', total: 0 },
    { name: 'Jul', total: 0 },
    { name: 'Aug', total: 0 },
    { name: 'Sep', total: 0 },
    { name: 'Opt', total: 0 },
    { name: 'Nov', total: 0 },
    { name: 'Dec', total: 0 },
  ];

  for (const month in monthlyRenvenue) {
    graphData[parseInt(month)].total = monthlyRenvenue[parseInt(month)];
  }

  return graphData;
};
