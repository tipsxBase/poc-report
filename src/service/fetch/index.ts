import { Message } from "@arco-design/web-react";
import { invoke } from "@tauri-apps/api";

export interface TauriCommandResponse<T> {
  message: string;
  success: boolean;
  data: T;
}

export interface TauriCommandPageResponse<T> extends TauriCommandResponse<T> {
  page_no: number;
  page_size: number;
  total: number;
}

export const tauriInvoke = <T>(
  method: string,
  params?: Record<string, any>
) => {
  return new Promise<TauriCommandResponse<T>>((resolve, reject) => {
    invoke<TauriCommandResponse<T>>(method, params)
      .then((res) => {
        const { success, message: msg } = res;
        if (!success) {
          Message.warning(msg);
          return reject(res);
        }
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const tauriPageInvoke = <T>(
  method: string,
  params?: Record<string, any>
) => {
  return new Promise<TauriCommandPageResponse<T>>((resolve, reject) => {
    invoke<TauriCommandPageResponse<T>>(method, params)
      .then((res) => {
        const { success, message: msg } = res;
        if (!success) {
          Message.warning(msg);
          return reject(res);
        }
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
