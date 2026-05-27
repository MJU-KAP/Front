export interface Skill {
  name: string;
  score: number;
  color: string;
  isLacking?: boolean;
  gap: number;
  required_score: number;
}

export interface SkillCanvasProps {
  skills: Skill[];
  hoveredSkill: string | null;
  setHoveredSkill: (skill: string | null) => void;
  hoveredPlanData: { skill: string, amount: number } | null;
}

export interface SkillChunk {
  id: string;
  name?: string;
  take: number;
  baseColor?: string;
  isHovered?: boolean;
  isDimmed?: boolean;
  isBonus?: boolean;
  bonusAmount?: number;
  isFirstPart?: boolean;
  isLastPart?: boolean;
  originalSkill?: string;
  isLongestPart?: boolean;
  isDummy?: boolean;
  isLacking?: boolean; 
}

export interface ActionPlan {
  id: number;
  category: string;
  skillTarget: string;
  title: string;
  desc: string;
  deadline: string;
  url?: string;
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
  insight: AiInsightData;
  lackingSkills?: string[];
}

export interface AiInsightData {
  strength: string;
  improvement: string;
  growth_direction: string;
  market_fit: string;
  summary: string;
}

export interface ParsedSkill {
  name: string;
  score: number;
}

export interface ParsedGap {
  name: string;
  gap: number;
}

export interface ParsedRecommendation {
  rank: number;
  type?: string;
  skills_covered?: string[];
  title: string;
  description: string;
  deadline_days?: number;
  url?: string;
}