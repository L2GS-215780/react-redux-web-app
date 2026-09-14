import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

interface MessageBoardItem {
    id: number
    user_id_fk: number
    user_name: string
    full_name: string
    title: string
    description: string
    is_deleted?: number
    created_at: string
    updated_at: string
}

interface MessageBoardState {
    messages: MessageBoardItem[]
    loading: boolean
    error: string | null
}

const initialState: MessageBoardState = {
    messages: [],
    loading: false,
    error: null,
}

export const fetchAllMessageBoards = createAsyncThunk(
    'messageBoard/fetchAll',
    async (_, { rejectWithValue }) => {
        const res = await fetch('http://localhost:3000/api/v1/message-boards/retrieve-message-boards/', {
            credentials: 'include',
        })

        const data = await res.json()

        if (!res.ok) {
            return rejectWithValue(data.message || 'Failed to fetch message boards')
        }

        return data.data as MessageBoardItem[]
    }
)

export const searchAndFilterMessageBoards = createAsyncThunk(
    'messageBoard/searchAndFilter',
    async (
        filters: { search_message_board?: string; is_deleted?: number; created_at?: string },
        { rejectWithValue }
    ) => {
        const params = new URLSearchParams()

        if (filters.search_message_board) params.append('search_message_board', filters.search_message_board)
        if (filters.is_deleted !== undefined) params.append('is_deleted', String(filters.is_deleted))
        if (filters.created_at) params.append('created_at', filters.created_at)

        const res = await fetch(
            `http://localhost:3000/api/v1/message-boards/search-filter-message-board/?${params.toString()}`,
            { credentials: 'include' }
        )

        const data = await res.json()

        if (!res.ok) {
            return rejectWithValue(data.message || 'Failed to search message boards')
        }

        return data.data as MessageBoardItem[]
    }
)

export const createMessageBoard = createAsyncThunk(
    'messageBoard/create',
    async (
        payload: { user_id_fk: number; title: string; description: string },
        { rejectWithValue }
    ) => {
        const res = await fetch('http://localhost:3000/api/v1/message-boards/create-message-board/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(payload),
        })

        const data = await res.json()

        if (!res.ok) {
            return rejectWithValue(data.message || 'Failed to post message')
        }

        return true
    },
    {
        // refetch after creating, since the create endpoint only returns an insertId, not the full row
    }
)

export const updateMessageBoard = createAsyncThunk(
    'messageBoard/update',
    async (
        payload: { id: number; title?: string; description?: string },
        { rejectWithValue }
    ) => {
        const { id, ...updates } = payload

        const res = await fetch(`http://localhost:3000/api/v1/message-boards/update-message-board/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(updates),
        })

        const data = await res.json()

        if (!res.ok) {
            return rejectWithValue(data.message || 'Failed to update message')
        }

        return { id, ...updates }
    }
)

export const archiveMessageBoard = createAsyncThunk(
    'messageBoard/archive',
    async (id: number, { rejectWithValue }) => {
        const res = await fetch(`http://localhost:3000/api/v1/message-boards/archive-message-board/${id}`, {
            method: 'PUT',
            credentials: 'include',
        })

        const data = await res.json()

        if (!res.ok) {
            return rejectWithValue(data.message || 'Failed to archive message')
        }

        return id
    }
)

export const unarchiveMessageBoard = createAsyncThunk(
    'messageBoard/unarchive',
    async (id: number, { rejectWithValue }) => {
        const res = await fetch(`http://localhost:3000/api/v1/message-boards/unarchive-message-board/${id}`, {
            method: 'PUT',
            credentials: 'include',
        })

        const data = await res.json()

        if (!res.ok) {
            return rejectWithValue(data.message || 'Failed to unarchive message')
        }

        return id
    }
)

export const deleteMessageBoard = createAsyncThunk(
    'messageBoard/delete',
    async (id: number, { rejectWithValue }) => {
        const res = await fetch(`http://localhost:3000/api/v1/message-boards/delete-message-board/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        })

        const data = await res.json()

        if (!res.ok) {
            return rejectWithValue(data.message || 'Failed to delete message')
        }

        return id
    }
)

const messageBoardSlice = createSlice({
    name: 'messageBoard',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllMessageBoards.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchAllMessageBoards.fulfilled, (state, action) => {
                state.loading = false
                state.messages = action.payload
            })
            .addCase(fetchAllMessageBoards.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            .addCase(searchAndFilterMessageBoards.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(searchAndFilterMessageBoards.fulfilled, (state, action) => {
                state.loading = false
                state.messages = action.payload
            })
            .addCase(searchAndFilterMessageBoards.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            .addCase(updateMessageBoard.fulfilled, (state, action) => {
                const message = state.messages.find(m => m.id === action.payload.id)
                if (message) {
                    if (action.payload.title) message.title = action.payload.title
                    if (action.payload.description) message.description = action.payload.description
                }
            })
            .addCase(updateMessageBoard.rejected, (state, action) => {
                state.error = action.payload as string
            })
            .addCase(deleteMessageBoard.fulfilled, (state, action) => {
                state.messages = state.messages.filter(m => m.id !== action.payload)
            })
            .addCase(deleteMessageBoard.rejected, (state, action) => {
                state.error = action.payload as string
            })
            .addCase(createMessageBoard.rejected, (state, action) => {
                state.error = action.payload as string
            })
            .addCase(archiveMessageBoard.rejected, (state, action) => {
                state.error = action.payload as string
            })
            .addCase(unarchiveMessageBoard.rejected, (state, action) => {
                state.error = action.payload as string
            })
    },
})

export default messageBoardSlice.reducer