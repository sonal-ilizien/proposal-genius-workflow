
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Check, X, Send, MessageCircle, Reply, CornerDownRight } from 'lucide-react';
import { Stage, Comment } from '@/utils/schemeData';
import { useEntranceAnimation } from '@/utils/animations';
import { Button } from '@/components/ui/button';

interface ApprovalSheetProps {
  stage: Stage;
  onApprove: (comment: string) => void;
  onReject: (comment: string) => void;
  onComment: (comment: string, parentCommentId?: string) => void;
  isActive: boolean;
}

const ApprovalSheet = ({ stage, onApprove, onReject, onComment, isActive }: ApprovalSheetProps) => {
  const [comment, setComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const { toast } = useToast();
  const isVisible = useEntranceAnimation(200);

  const handleSubmit = (action: 'approve' | 'reject' | 'comment') => {
    if (!comment.trim()) {
      toast({
        title: "Comment required",
        description: "Please provide a comment before proceeding.",
        variant: "destructive",
      });
      return;
    }

    switch (action) {
      case 'approve':
        onApprove(comment);
        break;
      case 'reject':
        onReject(comment);
        break;
      case 'comment':
        onComment(comment, replyingTo || undefined);
        break;
    }

    setComment('');
    setReplyingTo(null);
    
    toast({
      title: action === 'approve' ? "Stage approved" : 
             action === 'reject' ? "Stage rejected" : "Comment added",
      description: action === 'comment' ? 
        "Your comment has been added to this stage." : 
        `Stage has been ${action === 'approve' ? 'approved' : 'rejected'} successfully.`,
      variant: action === 'reject' ? "destructive" : "default",
    });
  };

  // Format date to be human-readable
  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Find parent comment by ID
  const findCommentById = (id: string): Comment | undefined => {
    return stage.comments.find(c => c.id === id);
  };

  // Render a single comment
  const renderComment = (comment: Comment, isReply: boolean = false) => {
    const replies = comment.replies 
      ? stage.comments.filter(c => comment.replies?.includes(c.id))
      : [];

    return (
      <div key={comment.id} className={`${isReply ? 'ml-6 mt-2' : 'mt-3'}`}>
        <div 
          className={`p-3 rounded-lg ${comment.approved ? 'bg-green-50 border border-green-100' : 'bg-gray-50 border border-gray-100'}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              {comment.approved !== undefined && (
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${comment.approved ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                  {comment.approved ? <Check className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}
                </div>
              )}
              <span className="text-sm font-medium">
                {comment.approved !== undefined ? (comment.approved ? 'Approval' : 'Comment') : 'Comment'}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              {formatDate(comment.createdAt)}
            </span>
          </div>
          <p className="mt-2 text-gray-700 text-sm">{comment.text}</p>
          
          {isActive && stage.status !== 'completed' && stage.status !== 'rejected' && (
            <div className="mt-2 flex justify-end">
              <button 
                className="text-xs text-blue-600 flex items-center gap-1 hover:underline"
                onClick={() => {
                  setReplyingTo(comment.id);
                  setComment(`@${comment.id.substring(0, 6)} `);
                }}
              >
                <Reply className="h-3 w-3" /> Reply
              </button>
            </div>
          )}
        </div>

        {/* Render replies */}
        {replies.length > 0 && (
          <div className="pl-2 border-l-2 border-gray-200 mt-2">
            {replies.map(reply => renderComment(reply, true))}
          </div>
        )}
      </div>
    );
  };

  // Get top-level comments (those without a parent)
  const topLevelComments = stage.comments.filter(c => !c.parentId);

  return (
    <div className={`w-full rounded-lg glass p-4 md:p-6 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">{stage.name}</h3>
          <div className="flex space-x-2 text-sm">
            {stage.startedAt && (
              <span className="text-gray-500">
                Started: {formatDate(stage.startedAt)}
              </span>
            )}
            {stage.completedAt && (
              <span className="text-gray-500">
                • Completed: {formatDate(stage.completedAt)}
              </span>
            )}
          </div>
        </div>
        
        <p className="text-gray-600">{stage.description}</p>

        {/* Comments section */}
        <div className="mt-4">
          <h4 className="text-md font-medium mb-2">
            Comments & Approvals
            {replyingTo && (
              <span className="ml-2 text-sm text-blue-600">
                Replying to comment
                <button 
                  className="ml-2 text-xs bg-blue-50 text-blue-700 px-1 py-0.5 rounded"
                  onClick={() => {
                    setReplyingTo(null);
                    setComment('');
                  }}
                >
                  <X className="h-3 w-3 inline" /> Cancel
                </button>
              </span>
            )}
          </h4>
          <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
            {topLevelComments.length > 0 ? (
              <div className="space-y-2">
                {topLevelComments.map(comment => renderComment(comment))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <MessageCircle className="h-5 w-5 mx-auto mb-2" />
                <p>No comments yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Comment input */}
        {isActive && stage.status !== 'completed' && stage.status !== 'rejected' && (
          <div className="mt-4">
            <div className="flex flex-col space-y-3">
              <div className="relative">
                {replyingTo && (
                  <div className="absolute -top-5 left-0 text-xs text-blue-600 flex items-center">
                    <CornerDownRight className="h-3 w-3 mr-1" />
                    Replying to comment
                  </div>
                )}
                <textarea
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  rows={3}
                  placeholder={replyingTo ? "Write your reply..." : "Add your comment or approval note..."}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleSubmit('comment')}
                  className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  {replyingTo ? (
                    <>
                      <Reply className="h-4 w-4 mr-2" />
                      Post Reply
                    </>
                  ) : (
                    <>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Add Comment
                    </>
                  )}
                </button>
                {!replyingTo && (
                  <>
                    <button
                      onClick={() => handleSubmit('approve')}
                      className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve & Proceed
                    </button>
                    <button
                      onClick={() => handleSubmit('reject')}
                      className="flex items-center px-4 py-2 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovalSheet;
