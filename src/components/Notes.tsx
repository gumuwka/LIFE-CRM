import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { 
  StickyNote, 
  Plus, 
  Trash2, 
  Search,
  Grid,
  List,
  Edit3,
  Calendar
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export const NotesSection: React.FC = () => {
    const { notes, addNote, updateNote, deleteNote } = useApp();
    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

    const filteredNotes = (notes || []).filter(n => 
        n.title.toLowerCase().includes(search.toLowerCase()) || 
        n.content.toLowerCase().includes(search.toLowerCase())
    );

    const handleAddNote = async () => {
        await addNote({
            title: 'Nowa Notatka',
            content: '',
            color: 'bg-white/5'
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Notatki</h2>
                    <p className="text-brand-muted">Twoje myśli, pomysły i brudnopis.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" size={16} />
                        <input 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Szukaj notatek..."
                            className="bg-white/5 border border-brand-border rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/20 w-full md:w-64"
                        />
                    </div>
                    <div className="flex bg-brand-card p-1 rounded-xl border border-brand-border">
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={cn("p-1.5 rounded-lg transition-all", viewMode === 'grid' ? "bg-white/10 text-white" : "text-brand-muted")}
                        >
                            <Grid size={18} />
                        </button>
                        <button 
                            onClick={() => setViewMode('list')}
                            className={cn("p-1.5 rounded-lg transition-all", viewMode === 'list' ? "bg-white/10 text-white" : "text-brand-muted")}
                        >
                            <List size={18} />
                        </button>
                    </div>
                    <button 
                        onClick={handleAddNote}
                        className="bg-white text-black p-2.5 rounded-xl hover:bg-white/90 active:scale-95 transition-all shadow-lg"
                    >
                        <Plus size={20} />
                    </button>
                </div>
            </div>

            <AnimatePresence mode="popLayout">
                <div className={cn(
                    "grid gap-6",
                    viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                )}>
                    {filteredNotes.map((note) => (
                        <motion.div 
                            layout
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            key={note.id}
                            className={cn(
                                "glass p-6 rounded-3xl group relative transition-all border border-brand-border hover:border-brand-active",
                                note.color || "bg-white/5"
                            )}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1 mr-2">
                                    <input 
                                        value={note.title}
                                        onChange={(e) => updateNote(note.id, { title: e.target.value })}
                                        className="bg-transparent font-bold text-lg w-full focus:outline-none border-0 p-0"
                                    />
                                    <div className="flex items-center gap-1.5 mt-1 text-[10px] text-brand-muted font-bold uppercase tracking-widest">
                                        <Calendar size={10} />
                                        {new Date(note.createdAt).toLocaleDateString('pl-PL')}
                                    </div>
                                </div>
                                <button 
                                    onClick={() => deleteNote(note.id)}
                                    className="p-2 text-brand-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <textarea 
                                value={note.content}
                                onChange={(e) => updateNote(note.id, { content: e.target.value })}
                                placeholder="Zacznij pisać..."
                                className="w-full bg-transparent text-sm text-brand-active leading-relaxed focus:outline-none min-h-[120px] resize-none border-0 p-0"
                            />
                        </motion.div>
                    ))}
                </div>
            </AnimatePresence>

            {filteredNotes.length === 0 && (
                <div className="text-center py-20 border-2 border-dashed border-brand-border rounded-3xl text-brand-muted">
                    <StickyNote size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="italic">Brak notatek. Kliknij plusa, aby coś zapisać.</p>
                </div>
            )}
        </div>
    );
};
