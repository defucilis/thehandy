import { ReactNode } from "react";
import Handy from "./Handy";
declare const HandyProvider: ({ children }: {
    children: ReactNode;
}) => JSX.Element;
declare const useHandy: () => {
    handy: Handy | null;
};
export { HandyProvider };
export default useHandy;
//# sourceMappingURL=HandyReact.d.ts.map