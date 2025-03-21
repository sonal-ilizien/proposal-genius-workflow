
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ChevronsUpDown } from 'lucide-react';
import { useProposals } from '@/context/ProposalContext';
import SchemeSelector from '@/components/SchemeSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ProposalCreationModalProps {
  onClose: () => void;
  preselectedSchemeId?: string | null;
}

const ProposalCreationModal = ({ onClose, preselectedSchemeId = null }: ProposalCreationModalProps) => {
  const { schemes, createProposal, setActiveProposal } = useProposals();
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    schemeId: preselectedSchemeId || '' 
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (preselectedSchemeId) {
      setFormData(prev => ({ ...prev, schemeId: preselectedSchemeId }));
    }
  }, [preselectedSchemeId]);

  const handleCreateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.schemeId) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields to create a proposal",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const newProposal = createProposal(formData.title, formData.description, formData.schemeId);
      
      if (newProposal) {
        toast({
          title: "Proposal Created",
          description: `Successfully created proposal: ${formData.title}`,
        });
        
        onClose();
        
        setActiveProposal(newProposal.id);
        setTimeout(() => {
          navigate(`/proposals/${newProposal.id}`);
        }, 300);
      }
    } catch (error) {
      console.error("Error creating proposal:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };

  const selectedScheme = formData.schemeId 
    ? schemes.find(s => s.id === formData.schemeId) 
    : null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Proposal</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new proposal
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleCreateProposal} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Proposal Title</Label>
            <Input
              id="title"
              placeholder="Enter proposal title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter proposal description"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Select Scheme</Label>
            {preselectedSchemeId ? (
              <div className="flex items-center justify-between p-2 border rounded-md">
                <div className="flex items-center">
                  {selectedScheme && (
                    <>
                      <div className={`w-3 h-3 rounded-full bg-${selectedScheme.color}-500 mr-3`}></div>
                      <span>{selectedScheme.name}</span>
                    </>
                  )}
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setFormData(prev => ({ ...prev, schemeId: '' }))}
                >
                  Change
                </Button>
              </div>
            ) : (
              <SchemeSelector 
                schemes={schemes} 
                onSelect={(schemeId) => setFormData({ ...formData, schemeId })}
                selectedSchemeId={formData.schemeId}
              />
            )}
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={!formData.title || !formData.description || !formData.schemeId}
            >
              Create Proposal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProposalCreationModal;
