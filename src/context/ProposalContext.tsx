
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Scheme, Stage, Proposal, schemeData } from '../utils/schemeData';

interface ProposalContextType {
  schemes: Scheme[];
  proposals: Proposal[];
  activeProposal: Proposal | null;
  createProposal: (title: string, description: string, schemeId: string) => void;
  setActiveProposal: (proposalId: string | null) => void;
  advanceStage: (proposalId: string, comment: string, approved: boolean) => void;
  addComment: (proposalId: string, stageId: string, comment: string, approved: boolean) => void;
}

const ProposalContext = createContext<ProposalContextType | undefined>(undefined);

export const ProposalProvider = ({ children }: { children: ReactNode }) => {
  const [schemes] = useState<Scheme[]>(schemeData);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [activeProposal, setActiveProposalState] = useState<Proposal | null>(null);

  const createProposal = (title: string, description: string, schemeId: string) => {
    const scheme = schemes.find(s => s.id === schemeId);
    if (!scheme) return;

    const newProposal: Proposal = {
      id: `proposal-${Date.now()}`,
      title,
      description,
      schemeId,
      createdAt: new Date(),
      currentStageIndex: 0,
      stages: scheme.stages.map(stage => ({
        ...stage,
        status: stage.id === scheme.stages[0].id ? 'active' : 'pending',
        comments: [],
        startedAt: stage.id === scheme.stages[0].id ? new Date() : null,
        completedAt: null,
      })),
    };

    setProposals(prev => [...prev, newProposal]);
    return newProposal;
  };

  const setActiveProposal = (proposalId: string | null) => {
    if (!proposalId) {
      setActiveProposalState(null);
      return;
    }
    
    const proposal = proposals.find(p => p.id === proposalId);
    setActiveProposalState(proposal || null);
  };

  const advanceStage = (proposalId: string, comment: string, approved: boolean) => {
    if (!approved) {
      // If not approved, just add the comment but don't advance
      addComment(proposalId, '', comment, false);
      return;
    }

    setProposals(prev => prev.map(proposal => {
      if (proposal.id !== proposalId) return proposal;

      const currentStageIndex = proposal.currentStageIndex;
      const nextStageIndex = currentStageIndex + 1;
      
      // If there is no next stage, mark the current as completed
      if (nextStageIndex >= proposal.stages.length) {
        const updatedStages = proposal.stages.map((stage, idx) => {
          if (idx === currentStageIndex) {
            return {
              ...stage,
              status: 'completed',
              completedAt: new Date(),
              comments: [
                ...stage.comments,
                { id: `comment-${Date.now()}`, text: comment, approved, createdAt: new Date() }
              ]
            };
          }
          return stage;
        });

        return {
          ...proposal,
          stages: updatedStages
        };
      }

      // Update current stage to completed and next stage to active
      const updatedStages = proposal.stages.map((stage, idx) => {
        if (idx === currentStageIndex) {
          return {
            ...stage,
            status: 'completed',
            completedAt: new Date(),
            comments: [
              ...stage.comments,
              { id: `comment-${Date.now()}`, text: comment, approved, createdAt: new Date() }
            ]
          };
        }
        if (idx === nextStageIndex) {
          return {
            ...stage,
            status: 'active',
            startedAt: new Date()
          };
        }
        return stage;
      });

      return {
        ...proposal,
        currentStageIndex: nextStageIndex,
        stages: updatedStages
      };
    }));
  };

  const addComment = (proposalId: string, stageId: string, comment: string, approved: boolean) => {
    setProposals(prev => prev.map(proposal => {
      if (proposal.id !== proposalId) return proposal;

      // If stageId is empty, use the current active stage
      const targetStageId = stageId || proposal.stages[proposal.currentStageIndex].id;

      const updatedStages = proposal.stages.map(stage => {
        if (stage.id === targetStageId) {
          return {
            ...stage,
            comments: [
              ...stage.comments,
              { id: `comment-${Date.now()}`, text: comment, approved, createdAt: new Date() }
            ]
          };
        }
        return stage;
      });

      return {
        ...proposal,
        stages: updatedStages
      };
    }));
  };

  const value = {
    schemes,
    proposals,
    activeProposal,
    createProposal,
    setActiveProposal,
    advanceStage,
    addComment
  };

  return (
    <ProposalContext.Provider value={value}>
      {children}
    </ProposalContext.Provider>
  );
};

export const useProposals = (): ProposalContextType => {
  const context = useContext(ProposalContext);
  if (context === undefined) {
    throw new Error('useProposals must be used within a ProposalProvider');
  }
  return context;
};
