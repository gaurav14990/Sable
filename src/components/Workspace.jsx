import { useLocation } from 'react-router-dom';
import { useEffect, useState, useMemo, useRef } from 'react';
import { SpiderCursor } from './ui/SpyderCursor';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';

export default function Workspace() {
  const location = useLocation();
  const { prompt, model } = location.state || {};
  const [dots, setDots] = useState('');
  const [fullCode, setFullCode] = useState('');
  const [displayedCode, setDisplayedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [usedProvider, setUsedProvider] = useState('');
  const codeContainerRef = useRef(null);

  useEffect(() => {
    if (!isGenerating) return;
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? '' : d + '.'));
    }, 400);
    return () => clearInterval(interval);
  }, [isGenerating]);

  useEffect(() => {
    if (!prompt) return;
    async function fetchGeneration() {
      setIsGenerating(true);
      setFullCode('');
      setDisplayedCode('');
      try {
        const res = await fetch(
          `${import.meta.env.PROD ? '/api' : 'http://localhost:3001'}/generate`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model, history: [], prompt }),
          }
        );
        const data = await res.json();
        if (data.error) {
          setDisplayedCode(`// Error: ${data.error}`);
          setIsGenerating(false);
          return;
        }
        const html = data.html;
        setFullCode(html);
        setUsedProvider(data.usedProvider);
        setIsGenerating(false);
        setIsTyping(true);
        const existing = JSON.parse(localStorage.getItem('sable_works') || '[]');
        existing.push({ title: prompt, html, savedAt: Date.now() });
        localStorage.setItem('sable_works', JSON.stringify(existing));
      } catch (err) {
        setDisplayedCode(`// Error: ${err.message}`);
        setIsGenerating(false);
      }
    }
    fetchGeneration();
  }, [prompt, model]);

  // Typewriter effect for code panel
  useEffect(() => {
    if (!fullCode || !isTyping) return;
    let i = 0;
    const charsPerTick = 40;
    const interval = setInterval(() => {
      i += charsPerTick;
      setDisplayedCode(fullCode.slice(0, i));
      if (i >= fullCode.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 15);
    return () => clearInterval(interval);
  }, [fullCode, isTyping]);

  // Auto-scroll code container as code types
  useEffect(() => {
    if (isTyping && codeContainerRef.current) {
      codeContainerRef.current.scrollTop = codeContainerRef.current.scrollHeight;
    }
  }, [displayedCode, isTyping]);

  // Syntax highlighting via Prism
  const highlightedCode = useMemo(() => {
    if (!displayedCode) return '';
    try {
      return Prism.highlight(displayedCode, Prism.languages.html, 'html');
    } catch {
      return displayedCode;
    }
  }, [displayedCode]);

  const handleSkipTyping = () => {
    if (fullCode) {
      setDisplayedCode(fullCode);
      setIsTyping(false);
    }
  };

  return (
    <div className="relative flex w-full h-screen bg-black text-white overflow-hidden p-6 gap-6">
      <div className="absolute inset-0 z-0">
        <SpiderCursor />
      </div>

      {/* LEFT: Live Render Preview */}
      <div
        className="relative z-10 w-1/2 h-full flex items-center justify-center overflow-hidden"
        style={{
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
      >
        {fullCode ? (
          <iframe
            title="preview"
            srcDoc={fullCode}
            className="w-full h-full rounded-[20px] bg-white border-0"
            sandbox="allow-scripts"
          />
        ) : (
          <p className="text-white/40 font-mono text-sm">
            {isGenerating ? `Building your page${dots}` : 'Output will render here...'}
          </p>
        )}
      </div>

      {/* RIGHT: Code Editor with Syntax Highlighting */}
      <div
        className="relative z-10 w-1/2 h-full p-6 flex flex-col overflow-hidden"
        style={{
          borderRadius: '30px',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div className="flex items-center justify-between mb-2 shrink-0">
          <p className="font-mono text-sm text-white/60 truncate max-w-[80%] m-0">
            Prompt: {prompt}
          </p>
          {isTyping && (
            <button
              onClick={handleSkipTyping}
              className="font-mono text-xs text-white/50 hover:text-white bg-white/10 px-2 py-1 rounded cursor-pointer transition-colors"
            >
              Skip ⚡
            </button>
          )}
        </div>

        {usedProvider && (
          <p className="font-mono text-xs text-white/30 mb-3 shrink-0 m-0">
            via {usedProvider}
          </p>
        )}

        {isGenerating && (
          <p className="font-mono text-sm text-white/40 mb-2 shrink-0">
            Thinking{dots}
          </p>
        )}

        {/* Syntax Highlighted Code Area */}
        <pre
          ref={codeContainerRef}
          className="font-mono text-xs overflow-y-auto flex-1 whitespace-pre-wrap leading-relaxed select-text"
          style={{
            margin: 0,
            padding: '1.25rem',
            background: 'rgba(5, 7, 15, 0.75)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <code
            className="language-html"
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
          {isTyping && <span className="animate-pulse text-blue-400">▊</span>}
        </pre>

        <div className="mt-4 shrink-0">
          <input
            type="text"
            placeholder="What Would You Like To Change?"
            style={{
              width: '100%',
              padding: '1.25rem 1rem',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              borderRadius: '16px',
              color: 'white',
              background: 'rgba(255, 255, 255, 0.05)',
              outline: 'none',
              fontFamily: 'ui-monospace, monospace',
              fontSize: '0.85rem'
            }}
          />
        </div>
      </div>
    </div>
  );
}