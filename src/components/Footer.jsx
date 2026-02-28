import { Printer, Github, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 pt-16 pb-8 px-8">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-12">
        {/* Brand Info */}
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-blue-600 p-2 rounded-xl">
              <Printer size={20} className="text-white" />
            </div>
            <span className="text-xl font-black text-slate-800 tracking-tighter">PrintEase</span>
          </div>
          <p className="text-slate-500 max-w-sm leading-relaxed">
            The fastest way for students to get high-quality prints delivered to campus. No more queues, no more broken printers.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Platform</h4>
          <ul className="space-y-4 text-sm text-slate-500 font-medium">
            <li><a href="/" className="hover:text-blue-600 transition">Home</a></li>
            <li><a href="/dashboard" className="hover:text-blue-600 transition">Orders</a></li>
            <li><a href="#pricing" className="hover:text-blue-600 transition">Pricing</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Contact</h4>
          <div className="flex gap-4">
            <a href="#" className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-blue-600 transition"><Twitter size={18} /></a>
            <a href="#" className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-blue-600 transition"><Instagram size={18} /></a>
            <a href="#" className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-slate-900 transition"><Github size={18} /></a>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-50 text-center">
        <p className="text-xs text-slate-400 font-medium">
          © {new Date().getFullYear()} PrintEase Technologies. All rights reserved. Made with ❤️ for Students.
        </p>
      </div>
    </footer>
  );
}