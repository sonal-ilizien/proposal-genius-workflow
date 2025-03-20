
import { useState, useEffect } from 'react';
import { Brain, ChevronUp, ChevronDown, Users, BarChart2 } from 'lucide-react';
import { Proposal, getAIRecommendation, getVendorRecommendations } from '@/utils/schemeData';
import { useEntranceAnimation } from '@/utils/animations';

interface AIInsightsProps {
  proposal: Proposal;
}

const AIInsights = ({ proposal }: AIInsightsProps) => {
  const [expanded, setExpanded] = useState(true);
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);
  const [vendorRecommendations, setVendorRecommendations] = useState<string[]>([]);
  const isVisible = useEntranceAnimation(300);
  
  // Simulate AI loading
  useEffect(() => {
    setRecommendationsLoading(true);
    const timer = setTimeout(() => {
      setRecommendationsLoading(false);
      setVendorRecommendations(getVendorRecommendations().slice(0, 5));
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [proposal.id, proposal.currentStageIndex]);
  
  const currentStage = proposal.stages[proposal.currentStageIndex];
  const aiRecommendation = getAIRecommendation(proposal);
  
  return (
    <div 
      className={`glass rounded-lg overflow-hidden transition-all duration-500 ${
        isVisible ? 'opacity-100 transform-none' : 'opacity-0 transform translate-y-4'
      }`}
    >
      <div 
        className="flex items-center justify-between px-4 py-3 cursor-pointer border-b border-gray-100"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <Brain className="h-4 w-4 text-blue-600" />
          </div>
          <h3 className="font-medium">AI Insights & Recommendations</h3>
        </div>
        {expanded ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </div>
      
      {expanded && (
        <div className="p-4">
          <div className="space-y-4">
            {/* Current Stage Analysis */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <BarChart2 className="h-4 w-4 text-blue-600" />
                <h4 className="font-medium">Current Stage Analysis</h4>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                {recommendationsLoading ? (
                  <div className="h-4 w-full bg-blue-200 rounded animate-pulse"></div>
                ) : (
                  <p className="text-sm text-gray-700">{aiRecommendation}</p>
                )}
              </div>
            </div>
            
            {/* Vendor Recommendations */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Users className="h-4 w-4 text-blue-600" />
                <h4 className="font-medium">Recommended Vendors</h4>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {recommendationsLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="h-8 bg-gray-100 rounded animate-pulse"></div>
                  ))
                ) : (
                  vendorRecommendations.map((vendor, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-sm">{vendor}</span>
                      <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                        {Math.floor(Math.random() * 20) + 80}% match
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {/* Stage Progress */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <BarChart2 className="h-4 w-4 text-blue-600" />
                <h4 className="font-medium">Stage Progress</h4>
              </div>
              {recommendationsLoading ? (
                <div className="w-full h-4 bg-gray-100 rounded animate-pulse"></div>
              ) : (
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${(proposal.currentStageIndex / (proposal.stages.length - 1)) * 100}%` }}
                  ></div>
                </div>
              )}
              <div className="mt-2 flex justify-between text-xs text-gray-500">
                <span>Stage {proposal.currentStageIndex + 1} of {proposal.stages.length}</span>
                <span>
                  {Math.round((proposal.currentStageIndex / (proposal.stages.length - 1)) * 100)}% Complete
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
