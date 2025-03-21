
import { useState } from 'react';
import { useProposals } from '@/context/ProposalContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, ThumbsUp, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Comment as CommentType } from '@/utils/schemeData';

interface DiscussionPanelProps {
  proposalId: string;
  stageId: string;
  onAddComment: (comment: string, parentCommentId?: string) => void;
}

const DiscussionPanel = ({ proposalId, stageId, onAddComment }: DiscussionPanelProps) => {
  const { proposals } = useProposals();
  const [comment, setComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  
  const proposal = proposals.find(p => p.id === proposalId);
  if (!proposal) return null;
  
  const stage = proposal.stages.find(s => s.id === stageId);
  if (!stage) return null;
  
  // Get top-level comments (those without a parent)
  const topLevelComments = stage.comments.filter(c => !c.parentId);
  
  // Find a comment by ID
  const findCommentById = (id: string): CommentType | undefined => {
    return stage.comments.find(c => c.id === id);
  };
  
  const handleSubmitComment = () => {
    if (!comment.trim()) return;
    
    onAddComment(comment, replyingTo || undefined);
    setComment('');
    setReplyingTo(null);
  };
  
  const handleReply = (commentId: string) => {
    setReplyingTo(commentId);
    // Focus on the comment input
    const commentInput = document.getElementById('comment-input');
    if (commentInput) {
      commentInput.focus();
    }
  };
  
  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };
  
  // Render a comment with its replies
  const renderComment = (comment: CommentType) => {
    const replies = comment.replies 
      ? stage.comments.filter(c => comment.replies?.includes(c.id))
      : [];
    
    const initials = getInitials(getUserName(comment.id));
    
    return (
      <div key={comment.id} className="mb-6">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-gray-100 text-gray-500">{initials}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-medium">{getUserName(comment.id)}</span>
                <span className="text-xs text-gray-500">{getUserRole(comment.id)}</span>
              </div>
              
              <p className="mt-1 text-gray-700">{comment.text}</p>
              
              <div className="flex items-center gap-4 mt-2">
                <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                
                <button 
                  className="text-xs text-gray-500 hover:text-blue-600 flex items-center gap-1"
                  onClick={() => handleLike(comment.id)}
                >
                  <ThumbsUp className="h-3 w-3" /> 
                  {comment.id.includes('2') ? '2' : '0'}
                </button>
                
                <button 
                  className="text-xs text-gray-500 hover:text-blue-600 flex items-center gap-1"
                  onClick={() => handleReply(comment.id)}
                >
                  <MessageCircle className="h-3 w-3" /> 
                  Reply
                </button>
              </div>
            </div>
            
            {/* Render replies */}
            {replies.length > 0 && (
              <div className="ml-2 pl-4 border-l border-gray-200 mt-4 space-y-4">
                {replies.map(reply => (
                  <div key={reply.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gray-100 text-gray-500 text-xs">
                        {getInitials(getUserName(reply.id))}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{getUserName(reply.id)}</span>
                        <span className="text-xs text-gray-500">{getUserRole(reply.id)}</span>
                      </div>
                      
                      <p className="mt-1 text-gray-700">{reply.text}</p>
                      
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-gray-500">{formatDate(reply.createdAt)}</span>
                        
                        <button 
                          className="text-xs text-gray-500 hover:text-blue-600 flex items-center gap-1"
                          onClick={() => handleLike(reply.id)}
                        >
                          <ThumbsUp className="h-3 w-3" /> 
                          {reply.id.includes('1') ? '1' : '0'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  // Mock functions for demo purposes
  const getUserName = (commentId: string): string => {
    // In a real app, this would come from a user database
    if (commentId.includes('1')) return 'John Doe';
    if (commentId.includes('2')) return 'Jane Smith';
    if (commentId.includes('3')) return 'Sarah Williams';
    return 'User';
  };
  
  const getUserRole = (commentId: string): string => {
    // In a real app, this would come from a user database
    if (commentId.includes('1')) return 'DOI';
    if (commentId.includes('2')) return 'PROF_DTES';
    if (commentId.includes('3')) return 'IFA_REP';
    return '';
  };
  
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  const handleLike = (commentId: string) => {
    // This would actually update the likes in a real app
    console.log('Liked comment:', commentId);
  };
  
  return (
    <div className="glass rounded-lg p-4 md:p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Discussion</h2>
        <p className="text-gray-600 text-sm">Project discussions and comments</p>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Comments & Feedback</h3>
        
        <div className="flex gap-3 mb-8">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-gray-100 text-gray-500">US</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 relative">
            <textarea
              id="comment-input"
              className="w-full min-h-[80px] border border-gray-200 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add your comment or feedback..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            
            {replyingTo && (
              <div className="absolute -top-6 left-0 text-xs text-blue-600">
                Replying to comment from {getUserName(replyingTo)}
              </div>
            )}
            
            <Button 
              className="absolute right-3 bottom-3 flex items-center gap-1"
              size="sm"
              onClick={handleSubmitComment}
              disabled={!comment.trim()}
            >
              Comment <Send className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-8">
          {topLevelComments.length > 0 ? (
            topLevelComments.map(comment => renderComment(comment))
          ) : (
            <div className="text-center py-6 text-gray-500">
              <MessageCircle className="h-8 w-8 mx-auto mb-2" />
              <p>No comments yet</p>
              <p className="text-sm mt-1">Be the first to add a comment to this discussion.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscussionPanel;
