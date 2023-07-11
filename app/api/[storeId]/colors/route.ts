import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name, value } = body;

    //Check if user logged in
    if (!userId) {
      return new NextResponse("Unhauthenticated", { status: 401 });
    }
    //check if label field is empty
    if (!name) {
      return new NextResponse("Size name is required", {
        status: 400,
      });
    }
    //Check if an image was uploaded to Cloudinary
    if (!value) {
      return new NextResponse("Value  is required", {
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

    const color = await prismadb.color.create({
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    });
    return NextResponse.json(color);
  } catch (error) {
    console.log("[COLOR_POST]", error);
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

    const sizes = await prismadb.color.findMany({
      where: { storeId: params.storeId },
    });
    return NextResponse.json(sizes);
  } catch (error) {
    console.log("[COLOR_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
