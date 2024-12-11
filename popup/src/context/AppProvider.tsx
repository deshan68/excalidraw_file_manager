import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  getStorage,
  sendMessageToContent,
  setStorage,
} from "../../../shared/chrome-utils";
import { MessageTypes, STORAGE_KEYS } from "../../../shared/types";
import { useAppDispatch } from "../hooks/UseReduxType";
import { Collection, File } from "../utils/types";
import { loadCollections } from "../slices/collectionSlice";
import { loadFiles } from "../slices/fileSlice";
import { updateCurrentWorkingFileId } from "../slices/configSlice";

interface AppContextType {
  isValidUrl: boolean;
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();

  const [isValidUrl, setIsValidUrl] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const checkCurrentURL = async () => {
    try {
      const response = await sendMessageToContent({
        type: MessageTypes.OPEN_POPUP,
      });
      if (response) setIsValidUrl(true);
    } catch (error) {
      console.error("Error while checking current URL");
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    checkCurrentURL();
    loadInitialData();
  }, []);

  return (
    <AppContext.Provider value={{ isValidUrl, loading }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
