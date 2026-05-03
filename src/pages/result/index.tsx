import { useEffect, useState, useMemo } from "react";
import { useParams, Navigate } from "react-router-dom"; 
import type { AnalysisData } from "./type";

import ResultHeader from "./component/ResultHeader";
import SkillCanvas from "./component/SkillCanvas";
import SkillSummary from "./component/SkillSummary";
import SkillProgress from "./component/SkillProgress";
import ActionPlanSidebar from "./component/ActionPlanSidebar";
import LoadingScreen from "./component/LoadingScreen";

const getMockData = (id: string): AnalysisData => ({
  id: id,
  fileName: `이력서_분석결과_${id}.pdf`,
  jobFamily: `프론트엔드 개발자 분석 결과 (ID: ${id})`,
  totalOwned: 8,
  totalLacking: 3,
  totalScore: 72,
  insight: "React와 TypeScript 기반의 탄탄한 기본기와 뛰어난 형상 관리 능력을 보유하고 있습니다. 향후 Next.js와 테스트 자동화 역량을 보완한다면 프론트엔드 생태계 전반을 아우르는 완성도 높은 개발자로 도약할 수 있습니다.",
  skills: [
    { name: "React", score: 85, color: "bg-emerald-500" },
    { name: "TypeScript", score: 78, color: "bg-orange-500" },
    { name: "CSS", score: 65, color: "bg-emerald-500" },
    { name: "Git", score: 98, color: "bg-orange-500" },
    { name: "Next.js", score: 45, color: "bg-emerald-500" },
    { name: "Testing", score: 38, color: "bg-orange-500", isLacking: true },
  ],
  actionPlans: [
    {
      id: 1, category: "공모전", skillTarget: "Testing +30%",
      title: "2025 소프트웨어 테스팅 공모전",
      desc: "테스트 코드 작성 및 품질 분석 능력을 키울 수 있는 대회",
      deadline: "마감: 2025.04.30",
    },
    {
      id: 2, category: "대외활동", skillTarget: "Next.js +45%",
      title: "GDSC 웹 개발 프로젝트",
      desc: "Next.js 기반 프로젝트를 통해 프레임워크 숙련도를 높이는 활동",
      deadline: "모집: 상시",
    },
    {
      id: 3, category: "IT 동아리", skillTarget: "Testing +25%",
      title: "DDD IT 연합 동아리",
      desc: "디자이너와 개발자가 함께 실전 프로젝트를 진행하는 IT 연합 동아리",
      deadline: "모집: 2025.05.01 ~ 05.15",
    },
  ]
});

export default function ResultPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<AnalysisData | null>(null);
  
  // 상태 세분화: 에러 처리 및 결과창 뷰 전환 제어
  const [error, setError] = useState<string | null>(null);
  const [showResultView, setShowResultView] = useState(false); 

  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;
    
    const fetchAnalysisData = async () => {
      try {
        // 실제 API 호출 시 여기에 로직 작성
        // const res = await api.get(`/api/analysis/${id}`);
        // if (isMounted) setData(res.data);
        
        await new Promise(resolve => setTimeout(resolve, 1000)); // 통신 시간 시뮬레이션
        if (isMounted) setData(getMockData(id));
        
      } catch (err) {
        console.error("데이터 통신 에러:", err);
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
  
  if (error) {
    return <div className="min-h-screen bg-zinc-950 flex justify-center items-center text-red-500">{error}</div>;
  }
  
  // 통신이 안 끝났거나, 유저가 결과 보기 버튼을 누르기 전에는 LoadingScreen 렌더링
  if (!data || !showResultView) {
    return (
      <LoadingScreen 
        isDataReady={data !== null} 
        onComplete={() => setShowResultView(true)} 
      />
    );
  }

  // 실제 결과 화면 렌더링
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 w-full overflow-x-hidden">
      <ResultHeader fileName={data.fileName} />
      
      <main className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <section className="lg:col-span-2 flex flex-col gap-6">
          <div className="mb-4">
            <h1 className="text-2xl font-bold tracking-tight mb-2">AI 역량 분석 결과</h1>
            <p className="text-zinc-500 text-sm">{data.jobFamily}</p>
          </div>

          <SkillCanvas 
            skills={data.skills} 
            hoveredSkill={hoveredSkill} 
            setHoveredSkill={setHoveredSkill} 
            hoveredPlanData={hoveredPlanData}
          />
          <SkillSummary owned={data.totalOwned} lacking={data.totalLacking} score={data.totalScore} />
          <SkillProgress 
            skills={data.skills} 
            hoveredSkill={hoveredSkill} 
            hoveredPlanData={hoveredPlanData}
          />
        </section>

        <section className="lg:col-span-1 mt-16 lg:mt-0">
          <ActionPlanSidebar 
            plans={data.actionPlans} 
            insight={data.insight} 
            hoveredSkill={hoveredSkill} 
            hoveredPlan={hoveredPlan}
            setHoveredPlan={setHoveredPlan}
          />
        </section>
      </main>
    </div>
  );
}