export interface Comment {
  id: string;
  text: string;
  approved: boolean;
  createdAt: Date;
  parentId: string | null;
  replies?: string[]; // IDs of reply comments
}

export interface Stage {
  id: string;
  name: string;
  description: string;
  status?: 'pending' | 'active' | 'completed' | 'rejected';
  comments: Comment[];
  startedAt: Date | null;
  completedAt: Date | null;
}

export interface Scheme {
  id: string;
  name: string;
  description: string;
  color: string;
  stages: Omit<Stage, 'comments' | 'startedAt' | 'completedAt'>[];
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  schemeId: string;
  createdAt: Date;
  currentStageIndex: number;
  stages: Stage[];
}

export const schemeData: Scheme[] = [
  {
    id: 'make-i',
    name: 'Make-I Scheme',
    description: 'Government-Funded Prototyping with up to 70% funding and mandatory bulk order assurance',
    color: 'blue',
    stages: [
      {
        id: 'make-i-stage-1',
        name: 'Feasibility Study & Categorization',
        description: 'Initial assessment of the project feasibility and categorization'
      },
      {
        id: 'make-i-stage-2',
        name: 'Approval of Necessity (AoN) & Project Definition',
        description: 'Formal approval of the project necessity and definition of project parameters'
      },
      {
        id: 'make-i-stage-3',
        name: 'Expression of Interest (EoI) & Vendor Shortlisting',
        description: 'Publication of EoI and selection of potential vendors'
      },
      {
        id: 'make-i-stage-4',
        name: 'Project Sanction Order & Prototype Development',
        description: 'Formal sanction order and commencement of prototype development'
      },
      {
        id: 'make-i-stage-5',
        name: 'Technical & Staff Evaluation',
        description: 'Comprehensive evaluation of the developed prototype'
      },
      {
        id: 'make-i-stage-6',
        name: 'Solicitation of Revised Commercial Offer',
        description: 'Request for updated commercial proposals based on evaluation'
      },
      {
        id: 'make-i-stage-7',
        name: 'Contract Negotiation & Finalization',
        description: 'Final negotiations and contract completion'
      }
    ]
  },
  {
    id: 'make-ii',
    name: 'Make-II Scheme',
    description: 'Industry-Funded Prototyping with no government funding but assured orders upon success',
    color: 'emerald',
    stages: [
      {
        id: 'make-ii-stage-1',
        name: 'Project Identification & Categorization',
        description: 'Identification of suitable projects and their categorization'
      },
      {
        id: 'make-ii-stage-2',
        name: 'Approval of Necessity (AoN) & Expression of Interest (EoI)',
        description: 'Formal approval and publication of EoI for industry participation'
      },
      {
        id: 'make-ii-stage-3',
        name: 'Industry Submission of Proposals & Screening',
        description: 'Receipt and initial screening of industry proposals'
      },
      {
        id: 'make-ii-stage-4',
        name: 'Shortlisting & Vendor Development',
        description: 'Selection of potential vendors and commencement of development'
      },
      {
        id: 'make-ii-stage-5',
        name: 'Prototype Development & Field Trials',
        description: 'Development of prototypes and their field evaluation'
      },
      {
        id: 'make-ii-stage-6',
        name: 'Final Evaluation & Contract Placement',
        description: 'Comprehensive evaluation and finalization of contracts'
      }
    ]
  },
  {
    id: 'make-iii',
    name: 'Make-III Scheme',
    description: 'Import Substitution through private manufacturing using JVs & Transfer of Technology',
    color: 'indigo',
    stages: [
      {
        id: 'make-iii-stage-1',
        name: 'Identification of Import-Dependent Equipment',
        description: 'Identifying equipment currently reliant on imports'
      },
      {
        id: 'make-iii-stage-2',
        name: 'Approval & Selection of Vendors',
        description: 'Formal approval process and selection of suitable vendors'
      },
      {
        id: 'make-iii-stage-3',
        name: 'Prototype Development & Testing',
        description: 'Development and testing of prototype equipment'
      },
      {
        id: 'make-iii-stage-4',
        name: 'Indigenous Content Validation',
        description: 'Verification of indigenous content in the developed prototype'
      },
      {
        id: 'make-iii-stage-5',
        name: 'Final Contracting & Bulk Procurement',
        description: 'Contract finalization and commencement of bulk procurement'
      }
    ]
  },
  {
    id: 'idex',
    name: 'iDEX Scheme',
    description: 'Innovations for Defence Excellence supporting startups, MSMEs, and innovators',
    color: 'amber',
    stages: [
      {
        id: 'idex-stage-1',
        name: 'Identification of Problem Statement (iDEX Challenge)',
        description: 'Definition of specific defence challenge to be addressed'
      },
      {
        id: 'idex-stage-2',
        name: 'Open Call for Applications from Startups/MSMEs',
        description: 'Invitation for proposals from startups and MSMEs'
      },
      {
        id: 'idex-stage-3',
        name: 'Screening & Selection by High-Powered Committee (HPSC)',
        description: 'Evaluation and selection of promising proposals'
      },
      {
        id: 'idex-stage-4',
        name: 'Development of Prototype & AI-Based Review',
        description: 'Prototype development with AI-assisted evaluation'
      },
      {
        id: 'idex-stage-5',
        name: 'Field Trials & Testing',
        description: 'Comprehensive field testing of the developed prototype'
      },
      {
        id: 'idex-stage-6',
        name: 'Acceptance & Contract Award',
        description: 'Final acceptance and contract formalization'
      }
    ]
  },
  {
    id: 'tdf',
    name: 'Technology Development Fund (TDF) Scheme',
    description: 'Government grants for developing indigenous defence technologies',
    color: 'rose',
    stages: [
      {
        id: 'tdf-stage-1',
        name: 'Submission of Technology Development Proposal',
        description: 'Formal submission of detailed technology development proposals'
      },
      {
        id: 'tdf-stage-2',
        name: 'Approval by Defence Research & Development Organisation (DRDO)',
        description: 'Evaluation and approval by DRDO'
      },
      {
        id: 'tdf-stage-3',
        name: 'Grant Disbursement & Prototype Development',
        description: 'Release of funds and commencement of prototype development'
      },
      {
        id: 'tdf-stage-4',
        name: 'Testing & Certification',
        description: 'Comprehensive testing and certification of the developed technology'
      },
      {
        id: 'tdf-stage-5',
        name: 'Final Selection for Mass Production',
        description: 'Selection for mass production based on testing results'
      }
    ]
  },
  {
    id: 'revenue',
    name: 'Revenue Scheme',
    description: 'Routine procurement & maintenance of defence systems',
    color: 'purple',
    stages: [
      {
        id: 'revenue-stage-1',
        name: 'Item Identification & Demand Generation',
        description: 'Identification of required items and formal demand creation'
      },
      {
        id: 'revenue-stage-2',
        name: 'Formulation of Statement of Technical Requirements (SOTRs)',
        description: 'Development of detailed technical specifications'
      },
      {
        id: 'revenue-stage-3',
        name: 'Vendor Identification & EoI Submission',
        description: 'Identification of potential vendors and request for expressions of interest'
      },
      {
        id: 'revenue-stage-4',
        name: 'Acceptance of Necessity (AoN) & Budget Allocation',
        description: 'Formal approval and budget allocation for procurement'
      },
      {
        id: 'revenue-stage-5',
        name: 'Technical & Commercial Evaluation',
        description: 'Comprehensive evaluation of technical and commercial aspects'
      },
      {
        id: 'revenue-stage-6',
        name: 'Contract Finalization & Procurement',
        description: 'Finalization of contracts and initiation of procurement'
      },
      {
        id: 'revenue-stage-7',
        name: 'Post-Procurement Maintenance & Audit',
        description: 'Ongoing maintenance and audit of procured items'
      }
    ]
  }
];

export const getSchemeById = (id: string): Scheme | undefined => {
  return schemeData.find(scheme => scheme.id === id);
};

export const getAIRecommendation = (proposal: Proposal): string => {
  const currentStage = proposal.stages[proposal.currentStageIndex];
  const scheme = getSchemeById(proposal.schemeId);
  
  if (!scheme) return "No AI recommendations available at this time.";
  
  const recommendations = [
    `Based on similar ${scheme.name} proposals, we recommend focusing on detailed technical documentation for this stage.`,
    `Historical data shows that ${currentStage.name} typically requires approximately 3-4 weeks to complete.`,
    `Consider involving technical experts early in this stage to prevent approval delays.`,
    `Previous successful proposals in this scheme had thorough risk assessment documentation.`,
    `For optimal approval rates, ensure all technical specifications are clearly defined and measurable.`,
    `AI analysis suggests including comprehensive vendor capability assessment to improve approval chances.`,
    `Similar proposals have benefited from early stakeholder consultation during this stage.`,
    `Based on pattern analysis, successful proposals typically include detailed milestone timelines.`
  ];
  
  // Deterministic but seemingly random selection based on proposal and stage IDs
  const seed = proposal.id.charCodeAt(0) + currentStage.id.charCodeAt(0);
  const index = seed % recommendations.length;
  
  return recommendations[index];
};

export const getVendorRecommendations = (): string[] => {
  return [
    "Bharat Electronics Limited (BEL)",
    "Hindustan Aeronautics Limited (HAL)",
    "Bharat Dynamics Limited (BDL)",
    "Mazagon Dock Shipbuilders Ltd",
    "Larsen & Toubro Defence",
    "Tata Advanced Systems",
    "Kalyani Strategic Systems",
    "Mahindra Defence Systems",
    "Alpha Design Technologies",
    "Astra Microwave Products",
    "Centum Electronics",
    "Data Patterns India",
    "Adani Defence & Aerospace"
  ];
};
