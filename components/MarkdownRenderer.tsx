import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-lg dark:prose-invert prose-slate max-w-none 
      prose-headings:font-serif prose-headings:font-bold 
      prose-a:text-n7-600 dark:prose-a:text-n7-500 hover:prose-a:text-n7-700
      prose-img:rounded-xl prose-img:shadow-lg
      prose-pre:bg-slate-800 prose-pre:text-slate-100 prose-pre:shadow-md
    ">
      <ReactMarkdown>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;