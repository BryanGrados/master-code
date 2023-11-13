import authDB from "@/lib/db-connector";
import { Role, User } from "@prisma/client";
import bcrypt from "bcrypt";

/**
 * Validates if a user with the given email already exists in the database.
 * @param email - The email of the user to validate.
 * @returns A Promise that resolves to the user object if it exists, or null if it doesn't.
 */
export const validateExistingUser = async (email: string) => {
	const user = await authDB.user.findUnique({
		where: {
			email: email,
		},
	});
	return user;
};

/**
 * Creates a new user with the provided form data.
 * @param formData The user data to be used for creating the new user.
 * @returns The newly created user.
 */
export const createNewUser = async (formData: User) => {
	const hashedPassword = await bcrypt.hash(formData.password, 10);

	const user = await authDB.user.create({
		data: { ...formData, password: hashedPassword },
	});

	return user;
};

/**
 * Edits a user in the database.
 * @param formData - The user data to update.
 * @returns The updated user.
 */
export const editUser = async (formData: User) => {
	const { password, ...data } = formData; // Destructure password from formData

	const user = await authDB.user.update({
		where: {
			id: formData.id,
		},
		data: { ...data },
	});

	return user;
};

/**
 * Deletes a user from the database.
 * @param id - The ID of the user to be deleted.
 * @returns The deleted user.
 */
export const deleteUser = async (id: string) => {
	const user = await authDB.user.delete({
		where: {
			id: id,
		},
	});

	return user;
};

/**
 * Changes the password of a user.
 * @param id - The id of the user.
 * @param previousPassword - The previous password of the user.
 * @param password - The new password of the user.
 * @returns The updated user object.
 * @throws An error if the user does not exist or if the previous password is incorrect.
 */
export const changePassword = async (id: string, previousPassword: string, password: string) => {
	const user = await authDB.user.findUnique({
		where: {
			id: id,
		},
	});

	if (!user) {
		throw new Error("El usuario no existe");
	}

	const isPasswordValid = await bcrypt.compare(previousPassword, user.password);

	if (!isPasswordValid) {
		throw new Error("Las contraseñas no coinciden");
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	const updatedUser = await authDB.user.update({
		where: {
			id: id,
		},
		data: {
			password: hashedPassword,
		},
	});

	return updatedUser;
};

/**
 * Retrieves all users with a specific role from the database.
 * @param role - The role of the users to retrieve.
 * @returns A promise that resolves to an array of users with the specified role.
 */
export const getUsersByRole = async (role: Role) => {
	const users = await authDB.user.findMany({
		where: {
			role: role,
		},
	});

	return users;
};

//Crear tienda

// const tienda = await authDB.tiendas.create({
//     data: {
//         name: "Primavera II",
//     }
// })

// console.log(tienda);

// Crear usuario

// const user = await authDB.user.fin({
//     data: {
//         email: formData.email,
//         password: formData.password,
//         user_name: formData.user_name,
//         role: formData.role,
//         tiendaId: formData.tiendaId,
//     }
// })

// console.log(user);

// Buscar usuario por email y obtener su tienda como su nombre atraves de la relacion
// const fullUser = await authDB.user.findUnique({
//     where: {
//         email: formData.email
//     },
//     include: {
//         tienda: true
//     }
// })

// console.log(fullUser);

// Buscar tienda por id y obtener sus usuarios
// const fullTienda = await authDB.tiendas.findUnique({
//     where: {
//         id: "79875b85-44df-4dac-a838-835c2ea6db21"
//     },
//     include: {
//         User: true
//     }
// })

// console.log(fullTienda);

// Buscamos por role de usuario y obtenemos su tienda de cada uno
// const fullUser = await authDB.user.findMany({
//     where: {
//         role: "TIENDA"
//     },
//     include: {
//         tienda: true
//     }
// })

// console.log(fullUser);
