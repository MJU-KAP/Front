export interface Skill {
    name: string;
    score: number;
    color: string;
    isLacking?: boolean;
  }
  
  export interface ActionPlan {
    id: number;
    category: string;
    skillTarget: string;
    title: string;
    desc: string;
    deadline: string;
  }
  
  export interface AnalysisData {
    id: string;
    fileName: string;
    jobFamily: string;
    skills: Skill[];
    totalOwned: number;
    totalLacking: number;
    totalScore: number;
    actionPlans: ActionPlan[];
    insight: string;
  }