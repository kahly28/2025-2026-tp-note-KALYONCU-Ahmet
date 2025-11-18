import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Job } from "@/types";
import { push, remove } from "@/stores/favouriteSlice";
import { AppDispatch, RootState } from "@/stores/store";

type ToggleResult = "added" | "removed" | "unchanged";

type UseFavouriteManagerReturn = {
  favouriteJobs: Array<Job>;
  isFavourite: (jobId: string) => boolean;
  addFavourite: (job: Job) => ToggleResult;
  removeFavourite: (jobId: string) => ToggleResult;
  toggleFavourite: (job: Job) => ToggleResult;
};

export const useFavouriteManager = (): UseFavouriteManagerReturn => {
  const dispatch = useDispatch<AppDispatch>();
  const favouriteJobs = useSelector(
    (state: RootState) => state.favourite.value,
  );

  const favouriteIds = useMemo(() => {
    return new Set(favouriteJobs.map((job) => job.id));
  }, [favouriteJobs]);

  const isFavourite = useCallback(
    (jobId: string) => {
      return favouriteIds.has(jobId);
    },
    [favouriteIds],
  );

  const addFavourite = useCallback(
    (job: Job): ToggleResult => {
      if (isFavourite(job.id)) {
        return "unchanged";
      }

      dispatch(push(job));
      return "added";
    },
    [dispatch, isFavourite],
  );

  const removeFavourite = useCallback(
    (jobId: string): ToggleResult => {
      if (!isFavourite(jobId)) {
        return "unchanged";
      }

      dispatch(remove(jobId));
      return "removed";
    },
    [dispatch, isFavourite],
  );

  const toggleFavourite = useCallback(
    (job: Job): ToggleResult => {
      if (isFavourite(job.id)) {
        dispatch(remove(job.id));
        return "removed";
      }

      dispatch(push(job));
      return "added";
    },
    [dispatch, isFavourite],
  );

  return {
    favouriteJobs,
    isFavourite,
    addFavourite,
    removeFavourite,
    toggleFavourite,
  };
};
