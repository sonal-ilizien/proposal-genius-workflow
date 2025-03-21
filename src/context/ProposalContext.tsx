
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Scheme, Stage, Proposal, schemeData, Comment } from '../utils/schemeData';
import { toast } from '@/hooks/use-toast';

interface ProposalContextType {
  schemes: Scheme[];
  proposals: Proposal[];
  activeProposal: Proposal | null;
  createProposal: (title: string, description: string, schemeId: string) => Proposal | undefined;
  setActiveProposal: (proposalId: string | null) => void;
  advanceStage: (proposalId: string, comment: string, approved: boolean) => void;
  skipToStage: (proposalId: string, targetStageIndex: number, comment: string) => void;
  addComment: (proposalId: string, stageId: string, comment: string, approved: boolean, parentCommentId?: string) => void;
}

const ProposalContext = createContext<ProposalContextType | undefined>(undefined);

export const ProposalProvider = ({ children }: { children: ReactNode }) => {
  const [schemes] = useState<Scheme[]>(schemeData);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [activeProposal, setActiveProposalState] = useState<Proposal | null>(null);

  const createProposal = (title: string, description: string, schemeId: string) => {
    const scheme = schemes.find(s => s.id === schemeId);
    if (!scheme) {
      toast({
        title: "Error",
        description: "Invalid scheme selected",
        variant: "destructive"
      });
      return undefined;
    }

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

    setProposals(prevProposals => [...prevProposals, newProposal]);
    toast({
      title: "Success",
      description: `Proposal "${title}" created successfully`,
    });
    
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
      addComment(proposalId, '', comment, false);
      return;
    }

    setProposals(prevProposals => prevProposals.map(proposal => {
      if (proposal.id !== proposalId) return proposal;

      const currentStageIndex = proposal.currentStageIndex;
      const nextStageIndex = currentStageIndex + 1;
      
      if (nextStageIndex >= proposal.stages.length) {
        // Final stage completion
        const updatedStages = [...proposal.stages];
        updatedStages[currentStageIndex] = {
          ...updatedStages[currentStageIndex],
          status: 'completed' as const,
          completedAt: new Date(),
          comments: [
            ...updatedStages[currentStageIndex].comments,
            { 
              id: `comment-${Date.now()}`, 
              text: comment, 
              approved, 
              createdAt: new Date(),
              parentId: null,
              replies: []
            }
          ]
        };

        return {
          ...proposal,
          stages: updatedStages
        };
      }

      // Normal stage advancement
      const updatedStages = [...proposal.stages];
      
      // Mark current stage as completed
      updatedStages[currentStageIndex] = {
        ...updatedStages[currentStageIndex],
        status: 'completed' as const,
        completedAt: new Date(),
        comments: [
          ...updatedStages[currentStageIndex].comments,
          { 
            id: `comment-${Date.now()}`, 
            text: comment, 
            approved, 
            createdAt: new Date(),
            parentId: null,
            replies: []
          }
        ]
      };
      
      // Mark next stage as active
      updatedStages[nextStageIndex] = {
        ...updatedStages[nextStageIndex],
        status: 'active' as const,
        startedAt: new Date()
      };

      return {
        ...proposal,
        currentStageIndex: nextStageIndex,
        stages: updatedStages
      };
    }));
    
    toast({
      title: "Stage Advanced",
      description: "The proposal has moved to the next stage",
    });
  };

  const skipToStage = (proposalId: string, targetStageIndex: number, comment: string) => {
    setProposals(prevProposals => prevProposals.map(proposal => {
      if (proposal.id !== proposalId) return proposal;
      
      const currentStageIndex = proposal.currentStageIndex;
      
      // Don't allow skipping to previous stages or the current stage
      if (targetStageIndex <= currentStageIndex || targetStageIndex >= proposal.stages.length) {
        return proposal;
      }
      
      const updatedStages = [...proposal.stages];
      
      // Mark current stage as completed
      updatedStages[currentStageIndex] = {
        ...updatedStages[currentStageIndex],
        status: 'completed' as const,
        completedAt: new Date(),
        comments: [
          ...updatedStages[currentStageIndex].comments,
          { 
            id: `comment-${Date.now()}`, 
            text: `Skipped to stage: ${proposal.stages[targetStageIndex].name}. ${comment}`, 
            approved: true, 
            createdAt: new Date(),
            parentId: null,
            replies: []
          }
        ]
      };
      
      // Mark intermediate stages as skipped/completed
      for (let i = currentStageIndex + 1; i < targetStageIndex; i++) {
        updatedStages[i] = {
          ...updatedStages[i],
          status: 'completed' as const,
          startedAt: new Date(),
          completedAt: new Date(),
          comments: [
            ...updatedStages[i].comments,
            { 
              id: `comment-${Date.now()}-${i}`, 
              text: "Skipped", 
              approved: true, 
              createdAt: new Date(),
              parentId: null,
              replies: []
            }
          ]
        };
      }
      
      // Mark target stage as active
      updatedStages[targetStageIndex] = {
        ...updatedStages[targetStageIndex],
        status: 'active' as const,
        startedAt: new Date()
      };
      
      return {
        ...proposal,
        currentStageIndex: targetStageIndex,
        stages: updatedStages
      };
    }));
    
    toast({
      title: "Stage Skipped",
      description: "Successfully skipped to the selected stage",
    });
  };

  const addComment = (proposalId: string, stageId: string, comment: string, approved: boolean, parentCommentId?: string) => {
    setProposals(prevProposals => prevProposals.map(proposal => {
      if (proposal.id !== proposalId) return proposal;

      const targetStageId = stageId || proposal.stages[proposal.currentStageIndex].id;
      const updatedStages = [...proposal.stages];
      
      const stageIndex = updatedStages.findIndex(s => s.id === targetStageId);
      if (stageIndex === -1) return proposal;
      
      const newComment: Comment = { 
        id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, 
        text: comment, 
        approved, 
        createdAt: new Date(),
        parentId: parentCommentId || null,
        replies: []
      };
      
      if (parentCommentId) {
        const updatedComments = [...updatedStages[stageIndex].comments];
        const parentIndex = updatedComments.findIndex(c => c.id === parentCommentId);
        
        if (parentIndex !== -1) {
          updatedComments[parentIndex] = {
            ...updatedComments[parentIndex],
            replies: [...(updatedComments[parentIndex].replies || []), newComment.id]
          };
          
          updatedStages[stageIndex] = {
            ...updatedStages[stageIndex],
            comments: [...updatedComments, newComment]
          };
        }
      } else {
        updatedStages[stageIndex] = {
          ...updatedStages[stageIndex],
          comments: [...updatedStages[stageIndex].comments, newComment]
        };
      }
      
      return {
        ...proposal,
        stages: updatedStages
      };
    }));
    
    if (!parentCommentId) {
      toast({
        title: "Comment Added",
        description: "Your comment has been added to the discussion",
      });
    } else {
      toast({
        title: "Reply Added",
        description: "Your reply has been added to the discussion",
      });
    }
  };

  const value = {
    schemes,
    proposals,
    activeProposal,
    createProposal,
    setActiveProposal,
    advanceStage,
    skipToStage,
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
