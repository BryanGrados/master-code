import authDB from "@/lib/db-connector";
import { handleUserRegister } from "@/utils/auth/methods-services";
import { User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const errorResponse = { success: false, message: "Something ocurred. Try Again" };

export async function POST(req: NextRequest) {
	try {
		const formData: User = await req.json();

		const isSuccess = await handleUserRegister(formData);

		if (isSuccess) return NextResponse.json(isSuccess, { status: 200 });

		return NextResponse.json(errorResponse, { status: 400 });
	} catch (error) {
		return NextResponse.json(errorResponse, { status: 400 });
	} finally {
		await authDB.$disconnect();
	}
}
