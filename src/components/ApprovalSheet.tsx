
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Check, X, Send, MessageCircle } from 'lucide-react';
import { Stage } from '@/utils/schemeData';
import { useEntranceAnimation } from '@/utils/animations';

interface ApprovalSheetProps {
  stage: Stage;
  onApprove: (comment: string) => void;
  onReject: (comment: string) => void;
  onComment: (comment: string) => void;
  isActive: boolean;
}

const ApprovalSheet = ({ stage, onApprove, onReject, onComment, isActive }: ApprovalSheetProps) => {
  const [comment, setComment] = useState('');
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
        onComment(comment);
        break;
    }

    setComment('');
    
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
          <h4 className="text-md font-medium mb-2">Comments & Approvals</h4>
          <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
            {stage.comments.length > 0 ? (
              stage.comments.map((comment, index) => (
                <div 
                  key={comment.id || index} 
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
                </div>
              ))
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
              <textarea
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                rows={3}
                placeholder="Add your comment or approval note..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleSubmit('comment')}
                  className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Add Comment
                </button>
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
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovalSheet;
