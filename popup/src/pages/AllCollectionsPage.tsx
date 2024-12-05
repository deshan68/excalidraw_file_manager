import { Flex, IconButton, Text } from "@radix-ui/themes";
import { useAppDispatch, useAppSelector } from "../hooks/UseReduxType";
import { goBack } from "../slices/navigationSlice";
import { ChevronLeftIcon, TrashIcon } from "@radix-ui/react-icons";
import CollectionCard from "../components/CollectionCard";
import { useState } from "react";
import { deleteCollection } from "../slices/collectionSlice";
import { setStorage } from "../../../shared/chrome-utils";
import { StorageKeys } from "../../../shared/types";
import EmptyList from "../components/EmptyList";

const AllCollectionsPage = () => {
  const dispatch = useAppDispatch();

  const collections = useAppSelector((state) => state.collection.collections);
  const currentScreen = useAppSelector(
    (state) => state.navigation.currentScreen
  );

  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);

  if (!currentScreen) {
    return <div>No screen to display</div>;
  }

  const toggleCollectionSelection = (collectionId: string) => {
    setSelectedCollections((prevSelected) => {
      if (prevSelected.includes(collectionId)) {
        // Remove if already selected
        return prevSelected.filter((id) => id !== collectionId);
      } else {
        // Add if not selected
        return [...prevSelected, collectionId];
      }
    });
  };

  const handleDeleteCollection = async () => {
    const updatedCollections = collections.filter(
      (c) => !selectedCollections.includes(c.id)
    );
    await setStorage(
      StorageKeys.COLLECTION,
      JSON.stringify(updatedCollections)
    );
    dispatch(deleteCollection(selectedCollections));
  };

  return (
    <Flex direction="column">
      {/* header */}
      <Flex my="3" justify="between" align="center">
        <Flex gapX="2" align="center">
          <Flex
            style={{ cursor: "pointer" }}
            onClick={() => dispatch(goBack())}
          >
            <ChevronLeftIcon />
          </Flex>
          <Text size="4" weight="bold">
            {currentScreen.title}
          </Text>
        </Flex>
        {selectedCollections.length !== 0 && (
          <IconButton
            size="1"
            color="red"
            variant="soft"
            radius="full"
            onClick={handleDeleteCollection}
          >
            <TrashIcon width="18" height="18" />
          </IconButton>
        )}
      </Flex>

      <Flex gap="2" overflowY="scroll" wrap="wrap">
        {collections.length === 0 && <EmptyList title="collection" />}

        {collections.map((col) => (
          <CollectionCard
            collection={col}
            selectedCollections={selectedCollections}
            toggleSelection={toggleCollectionSelection}
          />
        ))}
      </Flex>
    </Flex>
  );
};

export default AllCollectionsPage;