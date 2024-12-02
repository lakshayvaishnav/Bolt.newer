import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FileExplorer } from '../components/FileExplorer';
import { StatusCard } from '../components/StatusCard';
import { CodePreview } from '../components/CodePreview';
import { BuildStatus, FileStructure } from '../types';

export const BuilderPage: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [selectedFile, setSelectedFile] = useState<FileStructure | null>(null);
  
  const buildStatus: BuildStatus[] = [
    { status: 'building', message: 'Analyzing prompt...' },
    { status: 'completed', message: 'Generated project structure' },
  ];

  const files: FileStructure[] = [
    {
      name: 'src',
      type: 'directory',
      children: [
        { name: 'App.tsx', type: 'file', content: 'console.log("Hello")' },
        { name: 'index.css', type: 'file', content: '/* styles */' },
        {
          name: 'components',
          type: 'directory',
          children: [
            { name: 'Button.tsx', type: 'file', content: '// Button component' },
            { name: 'Card.tsx', type: 'file', content: '// Card component' },
          ],
        },
      ],
    },
    {
      name: 'public',
      type: 'directory',
      children: [
        { name: 'index.html', type: 'file', content: '<!DOCTYPE html>' },
      ],
    },
  ];

  return (
    <div className="h-screen flex bg-notion-darker">
      {/* Sidebar */}
      <div className="w-64 bg-notion-dark border-r border-notion-border p-4 space-y-6">
        <div className="space-y-4">
          {buildStatus.map((status, index) => (
            <StatusCard key={index} status={status} />
          ))}
        </div>
        <FileExplorer files={files} onFileSelect={setSelectedFile} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Tabs */}
        <div className="border-b border-notion-border bg-notion-dark">
          <div className="flex space-x-4 p-4">
            <button
              onClick={() => setActiveTab('code')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'code'
                  ? 'bg-notion-accent text-white'
                  : 'text-notion-text hover:bg-notion-subtle'
              }`}
            >
              Code
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'preview'
                  ? 'bg-notion-accent text-white'
                  : 'text-notion-text hover:bg-notion-subtle'
              }`}
            >
              Preview
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 bg-notion-darker">
          {activeTab === 'code' && selectedFile?.content ? (
            <CodePreview
              code={selectedFile.content}
              language={selectedFile.name.endsWith('tsx') ? 'typescript' : 'javascript'}
            />
          ) : activeTab === 'preview' ? (
            <div className="h-full bg-notion-dark rounded-lg shadow-inner p-4">
              <iframe
                className="w-full h-full border-0"
                src="about:blank"
                title="Website Preview"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-notion-dimmed">
              Select a file to view its contents
            </div>
          )}
        </div>
      </div>
    </div>
  );
};