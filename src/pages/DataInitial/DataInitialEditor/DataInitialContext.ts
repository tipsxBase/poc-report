import { FormInstance } from "@arco-design/web-react";
import { createContext } from "react";

export interface DataInitialContextProps {
  form: FormInstance;
}

const DataInitialContext = createContext<DataInitialContextProps>(
  {} as DataInitialContextProps
);

export default DataInitialContext;
