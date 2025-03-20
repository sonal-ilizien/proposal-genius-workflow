
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
import { PlusCircle, FileText, ChevronRight, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useEntranceAnimation } from '@/utils/animations';
import SchemeSelector from '@/components/SchemeSelector';

const ProposalMasterPage = () => {
  const { proposals, schemes, createProposal, setActiveProposal } = useProposals();
  const isVisible = useEntranceAnimation();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', schemeId: '' });

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

  const handleCreateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.schemeId) return;
    
    const newProposal = createProposal(formData.title, formData.description, formData.schemeId);
    setShowCreateModal(false);
    setFormData({ title: '', description: '', schemeId: '' });
    
    if (newProposal) {
      setActiveProposal(newProposal.id);
      setTimeout(() => {
        navigate(`/proposals/${newProposal.id}`);
      }, 300);
    }
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
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            New Proposal
          </Button>
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
                  <Button 
                    variant="outline"
                    onClick={() => setShowCreateModal(true)}
                  >
                    Create a proposal
                  </Button>
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

      {/* Create Proposal Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-xl max-w-md w-full p-6 animate-scale-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Create New Proposal</h2>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowCreateModal(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateProposal}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Proposal Title
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter proposal title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter proposal description"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Scheme
                  </label>
                  <SchemeSelector 
                    schemes={schemes} 
                    onSelect={(schemeId) => setFormData({ ...formData, schemeId })}
                    selectedSchemeId={formData.schemeId}
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={!formData.title || !formData.description || !formData.schemeId}
                  >
                    Create Proposal
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposalMasterPage;
