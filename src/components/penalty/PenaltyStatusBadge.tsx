
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface PenaltyStatusBadgeProps {
  status: '대기' | '완료' | '취소';
}

const PenaltyStatusBadge: React.FC<PenaltyStatusBadgeProps> = ({ status }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case '대기': return 'bg-yellow-100 text-yellow-700';
      case '완료': return 'bg-green-100 text-green-700';
      case '취소': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Badge className={`text-xs ${getStatusColor(status)}`}>
      {status}
    </Badge>
  );
};

export default PenaltyStatusBadge;
