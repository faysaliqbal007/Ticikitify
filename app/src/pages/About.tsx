import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function About() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col font-sans selection:bg-cyan-500/30 relative overflow-hidden">

      {/* High-End Tech Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800A_1px,transparent_1px),linear-gradient(to_bottom,#8080800A_1px,transparent_1px)] bg-[size:48px_48px] z-0 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[#050505] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,transparent_10%,#050505_100%)] z-0 pointer-events-none"></div>

      <div className="relative z-20 flex flex-col min-h-screen">
        <Navbar />

        {/* Ambient Glowing Orbs */}
        <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] animate-float pointer-events-none delay-100"></div>
        <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px] animate-float pointer-events-none delay-500 -z-10"></div>
        <div className="absolute bottom-40 left-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] animate-float pointer-events-none -z-10"></div>

        {/* Hero Section */}
        <div className="relative pt-36 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center animate-slide-up">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.05)]">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-glow-cyan animate-pulse"></span>
            <span className="text-sm font-bold text-gray-200 tracking-widest uppercase">The Team Behind The Tech</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white mb-4 sm:mb-6 tracking-tighter drop-shadow-2xl">
            About <span className="text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 animate-pulse-glow inline-block">Ticikitify</span>
          </h1>
          <p className="text-base sm:text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-medium leading-relaxed mt-6 sm:mt-8">
            Revolutionizing event ticketing in Bangladesh with a platform built for both passionate organizers and enthusiastic audiences.
          </p>
        </div>

        <main className="flex-grow px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-32 space-y-32">

          {/* Mission & Vision Section (Neon Tech Cards) */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-slide-up [animation-delay:200ms] opacity-0" style={{ animationFillMode: 'forwards' }}>
            {/* Card 1 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-[2.5rem] bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl"></div>
              <div className="relative h-full bg-[#111]/80 backdrop-blur-2xl p-6 sm:p-10 md:p-14 rounded-[2rem] sm:rounded-[2.5rem] border border-white/5 group-hover:border-cyan-500/30 transition-all duration-500 overflow-hidden">
                <div className="absolute -right-16 -top-16 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-colors duration-500"></div>

                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-2xl flex items-center justify-center mb-6 sm:mb-8 border border-cyan-500/30 shadow-glow-cyan animate-float backdrop-blur-md">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400 drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 sm:mb-6 tracking-tight">Our Mission</h2>
                <p className="text-gray-400 leading-relaxed text-base sm:text-xl font-medium">
                  To seamlessly connect event organizers with enthusiastic audiences, making it easier than ever to discover, book, and experience the best events happening near you with zero friction.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl"></div>
              <div className="relative h-full bg-[#111]/80 backdrop-blur-2xl p-6 sm:p-10 md:p-14 rounded-[2rem] sm:rounded-[2.5rem] border border-white/5 group-hover:border-purple-500/30 transition-all duration-500 overflow-hidden">
                <div className="absolute -right-16 -top-16 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-colors duration-500"></div>

                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500/20 to-transparent rounded-2xl flex items-center justify-center mb-6 sm:mb-8 border border-purple-500/30 shadow-glow animate-float [animation-delay:300ms] backdrop-blur-md">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-purple-400 drop-shadow-[0_0_10px_rgba(108,99,255,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 sm:mb-6 tracking-tight">Our Vision</h2>
                <p className="text-gray-400 leading-relaxed text-base sm:text-xl font-medium">
                  We envision a Bangladesh where every live event—be it a massive music festival, an intimate theater performance, or a large-scale tech conference—can be managed effortlessly.
                </p>
              </div>
            </div>
          </section>

          {/* Web Dev Team Section */}
          <section className="animate-slide-up [animation-delay:400ms] opacity-0" style={{ animationFillMode: 'forwards' }}>
            <div className="text-center mb-20 relative">
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-4 sm:mb-6 tracking-tight drop-shadow-md">
                Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">Web Dev</span> Team
              </h2>
              <div className="h-1 sm:h-1.5 w-24 sm:w-32 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto rounded-full mb-6 sm:mb-8 shadow-glow-strong"></div>
              <p className="text-gray-400 max-w-3xl mx-auto text-base sm:text-xl leading-relaxed">
                We are the engineering architects and UX designers behind Ticikitify. Proudly founded by three passionate engineering students from AUST, we built this dynamic tech stack to redefine event ticketing in Bangladesh.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Member 1: Faysal */}
              <div className="bg-[#0A0A0A]/90 backdrop-blur-xl p-8 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-white/5 hover:border-cyan-500/40 transition-all duration-500 hover:-translate-y-4 hover:shadow-glow-cyan flex flex-col items-center text-center group relative overflow-hidden">
                {/* Tech Line Top */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/80 to-transparent"></div>

                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-[#0A0A0A] rounded-full flex items-center justify-center mb-6 sm:mb-8 border-2 border-cyan-500/20 group-hover:border-cyan-500/80 group-hover:scale-110 shadow-[inner_0_0_30px_rgba(0,240,255,0.1)] group-hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all duration-500 z-10 relative">
                  <span className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 to-cyan-600 drop-shadow-md">MF</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white mb-2 sm:mb-3 z-10 group-hover:text-cyan-400 transition-colors">M.M. Faysal Iqbal</h3>
                <div className="px-4 py-1.5 sm:px-5 sm:py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs sm:text-sm font-bold tracking-wider uppercase mb-6 sm:mb-8 z-10">
                  Backend Architecture
                </div>

                <div className="flex space-x-5 mt-auto z-10">
                  <a href="https://www.facebook.com/share/19mBvLxGLr/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-2xl text-gray-400 hover:text-white hover:bg-[#1877F2] hover:scale-110 hover:-translate-y-1 transition-all duration-300" title="Facebook">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="mailto:mmfaysaliqbal@gmail.com" className="p-3 bg-white/5 rounded-2xl text-gray-400 hover:text-white hover:bg-cyan-500 hover:scale-110 hover:-translate-y-1 transition-all duration-300 hover:shadow-cyan-500/50" title="Email">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Member 2: Nafi */}
              <div className="bg-[#0A0A0A]/90 backdrop-blur-xl p-8 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-white/5 hover:border-blue-500/40 transition-all duration-500 hover:-translate-y-4 hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] flex flex-col items-center text-center group relative overflow-hidden">
                {/* Tech Line Top */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/80 to-transparent"></div>

                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-[#0A0A0A] rounded-full flex items-center justify-center mb-6 sm:mb-8 border-2 border-blue-500/20 group-hover:border-blue-500/80 group-hover:scale-110 shadow-[inner_0_0_30px_rgba(59,130,246,0.1)] group-hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all duration-500 z-10 relative">
                  <span className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-blue-700 drop-shadow-md">NN</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white mb-2 sm:mb-3 z-10 group-hover:text-blue-400 transition-colors">Nahid Hasan Nafi</h3>
                <div className="px-4 py-1.5 sm:px-5 sm:py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs sm:text-sm font-bold tracking-wider uppercase mb-6 sm:mb-8 z-10">
                  Frontend (Auth/Admin)
                </div>

                <div className="flex space-x-5 mt-auto z-10">
                  <a href="https://www.facebook.com/share/1E8cGtRLx9/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-2xl text-gray-400 hover:text-white hover:bg-[#1877F2] hover:scale-110 hover:-translate-y-1 transition-all duration-300" title="Facebook">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="mailto:nahid.hasan6072@gmail.com" className="p-3 bg-white/5 rounded-2xl text-gray-400 hover:text-white hover:bg-blue-600 hover:scale-110 hover:-translate-y-1 transition-all duration-300 hover:shadow-blue-500/50" title="Email">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Member 3: Ishraq */}
              <div className="bg-[#0A0A0A]/90 backdrop-blur-xl p-8 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-white/5 hover:border-purple-500/40 transition-all duration-500 hover:-translate-y-4 hover:shadow-glow flex flex-col items-center text-center group relative overflow-hidden">
                {/* Tech Line Top */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/80 to-transparent"></div>

                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-[#0A0A0A] rounded-full flex items-center justify-center mb-6 sm:mb-8 border-2 border-purple-500/20 group-hover:border-purple-500/80 group-hover:scale-110 shadow-[inner_0_0_30px_rgba(108,99,255,0.1)] group-hover:shadow-[0_0_30px_rgba(108,99,255,0.4)] transition-all duration-500 z-10 relative">
                  <span className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-purple-700 drop-shadow-md">IK</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white mb-2 sm:mb-3 z-10 group-hover:text-purple-400 transition-colors">Ishraq Alam Khan</h3>
                <div className="px-4 py-1.5 sm:px-5 sm:py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs sm:text-sm font-bold tracking-wider uppercase mb-6 sm:mb-8 z-10">
                  Frontend (Events)
                </div>

                <div className="flex space-x-5 mt-auto z-10">
                  <a href="https://www.facebook.com/share/1av2aBbc9X/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-2xl text-gray-400 hover:text-white hover:bg-[#1877F2] hover:scale-110 hover:-translate-y-1 transition-all duration-300" title="Facebook">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="mailto:ishraqkhan1080@gmail.com" className="p-3 bg-white/5 rounded-2xl text-gray-400 hover:text-white hover:bg-purple-600 hover:scale-110 hover:-translate-y-1 transition-all duration-300 hover:shadow-purple-500/50" title="Email">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Core Values Section (Minimalist Glass Grid) */}
          <section className="relative z-10 animate-slide-up [animation-delay:600ms] opacity-0" style={{ animationFillMode: 'forwards' }}>
            <div className="text-center mb-10 sm:mb-16">
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 drop-shadow-md">Our Core Values</h2>
              <div className="h-1 w-16 sm:w-20 bg-gray-500 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="p-8 sm:p-10 rounded-[2rem] bg-gradient-to-b from-[#111]/80 to-transparent border border-white/5 hover:border-cyan-500/20 transition-all duration-500 hover:-translate-y-1 group">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 sm:mb-6 flex items-center gap-4 sm:gap-5">
                  <span className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xl sm:text-2xl group-hover:bg-cyan-500/20 transition-colors">1</span>
                  Transparency
                </h3>
                <p className="text-gray-400 leading-relaxed text-base sm:text-xl">
                  No hidden fees. We communicate openly with both attendees and organizers to ensure complete trust in every transaction.
                </p>
              </div>

              <div className="p-8 sm:p-10 rounded-[2rem] bg-gradient-to-b from-[#111]/80 to-transparent border border-white/5 hover:border-blue-500/20 transition-all duration-500 hover:-translate-y-1 group">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 sm:mb-6 flex items-center gap-4 sm:gap-5">
                  <span className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xl sm:text-2xl group-hover:bg-blue-500/20 transition-colors">2</span>
                  Security
                </h3>
                <p className="text-gray-400 leading-relaxed text-base sm:text-xl">
                  Partnering with top gateways like bKash, Nagad, and SSLCommerz to rigidly protect your data and hard-earned money.
                </p>
              </div>

              <div className="p-8 sm:p-10 rounded-[2rem] bg-gradient-to-b from-[#111]/80 to-transparent border border-white/5 hover:border-purple-500/20 transition-all duration-500 hover:-translate-y-1 group">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 sm:mb-6 flex items-center gap-4 sm:gap-5">
                  <span className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xl sm:text-2xl group-hover:bg-purple-500/20 transition-colors">3</span>
                  Community
                </h3>
                <p className="text-gray-400 leading-relaxed text-base sm:text-xl">
                  We build features based strictly on what the Bangladeshi event community truly needs to thrive and grow natively.
                </p>
              </div>
            </div>
          </section>

          {/* Our Journey Banner */}
          <section className="relative z-10 animate-slide-up [animation-delay:800ms] opacity-0" style={{ animationFillMode: 'forwards' }}>
            <div className="bg-[#050505] rounded-[3rem] p-4 border border-white/5 shadow-2xl relative overflow-hidden group hover:border-cyan-500/30 transition-colors duration-700">
              {/* Inner Gradient Box */}
              <div className="bg-gradient-to-br from-cyan-900/30 via-[#111] to-[#0A0A0A] rounded-[2rem] sm:rounded-[2.5rem] p-8 sm:p-12 md:p-20 text-center max-w-6xl mx-auto overflow-hidden relative">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] group-hover:bg-cyan-500/20 transition-colors duration-1000"></div>

                <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-6 sm:mb-10 relative z-10 drop-shadow-lg">The Journey So Far</h2>
                <p className="text-gray-300 text-lg sm:text-xl md:text-2xl leading-relaxed relative z-10 max-w-4xl mx-auto font-medium">
                  What started as a small project to solve chaotic local ticketing queues has grown into Bangladesh's most trusted event platform. Over our journey, we have proudly facilitated thousands of seamless ticket transactions and partnered with hundreds of remarkable event organizers across the entire country. And we are just getting started.
                </p>
              </div>
            </div>
          </section>

        </main>
        <Footer />
      </div>
    </div>
  );
}
