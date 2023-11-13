"use client";

import { useEffect } from "react";

const LoginPage = () => {
	const email = "bryangrados9@gmail.com";
	const password = "Bryan123GRK";

	useEffect(() => {
		const handleLogin = async () => {
			const respose = await fetch("/auth/sign-in", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});

			const json = await respose.json();

			console.log(json);
		};

		handleLogin();
	}, []);

	return <div>LoginPage</div>;
};

export default LoginPage;
