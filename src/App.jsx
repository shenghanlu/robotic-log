import React, { useState, useEffect } from 'react';
import { 
  Calendar, User, CheckCircle, AlertTriangle, 
  ClipboardList, Video, Save, Clock, Wrench, Code, Trash2, LayoutDashboard
} from 'lucide-react';

// Firebase 必要引入
import { initializeApp } from "firebase/app";
import { 
  getFirestore, collection, addDoc, onSnapshot, 
  query, orderBy, deleteDoc, doc 
} from "firebase/firestore";

// 您提供的 Firebase 設定
const firebaseConfig = {
  apiKey: "AIzaSyAaP5c91GP9_QDLOgV-4EpHnoIalqW7Za4",
  authDomain: "ts-robotics-log.firebaseapp.com",
  projectId: "ts-robotics-log",
  storageBucket: "ts-robotics-log.firebasestorage.app",
  messagingSenderId: "1047510316170",
  appId: "1:1047510316170:web:b6e651fa556936eeb92973"
};

// 初始化 Firebase 與 Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const App = () => {
  const [logs, setLogs] = useState([]);
  const [currentView, setCurrentView] = useState('new');
  const [loading, setLoading] = useState(false);
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

  // 從 Firebase 即時獲取資料 (當資料庫有變動時會自動更新介面)
  useEffect(() => {
    const q = query(collection(db, "robotics_logs"), orderBy("date", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const logsArray = [];
      querySnapshot.forEach((doc) => {
        logsArray.push({ ...doc.data(), id: doc.id });
      });
      setLogs(logsArray);
    }, (error) => {
      console.error("資料讀取錯誤：", error);
    });
    return () => unsubscribe();
  }, []);

  // 提交日誌到雲端
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.studentName || !formData.completedItems) {
      alert("請填寫姓名與今日完成項目");
      return;
    }
    
    setLoading(true);
    try {
      await addDoc(collection(db, "robotics_logs"), {
        ...formData,
        createdAt: new Date().toISOString()
      });
      
      // 清空表單（保留姓名與角色方便連續填寫）
      setFormData({
        ...formData,
        completedItems: '',
        incompleteItems: '',
        issues: '',
        solutions: '',
        futurePlan: '',
        videoLink: ''
      });
      alert("日誌已成功同步至雲端資料庫！");
    } catch (error) {
      console.error("儲存失敗：", error);
      alert("儲存失敗！請確認 Firestore 的『安全性規則』是否已設為測試模式（或允許寫入）。");
    }
    setLoading(false);
  };

  // 刪除日誌
  const handleDelete = async (id) => {
    if (window.confirm("確定要刪除這筆紀錄嗎？")) {
      try {
        await deleteDoc(doc(db, "robotics_logs", id));
      } catch (error) {
        alert("刪除失敗：" + error.message);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* 導覽列 */}
      <nav className="bg-red-700 text-white shadow-lg p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Wrench size={24} />
            <h1 className="text-xl font-bold tracking-tight md:block hidden">泰山高中機器手臂日誌歷程系統</h1>
            <h1 className="text-xl font-bold tracking-tight md:hidden block">泰山機器人系統整合</h1>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setCurrentView('new')} 
              className={`px-3 py-1 rounded-md transition ${currentView === 'new' ? 'bg-red-800 ring-1 ring-white' : 'hover:bg-red-600'}`}
            >
              新增
            </button>
            <button 
              onClick={() => setCurrentView('history')} 
              className={`px-3 py-1 rounded-md transition ${currentView === 'history' ? 'bg-red-800 ring-1 ring-white' : 'hover:bg-red-600'}`}
            >
              總覽
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-4 md:p-8">
        {currentView === 'new' ? (
          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 基本資訊 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2"><User size={16} /> 選手姓名</label>
                  <input type="text" name="studentName" value={formData.studentName} onChange={handleInputChange} placeholder="輸入姓名" className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">{formData.role === '實機手' ? <Wrench size={16} /> : <Code size={16} />} 工作區分</label>
                  <select name="role" value={formData.role} onChange={handleInputChange} className="w-full p-2 border border-slate-300 rounded-lg bg-white outline-none">
                    <option value="實機手">實機手 (Hardware)</option>
                    <option value="軟體手">軟體手 (Software)</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2"><Calendar size={16} /> 日期</label>
                  <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full p-2 border border-slate-300 rounded-lg outline-none" />
                </div>
              </div>

              {/* 進度內容 */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">今日完成項目</label>
                  <textarea name="completedItems" value={formData.completedItems} onChange={handleInputChange} rows="3" placeholder="請詳細列出今日訓練進度..." className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">未完成/待續項目</label>
                  <textarea name="incompleteItems" value={formData.incompleteItems} onChange={handleInputChange} rows="2" placeholder="有哪些部分明天要繼續？" className="w-full p-3 border border-slate-300 rounded-lg outline-none"></textarea>
                </div>
              </div>

              {/* 問題解決 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <label className="flex items-center gap-1 text-sm font-semibold text-red-700 mb-2"><AlertTriangle size={14} /> 問題回報</label>
                  <textarea name="issues" value={formData.issues} onChange={handleInputChange} rows="2" className="w-full p-2 border border-slate-200 rounded-md outline-none" placeholder="遇到了什麼 Bug 或硬體問題？"></textarea>
                </div>
                <div>
                  <label className="flex items-center gap-1 text-sm font-semibold text-blue-700 mb-2"><CheckCircle size={14} /> 解決方法</label>
                  <textarea name="solutions" value={formData.solutions} onChange={handleInputChange} rows="2" className="w-full p-2 border border-slate-200 rounded-md outline-none" placeholder="最後是如何解決的？"></textarea>
                </div>
              </div>

              {/* 未來規劃與影片 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2"><ClipboardList size={16} /> 近期規劃</label>
                  <textarea name="futurePlan" value={formData.futurePlan} onChange={handleInputChange} rows="2" className="w-full p-3 border border-slate-300 rounded-lg outline-none"></textarea>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2"><Video size={16} /> 術科錄影連結 (選填)</label>
                  <input type="url" name="videoLink" value={formData.videoLink} onChange={handleInputChange} placeholder="https://..." className="w-full p-3 border border-slate-300 rounded-lg outline-none" />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className={`w-full ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-red-700 hover:bg-red-800'} text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95`}
              >
                {loading ? '儲存中...' : <><Save size={20} /> 儲存至雲端資料庫</>}
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><LayoutDashboard className="text-red-700" /> 團隊紀錄總覽</h2>
              <div className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-200">共 {logs.length} 筆</div>
            </div>
            
            {logs.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300 text-slate-400">目前尚無資料</div>
            ) : (
              logs.map(log => (
                <div key={log.id} className="bg-white rounded-xl shadow p-6 border-l-4 border-red-700 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${log.role === '實機手' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                        {log.role}
                      </span>
                      <h3 className="text-lg font-bold mt-2">{log.studentName}</h3>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-slate-500 text-sm font-mono">{log.date}</span>
                      <button onClick={() => handleDelete(log.id)} className="text-slate-300 hover:text-red-600 transition-colors"><Trash2 size={18}/></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-green-50/50 p-3 rounded">
                      <h4 className="font-bold text-green-700 mb-1">✓ 完成項目：</h4>
                      <p className="text-slate-600 whitespace-pre-wrap">{log.completedItems}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded">
                      <h4 className="font-bold text-slate-700 mb-1">➟ 未來規劃：</h4>
                      <p className="text-slate-600 whitespace-pre-wrap">{log.futurePlan || '無'}</p>
                    </div>
                  </div>
                  {(log.issues || log.solutions) && (
                    <div className="mt-4 p-3 bg-red-50/30 border border-red-50 rounded text-sm">
                      <p className="text-red-800 font-semibold italic">問題與解決：</p>
                      <p className="text-slate-600">{log.issues} ➔ {log.solutions}</p>
                    </div>
                  )}
                  {log.videoLink && (
                    <a href={log.videoLink} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-red-600 hover:underline text-sm font-medium">
                      <Video size={14} /> 查看訓練錄影
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </main>

      <footer className="max-w-4xl mx-auto p-8 text-center text-slate-400 text-sm">
        泰山高中 機器手臂校隊 &copy; 2026 工程日誌系統
      </footer>
    </div>
  );
};

export default App;

