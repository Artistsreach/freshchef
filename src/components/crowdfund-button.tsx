"use client";

import { Button } from "./ui/button";
import { Crown } from "lucide-react";
import { CrowdfundModal } from "./crowdfund-modal";

type CrowdfundButtonProps = {
  appId: string;
  appName: string;
  appDescription?: string;
  onSuccess?: () => void;
};

export function CrowdfundButton({ 
  appId, 
  appName, 
  appDescription = "",
  onSuccess 
}: CrowdfundButtonProps) {
  return (
    <CrowdfundModal 
      appId={appId} 
      appName={appName} 
      appDescription={appDescription}
      onSuccess={onSuccess}
    >
      <Button size="sm" className="gap-1">
        <Crown className="h-4 w-4" />
        Crowdfund
      </Button>
    </CrowdfundModal>
  );
}
