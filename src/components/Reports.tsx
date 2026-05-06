import React, { useState, useRef } from 'react';
import { useApp } from '../AppContext';
import { 
  FileText, 
  Calendar as CalendarIcon, 
  Star, 
  Image as ImageIcon, 
  Plus, 
  History,
  ChevronRight,
  Camera,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export const ReportsSection: React.FC = () => {
    const { reports, addReport } = useApp();
    const [isAdding, setIsAdding] = useState(false);
    const [rating, setRating] = useState(10);
    const [content, setContent] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        await addReport({
            date: new Date().toISOString().split('T')[0],
            rating,
            content,
            image: image || undefined
        });

        setIsAdding(false);
        setContent('');
        setRating(10);
        setImage(null);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter">Raporty Dnia</h2>
                    <p className="text-brand-muted font-medium">Podsumuj swój dzień i zbieraj wspomnienia.</p>
                </div>
                <button 
                    onClick={() => setIsAdding(true)}
                    className="bg-white text-black px-8 py-4 rounded-[1.5rem] font-black uppercase tracking-wider text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
                >
                    <Plus size={18} />
                    Nowy Raport
                </button>
            </div>

            {/* Add Report Modal / Section */}
            <AnimatePresence>
                {isAdding && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    >
                        <div className="glass w-full max-w-2xl rounded-[3rem] p-8 border border-white/10 relative overflow-y-auto max-h-[90vh]">
                            <button 
                                onClick={() => setIsAdding(false)}
                                className="absolute top-6 right-6 p-2 text-brand-muted hover:text-white transition-colors"
                            >
                                <Trash2 size={24} />
                            </button>

                            <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
                                <FileText className="text-white" />
                                Podsumowanie Dnia
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Rating */}
                                <div className="space-y-4">
                                    <label className="text-xs font-black uppercase tracking-widest text-brand-muted">Ocena Dnia (1-10)</label>
                                    <div className="flex flex-wrap gap-2">
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                            <button
                                                key={num}
                                                type="button"
                                                onClick={() => setRating(num)}
                                                className={cn(
                                                    "w-10 h-10 rounded-xl font-black transition-all border",
                                                    rating === num 
                                                        ? "bg-white text-black border-white shadow-lg shadow-white/20" 
                                                        : "bg-white/5 text-brand-muted border-white/10 hover:bg-white/10"
                                                )}
                                            >
                                                {num}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="space-y-4">
                                    <label className="text-xs font-black uppercase tracking-widest text-brand-muted">Co dzisiaj osiągnąłeś?</label>
                                    <textarea 
                                        autoFocus
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] p-6 text-lg font-medium focus:ring-2 focus:ring-white/20 focus:outline-none min-h-[200px]"
                                        placeholder="Opisz swój dzień, sukcesy i przemyślenia..."
                                    />
                                </div>

                                {/* Image Upload */}
                                <div className="space-y-4">
                                    <label className="text-xs font-black uppercase tracking-widest text-brand-muted">Zdjęcie Dnia (Opcjonalnie)</label>
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="relative w-full aspect-video rounded-[2rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all overflow-hidden"
                                    >
                                        {image ? (
                                            <img src={image} alt="Upload" className="w-full h-full object-cover" />
                                        ) : (
                                            <>
                                                <Camera size={32} className="text-brand-muted mb-2" />
                                                <p className="text-brand-muted font-bold">Kliknij, aby dodać zdjęcie</p>
                                            </>
                                        )}
                                        <input 
                                            type="file" 
                                            ref={fileInputRef} 
                                            onChange={handleFileChange} 
                                            className="hidden" 
                                            accept="image/*" 
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit"
                                    className="w-full bg-white text-black py-6 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl"
                                >
                                    Zapisz Raport
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Reports List */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 px-4">
                    <History size={18} className="text-brand-muted" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-brand-muted">Historia Twojego Życia</h3>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {reports.length > 0 ? (
                        reports.map((report) => (
                            <motion.div 
                                layout
                                key={report.id}
                                className="glass p-6 md:p-8 rounded-[3rem] border border-white/5 group hover:border-white/20 transition-all"
                            >
                                <div className="flex flex-col md:flex-row gap-8">
                                    {report.image && (
                                        <div className="w-full md:w-48 lg:w-64 h-48 rounded-[2.5rem] overflow-hidden border border-white/10 shrink-0">
                                            <img src={report.image} alt="Report Day" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        </div>
                                    )}
                                    
                                    <div className="flex-1 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-xl">
                                                    {report.rating}
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-xl uppercase tracking-tight">Dzień na {report.rating}/10</h4>
                                                    <span className="text-xs font-bold text-brand-muted uppercase tracking-widest flex items-center gap-2">
                                                        <CalendarIcon size={12} />
                                                        {report.date}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="hidden sm:flex items-center gap-1">
                                              {[...Array(5)].map((_, i) => (
                                                <Star 
                                                  key={i} 
                                                  size={14} 
                                                  className={cn(
                                                    i < report.rating / 2 ? "text-yellow-500 fill-yellow-500" : "text-white/10"
                                                  )} 
                                                />
                                              ))}
                                            </div>
                                        </div>

                                        <p className="text-brand-active/80 leading-relaxed font-medium whitespace-pre-wrap">
                                            {report.content}
                                        </p>

                                        <div className="flex items-center gap-2 pt-4">
                                            <div className="flex -space-x-2">
                                                <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-brand-bg flex items-center justify-center">
                                                    <CheckCircle2 size={10} className="text-blue-500" />
                                                </div>
                                                <div className="w-6 h-6 rounded-full bg-green-500/20 border border-brand-bg flex items-center justify-center">
                                                    <Star size={10} className="text-green-500" />
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-black uppercase text-brand-muted tracking-widest">Podsumowano</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="glass p-20 rounded-[3rem] border border-white/5 flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                            <History size={48} className="text-brand-muted" />
                            <div>
                                <h4 className="text-xl font-bold uppercase tracking-tight">Brak raportów</h4>
                                <p className="text-sm font-medium text-brand-muted">Zacznij pisać swoją historię już dzisiaj.</p>
                            </div>
                            <button 
                                onClick={() => setIsAdding(true)}
                                className="mt-4 px-8 py-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all font-bold"
                            >
                                Dodaj pierwszy raport
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
