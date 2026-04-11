import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Press() {
  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <h1 className="text-4xl font-bold text-white mb-8">Press</h1>
        <div className="bg-dark-50 rounded-2xl p-8 border border-white/5 space-y-6 text-gray-300">
          <p>
            Welcome to the Ticikitify Press Room. Here you can find the latest news, updates, and media resources about our platform.
          </p>
          <p>
            As Bangladesh's most trusted event ticketing platform, we frequently share our milestones, partnerships, and insights into the event industry.
          </p>
          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Media Inquiries</h2>
          <p>
            If you are a member of the media and would like to talk, please contact us at <a href="mailto:press@ticikitify.com" className="text-cyan-400 hover:underline">press@ticikitify.com</a>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
