'use client';

import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter();
    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const response = await fetch("http://localhost:3001/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "credentials": "include",
            },
            credentials: "include",
            body: JSON.stringify({ email, password }),
        });
        if(!response.ok) {
            throw new Error("Failed to login");
        }
        const data = await response.json();
        localStorage.setItem("token", data.token);
        router.push("/dashboard");
    }
    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" />
                <input type="password" name="password" placeholder="Password" />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}