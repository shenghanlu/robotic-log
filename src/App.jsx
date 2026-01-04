import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  User, 
  CheckCircle, 
  AlertTriangle, 
  ClipboardList, 
  Video, 
  Save, 
  Clock,
  Wrench,
  Code
} from 'lucide-react';

// 注意：在 Vite 專案中，主要元件通常命名為 App 並導出
const App = () => {
  const [logs, setLogs] = useState([]);
  const [currentView, setCurrentView] = useState('new');
  const [formData, setFormData] = useState({
    studentName: '',
    role: '實機手',
    date: new Date().toISOString().split('T')[0],
    completedItems: '',
    incompleteItems: '',
    issues: '',
    solutions: '',
    futurePlan: '',
    videoLink: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.studentName || !formData.completedItems) {
      alert("請至少填寫姓名與今日完成項目");
      return;
    }
    const newLog = { ...formData, id: Date.now() };
    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    setFormData({
      ...formData,
      completedItems: '',
      incompleteItems: '',
      issues: '',
      solutions: '',
      futurePlan: '',
      videoLink: ''
    });
    alert("日誌已暫存！");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <nav className="bg-red-700 text-white shadow-lg p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Wrench size={24} />
            <h1 className="text-xl font-bold tracking-tight">泰山高中機器手臂工程日誌</h1>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setCurrentView('new')} className={`px-3 py-1 rounded-md transition ${currentView === 'new' ? 'bg-red-800 ring-1 ring-white' : 'hover:bg-red-600'}`}>新增日誌</button>
            <button onClick={() => setCurrentView('history')} className={`px-3 py-1 rounded-md transition ${currentView === 'history' ? 'bg-red-800 ring-1 ring-white' : 'hover:bg-red-600'}`}>紀錄查詢</button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-4 md:p-8">
        {currentView === 'new' ? (
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-slate-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2"><User size={16} /> 選手姓名</label>
                  <input type="text" name="studentName" value={formData.studentName} onChange={handleInputChange} placeholder="輸入姓名" className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">{formData.role === '實機手' ? <Wrench size={16} /> : <Code size={16} />} 工作區分</label>
                  <select name="role" value={formData.role} onChange={handleInputChange} className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-red-500 outline-none">
                    <option value="實機手">實機手 (Hardware)</option>
                    <option value="軟體手">軟體手 (Software)</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2"><Calendar size={16} /> 日期</label>
                  <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
                </div>
              </div>
              <hr className="border-slate-100" />
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2"><CheckCircle size={16} className="text-green-600" /> 今日完成項目</label>
                  <textarea name="completedItems" value={formData.completedItems} onChange={handleInputChange} rows="3" placeholder="請條列說明今日進度..." className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"></textarea>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2"><Clock size={16} className="text-orange-600" /> 未完成項目</label>
                  <textarea name="incompleteItems" value={formData.incompleteItems} onChange={handleInputChange} rows="2" placeholder="有哪些待續工作？" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"></textarea>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                  <label className="flex items-center gap-2 text-sm font-semibold text-red-700 mb-2"><AlertTriangle size={16} /> 出現的問題</label>
                  <textarea name="issues" value={formData.issues} onChange={handleInputChange} rows="3" className="w-full p-2 border border-red-200 rounded-md outline-none focus:bg-white transition"></textarea>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <label className="flex items-center gap-2 text-sm font-semibold text-blue-700 mb-2"><CheckCircle size={16} /> 解決方法</label>
                  <textarea name="solutions" value={formData.solutions} onChange={handleInputChange} rows="3" className="w-full p-2 border border-blue-200 rounded-md outline-none focus:bg-white transition"></textarea>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2"><ClipboardList size={16} /> 近期規劃</label>
                  <textarea name="futurePlan" value={formData.futurePlan} onChange={handleInputChange} rows="2" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none"></textarea>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2"><Video size={16} /> 術科完成錄影連結</label>
                  <input type="url" name="videoLink" value={formData.videoLink} onChange={handleInputChange} placeholder="https://youtube.com/..." className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
                </div>
              </div>
              <button type="submit" className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"><Save size={20} /> 儲存今日日誌</button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Clock className="text-red-700" /> 歷程記錄回顧</h2>
            {logs.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300 text-slate-400">目前尚無紀錄</div>
            ) : (
              logs.map(log => (
                <div key={log.id} className="bg-white rounded-xl shadow p-6 border-l-4 border-red-700">
                  <div className="flex justify-between items-start mb-4">
                    <div><span className="text-sm font-bold text-red-700 bg-red-50 px-2 py-1 rounded">{log.role}</span><h3 className="text-lg font-bold mt-2">{log.studentName}</h3></div>
                    <span className="text-slate-500 text-sm font-mono">{log.date}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div><h4 className="font-bold text-green-700">✓ 完成項目：</h4><p className="text-slate-600 whitespace-pre-wrap">{log.completedItems}</p></div>
                    {log.issues && (<div><h4 className="font-bold text-red-700">⚠ 問題：</h4><p className="text-slate-600 whitespace-pre-wrap">{log.issues}</p></div>)}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
      <footer className="max-w-4xl mx-auto p-8 text-center text-slate-400 text-sm">泰山高中 機器手臂校隊 &copy; 2024</footer>
    </div>
  );
};

export default App;