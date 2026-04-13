import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom"; 
import type { AnalysisData } from "./type";

import ResultHeader from "./component/ResultHeader";
import SkillCanvas from "./component/SkillCanvas";
import SkillSummary from "./component/SkillSummary";
import SkillProgress from "./component/SkillProgress";
import ActionPlanSidebar from "./component/ActionPlanSidebar";

// 목업 데이터 가져오는 함수 (이전과 동일하므로 생략하지 않고 그대로 두시면 됩니다)
const getMockData = (id: string): AnalysisData => ({
  // ... (기존과 동일)
  id: id,
  fileName: `이력서_분석결과_${id}.pdf`,
  jobFamily: `프론트엔드 개발자 분석 결과 (ID: ${id})`,
  totalOwned: 8,
  totalLacking: 3,
  totalScore: 72,
  insight: "테스팅 역량이 가장 부족합니다. 공모전 참여 시 데이터 시각화 블록이 30% 강화될 수 있습니다.",
  skills: [
    { name: "React", score: 85, color: "bg-orange-500" },
    { name: "TypeScript", score: 78, color: "bg-orange-500" },
    { name: "CSS", score: 65, color: "bg-emerald-400" },
    { name: "Git", score: 98, color: "bg-orange-500" },
    { name: "Next.js", score: 45, color: "bg-emerald-400" },
    { name: "Testing", score: 38, color: "bg-red-400", isLacking: true },
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
  
  // ✅ 마우스가 올라간 스킬 이름을 저장하는 상태 추가
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;
    const fetchAnalysisData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        if (isMounted) setData(getMockData(id));
      } catch (error) {
        console.error("데이터 통신 에러:", error);
      }
    };
    fetchAnalysisData();
    return () => { isMounted = false; };
  }, [id]);

  if (!id) return <Navigate to="/" replace />;
  if (!data) return <div className="min-h-screen bg-zinc-50 flex justify-center items-center">분석 결과를 불러오는 중입니다...</div>;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 w-full overflow-x-hidden">
      <ResultHeader fileName={data.fileName} />
      
      <main className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <section className="lg:col-span-2 flex flex-col gap-6">
          <div className="mb-4">
            <h1 className="text-2xl font-bold tracking-tight mb-2">AI 역량 분석 결과</h1>
            <p className="text-zinc-500 text-sm">{data.jobFamily}</p>
          </div>

          {/* ✅ props로 hoveredSkill과 setHoveredSkill을 내려줍니다 */}
          <SkillCanvas 
            skills={data.skills} 
            hoveredSkill={hoveredSkill} 
            setHoveredSkill={setHoveredSkill} 
          />
          <SkillSummary owned={data.totalOwned} lacking={data.totalLacking} score={data.totalScore} />
          <SkillProgress 
            skills={data.skills} 
            hoveredSkill={hoveredSkill} 
          />
        </section>

        <section className="lg:col-span-1 mt-16 lg:mt-0">
          <ActionPlanSidebar 
            plans={data.actionPlans} 
            insight={data.insight} 
            hoveredSkill={hoveredSkill} 
          />
        </section>
      </main>
    </div>
  );
}