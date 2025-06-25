
export const getDutyTypeColor = (dutyType: string) => {
  switch (dutyType) {
    case '평일야간': return 'bg-blue-100 text-blue-700';
    case '주말주간': return 'bg-green-100 text-green-700';
    case '주말야간': return 'bg-purple-100 text-purple-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};
