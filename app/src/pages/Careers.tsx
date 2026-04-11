import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Careers() {
  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <h1 className="text-4xl font-bold text-white mb-8">Careers</h1>
        <div className="bg-dark-50 rounded-2xl p-8 border border-white/5 space-y-6 text-gray-300">
          <p>
            Join the Ticikitify team! We are looking for talented individuals who are passionate about events, technology, and creating seamless experiences.
          </p>
          <p>
            We regularly hire people to help organize our work, improve our website, manage ticketing systems, and support our growing community of organizers and attendees.
          </p>
          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Why Work With Us?</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Be part of a dynamic and fast-paced startup environment.</li>
            <li>Contribute to the largest ticketing platform in Bangladesh.</li>
            <li>Work with a team that values innovation and user experience.</li>
            <li>Flexible working opportunities and continuous learning.</li>
          </ul>
          <p className="mt-6 text-cyan-400">
            Keep an eye on this page for future job openings!
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
