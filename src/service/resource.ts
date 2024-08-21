import { tauriInvoke } from "./fetch/index";
import { CommonEntity } from "@/stores/SharedType";

export interface ResourceEntity extends CommonEntity {
  resource_id?: number;
  resource_name?: string;
  resource_url?: string;
  resource_size?: number;
  resource_description?: string;
  resource_required?: number;
}

export const queryResourceList = () => {
  return tauriInvoke<ResourceEntity[]>("query_resource_list");
};

export const downloadResource = (
  fileDir: string,
  url: string,
  fileName: string
) => {
  return tauriInvoke<string>("download_file_from_oss", {
    fileDir,
    fileName,
    url,
  });
};

export const downloadResourceZip = (fileDir: string, zipName: string) => {
  return tauriInvoke<string>("download_zip", {
    fileDir,
    zipName,
  });
};

export const uploadResource = (url: string, fileName: string) => {
  return tauriInvoke<string>("upload_resource_by_sftp", {
    url,
    fileName,
  });
};
