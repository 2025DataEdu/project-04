
export interface Complaint {
  id: string;
  complaint_number: string;
  title: string;
  content: string;
  complainant_name: string;
  complainant_contact: string;
  category: string;
  priority: string;
  status: string;
  assigned_to?: string;
  resolution_content?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
}

export interface ComplaintSolution {
  id: string;
  category: string;
  keywords: string[];
  solution_title: string;
  solution_content: string;
  priority_score: number;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface ComplaintStats {
  total: number;
  resolved: number;
  pending: number;
  categories: Record<string, number>;
  monthlyData: Array<{
    month: string;
    count: number;
    resolved: number;
  }>;
}
