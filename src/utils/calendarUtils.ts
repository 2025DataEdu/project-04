
export const getDaysInMonth = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  
  // Add all days of the month - 날짜 생성을 더 정확하게 수정
  for (let day = 1; day <= daysInMonth; day++) {
    // UTC 시간대로 날짜 생성하여 시간대 문제 방지
    const dayDate = new Date(year, month, day, 12, 0, 0, 0);
    days.push(dayDate);
  }
  
  console.log(`Calendar days generated for ${year}-${month + 1}: ${daysInMonth} days`);
  console.log('Days array length:', days.length);
  console.log('Last day in array:', days[days.length - 1]);
  console.log('Last day date check:', days[days.length - 1]?.getDate());
  
  return days;
};

export const getAssignmentsForDate = (date: Date, assignments: any[]) => {
  // 정확한 날짜 문자열 생성 (YYYY-MM-DD 형식)
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const dateString = `${year}-${month}-${day}`;
  
  const dateAssignments = assignments.filter(assignment => {
    const assignmentDate = assignment.assignment_date;
    const match = assignmentDate === dateString;
    if (day === '30') {
      console.log(`Checking day 30: ${dateString} vs ${assignmentDate}, match: ${match}`);
    }
    return match;
  });
  
  if (day === '30') {
    console.log(`Day 30 (${dateString}) assignments:`, dateAssignments);
    console.log('All assignments:', assignments.map(a => a.assignment_date));
  }
  
  console.log(`Calendar date: ${dateString}, Reports found: ${dateAssignments.length}, Day: ${date.getDate()}`);
  
  return dateAssignments;
};
