import { Document } from '@/types';
import { Search, FileText, CheckCircle2, Circle } from 'lucide-react';
import { useState } from 'react';

interface DocumentSidebarProps {
    documents: Document[];
    selectedDocs: number[];
    onToggleDoc: (docId: number) => void;
    onToggleAll: () => void;
}

export function DocumentSidebar({
    documents,
    selectedDocs,
    onToggleDoc,
    onToggleAll
}: DocumentSidebarProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredDocs = documents.filter(doc =>
        doc.original_filename.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isAllSelected = documents.length > 0 && selectedDocs.length === documents.length;

    return (
        <div className="flex flex-col h-full bg-dark-900 border-l border-dark-800">
            {/* Header */}
            <div className="p-4 border-b border-dark-800">
                <h3 className="text-lg font-semibold text-white mb-1">Context</h3>
                <p className="text-sm text-dark-400">Select documents for AI context</p>
            </div>

            {/* Search */}
            <div className="p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                    <input
                        type="text"
                        placeholder="Search documents..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white placeholder-dark-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                </div>
            </div>

            {/* Stats & Select All */}
            <div className="px-4 pb-2 flex items-center justify-between text-xs text-dark-400">
                <span>{selectedDocs.length} selected</span>
                <button
                    onClick={onToggleAll}
                    className="hover:text-primary-400 transition-colors"
                >
                    {isAllSelected ? 'Deselect All' : 'Select All'}
                </button>
            </div>

            {/* Document List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {filteredDocs.length > 0 ? (
                    filteredDocs.map(doc => {
                        const isSelected = selectedDocs.includes(doc.id);
                        return (
                            <div
                                key={doc.id}
                                onClick={() => onToggleDoc(doc.id)}
                                className={`
                                    group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border
                                    ${isSelected
                                        ? 'bg-primary-500/10 border-primary-500/30'
                                        : 'bg-dark-800/50 border-dark-700/50 hover:bg-dark-800 hover:border-dark-600'}
                                `}
                            >
                                <div className={`
                                    flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors
                                    ${isSelected ? 'bg-primary-500 text-white' : 'bg-dark-700 text-dark-400 group-hover:bg-dark-600'}
                                `}>
                                    <FileText className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium truncate ${isSelected ? 'text-primary-100' : 'text-dark-200'}`}>
                                        {doc.original_filename}
                                    </p>
                                    <p className="text-xs text-dark-500 truncate">
                                        {(doc.file_size / 1024).toFixed(1)} KB
                                    </p>
                                </div>
                                <div className={`
                                    text-primary-500 transition-opacity
                                    ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}
                                `}>
                                    {isSelected ? <CheckCircle2 className="w-5 h-5 fill-primary-500 text-dark-900" /> : <Circle className="w-5 h-5" />}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-8 text-dark-500">
                        <FileText className="w-8 h-8 mx-auto mb-2 opacity-20" />
                        <p className="text-sm">No documents found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
