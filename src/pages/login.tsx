import { useState } from "react";

const Login = () => {
const [user, setEmail] = useState("");
const [password, setPassword] = useState("");

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Backend login functionality will be implemented later
};

return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Login</h1>
        <form onSubmit={handleSubmit}>
        <div className="mb-4">
            <label className="block text-gray-700" htmlFor="user">
            Usuario
            </label>
            <input
            type="user"
            id="user"
            value={user}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            required
            />
        </div>
        <div className="mb-4">
            <label className="block text-gray-700" htmlFor="password">
            Senha
            </label>
            <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            required
            />
        </div>
        <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark"
        >
            Login
        </button>
        </form>
    </div>
    </div>
);
};

export default Login;