import { TauriCommandResponse } from "@/service/fetch";
import {
  downloadResource,
  downloadResourceZip,
  queryResourceList,
  ResourceEntity,
  uploadResource,
} from "@/service/resource";
import { create } from "zustand";

interface ResourceStore {
  records: ResourceEntity[];
  fetchResourceList: () => Promise<void>;
  downloadResource: (
    file_dir: string,
    url: string,
    file_name: string
  ) => Promise<TauriCommandResponse<string>>;

  downloadResourceZip: (
    file_dir: string,
    zip_name: string
  ) => Promise<TauriCommandResponse<string>>;

  uploadResource: (
    url: string,
    fileName: string
  ) => Promise<TauriCommandResponse<string>>;
}

const useResourceStore = create<ResourceStore>((set) => ({
  records: [],
  fetchResourceList: async () => {
    const res = await queryResourceList();
    set(() => {
      return {
        records: res.data,
      };
    });
  },
  downloadResource: (file_dir: string, url: string, file_name: string) => {
    return downloadResource(file_dir, url, file_name);
  },

  downloadResourceZip: (file_dir: string, zip_name: string) => {
    return downloadResourceZip(file_dir, zip_name);
  },

  uploadResource: (url: string, fileName: string) => {
    return uploadResource(url, fileName);
  },
}));

export default useResourceStore;
