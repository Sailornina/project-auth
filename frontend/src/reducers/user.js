import { createSlice } from '@reduxjs/toolkit';

const user = createSlice({
    name: 'user',
    initialState: {
        username: null,
        accessToken: null,
        userId: null,
        error: null
    },
    reducers: {
        setUserId: (store, action) => {
            store.userId = action.payload
        },
        setUsername: (store, action) => {
            store.username = action.payload;
        },
        setAccessToken: (store, action) => {
            store.accessToken = action.payload;
        },
        setError: (store, action) => {
            store.error = action.payload;
        },
    }
});

export default user;