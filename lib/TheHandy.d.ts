import { ReactNode } from "react";
import Handy from ".";
declare const HandyProvider: ({ children }: {
    children: ReactNode;
}) => JSX.Element;
declare const useHandy: () => {
    handy: Handy | null;
};
export { HandyProvider };
export default useHandy;
//# sourceMappingURL=TheHandy.d.ts.map