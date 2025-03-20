
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, User, Clipboard, ChevronDown, ChevronUp } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Timeline from '@/components/Timeline';
import ApprovalSheet from '@/components/ApprovalSheet';
import AIInsights from '@/components/AIInsights';
import { useProposals } from '@/context/ProposalContext';
import { getSchemeById } from '@/utils/schemeData';
import { useEntranceAnimation } from '@/utils/animations';

const ProposalDetails = () => {
  const { proposalId } = useParams<{ proposalId: string }>();
  const { proposals, activeProposal, setActiveProposal, advanceStage, addComment } = useProposals();
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);
  const navigate = useNavigate();
  const isVisible = useEntranceAnimation();
  
  useEffect(() => {
    if (proposalId) {
      setActiveProposal(proposalId);
    }
    
    return () => {
      setActiveProposal(null);
    };
  }, [proposalId, setActiveProposal]);
  
  useEffect(() => {
    if (activeProposal) {
      // Set selected stage to current stage by default
      setSelectedStageId(activeProposal.stages[activeProposal.currentStageIndex].id);
    }
  }, [activeProposal]);
  
  if (!activeProposal) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="text-center py-12">
            <Clipboard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-gray-900">Proposal not found</h2>
            <p className="mt-2 text-gray-500">The proposal you're looking for doesn't exist or has been removed.</p>
            <button
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }
  
  const scheme = getSchemeById(activeProposal.schemeId);
  const selectedStage = activeProposal.stages.find(stage => stage.id === selectedStageId) || 
                      activeProposal.stages[activeProposal.currentStageIndex];
  
  const handleStageClick = (stageId: string) => {
    setSelectedStageId(stageId);
  };
  
  const handleStageApprove = (comment: string) => {
    advanceStage(activeProposal.id, comment, true);
  };
  
  const handleStageReject = (comment: string) => {
    // For now, just add the comment without advancing
    addComment(activeProposal.id, selectedStage.id, comment, false);
  };
  
  const handleAddComment = (comment: string) => {
    addComment(activeProposal.id, selectedStage.id, comment, false);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className={`mb-8 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <button
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full bg-${scheme?.color || 'gray'}-500`}></div>
                <span className="text-sm text-gray-500">{scheme?.name}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mt-1">{activeProposal.title}</h1>
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
              <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-full text-sm border border-gray-100">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>Created {new Date(activeProposal.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-full text-sm border border-gray-100">
                <User className="h-4 w-4 text-gray-500" />
                <span>John Smith</span>
              </div>
            </div>
          </div>
          
          <p className="text-gray-600 mt-2 max-w-3xl">{activeProposal.description}</p>
        </div>
        
        <div className="glass rounded-lg mb-8 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold">Workflow Timeline</h2>
          </div>
          <div className="px-6 py-4 overflow-x-auto">
            <Timeline 
              stages={activeProposal.stages} 
              currentStageIndex={activeProposal.currentStageIndex} 
              onStageClick={handleStageClick}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <ApprovalSheet 
              stage={selectedStage} 
              onApprove={handleStageApprove}
              onReject={handleStageReject}
              onComment={handleAddComment}
              isActive={selectedStage.id === activeProposal.stages[activeProposal.currentStageIndex].id}
            />
            
            <div className="glass rounded-lg p-4 md:p-6">
              <div className="mb-4">
                <h3 className="text-lg font-medium">Proposal Details</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Scheme</h4>
                  <p>{scheme?.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Description</h4>
                  <p>{activeProposal.description}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Current Stage</h4>
                  <p>{activeProposal.stages[activeProposal.currentStageIndex].name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Progress</h4>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 mt-1">
                    <div 
                      className={`bg-${scheme?.color || 'blue'}-500 h-2.5 rounded-full`}
                      style={{ width: `${(activeProposal.currentStageIndex / (activeProposal.stages.length - 1)) * 100}%` }}
                    ></div>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {Math.round((activeProposal.currentStageIndex / (activeProposal.stages.length - 1)) * 100)}% Complete
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <AIInsights proposal={activeProposal} />
            
            <div className="glass rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-medium">Document Attachments</h3>
                <button className="text-blue-600 text-sm hover:underline">
                  Add Document
                </button>
              </div>
              <div className="p-4">
                <div className="text-center py-8 text-gray-500">
                  <Clipboard className="h-8 w-8 mx-auto mb-2" />
                  <p>No documents attached yet</p>
                  <button className="mt-2 text-blue-600 text-sm hover:underline">
                    Upload a document
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProposalDetails;
