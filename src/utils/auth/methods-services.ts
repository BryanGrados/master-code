import { User } from "@prisma/client";
import { createNewUser, validateExistingUser } from "../prisma/user-services";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * Handles the creation of a new user.
 * @param formData - The user data to be created.
 * @returns A boolean indicating if the user already exists or the newly created user.
 * @throws An error if there was an issue creating the user.
 */
export const handleUserRegister = async (formData: User): Promise<boolean | User> => {
	const existingUser = await validateExistingUser(formData.email);

	if (existingUser) return false;

	const newUser = await createNewUser(formData);

	if (newUser) return newUser;

	throw new Error("An error ocurred while creating the user.");
};

/**
 * Handles user login by validating the user's email and password, and generating a JWT token if the user is authenticated.
 * @param {User} user - An object containing the user's email and password.
 * @returns A Promise that resolves to a JWT token if the user is authenticated, or null if the user is not found or the password is invalid.
 */
export const handleUserLogin = async ({ email, password }: Partial<User>) => {
	if (!email || !password) return null;

	const existingUser = await validateExistingUser(email);

	if (!existingUser) return null;

	const isPasswordValid = await bcrypt.compare(password, existingUser.password);

	if (!isPasswordValid) return null;

	const tokenData = {
		id: existingUser.id,
		email: existingUser.email,
		role: existingUser.role,
		user_name: existingUser.user_name,
		tienda: existingUser.tiendaId,
	};

	const token = jwt.sign(tokenData, process.env.JWT_TOKEN_SECRET as string, {
		expiresIn: "1d",
	});

	return token;
};
