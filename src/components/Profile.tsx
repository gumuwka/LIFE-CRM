import React, { useRef } from 'react';
import { useApp } from '../AppContext';
import { useAuth } from '../AuthContext';
import { 
  User, 
  Camera, 
  Flame, 
  Trophy, 
  Users, 
  Tag as TagIcon, 
  Zap, 
  ChevronRight,
  ShieldCheck,
  Settings,
  Bell,
  Share2,
  LogOut
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export const ProfileSection: React.FC = () => {
    const { profile, streak, updateProfile } = useApp();
    const { logout } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateProfile({ avatar: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const progressPercentage = (profile.xp / profile.maxXp) * 100;

    const sections = [
        { id: 'friends', label: 'Znajomi', icon: Users, locked: true },
        { id: 'tags', label: 'Tagi i Kategorie', icon: TagIcon, locked: true },
        { id: 'achievements', label: 'Osiągnięcia', icon: Trophy, locked: true },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header / Basic Info */}
            <div className="relative glass p-8 rounded-[3rem] overflow-hidden border border-brand-border shadow-2xl">
                <div className="absolute top-0 right-0 p-8 flex gap-2">
                    <button 
                        onClick={() => logout()}
                        className="p-3 bg-red-500/10 rounded-2xl text-red-500 hover:bg-red-500 hover:text-white transition-all group"
                        title="Wyloguj"
                    >
                        <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="p-3 bg-white/5 rounded-2xl text-brand-muted hover:text-white transition-all">
                        <Settings size={20} />
                    </button>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl bg-brand-card flex items-center justify-center">
                            {profile.avatar ? (
                                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                            ) : (
                                <User size={48} className="text-brand-muted" />
                            )}
                        </div>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                            <Camera size={24} className="text-white" />
                        </div>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            className="hidden" 
                            accept="image/*" 
                        />
                        <div className="absolute -bottom-2 -right-2 bg-white text-black p-2 rounded-xl shadow-lg border-4 border-brand-bg">
                            <Zap size={16} className="fill-black" />
                        </div>
                    </div>

                    <div className="text-center md:text-left space-y-2">
                        <h2 className="text-4xl font-black tracking-tighter uppercase">{profile.name}</h2>
                        <p className="text-brand-muted text-sm font-medium max-w-xs">{profile.bio}</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
                            <div className="glass px-4 py-2 rounded-2xl border border-orange-500/30 flex items-center gap-2">
                                <Flame size={16} className="text-orange-500 fill-orange-500" />
                                <span className="font-black text-lg">{streak.current}</span>
                                <span className="text-[10px] font-black uppercase tracking-tighter text-brand-muted">Dni Streaku</span>
                            </div>
                            <div className="glass px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-2">
                                <ShieldCheck size={16} className="text-blue-500" />
                                <span className="font-black text-lg">POZIOM {profile.level}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* XP Bar */}
                <div className="mt-10 space-y-2">
                    <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-muted">Doświadczenie (XP)</span>
                        <span className="text-xs font-black tracking-tighter">{profile.xp} / {profile.maxXp} XP</span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-brand-border">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercentage}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-blue-600 to-indigo-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                        />
                    </div>
                </div>
            </div>

            {/* Quick Actions / Future Modules */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass p-8 rounded-[2.5rem] border border-brand-border space-y-6">
                    <h3 className="text-xl font-bold flex items-center gap-3">
                        <Trophy size={20} className="text-brand-muted" />
                        Status Rozwoju
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-yellow-500/20 text-yellow-500 rounded-lg">
                                    <Trophy size={18} />
                                </div>
                                <span className="font-bold">Ekspert Finansowy</span>
                            </div>
                            <span className="text-[10px] font-black bg-white/10 px-2 py-1 rounded-md text-brand-muted">W TRAKCIE</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 opacity-50 grayscale">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-brand-border rounded-lg">
                                    <Flame size={18} />
                                </div>
                                <span className="font-bold">Maratończyk</span>
                            </div>
                            <span className="text-[10px] font-black bg-white/10 px-2 py-1 rounded-md text-brand-muted">ZABLOKOWANE</span>
                        </div>
                    </div>
                </div>

                <div className="glass p-8 rounded-[2.5rem] border border-brand-border flex flex-col justify-between">
                    <div className="space-y-4">
                       <h3 className="text-xl font-bold">Udostępnij postępy</h3>
                       <p className="text-brand-muted text-sm">Pokaż innym swoje osiągnięcia i zainspiruj ich do działania.</p>
                    </div>
                    <button className="w-full mt-6 bg-white text-black py-4 rounded-[1.5rem] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl">
                        <Share2 size={18} />
                        Kopiuj Profil
                    </button>
                </div>
            </div>

            {/* Locked Sections */}
            <div className="space-y-4">
                <div className="flex items-center gap-3 px-4">
                    <Zap size={16} className="text-brand-muted" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-brand-muted opacity-50">Nadchodzące funkcje</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {sections.map((section) => (
                        <div 
                            key={section.id}
                            className="glass p-6 rounded-[2rem] border border-brand-border group relative overflow-hidden"
                        >
                            <div className="absolute top-4 right-4 bg-white/10 text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-tighter opacity-50">
                                WKRÓTCE
                            </div>
                            <div className="space-y-4 opacity-40">
                                <section.icon size={24} className="text-brand-muted" />
                                <div className="flex items-center justify-between">
                                    <span className="font-bold">{section.label}</span>
                                    <ChevronRight size={16} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
