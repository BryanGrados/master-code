import authDB from "@/lib/db-connector";
import { handleUserLogin } from "@/utils/auth/methods-services";
import { validateExistingUser } from "@/utils/prisma/user-services";
import { User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const errorResponse = { success: false, message: "Something ocurred. Try Again" };

export async function POST(req: NextRequest) {
	try {
		const { email, password }: User = await req.json();

		const successLogin = await handleUserLogin({ email, password });

		if (!successLogin) return NextResponse.json(errorResponse, { status: 400 });

		const response = NextResponse.json({ success: true }, { status: 200 });

		response.cookies.set("one-auth", successLogin, { httpOnly: true });

		return response;
	} catch (error) {
		return NextResponse.json(errorResponse, { status: 400 });
	} finally {
		await authDB.$disconnect();
	}
}
