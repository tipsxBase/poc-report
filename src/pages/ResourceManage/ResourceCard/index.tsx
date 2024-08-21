import { ResourceEntity } from "@/service/resource";
import { Message, Tag, Tooltip } from "@arco-design/web-react";
import TextRender from "@/components/TextRender";
import { filesize } from "filesize";
import { FaDownload, FaUpload } from "react-icons/fa";
import { useMemoizedFn } from "ahooks";
import { dialog } from "@tauri-apps/api";
import useResourceStore from "@/stores/resource";
import TButton from "@/components/TButton";

export interface ResourceCardProps {
  resource: ResourceEntity;
}

/**
 *
 */
const ResourceCard = (props: ResourceCardProps) => {
  const { resource } = props;
  const { downloadResource, uploadResource } = useResourceStore();

  const {
    resource_name,
    resource_size,
    resource_url,
    resource_description,
    resource_required,
  } = resource;

  const download = useMemoizedFn(async () => {
    const selectedDirectory = await dialog.open({
      directory: true,
      multiple: false,
      title: "选择下载目录",
    });
    downloadResource(
      selectedDirectory as string,
      resource_url,
      resource_name
    ).then(() => {
      Message.success(`${resource_name}资源开始下载，请在任务中心查看下载进度`);
    });
  });

  const doUpload = useMemoizedFn(() => {
    uploadResource(resource_url, resource_name).then(() => {
      Message.success(`${resource_name}资源开始上传，请在任务中心查看上传进度`);
    });
  });

  return (
    <div className="flex w-72 flex-col rounded-lg border border-red p-4">
      <div className="text-lg font-bold">
        <TextRender className="text-lg font-bold" text={resource_name} />
      </div>
      <div className="py-4">{resource_description}</div>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Tag color="arcoblue">
            {filesize(resource_size, { standard: "jedec" })}
          </Tag>
          <Tooltip disabled={resource_required !== 1} content="测试必要文件">
            <Tag color={resource_required === 1 ? "#f53f3f" : "#86909c"}>
              {resource_required ? "必要" : "非必要"}
            </Tag>
          </Tooltip>
        </div>
        <div className="flex gap-1">
          {resource_required ? (
            <TButton
              tooltip="上传到默认服务器"
              size="small"
              type="text"
              className="flex items-center justify-center"
              icon={<FaUpload />}
              onClick={doUpload}
            />
          ) : null}

          <TButton
            tooltip="下载到本地"
            size="small"
            type="text"
            className="flex items-center justify-center"
            onClick={download}
            icon={<FaDownload />}
          />
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
