import { useAppDispatch, useAppSelector } from "../hooks"
import { useNavigate, Link } from "react-router-dom"
import { updateUser } from "../feature/auth/authSlice"
import { useState } from "react"

function UserProfile() {
    const { id, first_name, last_name, user_name, user_role } = useAppSelector((state) => state.auth)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const [firstname, setFirstname] = useState(first_name ?? "")
    const [lastname, setLastname] = useState(last_name ?? "")
    const [username, setUsername] = useState(user_name ?? "")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [formError, setFormError] = useState("")

    const handleUpdate = async (event: React.FormEvent) => {
        event.preventDefault()
        setFormError("")

        if (password && password !== confirmPassword) {
            setFormError("Passwords do not match")
            return
        }

        if (!id) return

        const result = await dispatch(updateUser({
            id,
            first_name: firstname,
            last_name: lastname,
            user_name: username,
            ...(password ? { password } : {}),
        }))

        if (updateUser.fulfilled.match(result)) {
            navigate('/homepage')
        }
    }

    return (
        <div>
            <Link to={user_role === "Admin" ? "/adminpage" : "/homepage"} className="underline inline-flex items-center gap-1">
                <span>←</span> Back to Homepage
            </Link>
            <br /><br />

            <form onSubmit={handleUpdate}>
                <label htmlFor="firstname">First Name</label>
                <input
                    type="text"
                    name="firstname"
                    id="firstname"
                    className="border"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                />
                <label htmlFor="lastname">Last Name</label>
                <input
                    type="text"
                    name="lastname"
                    id="lastname"
                    className="border"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                />
                <br /><br />

                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    name="username"
                    id="username"
                    className="border"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <br /><br />

                <label htmlFor="password">Password</label>
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

                <label htmlFor="confirmpassword">Confirm Password</label>
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

                {formError && <p className="text-red-600">{formError}</p>}

                <button
                    type="submit"
                    className="border bg-orange-300 hover:bg-orange-400 cursor-pointer rounded"
                >
                    Update Account
                </button>
                <br /><br />
            </form>
        </div>
    )
}

export default UserProfile