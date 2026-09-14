import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

interface AuthState {
    id: number | null
    first_name: string | null
    last_name: string | null
    user_name: string | null
    user_role: string | null
    is_active: number | null
    isAuthenticated: boolean
    loading: boolean
    error: string | null
}

const initialState: AuthState = {
    id: null,
    first_name: null,
    last_name: null,
    user_name: null,
    user_role: null,
    is_active: null,
    isAuthenticated: false,
    loading: false,
    error: null,
}

interface LoginResponseData {
    id: number
    first_name: string
    last_name: string
    user_name: string
    user_role: string
    is_active: number
}

interface RegisterResponseData {
    id: number
    first_name: string
    last_name: string
    user_name: string
    user_role: string
    is_active: number
}

interface UpdateResponseData {
    id: number
    first_name: string
    last_name: string
    user_name: string
    user_role: string
    is_active: number
}

export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials: { user_name: string; password: string }, { rejectWithValue }) => {
        const res = await fetch('http://localhost:3000/api/v1/user-accounts/login-account/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(credentials),
        })

        const data = await res.json()

        if (!res.ok) {
            return rejectWithValue(data.message || 'Login failed')
        }

        return data.data as LoginResponseData
    }
)

export const fetchCurrentUser = createAsyncThunk(
    'auth/me',
    async (_, { rejectWithValue }) => {
        const res = await fetch('http://localhost:3000/api/v1/user-accounts/me/', {
            credentials: 'include',
        })

        const data = await res.json()

        if (!res.ok) {
            return rejectWithValue(data.message || 'Not authenticated')
        }

        return data.data as LoginResponseData
    }
)

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        const res = await fetch('http://localhost:3000/api/v1/user-accounts/logout-account/', {
            method: 'POST',
            credentials: 'include',
        })

        const data = await res.json()

        if (!res.ok) {
            return rejectWithValue(data.message || 'Logout failed')
        }

        return true
    }
)

export const registerUser = createAsyncThunk(
    'auth/register',
    async (
        newUser: { first_name: string; last_name: string; user_name: string; password: string, user_role: string },
        { rejectWithValue }
    ) => {
        const res = await fetch('http://localhost:3000/api/v1/user-accounts/create-account/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(newUser),
        })

        const data = await res.json()

        if (!res.ok) {
            return rejectWithValue(data.message || 'Registration failed')
        }

        return data.data as RegisterResponseData
    }
)

export const updateUser = createAsyncThunk(
    'auth/update',
    async (
        payload: { id: number; first_name?: string; last_name?: string; user_name?: string; password?: string },
        { rejectWithValue }
    ) => {
        const { id, ...updates } = payload

        const res = await fetch(`http://localhost:3000/api/v1/user-accounts/update-account/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(updates),
        })

        const data = await res.json()

        if (!res.ok) {
            return rejectWithValue(data.message || 'Update failed')
        }

        return data.data as UpdateResponseData
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            Object.assign(state, initialState)
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false
                state.isAuthenticated = true
                state.id = action.payload.id
                state.first_name = action.payload.first_name
                state.last_name = action.payload.last_name
                state.user_name = action.payload.user_name
                state.user_role = action.payload.user_role
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.isAuthenticated = true
                state.id = action.payload.id
                state.first_name = action.payload.first_name
                state.last_name = action.payload.last_name
                state.user_name = action.payload.user_name
                state.user_role = action.payload.user_role
            })
            .addCase(fetchCurrentUser.rejected, (state) => {
                Object.assign(state, initialState)
            })
            .addCase(logoutUser.fulfilled, (state) => {
                Object.assign(state, initialState)
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false
                state.isAuthenticated = true
                state.id = action.payload.id
                state.first_name = action.payload.first_name
                state.last_name = action.payload.last_name
                state.user_name = action.payload.user_name
                state.user_role = action.payload.user_role
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            .addCase(updateUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false
                state.first_name = action.payload.first_name
                state.last_name = action.payload.last_name
                state.user_name = action.payload.user_name
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    },
})

export const { logout } = authSlice.actions
export default authSlice.reducer