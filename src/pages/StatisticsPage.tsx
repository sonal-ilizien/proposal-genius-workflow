
import { useProposals } from "@/context/ProposalContext";
import { useEntranceAnimation } from "@/utils/animations";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const StatisticsPage = () => {
  const { proposals, schemes } = useProposals();
  const isVisible = useEntranceAnimation();
  
  // Count proposals by scheme
  const schemeStats = schemes.map(scheme => {
    const count = proposals.filter(p => p.schemeId === scheme.id).length;
    return {
      name: scheme.name,
      count: count
    };
  });
  
  // Count proposals by stage status
  const stageStatusCount = {
    active: 0,
    completed: 0,
    pending: 0,
    rejected: 0
  };
  
  proposals.forEach(proposal => {
    proposal.stages.forEach(stage => {
      stageStatusCount[stage.status as keyof typeof stageStatusCount]++;
    });
  });
  
  const stageData = [
    { name: 'Active', value: stageStatusCount.active },
    { name: 'Completed', value: stageStatusCount.completed },
    { name: 'Pending', value: stageStatusCount.pending },
    { name: 'Rejected', value: stageStatusCount.rejected }
  ];

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
      <div className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Statistics</h1>
          <p className="text-gray-600 mt-2">
            Overview of proposal metrics and analytics
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Proposals by Scheme */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Proposals by Scheme</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={schemeStats}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3b82f6" name="Number of Proposals" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Stage Status Distribution */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Stage Status Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {stageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {proposals.length === 0 && (
          <div className="mt-8 p-8 bg-white rounded-xl text-center">
            <p className="text-lg text-gray-600">No proposal data available yet. Create proposals to see statistics.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatisticsPage;
