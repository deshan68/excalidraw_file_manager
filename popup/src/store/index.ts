import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../slices/counterSlice";
import navigationReducer from "../slices/navigationSlice";
import collectionSliceReducer from "../slices/collectionSlice";
import fileSliceReducer from "../slices/fileSlice";

const store = configureStore({
  reducer: {
    counter: counterReducer,
    navigation: navigationReducer,
    collection: collectionSliceReducer,
    file: fileSliceReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
