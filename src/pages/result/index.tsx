import React, { useEffect, useState } from "react";
import type { AnalysisData } from "./type";

import ResultHeader from "./component/ResultHeader";
import SkillCanvas from "./component/SkillCanvas";
import SkillSummary from "./component/SkillSummary";
import SkillProgress from "./component/SkillProgress";
import ActionPlanSidebar from "./component/ActionPlanSidebar";

const mockData: AnalysisData = {
  id: "1",
  fileName: "이력서_김철익.pdf",
  jobFamily: "프론트엔드 개발자 이력서 기반 분석",
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
      id: 1,
      category: "공모전",
      skillTarget: "Testing +30%",
      title: "2025 소프트웨어 테스팅 공모전",
      desc: "테스트 코드 작성 및 품질 분석 능력을 키울 수 있는 대회",
      deadline: "마감: 2025.04.30",
    },
    {
      id: 2,
      category: "대외활동",
      skillTarget: "Next.js +45%",
      title: "GDSC 웹 개발 프로젝트",
      desc: "Next.js 기반 프로젝트를 통해 프레임워크 숙련도를 높이는 활동",
      deadline: "모집: 상시",
    },
    {
      id: 3,
      category: "IT 동아리",
      skillTarget: "Testing +25%",
      title: "DDD IT 연합 동아리",
      desc: "디자이너와 개발자가 함께 실전 프로젝트를 진행하는 IT 연합 동아리",
      deadline: "모집: 2025.05.01 ~ 05.15",
    },
  ]
};

export default function ResultPage({ params }: { params?: { id: string } }) {
  const [data, setData] = useState<AnalysisData | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchAnalysisData = async () => {
      try {
        await Promise.resolve();
        
        if (isMounted) {
          setData(mockData);
        }
      } catch (error) {
        console.error("데이터 통신 에러:", error);
      }
    };

    fetchAnalysisData();

    // 컴포넌트 언마운트 시 상태 업데이트 방지 (메모리 누수 방지)
    return () => {
      isMounted = false;
    };
  }, [params?.id]);

  if (!data) return <div className="min-h-screen bg-zinc-50 flex justify-center items-center">로딩중...</div>;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 w-full overflow-x-hidden">
      <ResultHeader fileName={data.fileName} />
      
      <main className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        <section className="lg:col-span-2 flex flex-col gap-6">
          <div className="mb-4">
            <h1 className="text-2xl font-bold tracking-tight mb-2">AI 역량 분석 결과</h1>
            <p className="text-zinc-500 text-sm">{data.jobFamily}</p>
          </div>

          <SkillCanvas />
          <SkillSummary owned={data.totalOwned} lacking={data.totalLacking} score={data.totalScore} />
          <SkillProgress skills={data.skills} />
        </section>

        <section className="lg:col-span-1 mt-16 lg:mt-0">
          <ActionPlanSidebar plans={data.actionPlans} insight={data.insight} />
        </section>
        
      </main>
    </div>
  );
}