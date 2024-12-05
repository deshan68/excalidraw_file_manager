import { Button, Flex } from "@radix-ui/themes";
import Collections from "../components/Collections";
import RecentFile from "../components/RecentFile";
import HomeHeader from "../components/HomeHeader";
import { useEffect } from "react";
import {
  getAllKeys,
  getStorage,
  removeStorage,
} from "../../../shared/chrome-utils";
import { StorageKeys } from "../../../shared/types";
import { Collection, File } from "../utils/types";
import { useAppDispatch } from "../hooks/UseReduxType";
import { loadCollections } from "../slices/collectionSlice";
import { loadFiles } from "../slices/fileSlice";

const HomePage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    loadInitialData();
  }, []);

  const reset = async () => {
    const keys = await getAllKeys();
    removeStorage(keys);
  };

  const loadInitialData = async () => {
    const storageCollections = await getStorage<Collection[]>(
      StorageKeys.COLLECTION
    );
    const storageFiles = await getStorage<File[]>(StorageKeys.FILE);
    console.log("storageCollections", storageCollections);
    console.log("storageFiles", storageFiles);

    if (storageCollections) {
      dispatch(loadCollections(storageCollections));
    } else {
      dispatch(loadCollections([]));
    }

    if (storageFiles) {
      dispatch(loadFiles(storageFiles));
    } else {
      dispatch(loadFiles([]));
    }
  };

  return (
    <Flex direction="column" gap="2">
      {/* header */}
      <HomeHeader />

      {/* collections */}
      <Collections />

      {/* Recent file */}
      <RecentFile />

      <Button color="red" size={"1"} onClick={reset}>
        Reset
      </Button>
    </Flex>
  );
};

export default HomePage;
