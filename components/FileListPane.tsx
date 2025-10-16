import React from 'react';
import type { File } from '../types';
import Icon from './Icon';

interface FileListPaneProps {
    files: File[];
}

const FileListPane: React.FC<FileListPaneProps> = ({ files }) => {

    const getFileIcon = (type: File['type']): 'file-pdf' | 'file-doc' | 'file-xls' | 'file-document' => {
        switch (type) {
            case 'PDF': return 'file-pdf';
            case 'DOCX': return 'file-doc';
            case 'XLSX': return 'file-xls';
            default: return 'file-document';
        }
    }

    if (files.length === 0) {
        return (
            <div className="text-center py-16 text-zinc-500">
                <p>No files have been shared in this community yet.</p>
            </div>
        );
    }
    
    return (
        <div className="p-4 space-y-3">
            {files.map(file => (
                <div key={file.id} className="bg-zinc-800/50 p-3 rounded-lg flex items-center justify-between">
                    <div className="flex items-center space-x-4 overflow-hidden">
                        <Icon type={getFileIcon(file.type)} className="w-8 h-8 text-zinc-400 shrink-0" />
                        <div className="overflow-hidden">
                            <p className="font-semibold text-zinc-200 truncate">{file.name}</p>
                            <p className="text-xs text-zinc-500">{file.size}</p>
                        </div>
                    </div>
                    <a
                        href={file.url}
                        download={file.name}
                        className="p-2 text-zinc-400 hover:text-amber-400 rounded-full hover:bg-zinc-700 transition-colors"
                        aria-label={`Download ${file.name}`}
                    >
                        <Icon type="download" className="w-5 h-5" />
                    </a>
                </div>
            ))}
        </div>
    );
};

export default FileListPane;
