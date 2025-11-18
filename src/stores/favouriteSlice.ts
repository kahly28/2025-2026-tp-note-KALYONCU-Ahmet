import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Movie } from "../types";

interface FavouriteState {
  value: Array<Movie>;
}

const initialState: FavouriteState = {
  value: [],
};

export const favouriteSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    push: (state, movie: PayloadAction<Movie>) => {
      state.value.push(movie.payload);
    },
    remove: (state, id: PayloadAction<number>) => {
      state.value = state.value.filter((m) => m.id != id.payload);
    },
  },
});

export const { push, remove } = favouriteSlice.actions;
export default favouriteSlice.reducer;

export const selectIsInFavourite = (
  state: { favourite: FavouriteState },
  id: number,
) => {
  return state.favourite.value.some((movie) => movie.id === id);
};
