import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { File } from "../utils/types";

interface FileState {
  files: File[];
}

const initialState: FileState = {
  files: [],
};

const fileSlice = createSlice({
  name: "file",
  initialState,
  reducers: {
    addFile: (state, action: PayloadAction<File>) => {
      state.files.push(action.payload);
    },
    deleteFile: (state, action: PayloadAction<string>) => {
      state.files = state.files.filter((f) => f.id !== action.payload);
    },
    loadFiles: (state, action: PayloadAction<File[]>) => {
      state.files = action.payload;
    },
    incrementByAmount: (_, action: PayloadAction<File>) => {
      console.log(action);
    },
  },
});

export const { addFile, loadFiles, deleteFile, incrementByAmount } =
  fileSlice.actions;
export default fileSlice.reducer;
