import { useEffect, useState, useMemo } from "react";
import { useParams, Navigate } from "react-router-dom"; 
import type { AnalysisData, ParsedGap, ParsedRecommendation, ParsedSkill } from "./type";
import ResultHeader from "./component/ResultHeader";
import SkillCanvas from "./component/SkillCanvas";
import SkillSummary from "./component/SkillSummary";
import SkillProgress from "./component/SkillProgress";
import ActionPlanSidebar from "./component/ActionPlanSidebar";
import LoadingScreen from "./component/LoadingScreen";
import { api } from "../../apis/api";

export default function ResultPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showResultView, setShowResultView] = useState(false); 

  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;
    
    const fetchAnalysisData = async () => {
      try {
        const res = await api.get(`/api/analyze/result/${id}`);
        
        // 문자열로 넘어올 경우를 대비해 안전하게 JSON 파싱
        const parsed = typeof res.data.result === 'string' 
          ? JSON.parse(res.data.result) 
          : res.data.result;

        console.log("파싱된 데이터 확인:", parsed); // 확인용 콘솔 로그

        if (isMounted) {
          const ownedSkills = (parsed.user_skills || []).map((s: ParsedSkill) => ({
            name: s.name,
            score: s.score,
            color: "",
            isLacking: false
          }));

          const lackingSkills = (parsed.skill_gaps || []).map((g: ParsedGap) => ({
            name: g.name,
            score: 0, 
            color: "",
            isLacking: true
          }));

          const formattedData: AnalysisData = {
            id: res.data.recordId,
            fileName: res.data.inputSummary,
            jobFamily: parsed.target_job || "분석 결과",
            skills: [...ownedSkills, ...lackingSkills],
            actionPlans: (parsed.recommendations || []).map((r: ParsedRecommendation) => {
              const targetSkill = r.skills_covered?.[0];
              const gapData = parsed.skill_gaps?.find((g: ParsedGap) => g.name === targetSkill);
              const amount = gapData ? gapData.gap : 20; 
            
              return {
                id: r.rank,
                category: r.type || "활동",
                skillTarget: `${targetSkill || '기타'} +${amount}%`,
                title: r.title,
                desc: r.description,
                deadline: `D-${r.deadline_days || 0}`,
                url: r.url
              };
            }),
            totalOwned: parsed.user_skills?.length || 0,
            totalLacking: parsed.skill_gaps?.length || 0,
            totalScore: parsed.readiness_score || 0,
            
            // ai_insight 객체 안전하게 매핑
            insight: {
              strength: parsed.ai_insight?.strength || "분석된 강점 데이터가 없습니다.",
              improvement: parsed.ai_insight?.improvement || "분석된 보완점 데이터가 없습니다.",
              growth_direction: parsed.ai_insight?.growth_direction || "분석된 성장 방향 데이터가 없습니다.",
              market_fit: parsed.ai_insight?.market_fit || "분석된 시장 적합도 데이터가 없습니다.",
              summary: parsed.ai_insight?.summary || "분석 결과를 확인하세요."
            }
          };
          
          setData(formattedData);
        }
      } catch (err) {
        console.error("데이터 불러오기 실패:", err);
        if (isMounted) setError("분석 결과를 불러오는데 실패했습니다."); 
      }
    };
    
    fetchAnalysisData();
    return () => { isMounted = false; };
  }, [id]);

  const hoveredPlanData = useMemo(() => {
    if (hoveredPlan === null || !data) return null;
    
    const activePlan = data.actionPlans.find(p => p.id === hoveredPlan);
    if (activePlan) {
      const match = activePlan.skillTarget.match(/([a-zA-Z0-9.]+)\s*\+(\d+)%/);
      if (match) {
        return { skill: match[1].trim(), amount: parseInt(match[2], 10) };
      }
    }
    return null;
  }, [hoveredPlan, data]);

  if (!id) return <Navigate to="/" replace />;
  if (error) return <div className="min-h-screen bg-zinc-950 flex justify-center items-center text-red-500">{error}</div>;
  
  if (!data || !showResultView) {
    return <LoadingScreen isDataReady={data !== null} onComplete={() => setShowResultView(true)} />;
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 w-full overflow-x-hidden">
      <ResultHeader fileName={data.fileName} />
      <main className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <section className="lg:col-span-2 flex flex-col gap-6">
          <div className="mb-4">
            <h1 className="text-2xl font-bold tracking-tight mb-2">AI 역량 분석 결과</h1>
            <p className="text-zinc-500 text-sm">{data.jobFamily}</p>
          </div>
          <SkillCanvas skills={data.skills} hoveredSkill={hoveredSkill} setHoveredSkill={setHoveredSkill} hoveredPlanData={hoveredPlanData} />
          <SkillSummary owned={data.totalOwned} lacking={data.totalLacking} score={data.totalScore} />
          <SkillProgress skills={data.skills} hoveredSkill={hoveredSkill} hoveredPlanData={hoveredPlanData} />
        </section>
        <section className="lg:col-span-1 mt-16 lg:mt-0">
          <ActionPlanSidebar plans={data.actionPlans} insight={data.insight} hoveredSkill={hoveredSkill} hoveredPlan={hoveredPlan} setHoveredPlan={setHoveredPlan} />
        </section>
      </main>
    </div>
  );
}