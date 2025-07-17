import { useRef, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';

const CollaborativeCodeEditor = ({ socket, roomId, user }) => {
  
  const codeRef = useRef('');
  const [code, setCode] = useState('// Start typing...');
  codeRef.current = code;

  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');

  const handleEditorChange = (value) => {
    setCode(value);
    socket.emit('codeUpdate', { roomId, code: value });
  };

  const runCode = async () => {
    try {
      const res = await axios.post('http://localhost:5000/run', {
        code,
        language,
      });

      const { stdout, stderr, compile_output } = res.data;

      if (stderr) setOutput(stderr);
      else if (compile_output) setOutput(compile_output);
      else setOutput(stdout || 'No Output');
    } catch (err) {
      setOutput('❌ Error running code');
    }
  };

  useEffect(() => {
  socket.on('codeUpdate', (data) => {
    if (data.roomId === roomId && data.code !== codeRef.current) {
      setCode(data.code);
    }
  });

  return () => {
    socket.off('codeUpdate');
  };
}, [socket, roomId]);


  useEffect(() => {
  if (socket && roomId) {
    socket.emit("joinRoom", roomId);
  }
}, [socket, roomId]);


  return (
    <div
      style={{
        height: 'calc(100vh - 60px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Top Controls */}
      <div
        className="d-flex align-items-center justify-content-between mb-3"
        style={{ flexShrink: 0 }}
      >
        <select
          className="form-select me-2"
          style={{ width: '30%' }}
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="c">C</option>
          <option value="cpp">C++</option>
        </select>
        <button className="btn btn-success" onClick={runCode}>
          Run Code
        </button>
      </div>

      {/* Editor Area */}
      <div style={{ flexGrow: 1, width: '100%' }}>
        <Editor
          height="100%"
          width="100%"
          language={language}
          value={code}
          theme="vs-dark"
          onChange={handleEditorChange}
          options={{ fontSize: 16          
           }}
        />
      </div>

      {/* Output */}
      <div className="mt-2" style={{ flexShrink: 0 }}>
        <h6 className='text-white'>Output:</h6>
        <pre
          style={{
            backgroundColor: '#1c1c1cff',
            color: '#fff',
            padding: '10px',
            borderRadius: '5px',
            height: '150px',
            overflowY: 'auto',
          }}
        >
          {output}
        </pre>
      </div>
    </div>
  );
};

export default CollaborativeCodeEditor;
