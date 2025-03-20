
import { useState, useRef, useEffect } from 'react';
import { Check, Clock, AlertCircle } from 'lucide-react';
import { Stage } from '@/utils/schemeData';
import { useEntranceAnimation } from '@/utils/animations';

interface TimelineProps {
  stages: Stage[];
  currentStageIndex: number;
  onStageClick?: (stageId: string) => void;
}

const Timeline = ({ stages, currentStageIndex, onStageClick }: TimelineProps) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [activeIndicator, setActiveIndicator] = useState<number | null>(null);
  const isVisible = useEntranceAnimation(100);
  
  useEffect(() => {
    // Scroll to make current stage visible
    if (timelineRef.current && stages.length > 0) {
      const stageElements = timelineRef.current.querySelectorAll('.timeline-stage');
      if (stageElements[currentStageIndex]) {
        stageElements[currentStageIndex].scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
      }
    }
  }, [currentStageIndex, stages.length]);

  const getStageStatusIcon = (stage: Stage, index: number) => {
    switch (stage.status) {
      case 'completed':
        return <Check className="h-5 w-5 text-white" />;
      case 'active':
        return <Clock className="h-5 w-5 text-white animate-pulse" />;
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-white" />;
      default:
        return <span className="text-white font-medium">{index + 1}</span>;
    }
  };

  const getStageStatusColor = (stage: Stage) => {
    switch (stage.status) {
      case 'completed':
        return 'bg-green-500';
      case 'active':
        return 'bg-blue-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };

  const handleStageClick = (stageId: string, index: number) => {
    setActiveIndicator(index);
    if (onStageClick) {
      onStageClick(stageId);
    }
  };

  return (
    <div 
      ref={timelineRef}
      className={`w-full overflow-x-auto transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="min-w-max py-6">
        <div className="flex items-center space-x-2">
          {stages.map((stage, index) => (
            <div key={stage.id} className="flex flex-col items-center timeline-stage">
              {/* Timeline connector */}
              {index > 0 && (
                <div 
                  className={`h-0.5 w-20 ${
                    index <= currentStageIndex ? 'bg-blue-500' : 'bg-gray-200'
                  } mb-6`}
                ></div>
              )}
              
              {/* Stage indicator */}
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  getStageStatusColor(stage)
                } transition-all duration-300 cursor-pointer transform hover:scale-110 ${
                  activeIndicator === index ? 'ring-4 ring-blue-200' : ''
                }`}
                onClick={() => handleStageClick(stage.id, index)}
              >
                {getStageStatusIcon(stage, index)}
              </div>
              
              {/* Stage name */}
              <div 
                className={`mt-2 text-center px-4 max-w-[150px] transition-all duration-300 ${
                  index === currentStageIndex || activeIndicator === index
                    ? 'text-blue-600 font-medium'
                    : 'text-gray-600'
                }`}
              >
                <span className="text-sm whitespace-normal">{stage.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
