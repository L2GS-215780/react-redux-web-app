import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

interface UserAccount {
    id: number
    first_name: string
    last_name: string
    user_name: string
    user_role: string
    is_active: number
    created_at: string
    updated_at: string
}

interface UsersState {
    accounts: UserAccount[]
    loading: boolean
    error: string | null
}

const initialState: UsersState = {
    accounts: [],
    loading: false,
    error: null,
}

export const fetchAllUsers = createAsyncThunk(
    'users/fetchAll',
    async (_, { rejectWithValue }) => {
        const res = await fetch('http://localhost:3000/api/v1/user-accounts/retrieve-accounts/', {
            credentials: 'include',
        })

        const data = await res.json()

        if (!res.ok) {
            return rejectWithValue(data.message || 'Failed to fetch users')
        }

        return data.data as UserAccount[]
    }
)

export const searchAndFilterUsers = createAsyncThunk(
    'users/searchAndFilter',
    async (
        filters: { search_name?: string; user_role?: string; is_active?: number; created_at?: string },
        { rejectWithValue }
    ) => {
        const params = new URLSearchParams()

        if (filters.search_name) params.append('search_name', filters.search_name)
        if (filters.user_role) params.append('user_role', filters.user_role)
        if (filters.is_active !== undefined) params.append('is_active', String(filters.is_active))
        if (filters.created_at) params.append('created_at', filters.created_at)

        const res = await fetch(
            `http://localhost:3000/api/v1/user-accounts/search-filter-account/?${params.toString()}`,
            { credentials: 'include' }
        )

        const data = await res.json()

        if (!res.ok) {
            return rejectWithValue(data.message || 'Failed to search users')
        }

        return data.data as UserAccount[]
    }
)

export const activateUser = createAsyncThunk(
    'users/activate',
    async (id: number, { rejectWithValue }) => {
        const res = await fetch(`http://localhost:3000/api/v1/user-accounts/activate-account/${id}`, {
            method: 'PUT',
            credentials: 'include',
        })

        const data = await res.json()

        if (!res.ok) {
            return rejectWithValue(data.message || 'Failed to activate user')
        }

        return id
    }
)

export const deactivateUser = createAsyncThunk(
    'users/deactivate',
    async (id: number, { rejectWithValue }) => {
        const res = await fetch(`http://localhost:3000/api/v1/user-accounts/deactivate-account/${id}`, {
            method: 'PUT',
            credentials: 'include',
        })

        const data = await res.json()

        if (!res.ok) {
            return rejectWithValue(data.message || 'Failed to deactivate user')
        }

        return id
    }
)

export const deleteUser = createAsyncThunk(
    'users/delete',
    async (id: number, { rejectWithValue }) => {
        const res = await fetch(`http://localhost:3000/api/v1/user-accounts/delete-account/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        })

        const data = await res.json()

        if (!res.ok) {
            return rejectWithValue(data.message || 'Failed to delete user')
        }

        return id
    }
)

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllUsers.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.loading = false
                state.accounts = action.payload
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            .addCase(searchAndFilterUsers.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(searchAndFilterUsers.fulfilled, (state, action) => {
                state.loading = false
                state.accounts = action.payload
            })
            .addCase(searchAndFilterUsers.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            .addCase(activateUser.fulfilled, (state, action) => {
                const account = state.accounts.find(a => a.id === action.payload)
                if (account) account.is_active = 1
            })
            .addCase(activateUser.rejected, (state, action) => {
                state.error = action.payload as string
            })
            .addCase(deactivateUser.fulfilled, (state, action) => {
                const account = state.accounts.find(a => a.id === action.payload)
                if (account) account.is_active = 0
            })
            .addCase(deactivateUser.rejected, (state, action) => {
                state.error = action.payload as string
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.accounts = state.accounts.filter(a => a.id !== action.payload)
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.error = action.payload as string
            })
    },
})

export default usersSlice.reducer