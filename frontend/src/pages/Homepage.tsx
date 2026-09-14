import { Link } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../hooks"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { logoutUser } from "../feature/auth/authSlice"
import {
    fetchAllMessageBoards,
    searchAndFilterMessageBoards,
    createMessageBoard,
    updateMessageBoard,
    archiveMessageBoard,
    unarchiveMessageBoard,
    deleteMessageBoard,
} from "../feature/message board/messageBoardSlice"

function Homepage() {
    const { id, first_name, last_name, user_name, user_role } = useAppSelector((state) => state.auth)
    const { messages, loading, error } = useAppSelector((state) => state.messageBoard)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const [searchTerm, setSearchTerm] = useState("")
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [editingId, setEditingId] = useState<number | null>(null)

    useEffect(() => {
        dispatch(fetchAllMessageBoards())
    }, [dispatch])

    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault()
        await dispatch(logoutUser())
        navigate('/login')
    }

    const handleSearch = (e: React.MouseEvent) => {
        e.preventDefault()

        if (searchTerm.trim() === "") {
            dispatch(fetchAllMessageBoards())
        } else {
            dispatch(searchAndFilterMessageBoards({ search_message_board: searchTerm.trim() }))
        }
    }

    const handlePost = async (e: React.MouseEvent) => {
        e.preventDefault()

        if (!id || title.trim() === "" || description.trim() === "") return

        if (editingId !== null) {
            await dispatch(updateMessageBoard({ id: editingId, title, description }))
            setEditingId(null)
        } else {
            await dispatch(createMessageBoard({ user_id_fk: id, title, description }))
            dispatch(fetchAllMessageBoards())
        }

        setTitle("")
        setDescription("")
    }

    const handleEditStart = (msgId: number, currentTitle: string, currentDescription: string) => {
        setEditingId(msgId)
        setTitle(currentTitle)
        setDescription(currentDescription)
    }

    const handleArchive = async (msgId: number) => {
        await dispatch(archiveMessageBoard(msgId))
        dispatch(fetchAllMessageBoards())
    }

    const handleUnarchive = async (msgId: number) => {
        await dispatch(unarchiveMessageBoard(msgId))
        dispatch(fetchAllMessageBoards())
    }

    const handleDelete = (msgId: number) => {
        if (window.confirm("Delete this message? This cannot be undone.")) {
            dispatch(deleteMessageBoard(msgId))
        }
    }

    const myMessages = messages.filter(m => m.user_id_fk === id)
    const otherMessages = messages.filter(m => !m.is_deleted && !m.is_deleted)

    return (
        <div>
            Hello <Link to="/userprofile" className="underline"> {first_name} {last_name}, {user_name}, ({user_role}) </Link>
            <br />
            <a href="" onClick={handleLogout} className="text-red-800 hover:underline cursor-pointer">
                Logout Account
            </a>
            <br /><br />
            <label htmlFor="searchuser">Search Message Board</label>
            <input
                type="text"
                name="searchuser"
                id="searchuser"
                className="border"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
                type="button"
                onClick={handleSearch}
                className="border bg-gray-300 hover:bg-gray-400 cursor-pointer rounded"
            >
                Search
            </button>
            <br />

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-600">{error}</p>}

            <br />
            <form>
                <label htmlFor="title">Title</label>
                <input
                    type="text"
                    name="title"
                    id="title"
                    className="border"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <label htmlFor="description">Description</label>
                <input
                    type="text"
                    name="description"
                    id="description"
                    className="border"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <button
                    type="button"
                    onClick={handlePost}
                    className="border bg-gray-300 hover:bg-gray-400 cursor-pointer rounded"
                >
                    {editingId !== null ? "Save" : "Post"}
                </button>
            </form>
            <br />
            <h1>My Messages</h1>
            <table className="border-collapse border">
                <thead>
                    <tr>
                        <th className="border px-2">Username</th>
                        <th className="border px-2">Title</th>
                        <th className="border px-2">Description</th>
                        <th></th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {myMessages.map((msg) => (
                        <tr key={msg.id}>
                            <td className="border px-2">{msg.user_name}</td>
                            <td className="border px-2">{msg.title}</td>
                            <td className="border px-2">{msg.description}</td>
                            <td className="border px-2">
                                <button
                                    onClick={() => handleEditStart(msg.id, msg.title, msg.description)}
                                    className="border bg-orange-300 hover:bg-orange-400 cursor-pointer rounded"
                                >
                                    Update
                                </button>
                            </td>
                            <td className="border px-2">
                                {msg.is_deleted ? (
                                    <button
                                        onClick={() => handleUnarchive(msg.id)}
                                        className="border bg-green-300 hover:bg-green-400 cursor-pointer rounded"
                                    >
                                        Unarchive
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleArchive(msg.id)}
                                        className="border bg-red-300 hover:bg-red-400 cursor-pointer rounded"
                                    >
                                        Archive
                                    </button>
                                )}
                            </td>
                            <td className="border px-2">
                                <button
                                    onClick={() => handleDelete(msg.id)}
                                    className="border bg-gray-300 hover:bg-gray-400 cursor-pointer rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <br /><h1>Message Board</h1>
            <table className="border-collapse border">
                <thead>
                    <tr>
                        <th className="border px-2">Username</th>
                        <th className="border px-2">Title</th>
                        <th className="border px-2">Description</th>
                    </tr>
                </thead>
                <tbody>
                    {otherMessages.map((msg) => (
                        <tr key={msg.id}>
                            <td className="border px-2">{msg.user_name}</td>
                            <td className="border px-2">{msg.title}</td>
                            <td className="border px-2">{msg.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Homepage