
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  FileText, 
  ArrowRight, 
  Brain,
  ChevronRight,
  Clock,
  Search,
  X
} from 'lucide-react';
import SchemeSelector from '@/components/SchemeSelector';
import { useProposals } from '@/context/ProposalContext';
import { useEntranceAnimation, useStaggeredChildren } from '@/utils/animations';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { schemes, proposals, createProposal, setActiveProposal } = useProposals();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', schemeId: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const isVisible = useEntranceAnimation();
  const cardDelays = useStaggeredChildren(proposals.length > 0 ? proposals.length : 3, 100, 300);

  const filteredProposals = proposals.filter(proposal => 
    proposal.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const handleViewProposal = (proposalId: string) => {
    setActiveProposal(proposalId);
    navigate(`/proposals/${proposalId}`);
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
      <div className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Manage all your indigenisation scheme proposals
            </p>
          </div>
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create New Proposal
          </Button>
        </div>
          
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Recent Proposals</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search proposals..."
                className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all w-full md:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          {proposals.length > 0 ? (
            <div className="space-y-4">
              {filteredProposals.map((proposal, index) => {
                const scheme = schemes.find(s => s.id === proposal.schemeId);
                const currentStage = proposal.stages[proposal.currentStageIndex];
                
                return (
                  <div 
                    key={proposal.id}
                    className="p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => handleViewProposal(proposal.id)}
                    style={{ 
                      animationDelay: `${cardDelays[index]}ms`,
                      animation: 'slide-up 0.5s ease-out forwards',
                      opacity: 0
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2.5 h-2.5 rounded-full bg-${scheme?.color || 'gray'}-500`}></div>
                          <span className="text-sm text-gray-500">{scheme?.name}</span>
                        </div>
                        <h3 className="font-medium text-lg mt-1">{proposal.title}</h3>
                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{proposal.description}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-500">
                          Created {new Date(proposal.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className={`px-2 py-1 rounded-full text-xs ${
                          currentStage.status === 'active' ? 'bg-blue-100 text-blue-800' :
                          currentStage.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          Stage {proposal.currentStageIndex + 1}/{proposal.stages.length}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {filteredProposals.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No matching proposals</h3>
                  <p className="mt-1 text-gray-500">Try adjusting your search query</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No proposals yet</h3>
              <p className="mt-1 text-gray-500">Create your first proposal to get started</p>
              <button
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Proposal
              </button>
            </div>
          )}
        </div>
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

export default Index;
