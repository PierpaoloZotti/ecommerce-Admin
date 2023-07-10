import prismadb from "@/lib/prsimadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { productId: string } }) {
  try {
    if (!params.productId) {
      return new NextResponse("Product Id is required", { status: 400 });
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        image: true,
        category: true,
        size: true,
        color: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name, price, isFeatured, isArchived, sizeId, colorId, categoryId, image } =
      body;

    if (!userId) {
      return new NextResponse("Unhautenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Label is required", { status: 400 });
    }

    if (!image || !image.length) {
      return new NextResponse("Image is required", { status: 400 });
    }

    if (!sizeId) {
      return new NextResponse("Size Id  is required", {
        status: 400,
      });
    }
    if (!colorId) {
      return new NextResponse("Color Id  is required", {
        status: 400,
      });
    }
    if (!categoryId) {
      return new NextResponse("Color Id  is required", {
        status: 400,
      });
    }

    if (!params.productId) {
      return new NextResponse("Product Id is required", { status: 400 });
    }

    const storeIdByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeIdByUserId) {
      return new NextResponse("Unhautorized", { status: 403 });
    }

    await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        price,
        isFeatured,
        isArchived,
        categoryId,
        sizeId,
        colorId,
        storeId: params.storeId,
        image: {
          deleteMany: {},
        },
      },
    });

    const product = await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        image: {
          createMany: {
            data: [...image.map((i: { url: string }) => i)],
          },
        },
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unhautenticated", { status: 401 });
    }

    if (!params.productId) {
      return new NextResponse("Product Id is required", { status: 400 });
    }

    const storeIdByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeIdByUserId) {
      return new NextResponse("Unhautorized", { status: 403 });
    }

    const product = await prismadb.product.deleteMany({
      where: {
        id: params.productId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
