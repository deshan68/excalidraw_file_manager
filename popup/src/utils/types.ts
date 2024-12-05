export interface File {
  id: string;
  name: string;
  lastModified: string;
  excalidraw: string;
}

export interface Collection {
  id: string;
  name: string;
  fileIds: string[];
}
