
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  BarChart3, 
  PieChart,
  LineChart,
  ArrowRight, 
  MessageSquare,
  Clock,
  Search,
  X,
  RefreshCcw,
  Clipboard,
  FastForward
} from 'lucide-react';
import { useProposals } from '@/context/ProposalContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useEntranceAnimation, useStaggeredChildren } from '@/utils/animations';
import { Badge } from '@/components/ui/badge';
import ProposalCreationModal from '@/components/ProposalCreationModal';
import StageSkipModal from '@/components/StageSkipModal';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';
import { Input } from '@/components/ui/input';

const ModernDashboard = () => {
  const { schemes, proposals, setActiveProposal } = useProposals();
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [selectedProposalId, setSelectedProposalId] = useState<string | null>(null);
  const [preselectedSchemeId, setPreselectedSchemeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const isVisible = useEntranceAnimation();
  const cardDelays = useStaggeredChildren(6, 100, 200);

  const filteredProposals = proposals.filter(proposal => 
    proposal.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Prepare data for charts
  const stageStatusCounts = proposals.reduce((acc, proposal) => {
    proposal.stages.forEach(stage => {
      if (!acc[stage.status]) acc[stage.status] = 0;
      acc[stage.status]++;
    });
    return acc;
  }, { active: 0, pending: 0, completed: 0 });

  const pieChartData = [
    { name: 'Active', value: stageStatusCounts.active, color: '#3b82f6' },
    { name: 'Pending', value: stageStatusCounts.pending, color: '#f97316' },
    { name: 'Completed', value: stageStatusCounts.completed, color: '#22c55e' }
  ];

  const lineChartData = [
    { name: 'Jan', proposals: 4, approvals: 2 },
    { name: 'Feb', proposals: 3, approvals: 1 },
    { name: 'Mar', proposals: 5, approvals: 3 },
    { name: 'Apr', proposals: 7, approvals: 4 },
    { name: 'May', proposals: 6, approvals: 4 },
    { name: 'Jun', proposals: 9, approvals: 6 },
  ];

  const schemeDistribution = schemes.map(scheme => ({
    name: scheme.name,
    count: proposals.filter(p => p.schemeId === scheme.id).length,
    color: `#${Math.floor(Math.random()*16777215).toString(16)}` // Random color for each scheme
  }));

  const handleViewProposal = (proposalId: string) => {
    setActiveProposal(proposalId);
    navigate(`/proposals/${proposalId}`);
  };

  const handleOpenProposalModal = (schemeId?: string) => {
    if (schemeId) {
      setPreselectedSchemeId(schemeId);
    } else {
      setPreselectedSchemeId(null);
    }
    setShowProposalModal(true);
  };

  const handleOpenSkipModal = (proposalId: string) => {
    setSelectedProposalId(proposalId);
    setShowSkipModal(true);
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
      <div className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Modern Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Interactive overview of your indigenisation scheme proposals
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={() => setShowProposalModal(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Proposal
            </Button>
            
            <Button variant="outline" onClick={() => navigate('/proposals')}>
              View All Proposals
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search and filter bar */}
        <div className="mb-6 glass p-4 rounded-lg flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-auto flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search proposals..."
              className="pl-10 pr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 w-full md:w-auto justify-end">
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCcw className="h-4 w-4" /> Refresh
            </Button>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card style={{ animationDelay: `${cardDelays[0]}ms` }} className="animate-scale-in">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">{proposals.length}</CardTitle>
              <CardDescription>Total Proposals</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress 
                value={100} 
                className="h-2 bg-blue-100" 
              />
            </CardContent>
          </Card>
          
          <Card style={{ animationDelay: `${cardDelays[1]}ms` }} className="animate-scale-in">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">{stageStatusCounts.completed}</CardTitle>
              <CardDescription>Completed Stages</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress 
                value={stageStatusCounts.completed > 0 ? (stageStatusCounts.completed / (stageStatusCounts.completed + stageStatusCounts.active + stageStatusCounts.pending)) * 100 : 0} 
                className="h-2 bg-green-100" 
              />
            </CardContent>
          </Card>
          
          <Card style={{ animationDelay: `${cardDelays[2]}ms` }} className="animate-scale-in">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">{stageStatusCounts.active}</CardTitle>
              <CardDescription>Active Stages</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress 
                value={stageStatusCounts.active > 0 ? (stageStatusCounts.active / (stageStatusCounts.completed + stageStatusCounts.active + stageStatusCounts.pending)) * 100 : 0} 
                className="h-2 bg-blue-100" 
              />
            </CardContent>
          </Card>
        </div>
        
        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          <Card className="col-span-1 xl:col-span-1" style={{ animationDelay: `${cardDelays[3]}ms` }} className="animate-scale-in">
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="mr-2 h-5 w-5" />
                Stage Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-1 xl:col-span-2" style={{ animationDelay: `${cardDelays[4]}ms` }} className="animate-scale-in">
            <CardHeader>
              <CardTitle className="flex items-center">
                <LineChart className="mr-2 h-5 w-5" />
                Proposal Trends
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[300px] w-full p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={lineChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="proposals" stroke="#3b82f6" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="approvals" stroke="#22c55e" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Schemes Row */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Indigenisation Schemes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schemes.map((scheme, index) => (
              <Card 
                key={scheme.id} 
                className="hover:shadow-md transition-all"
                style={{ animationDelay: `${cardDelays[0] + index * 100}ms` }}
                onClick={() => handleOpenProposalModal(scheme.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge className={`bg-${scheme.color}-100 text-${scheme.color}-800 border-${scheme.color}-200`}>
                      {scheme.name}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardTitle className="text-lg">{scheme.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{scheme.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <span>Proposals: {proposals.filter(p => p.schemeId === scheme.id).length}</span>
                    <span>Stages: {scheme.stages.length}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" size="sm" className="w-full">
                    Create Proposal with this Scheme
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Recent Proposals */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Proposals</h2>
          
          {filteredProposals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProposals.slice(0, 4).map((proposal, index) => {
                const scheme = schemes.find(s => s.id === proposal.schemeId);
                const currentStage = proposal.stages[proposal.currentStageIndex];
                const progress = (proposal.currentStageIndex / (proposal.stages.length - 1)) * 100;
                
                return (
                  <Card
                    key={proposal.id}
                    className="hover:shadow-md transition-all"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <Badge className={`bg-${scheme?.color || 'gray'}-100 text-${scheme?.color || 'gray'}-800 border-${scheme?.color || 'gray'}-200`}>
                          {scheme?.name}
                        </Badge>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenSkipModal(proposal.id);
                            }}
                          >
                            <FastForward className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleViewProposal(proposal.id)}
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{proposal.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{proposal.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Stage {proposal.currentStageIndex + 1}/{proposal.stages.length}</span>
                            <span className="text-gray-500">{Math.round(progress)}% Complete</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-gray-500" />
                            <span className="text-gray-500">
                              Created {new Date(proposal.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs ${
                            currentStage.status === 'active' ? 'bg-blue-100 text-blue-800' :
                            currentStage.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {currentStage.status.charAt(0).toUpperCase() + currentStage.status.slice(1)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleViewProposal(proposal.id)}
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Clipboard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No proposals found</h3>
                <p className="mt-1 text-gray-500">Create your first proposal to get started</p>
                <Button 
                  className="mt-4"
                  onClick={() => setShowProposalModal(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Proposal
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Create Proposal Modal */}
      {showProposalModal && (
        <ProposalCreationModal 
          onClose={() => setShowProposalModal(false)} 
          preselectedSchemeId={preselectedSchemeId}
        />
      )}
      
      {/* Skip Stage Modal */}
      {showSkipModal && selectedProposalId && (
        <StageSkipModal 
          proposalId={selectedProposalId}
          onClose={() => {
            setShowSkipModal(false);
            setSelectedProposalId(null);
          }}
        />
      )}
    </div>
  );
};

export default ModernDashboard;
