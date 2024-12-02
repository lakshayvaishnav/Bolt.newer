import React from 'react';
import Editor from '@monaco-editor/react';

interface CodePreviewProps {
  code: string;
  language: string;
}

export const CodePreview: React.FC<CodePreviewProps> = ({ code, language }) => {
  return (
    <div className="h-full">
      <Editor
        height="100%"
        defaultLanguage={language}
        value={code}
        theme="vs-dark"
        options={{
          readOnly: true,
          minimap: { enabled: false },
          fontSize: 14,
        }}
      />
    </div>
  );
};