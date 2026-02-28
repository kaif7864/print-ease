import { useState, useContext } from "react";
import { PDFDocument } from "pdf-lib";
import { Trash2, Plus, Minus, ShoppingCart, FileText, ArrowRight } from "lucide-react";
import { CartContext } from "../context/CartContext"; // Path check kar lena
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { cart, addToCart, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [currentFile, setCurrentFile] = useState(null);
  const [options, setOptions] = useState({
    copies: 1,
    type: "bw",
    binding: false,
    pages: 0
  });

  const handleFileSelection = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== "application/pdf") return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const pagesCount = pdfDoc.getPageCount();
      
      setCurrentFile(file);
      setOptions({ copies: 1, type: "bw", binding: false, pages: pagesCount });
    } catch (err) {
      alert("Error reading PDF.");
    }
    e.target.value = null;
  };

  const handleAddToCart = () => {
    if (!currentFile) return;

    const itemPrice = (options.pages * (options.type === "color" ? 5 : 2) * options.copies) + (options.binding ? 20 : 0);
    
    addToCart({
      id: Math.random().toString(36).substring(7),
      file: currentFile, // Binary store ho raha hai backend ke liye
      fileName: currentFile.name,
      ...options,
      price: itemPrice
    });
    
    setCurrentFile(null); // Form reset
  };

  const totalCartPrice = cart.reduce((sum, item) => sum + item.price, 0) + (cart.length > 0 ? 15 : 0);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
        
        {/* LEFT: UPLOADER & CUSTOMIZER */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
              <Plus className="text-blue-600" /> Customize Print
            </h2>

            {!currentFile ? (
              <div className="relative border-2 border-dashed border-blue-100 rounded-[2rem] p-12 text-center hover:bg-blue-50/50 transition-all cursor-pointer group">
                <input type="file" accept=".pdf" onChange={handleFileSelection} className="absolute inset-0 opacity-0 cursor-pointer" />
                <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg group-hover:scale-110 transition-transform">
                  <FileText size={32} />
                </div>
                <p className="font-bold text-slate-600">Drop your PDF here</p>
                <p className="text-xs text-slate-400 mt-1 font-black">PER FILE CUSTOMIZATION</p>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-[2rem] p-8 border border-blue-100 animate-in fade-in zoom-in">
                <div className="flex justify-between items-center mb-6">
                  <p className="font-black text-slate-800 truncate w-2/3">{currentFile.name}</p>
                  <button onClick={() => setCurrentFile(null)} className="text-red-500 font-bold text-xs uppercase">Cancel</button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Ink Type */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ink Type</label>
                    <div className="flex gap-2">
                      {['bw', 'color'].map(t => (
                        <button key={t} onClick={() => setOptions({...options, type: t})}
                          className={`flex-1 py-3 rounded-xl font-bold text-sm border-2 transition-all ${options.type === t ? 'border-blue-600 bg-blue-50 text-blue-600' : 'bg-white text-slate-400'}`}>
                          {t === 'bw' ? 'B&W' : 'Color'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Binding */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Finishing</label>
                    <button onClick={() => setOptions({...options, binding: !options.binding})}
                      className={`w-full py-3 rounded-xl font-bold text-sm border-2 transition-all ${options.binding ? 'border-blue-600 bg-blue-50 text-blue-600' : 'bg-white text-slate-400'}`}>
                      {options.binding ? 'Spiral Binding (+₹20)' : 'No Binding'}
                    </button>
                  </div>

                  {/* Copies */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Copies</label>
                    <div className="flex items-center bg-white rounded-xl p-1 border">
                      <button onClick={() => setOptions({...options, copies: Math.max(1, options.copies - 1)})} className="p-2 text-blue-600"><Minus size={18}/></button>
                      <span className="flex-1 text-center font-black">{options.copies}</span>
                      <button onClick={() => setOptions({...options, copies: options.copies + 1})} className="p-2 text-blue-600"><Plus size={18}/></button>
                    </div>
                  </div>

                  <button onClick={handleAddToCart} className="mt-auto bg-blue-600 text-white py-4 rounded-xl font-black shadow-lg hover:bg-blue-700 transition-all">
                    ADD TO CART • ₹{(options.pages * (options.type === "color" ? 5 : 2) * options.copies) + (options.binding ? 20 : 0)}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: MINI CART PREVIEW */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col h-fit sticky top-24 shadow-2xl">
            <h2 className="text-xl font-black mb-6 flex items-center gap-3">
              <ShoppingCart size={24} className="text-blue-400" /> Recent Adds
            </h2>

            <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {cart.map((item) => (
                <div key={item.id} className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 flex justify-between items-center">
                  <div className="truncate w-32">
                    <p className="text-xs font-bold truncate">{item.fileName}</p>
                    <p className="text-[10px] text-blue-400 uppercase font-black">{item.type} • {item.copies} cpy</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-black">₹{item.price}</span>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-400"><Trash2 size={14}/></button>
                  </div>
                </div>
              ))}
              {cart.length === 0 && <p className="text-slate-500 text-center py-10 text-xs font-bold uppercase tracking-widest">Cart is empty</p>}
            </div>

            {cart.length > 0 && (
              <button 
                onClick={() => navigate("/cart")}
                className="w-full bg-blue-500 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/20"
              >
                GO TO CART <ArrowRight size={20}/>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}