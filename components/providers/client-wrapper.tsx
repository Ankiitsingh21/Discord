"use client";

import { ModalProvider } from "@/components/providers/modal-provider";

export const ClientWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ModalProvider />
      {children}
    </>
  );
};
