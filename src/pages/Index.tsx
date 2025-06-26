
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
      <div className="min-h-screen bg-gray-50">
        <PageHeader />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabNavigation />

          <div className="container mx-auto px-4 py-6">
            <TabsContent value="assignment" className="mt-0">
              <DutyAssignment />
            </TabsContent>

            <TabsContent value="analysis" className="mt-0">
              <WorkAnalysisTab />
            </TabsContent>

            <TabsContent value="handover" className="mt-0">
              <HandoverDashboard />
            </TabsContent>

            <TabsContent value="penalty" className="mt-0">
              <PenaltyDutyManagement />
            </TabsContent>

            <TabsContent value="complaint-dashboard" className="mt-0">
              <ComplaintDashboard />
            </TabsContent>

            <TabsContent value="complaint-management" className="mt-0">
              <ComplaintManagement />
            </TabsContent>

            <TabsContent value="report" className="mt-0">
              <DutyReport />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </TooltipProvider>
  );
};

export default Index;
