import { configureStore, StateFromReducersMapObject } from '@reduxjs/toolkit';
import { memoSlice } from './memo.slice';
import { listenerMiddleware } from './listenerMiddleware';

const reducer = {
    [memoSlice.name]: memoSlice.reducer,
};

export type RootState = StateFromReducersMapObject<typeof reducer>;

export const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({}).prepend(listenerMiddleware.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type AppGetState = typeof store.getState;
