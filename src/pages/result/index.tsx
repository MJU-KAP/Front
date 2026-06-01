import { useEffect, useState, useMemo } from "react";
import { useParams, Navigate, useLocation } from "react-router-dom"; 
import type { AnalysisData, ParsedGap, ParsedRecommendation, ParsedSkill, Skill } from "./type";
import ResultHeader from "./component/ResultHeader";
import SkillCanvas from "./component/SkillCanvas";
import SkillSummary from "./component/SkillSummary";
import SkillProgress from "./component/SkillProgress";
import ActionPlanSidebar from "./component/ActionPlanSidebar";
import LoadingScreen from "./component/LoadingScreen";
import { api } from "../../apis/api";

export default function ResultPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const preloadedData = location.state?.preloadedData as Record<string, unknown> | undefined;

  const [data, setData] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [showResultView, setShowResultView] = useState(!!preloadedData); 

  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    const formatAndSetData = (rawData: Record<string, unknown>) => {
      try {
        const parsed = typeof rawData.result === 'string' 
          ? JSON.parse(rawData.result) 
          : rawData.result;

        if (isMounted) {
          const skillMap = new Map<string, Skill>();

          (parsed.user_skills || []).forEach((s: ParsedSkill & { required_score?: number }) => {
            skillMap.set(s.name, {
              name: s.name,
              score: s.score || 0,
              color: "",
              isLacking: false,
              gap: 0,
              required_score: s.required_score ?? 0,
            });
          });

          (parsed.skill_gaps || []).forEach((g: ParsedGap & { required_score?: number }) => {
            const existing = skillMap.get(g.name);
            if (existing) {
              existing.gap = g.gap || 0;
              existing.required_score = g.required_score || (existing.score + existing.gap);
              existing.isLacking = existing.score < existing.required_score;
            } else {
              skillMap.set(g.name, {
                name: g.name,
                score: 0,
                color: "",
                isLacking: true,
                gap: g.gap || 0,
                required_score: g.required_score || g.gap || 0
              });
            }
          });

          const unifiedSkills = Array.from(skillMap.values());

          const formattedData: AnalysisData = {
            id: rawData.recordId as string,
            
            // fileName이 아예 없으면 빈 문자열("")로 세팅합니다.
            fileName: (rawData.fileName as string) || (rawData.originalFileName as string) || (rawData.file_name as string) || "",
            
            jobFamily: (rawData.inputSummary as string) || parsed.target_job || "분석 결과",
            
            skills: unifiedSkills,
            actionPlans: (parsed.recommendations || []).map((r: ParsedRecommendation) => {
              const targetSkill = r.skills_covered?.[0];
            
              let amount = 0;
              let boostSkill = targetSkill;
            
              const boostEntries = r.boost_detail ? Object.entries(r.boost_detail) : [];
            
              if (boostEntries.length > 0) {
                // boost_detail에 값이 있으면 그걸 사용 (정확한 상승량)
                if (targetSkill && typeof r.boost_detail![targetSkill] === 'number') {
                  amount = r.boost_detail![targetSkill];
                } else {
                  // skills_covered[0]와 키가 다르면 boost_detail 첫 항목 사용
                  const [k, v] = boostEntries[0];
                  boostSkill = k;
                  amount = v;
                }
              } else {
                // boost_detail이 비어있으면 gap의 약 40%로 폴백 (1/3~1/2 사이)
                const gapData = parsed.skill_gaps?.find((g: ParsedGap) => g.name === targetSkill);
                amount = gapData ? Math.round(gapData.gap * 0.4) : 0;
              }
            
              return {
                id: r.rank,
                category: r.type || "활동",
                skillTarget: `${boostSkill || '기타'} +${amount}%`,
                targetSkillName: boostSkill || '',
                targetAmount: amount,
                title: r.title,
                desc: r.description,
                deadline: `D-${r.deadline_days || 0}`,
                url: r.url,
                skillsCovered: r.skills_covered,
              };
            }),
            totalOwned: parsed.user_skills?.length || 0,
            totalLacking: parsed.skill_gaps?.length || 0,
            totalScore: parsed.readiness_score || 0,
            insight: {
              strength: parsed.ai_insight?.strength || "분석된 강점 데이터가 없습니다.",
              improvement: parsed.ai_insight?.improvement || "분석된 보완점 데이터가 없습니다.",
              growth_direction: parsed.ai_insight?.growth_direction || "분석된 성장 방향 데이터가 없습니다.",
              market_fit: parsed.ai_insight?.market_fit || "분석된 시장 적합도 데이터가 없습니다.",
              summary: parsed.ai_insight?.summary || "분석 결과를 확인하세요.",
              user_skills: parsed.user_skills || [],
            }
          };
          
          setData(formattedData);
        }
      } catch (err) {
        console.error("데이터 파싱 실패:", err);
        if (isMounted) setError("데이터 처리 중 오류가 발생했습니다.");
      }
    };

    if (preloadedData) {
      formatAndSetData(preloadedData);
      return; 
    }

    const fetchAnalysisData = async () => {
      try {
        const res = await api.get(`/api/analyze/result/${id}`);
        formatAndSetData(res.data);
      } catch (err) {
        console.error("데이터 불러오기 실패:", err);
        if (isMounted) setError("분석 결과를 불러오는데 실패했습니다."); 
      }
    };
    
    fetchAnalysisData();
    
    return () => { isMounted = false; };
  }, [id, preloadedData]);

  const hoveredPlanData = useMemo(() => {
    if (hoveredPlan === null || !data) return null;
    const activePlan = data.actionPlans.find(p => p.id === hoveredPlan);
    if (activePlan?.targetSkillName) {
      return { skill: activePlan.targetSkillName, amount: activePlan.targetAmount ?? 0 };
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
      {/* 데이터에 파일명이 있을 때만 ResultHeader를 렌더링합니다 */}
      {data.fileName && <ResultHeader fileName={data.fileName} />}
      
      <main className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <section className="lg:col-span-2 flex flex-col gap-6">
          <div className="mb-4">
            <h1 className="text-2xl font-bold tracking-tight mb-2">AI 역량 분석 결과</h1>
            <p className="text-zinc-500 text-sm">{data.jobFamily}</p>
          </div>
          <SkillCanvas skills={data.skills} hoveredSkill={hoveredSkill} setHoveredSkill={setHoveredSkill} hoveredPlanData={hoveredPlanData} />
          <SkillSummary owned={data.totalOwned} lacking={data.totalLacking} score={data.totalScore} />
          <SkillProgress skills={data.skills} hoveredSkill={hoveredSkill} setHoveredSkill={setHoveredSkill} hoveredPlanData={hoveredPlanData} />
        </section>
        <section className="lg:col-span-1 mt-16 lg:mt-0">
          <ActionPlanSidebar plans={data.actionPlans} insight={data.insight} hoveredSkill={hoveredSkill} hoveredPlan={hoveredPlan} setHoveredPlan={setHoveredPlan} />
        </section>
      </main>
    </div>
  );
}