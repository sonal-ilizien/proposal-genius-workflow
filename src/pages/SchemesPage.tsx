
import { useState } from 'react';
import { useProposals } from '@/context/ProposalContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useEntranceAnimation } from '@/utils/animations';

const SchemesPage = () => {
  const { schemes } = useProposals();
  const isVisible = useEntranceAnimation();
  const [expandedScheme, setExpandedScheme] = useState<string | null>(null);

  const toggleExpand = (schemeId: string) => {
    if (expandedScheme === schemeId) {
      setExpandedScheme(null);
    } else {
      setExpandedScheme(schemeId);
    }
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
      <div className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Scheme Master</h1>
          <p className="text-gray-600 mt-2">
            Review and manage all indigenisation schemes and their workflow stages
          </p>
        </div>

        <div className="grid gap-6">
          {schemes.map((scheme) => (
            <Card key={scheme.id} className="overflow-hidden transition-all duration-300">
              <CardHeader 
                className={`cursor-pointer flex flex-row items-center justify-between bg-${scheme.color}-50`}
                onClick={() => toggleExpand(scheme.id)}
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full bg-${scheme.color}-500`}></div>
                    <CardTitle className="text-lg">{scheme.name}</CardTitle>
                  </div>
                  <CardDescription className="mt-1.5">{scheme.description}</CardDescription>
                </div>
                {expandedScheme === scheme.id ? 
                  <ChevronDown className="h-5 w-5 text-gray-500" /> : 
                  <ChevronRight className="h-5 w-5 text-gray-500" />
                }
              </CardHeader>
              
              {expandedScheme === scheme.id && (
                <CardContent className="pt-6">
                  <h3 className="text-md font-semibold mb-4">Workflow Stages</h3>
                  <div className="space-y-4">
                    {scheme.stages.map((stage, index) => (
                      <div key={stage.id} className="relative pl-6 pb-6 border-l border-gray-200">
                        <div className="absolute left-0 -translate-x-1/2 w-3 h-3 rounded-full bg-gray-200 border-4 border-white"></div>
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <h4 className="font-medium">{stage.name}</h4>
                            <Badge variant="outline" className="ml-2">Stage {index + 1}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{stage.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
              
              <CardFooter 
                className={`bg-${scheme.color}-50 p-4 text-sm text-gray-600 ${expandedScheme === scheme.id ? 'block' : 'hidden'}`}
              >
                <div className="flex items-center justify-between">
                  <span>{scheme.stages.length} workflow stages</span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SchemesPage;
