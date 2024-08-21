import useResourceStore from "@/stores/resource";
import { useEffect } from "react";
import { Button, Empty, Message } from "@arco-design/web-react";
import ResourceCard from "./ResourceCard";
import { FaDownload } from "react-icons/fa";
import { useMemoizedFn } from "ahooks";
import { dialog } from "@tauri-apps/api";

export interface ResourceManageProps {}

/**
 *
 */
const ResourceManage = () => {
  const { records, fetchResourceList, downloadResourceZip } =
    useResourceStore();

  useEffect(() => {
    fetchResourceList();
  }, [fetchResourceList]);

  const doDownloadZip = useMemoizedFn(async () => {
    const selectedDirectory = await dialog.open({
      directory: true,
      multiple: false,
      title: "选择下载目录",
    });
    downloadResourceZip(selectedDirectory as string, "POC作战包").then(() => {
      Message.success("作战包开始下载，请前往任务中心查看下载进度。");
    });
  });
  return (
    <div className="p-5">
      <Button
        className="mb-3 flex items-center"
        type="primary"
        icon={<FaDownload />}
        onClick={doDownloadZip}
      >
        作战包下载
      </Button>
      <div className="flex gap-3">
        {records && records.length > 0 ? (
          records.map((item) => (
            <ResourceCard key={item.resource_id} resource={item} />
          ))
        ) : (
          <Empty />
        )}
      </div>
    </div>
  );
};

export default ResourceManage;
