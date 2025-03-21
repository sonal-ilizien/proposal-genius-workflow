
import { useState, useEffect } from 'react';
import { useProposals } from '@/context/ProposalContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FastForward, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface StageSkipModalProps {
  proposalId: string;
  onClose: () => void;
}

const StageSkipModal = ({ proposalId, onClose }: StageSkipModalProps) => {
  const { proposals, skipToStage } = useProposals();
  const [selectedStageIndex, setSelectedStageIndex] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const proposal = proposals.find(p => p.id === proposalId);

  useEffect(() => {
    // Default to the next stage after current
    if (proposal) {
      const nextStageIndex = proposal.currentStageIndex + 1;
      if (nextStageIndex < proposal.stages.length) {
        setSelectedStageIndex(nextStageIndex);
      }
    }
  }, [proposal]);

  if (!proposal) {
    return null;
  }

  const currentStageIndex = proposal.currentStageIndex;
  const remainingStages = proposal.stages.slice(currentStageIndex + 1);

  const handleSkip = () => {
    if (selectedStageIndex !== null && selectedStageIndex > currentStageIndex) {
      skipToStage(proposalId, selectedStageIndex, comment);
      onClose();
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FastForward className="h-5 w-5" />
            Skip to Later Stage
          </DialogTitle>
          <DialogDescription>
            Choose a future stage to skip to in this proposal's workflow
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              Skipping stages will mark all intermediate stages as completed. This action cannot be undone.
            </AlertDescription>
          </Alert>

          {remainingStages.length > 0 ? (
            <>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Target Stage</Label>
                  <RadioGroup 
                    value={selectedStageIndex?.toString()} 
                    onValueChange={(value) => setSelectedStageIndex(Number(value))}
                  >
                    {remainingStages.map((stage, index) => {
                      const actualIndex = currentStageIndex + 1 + index;
                      return (
                        <div key={stage.id} className="flex items-start space-x-2 p-2 rounded-md hover:bg-gray-50">
                          <RadioGroupItem value={actualIndex.toString()} id={`stage-${stage.id}`} />
                          <div className="grid gap-1">
                            <Label className="font-medium" htmlFor={`stage-${stage.id}`}>
                              Stage {actualIndex + 1}: {stage.name}
                            </Label>
                            <p className="text-sm text-gray-500">{stage.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skipComment">Skip Reason (Required)</Label>
                  <Textarea
                    id="skipComment"
                    placeholder="Explain why you're skipping stages..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    required
                  />
                </div>
              </div>

              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSkip}
                  disabled={selectedStageIndex === null || !comment.trim()}
                  className="gap-2"
                >
                  <FastForward className="h-4 w-4" />
                  Skip to Selected Stage
                </Button>
              </DialogFooter>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">No remaining stages available to skip to.</p>
              <Button className="mt-4" onClick={onClose}>Close</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StageSkipModal;
