import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Job } from "@/types";

interface FavouriteState {
  value: Array<Job>;
}

const initialState: FavouriteState = {
  value: [],
};

export const favouriteSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    push: (state, job: PayloadAction<Job>) => {
      state.value.push(job.payload);
    },
    remove: (state, id: PayloadAction<string>) => {
      state.value = state.value.filter((job) => job.id !== id.payload);
    },
  },
});

export const { push, remove } = favouriteSlice.actions;
export default favouriteSlice.reducer;

export const selectIsInFavourite = (
  state: { favourite: FavouriteState },
  id: string,
) => {
  return state.favourite.value.some((job) => job.id === id);
};
