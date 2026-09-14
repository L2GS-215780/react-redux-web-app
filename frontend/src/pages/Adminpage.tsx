import { Link } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../hooks"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { logoutUser } from "../feature/auth/authSlice"
import { fetchAllUsers, activateUser, deactivateUser, deleteUser } from "../feature/users/usersSlice"

function Adminpage() {
    const { first_name, last_name, user_name, user_role } = useAppSelector((state) => state.auth)
    const { accounts, loading, error } = useAppSelector((state) => state.users)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(fetchAllUsers())
    }, [dispatch])

    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault()
        await dispatch(logoutUser())
        navigate('/login')
    }

    const handleActivate = (id: number) => {
        dispatch(activateUser(id))
    }

    const handleDeactivate = (id: number) => {
        dispatch(deactivateUser(id))
    }

    const handleDelete = (id: number) => {
        if (window.confirm("Are you sure you want to delete this account? This cannot be undone.")) {
            dispatch(deleteUser(id))
        }
    }

    return (
        <div>
            Hello <Link to="/userprofile" className="underline"> {first_name} {last_name}, {user_name}, ({user_role}) </Link>
            <br />
            <a href="" onClick={handleLogout} className="text-red-800 hover:underline cursor-pointer">
                Logout Account
            </a>
            <br /><br />
            <ul>
                <li>
                    <Link to="/adminpage" className="underline">Manage Users</Link>
                </li>
                <li>
                    <Link to="/adminpage" className="hover:underline cursor-pointer">Manage Message Board</Link>
                </li>
            </ul>
            <br /><br />

            {/* Manage User Table */}
            {loading && <p>Loading users...</p>}
            {error && <p className="text-red-600">{error}</p>}

            {!loading && !error && (
                <table className="border-collapse border">
                    <thead>
                        <tr>
                            <th className="border px-2">ID</th>
                            <th className="border px-2">First Name</th>
                            <th className="border px-2">Last Name</th>
                            <th className="border px-2">Username</th>
                            <th className="border px-2">Role</th>
                            <th className="border px-2">Active</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.map((account) => (
                            <tr key={account.id}>
                                <td className="border px-2">{account.id}</td>
                                <td className="border px-2">{account.first_name}</td>
                                <td className="border px-2">{account.last_name}</td>
                                <td className="border px-2">{account.user_name}</td>
                                <td className="border px-2">{account.user_role}</td>
                                <td className="border px-2">{account.is_active ? "Active" : "Inactive"}</td>
                                <td className="border px-2">
                                    {account.is_active ? (
                                        <button
                                            onClick={() => handleDeactivate(account.id)}
                                            className="border bg-red-300 hover:bg-red-400 cursor-pointer rounded"
                                        >
                                            Deactivate
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleActivate(account.id)}
                                            className="border bg-green-300 hover:bg-green-400 cursor-pointer rounded"
                                        >
                                            Activate
                                        </button>
                                    )}
                                </td>
                                <td className="border px-2">
                                    <button
                                        onClick={() => handleDelete(account.id)}
                                        className="border bg-gray-300 hover:bg-gray-400 cursor-pointer rounded"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default Adminpage