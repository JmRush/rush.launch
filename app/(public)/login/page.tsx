"use client";

import { useAuth } from "@/Context/AuthContext";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const { login, isLoggedIn } = useAuth();
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    try {
      const result = await login(email, password, false);
      //login should update the auth context, so we can check if the user is logged in
      if (result) {
        router.push("/dashboard");
      } else {
        throw new Error("Failed to login");
      }
    } catch (error) {
      console.error("Error in login:", error);
    }
  };
  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" />
        <input type="password" name="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
