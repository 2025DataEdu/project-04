
import React, { useState } from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import DutyAssignment from "@/components/DutyAssignment";
import HandoverDashboard from "@/components/HandoverDashboard";
import PenaltyDutyManagement from '@/components/PenaltyDutyManagement';
import ComplaintDashboard from '@/components/ComplaintDashboard';
import ComplaintManagement from '@/components/ComplaintManagement';
import DutyReport from '@/components/DutyReport';
import PageHeader from '@/components/layout/PageHeader';
import TabNavigation from '@/components/layout/TabNavigation';
import WorkAnalysisTab from '@/components/analysis/WorkAnalysisTab';

const Index = () => {
  const [activeTab, setActiveTab] = useState('assignment');

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <PageHeader />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabNavigation />

            <TabsContent value="assignment">
              <DutyAssignment />
            </TabsContent>

            <TabsContent value="analysis">
              <WorkAnalysisTab />
            </TabsContent>

            <TabsContent value="handover">
              <HandoverDashboard />
            </TabsContent>

            <TabsContent value="penalty">
              <PenaltyDutyManagement />
            </TabsContent>

            <TabsContent value="complaint-dashboard">
              <ComplaintDashboard />
            </TabsContent>

            <TabsContent value="complaint-management">
              <ComplaintManagement />
            </TabsContent>

            <TabsContent value="report">
              <DutyReport />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Index;
