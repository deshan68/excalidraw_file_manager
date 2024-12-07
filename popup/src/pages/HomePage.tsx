import { Flex } from "@radix-ui/themes";
import Collections from "../components/Collections";
import RecentFile from "../components/RecentFile";
import HomeHeader from "../components/HomeHeader";
import { useEffect } from "react";
import {
  getStorage,
  sendMessageToContent,
  setStorage,
} from "../../../shared/chrome-utils";
import { MessageTypes, STORAGE_KEYS } from "../../../shared/types";
import { Collection, File } from "../utils/types";
import { useAppDispatch, useAppSelector } from "../hooks/UseReduxType";
import { loadCollections } from "../slices/collectionSlice";
import { loadFiles } from "../slices/fileSlice";
import {
  updateCurrentWorkingFileId,
  updateUrlState,
} from "../slices/configSlice";
import InvalidUrlMessage from "../components/InvalidUrlMessage";

const HomePage = () => {
  const dispatch = useAppDispatch();
  const currentUrlState = useAppSelector((state) => state.config.isValidUrl);

  useEffect(() => {
    checkCurrentURL();
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    const storageCollections = await getStorage<Collection[]>(
      STORAGE_KEYS.COLLECTION
    );
    if (storageCollections) {
      dispatch(loadCollections(storageCollections));
    } else {
      dispatch(loadCollections([]));
    }

    const storageFiles = await getStorage<File[]>(STORAGE_KEYS.FILE);
    if (storageFiles) {
      dispatch(loadFiles(storageFiles));
    } else {
      dispatch(loadFiles([]));
    }

    const currentWorkingFileId = await getStorage<string>(
      STORAGE_KEYS.CURRENT_WORKING_FILE_ID
    );
    if (currentWorkingFileId) {
      dispatch(updateCurrentWorkingFileId(currentWorkingFileId));
    } else {
      dispatch(updateCurrentWorkingFileId(""));
    }

    if (currentWorkingFileId && storageFiles)
      loadExcalidrawFile(currentWorkingFileId, storageFiles);
  };

  const checkCurrentURL = async () => {
    const response = await sendMessageToContent({
      type: MessageTypes.OPEN_POPUP,
    });
    if (response) dispatch(updateUrlState(true));
  };

  const loadExcalidrawFile = async (
    currentWorkingFileId: string,
    storageFiles: File[]
  ) => {
    const response = await sendMessageToContent({
      type: MessageTypes.LOAD_EXCALIDRAW_FILE,
    });
    if (!response) return;

    const updatedFiles: File[] = storageFiles.map((f) => {
      if (f.id === currentWorkingFileId)
        return {
          ...f,
          excalidraw: response,
        };
      return f;
    });

    await setStorage(STORAGE_KEYS.FILE, JSON.stringify(updatedFiles));
    dispatch(loadFiles(updatedFiles));
  };

  if (!currentUrlState) {
    return <InvalidUrlMessage />;
  }

  return (
    <Flex direction="column" gap="2">
      {/* header */}
      <HomeHeader />

      {/* collections */}
      <Collections />

      {/* Recent file */}
      <RecentFile />
    </Flex>
  );
};

export default HomePage;
