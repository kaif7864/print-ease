import { motion } from "framer-motion";
import { Upload, Settings, Truck, CheckCircle, ArrowRight } from "lucide-react";
import Navbar from "./../components/Navbar";

export default function Home() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans overflow-x-hidden">
      {/* <Navbar /> */}

      {/* Hero Section with Animated Background Elements */}
      <section className="relative text-center py-28 px-6 bg-white overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <motion.div {...fadeIn}>
          <h1 className="text-6xl md:text-7xl font-black text-slate-900 leading-tight">
            Print Your Docs <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Without the Hassle.
            </span>
          </h1>
          <p className="mt-8 text-slate-500 text-xl max-w-2xl mx-auto leading-relaxed">
            Quick, affordable, and high-quality printing delivered straight to your hostel or doorstep. 
            Assignments, notes, or projects—we handle it all.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/register"
              className="group bg-blue-600 text-white px-10 py-4 rounded-2xl shadow-xl shadow-blue-500/30 flex items-center gap-2 font-bold text-lg"
            >
              Start Printing <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </motion.a>
            <a
              href="#pricing"
              className="text-slate-600 px-10 py-4 rounded-2xl font-bold hover:bg-slate-100 transition-all text-lg"
            >
              View Pricing
            </a>
          </div>
        </motion.div>
      </section>

      {/* How It Works with Modern Cards */}
      <section className="py-24 bg-slate-50 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900">How PrintEase Works</h2>
            <div className="h-1 w-20 bg-blue-600 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: <Upload className="text-blue-600" size={32} />, title: "1. Upload File", desc: "Drag & drop your PDFs. Our smart stack handles duplicates." },
              { icon: <Settings className="text-blue-600" size={32} />, title: "2. Customize", desc: "Choose B&W or Color, set copies, and add spiral binding." },
              { icon: <Truck className="text-blue-600" size={32} />, title: "3. Quick Delivery", desc: "Relax as we deliver your prints within 24 hours." }
            ].map((step, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white p-10 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all"
              >
                <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">{step.title}</h3>
                <p className="text-slate-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section with "Glass" effect  */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-4xl font-black text-center mb-16">Transparent Pricing</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <PricingCard title="Black & White" price="₹2" detail="per page" />
            <PricingCard title="Color Print" price="₹5" detail="per page" highlight={true} />
            <PricingCard title="Binding" price="₹20" detail="spiral / soft" />
          </div>
          
          <p className="text-center mt-12 text-slate-400 font-medium">
            * ₹15 flat delivery fee on all stack orders.
          </p>
        </div>
      </section>

      {/* Footer / CTA */}
      <section className="bg-blue-600 py-20 px-8 text-center text-white">
        <h2 className="text-4xl font-bold mb-6">Ready to save your time?</h2>
        <p className="text-blue-100 mb-10 text-lg">Join 1000+ students who use PrintEase for their daily needs.</p>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          className="bg-white text-blue-600 px-12 py-4 rounded-2xl font-black text-xl shadow-2xl"
        >
          Get Started Now
        </motion.button>
      </section>
    </div>
  );
}

function PricingCard({ title, price, detail, highlight = false }) {
  return (
    <div className={`p-10 rounded-[2.5rem] transition-all border ${highlight ? 'bg-slate-900 text-white border-slate-900 scale-105 shadow-2xl' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
      <h3 className={`text-xl font-bold mb-6 ${highlight ? 'text-blue-400' : 'text-slate-500'}`}>{title}</h3>
      <div className="flex items-baseline gap-1 mb-8">
        <span className="text-5xl font-black">{price}</span>
        <span className={`text-sm ${highlight ? 'text-slate-400' : 'text-slate-400'}`}>{detail}</span>
      </div>
      <ul className="space-y-4 mb-8 text-sm font-medium">
        <li className="flex items-center gap-2"><CheckCircle size={16} className="text-blue-500" /> Premium 75GSM Paper</li>
        <li className="flex items-center gap-2"><CheckCircle size={16} className="text-blue-500" /> Sharp Laser Quality</li>
      </ul>
    </div>
  );
}