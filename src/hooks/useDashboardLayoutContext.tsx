import { defaultLayoutContext } from "@/app/admin/layout";
import { useContext } from "react";

const useDashboardLayoutContext = () => {
  const context = useContext(defaultLayoutContext);

  if (!context) {
    throw new Error('useDashboardLayoutContext must be used within a DashboardLayoutProvider');
  }

  return context;
}

export default useDashboardLayoutContext;