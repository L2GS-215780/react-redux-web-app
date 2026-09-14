import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../hooks"
import { registerUser } from "../feature/auth/authSlice"

function Register() {
    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [formError, setFormError] = useState("")

    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { loading, error } = useAppSelector((state) => state.auth)

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault()
        setFormError("")

        if (password !== confirmPassword) {
            setFormError("Passwords do not match")
            return
        }

        const result = await dispatch(registerUser({
            first_name: firstname,
            last_name: lastname,
            user_name: username,
            password,
            user_role: "User"
        }))

        if (registerUser.fulfilled.match(result)) {
            navigate('/homepage');
        }
    }

    return (
        <div>
            <form onSubmit={handleRegister}>
                <label htmlFor="firstname">Enter First Name</label>
                <input
                    type="text"
                    name="firstname"
                    id="firstname"
                    className="border"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                />
                <label htmlFor="lastname">Enter Last Name</label>
                <input
                    type="text"
                    name="lastname"
                    id="lastname"
                    className="border"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                />
                <br /><br />

                <label htmlFor="username">Enter Username</label>
                <input
                    type="text"
                    name="username"
                    id="username"
                    className="border"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <br /><br />

                <label htmlFor="password">Enter Password</label>
                <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    id="password"
                    className="border"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="border bg-gray-300 hover:bg-gray-400 cursor-pointer rounded"
                >
                    {showPassword ? "Hide" : "Show"}
                </button>

                <label htmlFor="confirmpassword">Enter Confirm Password</label>
                <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmpassword"
                    id="confirmpassword"
                    className="border"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="border bg-gray-300 hover:bg-gray-400 cursor-pointer rounded"
                >
                    {showConfirmPassword ? "Hide" : "Show"}
                </button>
                <br /><br />

                {(formError || error) && (
                    <p className="text-red-600">{formError || error}</p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="border bg-gray-300 hover:bg-gray-400 cursor-pointer rounded"
                >
                    {loading ? "Registering..." : "Register Account"}
                </button><br /><br />

                <Link to="/login" className="text-blue-800 hover:underline cursor-pointer">
                    Login Account
                </Link>
            </form>
        </div>
    )
}

export default Register