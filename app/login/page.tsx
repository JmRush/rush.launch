export default function Login() {
    return (
        <div>
            <h1>Login</h1>
            <form action="https://localhost:3001/api/login" method="post">
                <input type="email" name="email" placeholder="Email" />
                <input type="password" name="password" placeholder="Password" />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}