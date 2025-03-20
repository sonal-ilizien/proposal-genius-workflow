
import { useState } from 'react';
import { useProposals } from '@/context/ProposalContext';
import { 
  Card, 
  CardContent,
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useEntranceAnimation } from '@/utils/animations';

const ProposalMasterPage = () => {
  const { proposals, schemes } = useProposals();
  const isVisible = useEntranceAnimation();

  const getSchemeNameById = (schemeId: string) => {
    const scheme = schemes.find(s => s.id === schemeId);
    return scheme ? scheme.name : 'Unknown Scheme';
  };

  const getSchemeColorById = (schemeId: string) => {
    const scheme = schemes.find(s => s.id === schemeId);
    return scheme ? scheme.color : 'gray';
  };

  const getCurrentStageName = (proposal: any) => {
    const currentStage = proposal.stages[proposal.currentStageIndex];
    return currentStage ? currentStage.name : 'Not Started';
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
      <div className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Proposal Master</h1>
            <p className="text-gray-600 mt-2">
              Manage all proposals and track their progress through the workflow
            </p>
          </div>
          <Link to="/">
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              New Proposal
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Proposals</CardTitle>
          </CardHeader>
          <CardContent>
            {proposals.length === 0 ? (
              <div className="text-center py-10">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900">No proposals yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating a new proposal from the dashboard.
                </p>
                <div className="mt-6">
                  <Link to="/">
                    <Button variant="outline">Create a proposal</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Scheme</TableHead>
                      <TableHead>Current Stage</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {proposals.map((proposal) => (
                      <TableRow key={proposal.id}>
                        <TableCell className="font-medium">{proposal.title}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={`bg-${getSchemeColorById(proposal.schemeId)}-50 text-${getSchemeColorById(proposal.schemeId)}-700 border-${getSchemeColorById(proposal.schemeId)}-200`}
                          >
                            {getSchemeNameById(proposal.schemeId)}
                          </Badge>
                        </TableCell>
                        <TableCell>{getCurrentStageName(proposal)}</TableCell>
                        <TableCell>
                          {proposal.createdAt instanceof Date 
                            ? format(proposal.createdAt, 'dd MMM yyyy') 
                            : 'Invalid date'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Link to={`/proposals/${proposal.id}`}>
                            <Button variant="ghost" size="sm">
                              View <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProposalMasterPage;
