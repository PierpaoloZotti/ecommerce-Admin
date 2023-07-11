import { getSalesCount } from "@/actions/getSalesCount";
import { getStockProduct } from "@/actions/getStockProduct";
import { getTotalRenvenue } from "@/actions/getTotalRenvenue";
import { Heading } from "@/components/ui/Heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";
import { CreditCard, DollarSign, Package } from "lucide-react";

interface DashbordPageProps {
  params: { storeId: string };
}
const DashboardPage: React.FC<DashbordPageProps> = async ({ params }) => {
  const totalRenvenue = await getTotalRenvenue(params.storeId);
  const salesCount = await getSalesCount(params.storeId);
  const stockCount = await getStockProduct(params.storeId);

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <Heading
          title='Dashboard'
          description='Visão geral da sua loja'
        />
        <Separator />
        <div className='grid gap-4 grid-cols-3'>
          <Card>
            <CardHeader
              className='flex flex-row items-center justify-between space-y-0pb2
            '
            >
              <CardTitle className='text-sm font-medium'>Receita Total</CardTitle>
              <div className='flex justify-start items-center text-muted-foreground'>
                <h1 className='text-sm p-0'>R</h1>
                <DollarSign className='w-4 h-4 text-muted-foreground pb-0.5' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{formatter.format(totalRenvenue)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader
              className='flex flex-row items-center justify-between space-y-0pb2
            '
            >
              <CardTitle className='text-sm font-medium'>Vendas</CardTitle>

              <CreditCard className='w-4 h-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{salesCount} </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader
              className='flex flex-row items-center justify-between space-y-0pb2
            '
            >
              <CardTitle className='text-sm font-medium'>Produtos a stock</CardTitle>

              <Package className='w-4 h-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stockCount}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default DashboardPage;
