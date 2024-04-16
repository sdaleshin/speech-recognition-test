import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { MemoModel } from '../types';
import { RootState } from './store';
import { listenerMiddleware } from './listenerMiddleware';

export interface MemoState {
    items: MemoModel[];
    newMemo: Partial<MemoModel>;
}

const initialState: MemoState = {
    items: JSON.parse(localStorage.getItem('memos') || '[]'),
    newMemo: null,
};

export const memoSlice = createSlice({
    name: 'memo',
    initialState,
    reducers: {
        addItem: (state, action) => {
            state.items.unshift(action.payload);
        },
        editItem: (state, action) => {
            const { id } = action.payload;
            const index = state.items.findIndex((item) => item.id === id);
            if (index !== -1) {
                state.items[index] = {
                    ...state.items[index],
                    ...action.payload,
                };
            }
        },
        deleteItem: (state, action) => {
            const id = action.payload;
            state.items = state.items.filter((item) => item.id !== id);
        },
        createNewMemo(state) {
            state.newMemo = {
                date: new Date().toLocaleString(),
                text: '',
            };
        },
        clearNewMemo: (state) => {
            state.newMemo = null;
        },
        addNewMemoText: (state, action) => {
            state.newMemo = {
                ...state.newMemo,
                text: state.newMemo.text + ' ' + action.payload,
            };
        },
    },
});

export const selectMemoSlice = (state: RootState) => state.memo;
export const selectMemos = (state: RootState) => selectMemoSlice(state).items;
export const selectNewMemo = (state: RootState) =>
    selectMemoSlice(state).newMemo;

export const {
    addItem,
    editItem,
    deleteItem,
    createNewMemo,
    clearNewMemo,
    addNewMemoText,
} = memoSlice.actions;

listenerMiddleware.startListening({
    matcher: isAnyOf(addItem, editItem, deleteItem),
    effect: async (action, listenerApi) => {
        localStorage.setItem(
            'memos',
            JSON.stringify(selectMemos(listenerApi.getState() as RootState)),
        );
    },
});
