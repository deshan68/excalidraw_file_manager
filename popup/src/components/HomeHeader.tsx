import {
  Button,
  Dialog,
  DropdownMenu,
  Flex,
  Text,
  TextField,
} from "@radix-ui/themes";
import { PlusIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { setStorage } from "../../../shared/chrome-utils";
import { StorageKeys } from "../../../shared/types";
import { useAppDispatch, useAppSelector } from "../hooks/UseReduxType";
import { addCollection } from "../slices/collectionSlice";
import { addFile } from "../slices/fileSlice";
import { CollectionInstance } from "../lib/collectionInstance";
import { FileInstance } from "../lib/fileCollection";

const HomeHeader = () => {
  const collections = useAppSelector((state) => state.collection.collections);
  const files = useAppSelector((state) => state.file.files);
  const dispatch = useAppDispatch();
  const [collectionName, setCollectionName] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");

  const handleCreateCollection = async () => {
    const collection = new CollectionInstance(collectionName);

    const updatedCollections = [...collections, collection.getCollection()];

    await setStorage(
      StorageKeys.COLLECTION,
      JSON.stringify(updatedCollections)
    );

    dispatch(addCollection(collection.getCollection()));
  };

  const handleCreateFile = async () => {
    const file = new FileInstance(fileName);

    const updatedFiles = [...files, file.getFile()];

    await setStorage(StorageKeys.FILE, JSON.stringify(updatedFiles));

    dispatch(addFile(file.getFile()));
  };

  return (
    <Flex my="3" justify="between">
      <Flex direction="column">
        <Text size="5" weight="bold" trim="both">
          Excalidraw
        </Text>
        <Text size="1" weight="light">
          File Manager
        </Text>
      </Flex>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Flex
            style={{
              backgroundColor: "#E6E5FF",
              borderRadius: "100%",
              cursor: "pointer",
            }}
            p="2"
            justify="center"
            align="center"
          >
            <PlusIcon />
          </Flex>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content size="1" color="gray" variant="soft">
          {/* Dialog for "Create File" */}
          <Dialog.Root>
            <Dialog.Trigger>
              <DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
                File
              </DropdownMenu.Item>
            </Dialog.Trigger>
            <Dialog.Content maxWidth="450px">
              <Dialog.Title size="3">Create File</Dialog.Title>
              <Flex direction="column" gap="3">
                <label>
                  <Text as="div" size="1" mb="1">
                    File Name
                  </Text>
                  <TextField.Root
                    placeholder="Enter file name"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                  />
                </label>
              </Flex>
              <Flex gap="3" mt="4" justify="end">
                <Dialog.Close>
                  <Button variant="soft" color="gray" size="1">
                    Cancel
                  </Button>
                </Dialog.Close>
                <Dialog.Close>
                  <Button size="1" onClick={handleCreateFile}>
                    Create
                  </Button>
                </Dialog.Close>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>

          {/* Dialog for "Create Collection" */}
          <Dialog.Root>
            <Dialog.Trigger>
              <DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
                Collection
              </DropdownMenu.Item>
            </Dialog.Trigger>
            <Dialog.Content maxWidth="450px">
              <Dialog.Title size="3">Create Collection</Dialog.Title>
              <Flex direction="column" gap="3">
                <label>
                  <Text as="div" size="2" mb="1">
                    Collection Name
                  </Text>
                  <TextField.Root
                    placeholder="Enter collection name"
                    value={collectionName}
                    onChange={(e) => setCollectionName(e.target.value)}
                  />
                </label>
              </Flex>
              <Flex gap="3" mt="4" justify="end">
                <Dialog.Close>
                  <Button variant="soft" color="gray" size="1">
                    Cancel
                  </Button>
                </Dialog.Close>
                <Dialog.Close>
                  <Button size="1" onClick={handleCreateCollection}>
                    Create
                  </Button>
                </Dialog.Close>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Flex>
  );
};

export default HomeHeader;
