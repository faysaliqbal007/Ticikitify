import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <h1 className="text-4xl font-bold text-white mb-8">Contact Us</h1>
        <div className="bg-dark-50 rounded-2xl p-8 border border-white/5 space-y-6 text-gray-300">
          <p>
            We're here to help! If you have any questions, feedback, or need assistance, feel free to reach out to us using the contact details below.
          </p>
          
          <div className="mt-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Email Us</h3>
                <p className="text-sm">support@ticikitify.com</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Our Office</h3>
                <p className="text-sm">Dhaka, Bangladesh</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Call Us</h3>
                <p className="text-sm">+880 1234-567890</p>
              </div>
            </div>
          </div>
          <p className="mt-8 text-sm text-gray-500">
            Note: Our support is available Sunday through Thursday, from 9:00 AM to 6:00 PM (Bangladesh Time).
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
