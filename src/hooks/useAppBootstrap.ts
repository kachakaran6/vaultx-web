import { useEffect } from "react";
import { useAppStore } from "../store/app-store";

export function useAppBootstrap(): void {
  const bootstrap = useAppStore((state) => state.bootstrap);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);
}
