"use client";
import { useEffect } from "react";
import ProviderConfigration from "./components/ProviderConfigration";
import { useQueryClient } from "@tanstack/react-query";

const Page = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries();
  }, [queryClient]);

  return (
    <div>
      <ProviderConfigration />
    </div>
  );
};

export default Page;
