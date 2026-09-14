import { Link } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../hooks"
import { useNavigate } from "react-router-dom"
import { logoutUser } from "../feature/auth/authSlice"

function Homepage() {
    const { first_name, last_name, user_name, user_role } = useAppSelector((state) => state.auth)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault()
        await dispatch(logoutUser())
        navigate('/login')
    }

    return (
        <div>
            Hello <Link to="/userprofile" className="underline"> {first_name} {last_name}, {user_name}, ({user_role}) </Link>
            <br />
            <a href="" onClick={handleLogout} className="text-red-800 hover:underline cursor-pointer">
                Logout Account
            </a>
        </div>
    )
}

export default Homepage