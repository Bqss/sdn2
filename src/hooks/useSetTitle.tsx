import { defaultLayoutContext } from "@/app/admin/layout"
import { useContext, useEffect } from "react"

export const useSetTitle = (title: string) => {
  const {setTitle} = useContext(defaultLayoutContext);
  useEffect(() => {
    setTitle(title);
  },[title, setTitle]);
}