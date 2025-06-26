
import React from 'react';
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { MessageSquareMore, Plus } from "lucide-react";

interface ComplaintHeaderProps {
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
  children: React.ReactNode;
}

const ComplaintHeader = ({ isCreateDialogOpen, setIsCreateDialogOpen, children }: ComplaintHeaderProps) => {
  return (
    <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
      <CardTitle className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquareMore className="h-5 w-5" />
          민원 관리
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30">
              <Plus className="h-4 w-4 mr-2" />
              민원 등록
            </Button>
          </DialogTrigger>
          {children}
        </Dialog>
      </CardTitle>
      <CardDescription className="text-orange-100">
        민원 접수, 처리 및 해결방법 관리
      </CardDescription>
    </CardHeader>
  );
};

export default ComplaintHeader;
