import { motion, type Variants } from 'framer-motion';
import FileUpload from "./component/FileUpload";
import KakaoLoginButton from '../kakao/component/KakaoLoginButton';

export default function MainPage() {
  // 공통 텍스트 애니메이션
  const fadeUpItem: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  // 카드 전용 애니메이션
  const smoothCardItem: Variants = {
    hidden: { opacity: 0, scale: 0.9, y: 15 },
    visible: (custom: number) => ({ 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1],
        delay: custom * 0.1
      }
    })
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 w-full overflow-x-hidden relative">

      {/* 헤더 영역: 카카오 로그인 버튼 */}
      <header className="absolute top-0 left-0 w-full p-6 flex justify-end z-50">
        <KakaoLoginButton />
      </header>

      <section className="bg-zinc-950 text-white min-h-[90vh] py-24 px-6 flex flex-col items-center justify-center text-center w-full">

        <motion.span 
          variants={fadeUpItem}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
          className="px-5 py-1.5 bg-orange-500 text-[16px] font-bold rounded-full mb-8 tracking-widest uppercase"
        >
          조조이백배 프로젝트
        </motion.span>
        
        <motion.h1 
          variants={fadeUpItem}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
          className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-tight w-full max-w-4xl"
        >
          Next Plan<br />
          <span className="text-orange-500">AI 역량 분석</span>
        </motion.h1>
        
        <motion.p 
          variants={fadeUpItem}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
          className="text-zinc-400 text-lg md:text-xl mb-16 max-w-2xl font-light leading-relaxed mx-auto"
        >
          이력서와 포트폴리오를 AI가 분석하여 <br className="hidden md:block" /> 
          당신만의 테트리스 로드맵을 그려드립니다.
        </motion.p>
        
        <motion.div
          variants={fadeUpItem}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="w-full max-w-4xl flex justify-center px-4"
        >
          <FileUpload />
        </motion.div>
      </section>

      <section className="bg-white py-40 px-6 w-full flex flex-col items-center">
        <div className="w-full max-w-6xl flex flex-col items-center">
          
          <motion.div 
            variants={fadeUpItem} 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            className="text-center mb-24"
          >
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-zinc-900">
              나의 역량 캔버스
            </h2>
            <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
              분석된 핵심 역량을 정의하고, <br />
              맞춤형 대외활동 추천까지 <u>Next Plan</u>에서 확인하세요.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-6 w-full">
            {['🎯 AI 역량 분석', '🧩 맞춤형 추천', '🧱 테트리스 시각화'].map((text, index) => (
              <motion.div 
                key={text}
                custom={index}
                variants={smoothCardItem}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                className="px-10 py-12 bg-zinc-50 rounded-[32px] border border-zinc-100 flex items-center justify-center text-xl md:text-2xl font-bold text-zinc-800 shadow-sm hover:shadow-md hover:bg-white transition-shadow duration-300 cursor-default"
              >
                {text}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-zinc-950 text-zinc-600 py-20 px-10 w-full flex justify-center border-t border-zinc-900">
        <div className="max-w-6xl w-full flex flex-col md:flex-row justify-between items-center md:items-end gap-10 text-center md:text-left">
          <div>
            <div className="text-2xl font-black text-white mb-3 tracking-tighter">Next Plan</div>
            <p className="text-sm font-light">
              당신의 성장을 시각화합니다. <br />
              _Team 조조이백배_
            </p>
          </div>
          <div className="flex gap-8">
            {['GitHub', 'Email', 'LinkedIn'].map((link) => (
              <button key={link} className="hover:text-orange-500 transition-colors text-sm font-medium">
                {link}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}