import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name, billboardId } = body;

    //Check if user logged in
    if (!userId) {
      return new NextResponse("Unhauthenticated", { status: 401 });
    }
    //check if label field is empty
    if (!name) {
      return new NextResponse("Category name is required", {
        status: 400,
      });
    }
    //Check if an image was uploaded to Cloudinary
    if (!billboardId) {
      return new NextResponse("Billboard Id  is required", {
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

    const category = await prismadb.category.create({
      data: {
        name,
        billboardId,
        storeId: params.storeId,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    //Check if a store id was passed as parameter
    if (!params.storeId) {
      return new NextResponse("Store Id  is required", {
        status: 400,
      });
    }

    const categories = await prismadb.category.findMany({
      where: { storeId: params.storeId },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.log("[CATEGORY_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
