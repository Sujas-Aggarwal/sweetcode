'use client';

import { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';

export default function EditorPage() {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [language, setLanguage] = useState('python');

  const handleExecute = async () => {
    try {
      setOutput('');
      setError('');

      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, language }),
      });

      const data = await response.json();
      
      if (data.error) {
        setError(`Error: ${data.error}\n\nStderr: ${data.stderr || 'N/A'}`);
      } else {
        setOutput(data.output || 'No output');
        if (data.stderr) {
          setError(`Stderr: ${data.stderr}`);
        }
      }
    } catch (error) {
      console.error('Error executing code:', error);
      setError('An error occurred while executing the code.');
    }
  };

  const getLanguageExtension = () => {
    switch (language) {
      case 'python':
        return python();
      case 'cpp':
        return cpp();
      default:
        return javascript();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Online Code Editor</h1>
      <div className="mb-4">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="p-2 border rounded bg-blue-300"
        >
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="javascript">JavaScript</option>
        </select>
      </div>
      <CodeMirror
        value={code}
        theme={"dark"}
        height="200px"
        extensions={[getLanguageExtension()]}
        onChange={(value) => setCode(value)}
        className="mb-4"
      />
      <button
        onClick={handleExecute}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Execute
      </button>
      {output && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Output:</h2>
          <pre className=" p-4 rounded">{output}</pre>
        </div>
      )}
      {error && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold text-red-500">Error:</h2>
          <pre className=" p-4 rounded text-red-700">{error}</pre>
        </div>
      )}
    </div>
  );
}