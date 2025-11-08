import { useState } from "react";
import { Play, RotateCcw } from "lucide-react";

interface CodeEditorProps {
  initialCode?: string;
  onRun: (code: string) => { success: boolean; output: string };
  language?: string;
}

export default function CodeEditor({ initialCode = '', onRun, language = 'javascript' }: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<{ success: boolean; message: string } | null>(null);

  const handleRun = () => {
    const result = onRun(code);
    setOutput({ success: result.success, message: result.output });
  };

  const handleReset = () => {
    setCode(initialCode);
    setOutput(null);
  };

  return (
    <div className="bg-slate-900 rounded-xl border-2 border-indigo-500 overflow-hidden">
      <div className="flex items-center justify-between bg-slate-800 px-4 py-2 border-b-2 border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-4 font-orbitron text-xs text-gray-400">{language}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 transition-colors font-orbitron text-xs text-white"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
          <button
            onClick={handleRun}
            className="flex items-center gap-1 px-3 py-1 rounded bg-green-600 hover:bg-green-500 transition-colors font-orbitron text-xs text-white"
          >
            <Play className="w-3 h-3" />
            Run
          </button>
        </div>
      </div>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full h-64 p-4 bg-slate-900 text-gray-100 font-mono text-sm resize-none outline-none"
        spellCheck={false}
        placeholder="// Write your code here..."
      />

      {output && (
        <div className={`border-t-2 border-slate-700 p-4 ${
          output.success ? 'bg-green-900/30' : 'bg-red-900/30'
        }`}>
          <div className="flex items-start gap-2">
            <span className="font-orbitron text-xs text-gray-400">Output:</span>
            <pre className={`font-mono text-sm flex-1 ${
              output.success ? 'text-green-300' : 'text-red-300'
            }`}>
              {output.message}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
