import prismadb from "@/lib/prsimadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name, price, isFeatured, isArchived, sizeId, colorId, categoryId, image } =
      body;

    //Check if user logged in
    if (!userId) {
      return new NextResponse("Unhauthenticated", { status: 401 });
    }
    //check if label field is empty
    if (!name) {
      return new NextResponse("Billboard name is required", {
        status: 400,
      });
    }
    //Check if an image was uploaded to Cloudinary
    if (!image || !image.length) {
      return new NextResponse("Images are required", {
        status: 400,
      });
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
    //Check if a store id was passed as parameter
    if (!params.storeId) {
      return new NextResponse("Store Id  is required", {
        status: 400,
      });
    }
    //Check if the specific user is authorized to modify that specific store
    const storeIdByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeIdByUserId) {
      return new NextResponse("Unhautorized", { status: 403 });
    }

    const product = await prismadb.product.create({
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
          createMany: {
            data: [...image.map((i: { url: string }) => i)],
          },
        },
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    //Check if a store id was passed as parameter

    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isFeatured = searchParams.get("isFeatured");

    if (!params.storeId) {
      return new NextResponse("Store Id  is required", {
        status: 400,
      });
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: { image: true, category: true, color: true, size: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.log("[PRODUCT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
