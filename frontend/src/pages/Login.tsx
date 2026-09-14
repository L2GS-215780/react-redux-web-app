import React, { useState } from "react"
import { useAppDispatch, useAppSelector } from "../hooks";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../feature/auth/authSlice";

function Login() {
    const [user_name, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading, error } = useAppSelector((state) => state.auth);

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();

        const result = await dispatch(loginUser({ user_name, password }));
        if (loginUser.fulfilled.match(result)) {
            if (result.payload.user_role === "Admin") {
                navigate('/adminpage');
            } else {
                navigate('/homepage');
            }
        }
    }

    return (
        <div>
            <form action="" onSubmit={handleLogin}>
                <label htmlFor="username">Enter Username</label>
                <input type="text" name="username" id="username" className="border" value={user_name} onChange={(e) => setUsername(e.target.value)} /><br /><br />

                <label htmlFor="password">Enter Password</label>
                <input type={showPassword ? 'text' : 'password'} name="password" id="password" className="border" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="border bg-gray-300 hover:bg-gray-400 cursor-pointer rounded">
                    {!showPassword ? "Show" : "Hide"}
                </button>
                <br /><br />

                {error && <p className="text-red-600">{error}</p>}

                <button disabled={loading} type="submit" className="border bg-gray-300 hover:bg-gray-400 cursor-pointer rounded">
                    {loading ? 'Logging in...' : 'Login Account'}
                </button><br /><br />
                <a href="/register" className="text-blue-800 hover:underline cursor-pointer">Register Account</a>
            </form>
        </div>
    )
}

export default Login