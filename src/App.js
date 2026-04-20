import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, Users, Share2, Phone, Target, Megaphone, 
  Award, LogIn, CheckCircle2, Save, LogOut, Loader2, Plus, Trash2, Calendar, 
  KeyRound, CloudLightning, Search, ChevronDown, BarChart3, Trophy, AlertTriangle, 
  TrendingUp, Activity, FileText, Lightbulb, MessageSquare, Video, Headset, MapPin,
  Printer, AlertOctagon, X
} from 'lucide-react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';

// --- Institution Data ---
export const COLLEGES = [
  { id: "c01", passkey: "HJI8X", name: "HUJJATHUL ISLAM WAFY COLLEGE" },
  { id: "c02", passkey: "PMS7Y", name: "PMSA POOKOYA THANGAL ISLAMIC & ARTS COLLEGE" },
  { id: "c03", passkey: "BFK3M", name: "BAFAKHY ISLAMIC & ARTS COLLEGE" },
  { id: "c04", passkey: "FLH4A", name: "FALAHIYA ISLAMIC ARABIC COLLEGE" },
  { id: "c05", passkey: "UST2P", name: "UMERALI SHIHAB THANGAL ISLAMIC ACADEMY" },
  { id: "c06", passkey: "ASH9R", name: "ASSHUHADA ISLAMIC DAWA COLLEGE" },
  { id: "c07", passkey: "MTM5E", name: "MTM ISLAMIC & ARTS COLLEGE" },
  { id: "c08", passkey: "SWH6C", name: "SWAHABA ISLAMIC ACADEMY" },
  { id: "c09", passkey: "RHM1N", name: "RAHMANIYA ISLAMIC & ARTS COLLEGE" },
  { id: "c10", passkey: "MDR8L", name: "MADARJUSSUNNA ISLAMIC COLLEGE" },
  { id: "c11", passkey: "VRK3W", name: "VARAKKAL MULLAKOVA THANGAL COLLEGE" },
  { id: "c12", passkey: "SUM9D", name: "SHAMSUL ULAMA MEMORIAL SALIHEEN WAFY COLLEGE" },
  { id: "c13", passkey: "KHM4Q", name: "KKHM ISLAMIC & ARTS COLLEGE" },
  { id: "c14", passkey: "RSH2Z", name: "RASHEEDIYYA ISLAMIC & ARTS COLLEGE" },
  { id: "c15", passkey: "MJM7V", name: "MAJMAA SHAREE-ATH & ARTS COLLEGE" },
  { id: "c16", passkey: "DUL6T", name: "DARUL ULOOM ISLAMIC & ARTS COLLEGE" },
  { id: "c17", passkey: "DSL5K", name: "DARUSSALAM ISLAMIC & ARTS COLLEGE" },
  { id: "c18", passkey: "DHI8B", name: "DARUL IHSAN ISLAMIC ACADEMY" },
  { id: "c19", passkey: "MJL3F", name: "MAJLIS UMARIYYA ISLAMIC & ARTS COLLEGE" },
  { id: "c20", passkey: "SHT9G", name: "SHIHAB THANGAL ISLAMIC & ARTS COLLEGE" },
  { id: "c21", passkey: "SHU4J", name: "SHAMSUL HUDA ISLAMIC ACADEMY" },
  { id: "c22", passkey: "MNR1X", name: "MUNEERUL ISLAM ARABIC (WAFY) COLLEGE" },
  { id: "c23", passkey: "DAF6Y", name: "DARUL ATHFAL WAFY ARTS COLLEGE" },
  { id: "c24", passkey: "PAK2M", name: "PANGIL AHMED KUTTY MUSLIYAR WAFY COLLEGE" },
  { id: "c25", passkey: "NMI7A", name: "NAFEESATHUL MISRIYA INSTITUTE OF INNOVATIVE STUDIES" },
  { id: "c26", passkey: "ESC9P", name: "ESCOLA INTERNATIONAL" },
  { id: "c27", passkey: "VAM5R", name: "VAM ISLAMIC & ARTS COLLEGE FOR GIRLS" },
  { id: "c28", passkey: "HST3E", name: "HYDERALI SHIHAB THANGAL COLLEGE FOR WOMEN (WAFIYYA)" },
  { id: "c29", passkey: "FZW8C", name: "FATHIMA ZAHRA WOMEN'S COLLEGE" },
  { id: "c30", passkey: "WIA4N", name: "WOMEN'S ISLAMIC & ARTS COLLEGE" },
  { id: "c31", passkey: "ESC1L", name: "ELITE SHE CAMPUS WAFIYYA ARTS COLLEGE" },
  { id: "c32", passkey: "PTM6W", name: "PTM ARTS & SCIENCE COLLEGE FOR GIRLS (WAFIYYA)" },
  { id: "c33", passkey: "LOR2D", name: "LORE ACADEMY DAY COLLEGE FOR WOMEN" },
  { id: "c34", passkey: "SPL9Q", name: "SOULPATH COLLEGE FOR ADVANCED STUDIES (WAFIYYA)" },
  { id: "c35", passkey: "HVW5Z", name: "HOPE VALLEY WOMEN'S COLLEGE (WAFIYYA)" },
  { id: "c36", passkey: "MTW7V", name: "MTM WOMEN'S COLLEGE" },
  { id: "c37", passkey: "STE3T", name: "SHIHAB THANGAL EDUCATIONAL ACADEMY" },
  { id: "c38", passkey: "WMB8K", name: "WADEEMA MOHAMED BUTTI WOMEN'S COLLEGE" },
  { id: "c39", passkey: "WMO4B", name: "WMO WOMEN'S COLLEGE (WAFIYYA)" },
  { id: "c40", passkey: "VMH2F", name: "VAYALIL MOYI HAJI MEMORIAL ISLAMIC & ARTS COLLEGE FOR WOMEN" },
  { id: "c41", passkey: "CMA6G", name: "CM AYISHA HAJJUMMA INSTITUTE OF ADVANCED STUDIES (WAFIYYA)" },
  { id: "c42", passkey: "CMM1J", name: "CHELAKKAD MUHAMMED MUSLIYAR ISLAMIC ARTS COLLEGE FOR GIRLS" },
  { id: "c43", passkey: "ALG9X", name: "AL GAITH ISLAMIC & ARTS COLLEGE FOR GIRLS" },
  { id: "c44", passkey: "BFW5Y", name: "BAFAKHY WAFIYYA COLLEGE" },
  { id: "c45", passkey: "AFW3M", name: "AL FAROOQ ISLAMIC WOMEN'S COLLEGE" },
  { id: "c46", passkey: "DAW8A", name: "DARULATHFAL ISLAMIC & ARTS COLLEGE FOR WOMEN" },
  { id: "c47", passkey: "SMS4P", name: "SAYYID MUHAMMEDALI SHIHAB THANGAL ISLAMIC & ARTS WOMEN'S COLLEGE" },
  { id: "c48", passkey: "BKC7R", name: "BEEVI KHADEEJA (R) ISLAMIC & ARTS WOMEN'S COLLEGE" },
  { id: "c49", passkey: "QIS5K", name: "QUVATHUL ISLAM WAFY COLLEGE" },
  { id: "c50", passkey: "BST2N", name: "BUSTHANABAD WAFY COLLEGE" },
  { id: "c51", passkey: "JMC8W", name: "JAMIA ISLAMIYA WAFY COLLEGE" },
  { id: "c52", passkey: "KIC4Y", name: "KIC WAFY COLLEGE" },
  { id: "c53", passkey: "MIC9B", name: "MIC WAFY COLLEGE" },
  { id: "c54", passkey: "MLB7V", name: "MALABAR WAFY COLLEGE" },
  { id: "c55", passkey: "DNR3X", name: "DARUNNUJOOM WAFY COLLEGE" },
  { id: "c56", passkey: "AHW6M", name: "AL HIDAYA WAFIYYA COLLEGE" },
  { id: "c57", passkey: "BUC1P", name: "BUSTHANUL ULOOM WAFY COLLEGE" },
  { id: "c58", passkey: "HIW4A", name: "HIDAYATHUL ISLAM WAFY COLLEGE" },
  { id: "c59", passkey: "SHW8Z", name: "SIRAJUL HUDA WAFY COLLEGE" }
];

// --- Score Calculation Algorithm ---
const calculateScore = (data) => {
  if (!data) return 0;
  let score = 0;

  // 1. One-time Actions
  if (data.q1_committee_formed === 'Yes') score += 10;
  if (data.q4_help_desk_formed === 'Yes') score += 10;
  if (data.q3_has_youtube) score += 5;
  if (data.q3_has_twitter) score += 5;
  if (data.q3_has_linkedin) score += 5;
  if (data.q3_has_others) score += 5;
  if (data.q7_door_to_door === 'Yes') score += 10;
  if (data.q13_student_motivation_formed === 'Yes') score += 10;
  if (data.q16_call_team_ready === 'Yes') score += 10;
  if (data.q17_video_brochure === 'Yes') score += 10;

  // 2. Variable Actions
  const validMeetings = (data.q5_meetings || []).filter(m => m.date).length;
  score += Math.min(validMeetings, 6) * 10;

  const dataCollected = parseInt(data.q6_data_collected) || 0;
  score += dataCollected * 2;

  const housesCovered = parseInt(data.q7_houses_covered) || 0;
  score += Math.floor(housesCovered * 0.5);

  const referrals = parseInt(data.q15_referral_count) || 0;
  score += referrals * 50;

  const orbit = parseInt(data.q8_orbit_participation) || 0;
  score += Math.floor(orbit * 0.5); 

  const mgt = parseInt(data.q10_management_rating) || 0;
  score += mgt * 2; 

  const teachers = parseInt(data.q11_teachers_rating) || 0;
  score += teachers * 2;

  return score;
};

// --- Firebase Setup ---
const canvasFirebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
const fallbackFirebaseConfig = {
  apiKey: "AIzaSyCDa--GhMiHyymM-4y6eyC67IZq8LLcGbM",
  authDomain: "wafy-entrance-tracker.firebaseapp.com",
  projectId: "wafy-entrance-tracker",
  storageBucket: "wafy-entrance-tracker.firebasestorage.app",
  messagingSenderId: "645522627426",
  appId: "1:645522627426:web:2711be5d20da51bc2faa3b"
};
const firebaseConfig = canvasFirebaseConfig || fallbackFirebaseConfig;
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : "wafy-entrance-tracker";

// --- Empty Form State ---
const initialFormState = {
  q1_committee_formed: '', q2_chairman: '', q2_convener: '', q2_member1: '', q2_member2: '', q2_member3: '',
  q4_help_desk_formed: '', q4_contact_numbers: [''],
  q3_instagram: '', q3_facebook: '', q3_has_youtube: false, q3_youtube_links: [''], q3_has_twitter: false, q3_twitter_links: [''], q3_has_linkedin: false, q3_linkedin_links: [''], q3_has_others: false, q3_other_links: [''],
  q5_meetings: [{ date: '', participants: '' }], q6_data_collected: '', q6_followed_up: '', q7_door_to_door: '', q7_houses_covered: '',
  q8_orbit_participation: 50, q9_orbit_absentees_followed: '', q9_orbit_absentees_details: '', q10_management_rating: 5, q11_teachers_rating: 5, q12_other_events_count: '', q12_other_events_links: [''],
  q13_student_motivation_formed: '', q13_student_motivation: '', q14_social_media_posts: [''], q15_referral_count: '',
  q16_call_team_ready: '', q16_call_team_count: '', q17_video_brochure: '', q17_video_links: [''], q18_expected_support: '', q19_future_plans: ['']
};

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login');
  const [loginTab, setLoginTab] = useState('college');
  const [activeCollege, setActiveCollege] = useState(null);
  const [selectedIdInput, setSelectedIdInput] = useState('');
  const [passkeyInput, setPasskeyInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [formData, setFormData] = useState(initialFormState);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [allSubmissions, setAllSubmissions] = useState([]); 
  
  // Auto Save States
  const [autoSaveStatus, setAutoSaveStatus] = useState('');
  const isFirstLoad = useRef(true);
  const lastSavedData = useRef(null);

  // Clear Data Modal States
  const [showClearModal, setShowClearModal] = useState(false);
  const [clearVerifyText, setClearVerifyText] = useState('');
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Auth Error:", error);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  const fetchAllSubmissions = async () => {
    if (!user) return;
    setIsLoadingData(true);
    try {
      const colRef = collection(db, 'artifacts', appId, 'public', 'data', 'submissions');
      const snapshot = await getDocs(colRef);
      const dataArray = snapshot.docs.map(d => {
        const dData = d.data();
        return { id: d.id, ...dData, score: calculateScore(dData) };
      }).filter(d => d.institutionId); 

      dataArray.sort((a, b) => b.score - a.score);
      dataArray.forEach((item, index) => { item.rank = index + 1; });
      setAllSubmissions(dataArray);
    } catch (err) {
      console.error("Error fetching submissions:", err);
    }
    setIsLoadingData(false);
  };

  useEffect(() => {
    if (!user || view !== 'college' || !activeCollege) return;

    const loadInstitutionData = async () => {
      setIsLoadingData(true);
      try {
        await fetchAllSubmissions(); 
        const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'submissions', activeCollege.id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          let loadedData = docSnap.data();
          const ensureArray = (data, oldKey, newKey) => {
            if (data[oldKey] && typeof data[oldKey] === 'string' && !data[newKey]) { data[newKey] = [data[oldKey]]; }
            if (!data[newKey] || !Array.isArray(data[newKey]) || data[newKey].length === 0) { data[newKey] = ['']; }
          };
          ensureArray(loadedData, 'q14_social_media_posts', 'q14_social_media_posts');
          ensureArray(loadedData, 'q12_other_events_links', 'q12_other_events_links');
          ensureArray(loadedData, 'q17_video_link', 'q17_video_links');
          ensureArray(loadedData, 'q19_future_plans', 'q19_future_plans');
          ensureArray(loadedData, 'q3_youtube_links', 'q3_youtube_links');
          ensureArray(loadedData, 'q3_twitter_links', 'q3_twitter_links');
          ensureArray(loadedData, 'q3_linkedin_links', 'q3_linkedin_links');
          ensureArray(loadedData, 'q3_other_links', 'q3_other_links');

          if (loadedData.q4_contact_numbers && typeof loadedData.q4_contact_numbers === 'string') {
            loadedData.q4_contact_numbers = loadedData.q4_contact_numbers.split(',').map(s=>s.trim());
          } else if (!loadedData.q4_contact_numbers || loadedData.q4_contact_numbers.length === 0) {
            loadedData.q4_contact_numbers = [''];
          }

          if (!loadedData.q5_meetings || loadedData.q5_meetings.length === 0) {
            loadedData.q5_meetings = [{ date: '', participants: '' }];
          } else if (typeof loadedData.q5_meetings[0] === 'string') {
             loadedData.q5_meetings = loadedData.q5_meetings.map(d => ({ date: d, participants: '' }));
          }

          const finalData = { ...initialFormState, ...loadedData };
          setFormData(finalData);
          lastSavedData.current = JSON.stringify(finalData);
        } else {
          setFormData(initialFormState);
          lastSavedData.current = JSON.stringify(initialFormState);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
      setIsLoadingData(false);
      isFirstLoad.current = false;
    };

    loadInstitutionData();
  }, [user, activeCollege, view]);

  useEffect(() => {
    if (isFirstLoad.current || view !== 'college' || !activeCollege || !user) return;
    const currentDataStr = JSON.stringify(formData);
    if (currentDataStr === lastSavedData.current) return;
    const timer = setTimeout(() => { autoSaveData(formData); }, 2000);
    return () => clearTimeout(timer);
  }, [formData, activeCollege, user, view]);

  const autoSaveData = async (dataToSave) => {
    setAutoSaveStatus('Saving...');
    try {
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'submissions', activeCollege.id);
      await setDoc(docRef, { ...dataToSave, lastUpdated: new Date().toISOString(), institutionId: activeCollege.id, institutionName: activeCollege.name });
      
      const GOOGLE_SHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxyEpkyf1dXXteMdM735fBC9KK_bO26hQRej5YKG3OwqQO0KKyIisuj8rr-m8Caqra1/exec';
      try {
        await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
          method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: { ...dataToSave, institutionId: activeCollege.id, institutionName: activeCollege.name } })
        });
      } catch (sheetError) { console.error("Google Sheets error:", sheetError); }

      lastSavedData.current = JSON.stringify(dataToSave);
      setAutoSaveStatus('Auto-saved');
      fetchAllSubmissions(); 
      setTimeout(() => { setAutoSaveStatus(''); }, 3000);
    } catch (error) {
      setAutoSaveStatus('Save Failed!');
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');

    if (loginTab === 'admin') {
      if (passkeyInput === 'Entr123') {
        setView('admin');
        fetchAllSubmissions(); 
      } else {
        setLoginError("പാസ്‌വേർഡ് തെറ്റാണ് (Incorrect Password).");
      }
      return;
    }

    if(!selectedIdInput || !passkeyInput || passkeyInput.length !== 5) {
      setLoginError("ദയവായി സ്ഥാപനം തിരഞ്ഞെടുത്ത് 5 അക്ക പാസ്കീ നൽകുക.");
      return;
    }

    const college = COLLEGES.find(c => c.id === selectedIdInput);
    if (college && college.passkey.toUpperCase() === passkeyInput.trim().toUpperCase()) {
      setActiveCollege(college);
      setView('college');
      isFirstLoad.current = true;
    } else {
      setLoginError("പാസ്കീ തെറ്റാണ്. ദയവായി പരിശോധിക്കുക.");
    }
  };

  const handleLogout = () => {
    setActiveCollege(null);
    setFormData(initialFormState);
    setSelectedIdInput('');
    setPasskeyInput('');
    setAutoSaveStatus('');
    setView('login');
  };

  const handleManualSave = async (e) => {
    e.preventDefault();
    if (!user || !activeCollege) return;
    setIsSaving(true);
    await autoSaveData(formData);
    setIsSaving(false);
  };

  // Admin Clear All Data Handler
  const handleClearAllData = async () => {
    if (clearVerifyText !== 'DeLeTe') return;
    setIsClearing(true);
    try {
      // Loop through all fetched submissions and delete documents one by one
      for (const sub of allSubmissions) {
         const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'submissions', sub.id);
         await deleteDoc(docRef);
      }
      setAllSubmissions([]);
      setShowClearModal(false);
      setClearVerifyText('');
    } catch(e) {
       console.error("Error clearing data: ", e);
    }
    setIsClearing(false);
  };

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Anek+Malayalam:wght@400;500;600;700;800&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
  const handleArrayChange = (name, newArray) => setFormData(prev => ({ ...prev, [name]: newArray }));
  const handleMeetingChange = (index, field, value) => {
    const newMeetings = [...formData.q5_meetings];
    newMeetings[index] = { ...newMeetings[index], [field]: value };
    setFormData(prev => ({ ...prev, q5_meetings: newMeetings }));
  };
  const addMeeting = () => setFormData(prev => ({ ...prev, q5_meetings: [...prev.q5_meetings, { date: '', participants: '' }] }));
  const removeMeeting = (index) => {
    const newMeetings = formData.q5_meetings.filter((_, i) => i !== index);
    if (newMeetings.length === 0) newMeetings.push({ date: '', participants: '' });
    setFormData(prev => ({ ...prev, q5_meetings: newMeetings }));
  };


  // -------------------------------------------------------------
  // VIEWS
  // -------------------------------------------------------------

  if (view === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-blue-100 flex items-center justify-center p-4" style={{ fontFamily: "'Inter', 'Anek Malayalam', sans-serif" }}>
        <div className="max-w-xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
          <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <Building2 className="w-32 h-32" />
            </div>
            <Award className="w-16 h-16 text-white mx-auto mb-4 relative z-10" />
            <h1 className="text-3xl font-extrabold text-white mb-1 relative z-10">Wafy Wafiyya Entrance</h1>
            <p className="text-blue-100 font-medium text-lg relative z-10">Admission Drive - Tracker & Analytics</p>
          </div>
          
          <div className="p-8">
            {/* Login Tabs */}
            <div className="flex rounded-xl bg-slate-100 p-1 mb-8">
              <button 
                onClick={() => { setLoginTab('college'); setLoginError(''); setPasskeyInput(''); }}
                className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${loginTab === 'college' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                College Login
              </button>
              <button 
                onClick={() => { setLoginTab('admin'); setLoginError(''); setPasskeyInput(''); }}
                className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${loginTab === 'admin' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Admin Login
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {loginError && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" /> {loginError}
                </div>
              )}

              {loginTab === 'college' ? (
                <>
                  <div className="relative z-50">
                    <label className="block text-base font-bold text-slate-700 mb-2">സ്ഥാപനം (Select Institution)</label>
                    <SearchableSelect 
                      options={COLLEGES} value={selectedIdInput} onChange={setSelectedIdInput}
                      placeholder="-- നിങ്ങളുടെ സ്ഥാപനം തിരയുക --"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-bold text-slate-700 mb-2">പാസ്കീ (Passkey)</label>
                    <div className="relative">
                      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="text" required maxLength={5}
                        className="w-full pl-12 pr-5 py-4 text-lg font-bold tracking-widest uppercase rounded-xl border-2 border-slate-200 focus:border-blue-500 outline-none text-slate-800"
                        placeholder="5-Digit Key" value={passkeyInput} onChange={(e) => setPasskeyInput(e.target.value.toUpperCase())}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-base font-bold text-slate-700 mb-2">അഡ്മിൻ പാസ്‌വേർഡ് (Admin Password)</label>
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="password" required
                      className="w-full pl-12 pr-5 py-4 text-lg font-bold rounded-xl border-2 border-slate-200 focus:border-teal-500 outline-none text-slate-800"
                      placeholder="Enter Admin Password" value={passkeyInput} onChange={(e) => setPasskeyInput(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <button type="submit" className={`w-full text-white text-lg font-bold py-4 px-4 rounded-xl transition-all flex justify-center items-center gap-3 hover:-translate-y-0.5 shadow-lg ${loginTab === 'college' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' : 'bg-teal-600 hover:bg-teal-700 shadow-teal-200'}`}>
                <LogIn className="w-6 h-6" /> {loginTab === 'college' ? 'കോളേജ് ലോഗിൻ' : 'അഡ്മിൻ ലോഗിൻ'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'admin') {
    const totalColleges = COLLEGES.length;
    const submittedCount = allSubmissions.length;
    
    // Aggregated Metrics
    const totalStudents = allSubmissions.reduce((acc, curr) => acc + (parseInt(curr.q6_data_collected) || 0), 0);
    const totalReferrals = allSubmissions.reduce((acc, curr) => acc + (parseInt(curr.q15_referral_count) || 0), 0);
    const totalHouses = allSubmissions.reduce((acc, curr) => acc + (parseInt(curr.q7_houses_covered) || 0), 0);
    const totalCallTeamReady = allSubmissions.filter(c => c.q16_call_team_ready === 'Yes').length;
    const totalCallTeamMembers = allSubmissions.reduce((acc, curr) => acc + (parseInt(curr.q16_call_team_count) || 0), 0);
    const videoBrochureAdopted = allSubmissions.filter(c => c.q17_video_brochure === 'Yes').length;
    const totalMeetingsConducted = allSubmissions.reduce((acc, curr) => acc + (curr.q5_meetings?.filter(m => m.date).length || 0), 0);

    const avgOrbit = submittedCount ? Math.round(allSubmissions.reduce((acc, curr) => acc + (parseInt(curr.q8_orbit_participation) || 0), 0) / submittedCount) : 0;
    const avgMgt = submittedCount ? (allSubmissions.reduce((acc, curr) => acc + (parseInt(curr.q10_management_rating) || 0), 0) / submittedCount).toFixed(1) : 0;

    // Percentages
    const percCommittee = submittedCount ? Math.round((allSubmissions.filter(d => d.q1_committee_formed === 'Yes').length / submittedCount) * 100) : 0;
    const percHelpDesk = submittedCount ? Math.round((allSubmissions.filter(d => d.q4_help_desk_formed === 'Yes').length / submittedCount) * 100) : 0;
    const percDoorToDoor = submittedCount ? Math.round((allSubmissions.filter(d => d.q7_door_to_door === 'Yes').length / submittedCount) * 100) : 0;
    const percSocial = submittedCount ? Math.round((allSubmissions.filter(d => d.q3_instagram || d.q3_facebook || d.q3_has_youtube || d.q3_has_twitter).length / submittedCount) * 100) : 0;

    const top5 = allSubmissions.slice(0, 5);
    const bottom5 = [...allSubmissions].reverse().slice(0, 5).filter(d => d.score > 0);

    // Extracting Suggestions & Plans
    const allPlans = allSubmissions.flatMap(c => 
       (c.q19_future_plans || []).map(plan => ({ college: c.institutionName, text: plan }))
    ).filter(p => p.text && p.text.trim() !== '');

    const allSuggestions = allSubmissions.map(c => 
       ({ college: c.institutionName, text: c.q18_expected_support })
    ).filter(s => s.text && s.text.trim() !== '');

    return (
      <div className="min-h-screen bg-slate-50 pb-24" style={{ fontFamily: "'Inter', 'Anek Malayalam', sans-serif" }}>
        {/* CSS for Printing PDF */}
        <style>{`
          @media print {
            .no-print { display: none !important; }
            body { background-color: white !important; }
            main { padding: 0 !important; max-width: 100% !important; margin: 0 !important; }
            .shadow-sm, .shadow-md, .shadow-lg, .shadow-2xl { box-shadow: none !important; }
            .border { border-color: #e2e8f0 !important; }
            .print-break-inside-avoid { page-break-inside: avoid; }
            * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
            .h-[500px] { height: auto !important; max-height: none !important; overflow: visible !important; }
            .overflow-y-auto { overflow: visible !important; }
          }
        `}</style>

        <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-md no-print">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-7 h-7 text-teal-400" />
              <h1 className="font-bold text-xl">Admin Dashboard & Analytics</h1>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-colors">
                <Printer className="w-4 h-4" /> Print Report
              </button>
              <button onClick={() => setShowClearModal(true)} className="bg-red-600/20 hover:bg-red-600/40 text-red-200 hover:text-white border border-red-500/50 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-colors">
                <Trash2 className="w-4 h-4" /> Clear Data
              </button>
              <button onClick={handleLogout} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-colors">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </header>

        {/* Clear Data Verification Modal */}
        {showClearModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 no-print">
             <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-red-600 flex items-center gap-2"><AlertOctagon className="w-6 h-6" /> ഡാറ്റ ഡിലീറ്റ് ചെയ്യുക!</h3>
                    <button onClick={() => { setShowClearModal(false); setClearVerifyText(''); }} className="p-1 hover:bg-slate-100 rounded-full"><X className="w-6 h-6 text-slate-500" /></button>
                 </div>
                 <div className="bg-red-50 p-4 rounded-xl border border-red-100 mb-5">
                    <p className="text-red-800 text-sm font-semibold leading-relaxed">
                      മുന്നറിയിപ്പ്: ഇത് ഫയർബേസിലുള്ള എല്ലാ കോളേജുകളുടെയും ഡാറ്റ പൂർണ്ണമായും മായ്ച്ചു കളയും. ടെസ്റ്റിംഗ് കഴിഞ്ഞ ശേഷം സിസ്റ്റം ഫ്രഷ് ആക്കാൻ മാത്രം ഇത് ഉപയോഗിക്കുക.
                    </p>
                 </div>
                 <p className="text-slate-800 font-bold mb-2 text-sm">തുടരാൻ താഴെ <span className="text-red-600 select-none bg-red-100 px-1.5 py-0.5 rounded">DeLeTe</span> എന്ന് കൃത്യമായി ടൈപ്പ് ചെയ്യുക:</p>
                 <input 
                    type="text" 
                    value={clearVerifyText} 
                    onChange={e => setClearVerifyText(e.target.value)} 
                    placeholder="Type DeLeTe here"
                    className="w-full border-2 border-slate-200 focus:border-red-500 p-3 rounded-lg mb-5 outline-none font-bold text-slate-800" 
                 />
                 <button 
                    disabled={clearVerifyText !== 'DeLeTe' || isClearing} 
                    onClick={handleClearAllData} 
                    className="w-full bg-red-600 text-white p-3.5 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                 >
                    {isClearing ? <><Loader2 className="w-5 h-5 animate-spin" /> Clearing Data...</> : <><Trash2 className="w-5 h-5" /> Permanently Delete All Data</>}
                 </button>
             </div>
          </div>
        )}

        <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
          <div className="hidden print-only mb-6 text-center">
             <h1 className="text-2xl font-extrabold text-slate-900">Wafy Wafiyya Entrance</h1>
             <p className="text-slate-500 font-semibold">Admission Drive Performance Report</p>
          </div>

          {isLoadingData ? (
             <div className="flex justify-center py-20 no-print"><Loader2 className="w-12 h-12 text-teal-600 animate-spin" /></div>
          ) : (
            <>
              {/* Detailed Top Stats Grid (8 Cards) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 print-break-inside-avoid">
                <StatCard icon={Target} title="Total Referrals (Adm.)" value={totalReferrals} color="bg-emerald-500" />
                <StatCard icon={Users} title="Total Data Collected" value={totalStudents} color="bg-blue-500" />
                <StatCard icon={Building2} title="Colleges Submitted" value={`${submittedCount} / ${totalColleges}`} color="bg-purple-500" />
                <StatCard icon={MapPin} title="Total Houses Covered" value={totalHouses} color="bg-orange-500" />
                
                <StatCard icon={Headset} title="Call Team Members" value={totalCallTeamMembers} subText={`${totalCallTeamReady} Teams Ready`} color="bg-indigo-500" />
                <StatCard icon={Calendar} title="Total Meetings Held" value={totalMeetingsConducted} color="bg-rose-500" />
                <StatCard icon={Video} title="Video Brochures" value={videoBrochureAdopted} subText={`Colleges adopted`} color="bg-pink-500" />
                <StatCard icon={Activity} title="Avg. Orbit Particip." value={`${avgOrbit}%`} color="bg-teal-500" />
              </div>

              {/* Line Graph: Performance Curve */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-6 print-break-inside-avoid">
                 <div className="flex items-center gap-3 mb-6">
                    <TrendingUp className="w-6 h-6 text-indigo-600" />
                    <h2 className="font-bold text-slate-800 text-lg">Overall Performance Curve (Rank vs Score)</h2>
                 </div>
                 {allSubmissions.length > 0 ? (
                    <PerformanceGraph data={allSubmissions} />
                 ) : (
                    <p className="text-center text-slate-500 py-10">No data available for graph.</p>
                 )}
              </div>

              {/* Ranks & Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print-break-inside-avoid">
                {/* Toppers */}
                <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                  <div className="bg-emerald-50 border-b border-emerald-100 p-5 flex items-center gap-3">
                    <Trophy className="w-6 h-6 text-emerald-600" />
                    <h2 className="font-bold text-emerald-900 text-lg">Toppers (Top 5)</h2>
                  </div>
                  <div className="p-0 flex-1">
                    {top5.length ? top5.map((college, i) => (
                      <div key={college.id} className="flex justify-between items-center p-4 border-b border-slate-100 hover:bg-slate-50">
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${i === 0 ? 'bg-yellow-100 text-yellow-700' : i === 1 ? 'bg-slate-200 text-slate-700' : i === 2 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-50 text-emerald-600'}`}>
                            {i + 1}
                          </span>
                          <div>
                            <p className="font-bold text-slate-800 text-sm truncate max-w-[170px]" title={college.institutionName}>{college.institutionName}</p>
                            <p className="text-xs text-slate-500">{college.q15_referral_count || 0} Referrals</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-emerald-600">{college.score} pts</span>
                        </div>
                      </div>
                    )) : <p className="p-5 text-slate-500 text-sm text-center">No data yet.</p>}
                  </div>
                </div>

                {/* Core Metrics */}
                <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                  <div className="bg-blue-50 border-b border-blue-100 p-5 flex items-center gap-3">
                    <Activity className="w-6 h-6 text-blue-600" />
                    <h2 className="font-bold text-blue-900 text-lg">Action Completion Rates</h2>
                  </div>
                  <div className="p-6 space-y-6 flex-1">
                    <ProgressBar label="Committee Formed" percentage={percCommittee} color="bg-sky-500" />
                    <ProgressBar label="Help Desk Setup" percentage={percHelpDesk} color="bg-blue-500" />
                    <ProgressBar label="Door-to-Door Campaign" percentage={percDoorToDoor} color="bg-indigo-500" />
                    <ProgressBar label="Social Media Activity" percentage={percSocial} color="bg-purple-500" />
                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                       <div>
                         <p className="text-sm text-slate-500 font-semibold">Avg Mgt Rating</p>
                         <p className="text-xl font-bold text-slate-800">{avgMgt} / 10</p>
                       </div>
                       <div>
                         <p className="text-sm text-slate-500 font-semibold">Avg Orbit %</p>
                         <p className="text-xl font-bold text-slate-800">{avgOrbit}%</p>
                       </div>
                    </div>
                  </div>
                </div>

                {/* Needs Attention */}
                <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                  <div className="bg-red-50 border-b border-red-100 p-5 flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                    <h2 className="font-bold text-red-900 text-lg">Needs Attention</h2>
                  </div>
                  <div className="p-0 flex-1">
                     {bottom5.length ? bottom5.map((college, i) => (
                      <div key={college.id} className="flex justify-between items-center p-4 border-b border-slate-100 hover:bg-red-50/30">
                        <div>
                          <p className="font-bold text-slate-800 text-sm truncate max-w-[190px]" title={college.institutionName}>{college.institutionName}</p>
                          <p className="text-xs text-red-500 font-medium">Rank: {college.rank}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-red-600">{college.score} pts</span>
                        </div>
                      </div>
                    )) : <p className="p-5 text-slate-500 text-sm text-center">No sufficient data.</p>}
                  </div>
                </div>
              </div>

              {/* Suggestions & Plans Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print-break-inside-avoid">
                 {/* Future Plans */}
                 <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[500px]">
                    <div className="bg-amber-50 border-b border-amber-100 p-5 flex items-center gap-3">
                      <Lightbulb className="w-6 h-6 text-amber-600" />
                      <h2 className="font-bold text-amber-900 text-lg">Future Plans Added by Colleges</h2>
                      <span className="ml-auto bg-amber-200 text-amber-800 py-0.5 px-2 rounded-full text-xs font-bold">{allPlans.length}</span>
                    </div>
                    <div className="p-5 overflow-y-auto space-y-4 flex-1 bg-slate-50/50">
                       {allPlans.length > 0 ? allPlans.map((plan, i) => (
                          <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                             <p className="text-xs font-bold text-amber-600 mb-1">{plan.college}</p>
                             <p className="text-sm text-slate-700 leading-relaxed">{plan.text}</p>
                          </div>
                       )) : <p className="text-slate-500 text-sm text-center py-10">No future plans submitted yet.</p>}
                    </div>
                 </div>

                 {/* Suggestions/Expected Support */}
                 <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[500px]">
                    <div className="bg-sky-50 border-b border-sky-100 p-5 flex items-center gap-3">
                      <MessageSquare className="w-6 h-6 text-sky-600" />
                      <h2 className="font-bold text-sky-900 text-lg">Suggestions & Expected Support</h2>
                      <span className="ml-auto bg-sky-200 text-sky-800 py-0.5 px-2 rounded-full text-xs font-bold">{allSuggestions.length}</span>
                    </div>
                    <div className="p-5 overflow-y-auto space-y-4 flex-1 bg-slate-50/50">
                       {allSuggestions.length > 0 ? allSuggestions.map((sug, i) => (
                          <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                             <p className="text-xs font-bold text-sky-600 mb-1">{sug.college}</p>
                             <p className="text-sm text-slate-700 leading-relaxed">{sug.text}</p>
                          </div>
                       )) : <p className="text-slate-500 text-sm text-center py-10">No suggestions submitted yet.</p>}
                    </div>
                 </div>
              </div>

              {/* Full College Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden print-break-inside-avoid">
                 <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="font-bold text-slate-800 text-lg">All Colleges Detailed Performance</h2>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                       <thead>
                          <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                             <th className="p-4 font-bold">Rank</th>
                             <th className="p-4 font-bold">Institution</th>
                             <th className="p-4 font-bold text-right">Total Score</th>
                             <th className="p-4 font-bold text-right">Referrals</th>
                             <th className="p-4 font-bold text-right">Data Col.</th>
                             <th className="p-4 font-bold text-right">Orbit %</th>
                             <th className="p-4 font-bold text-center">Help Desk</th>
                          </tr>
                       </thead>
                       <tbody className="text-sm">
                          {allSubmissions.map((c) => (
                             <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50">
                                <td className="p-4 font-bold text-slate-700">#{c.rank}</td>
                                <td className="p-4 font-bold text-slate-800 max-w-[250px] truncate" title={c.institutionName}>{c.institutionName}</td>
                                <td className="p-4 font-bold text-teal-600 text-right">{c.score}</td>
                                <td className="p-4 font-medium text-slate-600 text-right">{c.q15_referral_count || 0}</td>
                                <td className="p-4 font-medium text-slate-600 text-right">{c.q6_data_collected || 0}</td>
                                <td className="p-4 font-medium text-slate-600 text-right">{c.q8_orbit_participation || 0}%</td>
                                <td className="p-4 text-center">
                                  {c.q4_help_desk_formed === 'Yes' ? <span className="text-emerald-500 font-bold">✓</span> : <span className="text-red-400 font-bold">✗</span>}
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>

            </>
          )}
        </main>
      </div>
    );
  }

  // --- College Form View ---
  let myRank = null;
  let totalRanked = allSubmissions.length;
  if (allSubmissions.length > 0 && activeCollege) {
      const found = allSubmissions.find(d => d.id === activeCollege.id);
      if (found) myRank = found.rank;
  }
  const showWarning = myRank && totalRanked > 3 && (myRank > totalRanked * 0.6);

  return (
    <div className="min-h-screen bg-slate-50 pb-24" style={{ fontFamily: "'Inter', 'Anek Malayalam', sans-serif" }}>
      <style>{`
        .custom-slider { -webkit-appearance: none; width: 100%; height: 8px; border-radius: 4px; outline: none; }
        .custom-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 28px; height: 28px; border-radius: 50%; background: #7c3aed; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.3); border: 2px solid white; }
        .custom-slider::-moz-range-thumb { width: 28px; height: 28px; border-radius: 50%; background: #7c3aed; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.3); border: 2px solid white; }
      `}</style>

      <header className="bg-gradient-to-r from-blue-600 to-teal-600 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Award className="w-7 h-7 text-teal-100 flex-shrink-0" />
            <h1 className="font-bold text-lg leading-tight hidden sm:block truncate max-w-sm" title={activeCollege.name}>
              {activeCollege.name}
            </h1>
            <h1 className="font-bold text-xl sm:hidden">Drive Tracker</h1>
          </div>
          <div className="flex items-center gap-4">
            {autoSaveStatus && (
               <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-black/20 rounded-full text-sm font-semibold">
                 {autoSaveStatus === 'Saving...' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CloudLightning className="w-4 h-4 text-yellow-300" />}
                 {autoSaveStatus}
               </div>
            )}
            <button onClick={handleLogout} className="text-teal-50 hover:text-white transition-colors flex items-center gap-2 text-base font-semibold bg-white/10 px-4 py-1.5 rounded-full hover:bg-white/20 whitespace-nowrap">
              <LogOut className="w-5 h-5" /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Dynamic Performance Banner */}
        {!isLoadingData && myRank && (
          <div className={`mb-8 p-5 rounded-2xl border ${showWarning ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'} shadow-sm flex flex-col md:flex-row items-center justify-between gap-4`}>
             <div className="flex items-center gap-4">
               <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${showWarning ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                 <Trophy className="w-7 h-7" />
               </div>
               <div>
                 <h3 className={`text-sm font-bold uppercase tracking-wider ${showWarning ? 'text-red-800' : 'text-emerald-800'}`}>നിങ്ങളുടെ നിലവിലെ റാങ്ക്</h3>
                 <p className={`text-3xl font-extrabold ${showWarning ? 'text-red-600' : 'text-emerald-600'}`}>
                   {myRank} <span className="text-lg font-medium opacity-70">/ {COLLEGES.length}</span>
                 </p>
               </div>
             </div>
             {showWarning && (
                <div className="bg-white/80 p-3 rounded-xl flex-1 border border-red-100 text-red-800 text-sm font-semibold leading-relaxed flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p>ശ്രദ്ധിക്കുക: നിങ്ങളുടെ സ്ഥാപനത്തിന്റെ പ്രകടനം നിലവിൽ പിന്നിലാണ്. കൂടുതൽ അഡ്മിഷനുകൾക്കും (Referrals) ഡാറ്റാ ശേഖരണത്തിനും ശ്രദ്ധ നൽകുക! നിങ്ങളുടെ റാങ്ക് ഉയർത്താം.</p>
                </div>
             )}
             {!showWarning && (
                <div className="bg-white/80 p-3 rounded-xl flex-1 border border-emerald-100 text-emerald-800 text-sm font-semibold leading-relaxed flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p>അഭിനന്ദനങ്ങൾ! നിങ്ങളുടെ അഡ്മിഷൻ പ്രവർത്തനങ്ങൾ മികച്ച രീതിയിൽ പുരോഗമിക്കുന്നു. ഈ നിലവാരം തുടരുക.</p>
                </div>
             )}
          </div>
        )}

        {isLoadingData ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-teal-600 animate-spin mb-4" />
            <p className="text-slate-600 font-bold text-lg">വിവരങ്ങൾ ലോഡ് ചെയ്യുന്നു...</p>
          </div>
        ) : (
          <form onSubmit={handleManualSave} className="space-y-10">
            
            <Section 
              title="സമിതി & ഹെൽപ്പ് ഡെസ്ക്" 
              icon={<Users className="w-7 h-7 text-blue-600"/>}
              themeClasses="border-blue-100 bg-white"
              headerClasses="bg-blue-50/80 border-b border-blue-100 text-blue-900"
            >
              <RadioGroup 
                label="സ്ഥാപനത്തിൽ അഡ്മിഷൻ പ്രചരണ സമിതി രൂപീകരണം നടന്നോ?"
                name="q1_committee_formed"
                value={formData.q1_committee_formed}
                onChange={handleChange}
                options={['Yes', 'No']}
                accentColor="peer-checked:border-blue-600"
                dotColor="bg-blue-600"
              />
              
              {formData.q1_committee_formed === 'Yes' && (
                <div className="mt-6 p-5 bg-blue-50/50 rounded-xl space-y-5 border border-blue-100">
                  <h4 className="font-bold text-blue-900 text-base mb-2">സമിതിയുടെ വിവരങ്ങൾ</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <TextInput label="Chairman" name="q2_chairman" value={formData.q2_chairman} onChange={handleChange} focusClass="focus:ring-blue-500 focus:border-blue-500"/>
                    <TextInput label="Convener" name="q2_convener" value={formData.q2_convener} onChange={handleChange} focusClass="focus:ring-blue-500 focus:border-blue-500"/>
                    <TextInput label="Member 1" name="q2_member1" value={formData.q2_member1} onChange={handleChange} focusClass="focus:ring-blue-500 focus:border-blue-500"/>
                    <TextInput label="Member 2" name="q2_member2" value={formData.q2_member2} onChange={handleChange} focusClass="focus:ring-blue-500 focus:border-blue-500"/>
                    <TextInput label="Member 3" name="q2_member3" value={formData.q2_member3} onChange={handleChange} focusClass="focus:ring-blue-500 focus:border-blue-500"/>
                  </div>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-blue-50">
                <RadioGroup 
                  label="ഹെൽപ്പ് ഡെസ്ക് രൂപീകരിച്ചോ?"
                  name="q4_help_desk_formed"
                  value={formData.q4_help_desk_formed}
                  onChange={handleChange}
                  options={['Yes', 'No']}
                  accentColor="peer-checked:border-blue-600"
                  dotColor="bg-blue-600"
                />
                
                {formData.q4_help_desk_formed === 'Yes' && (
                  <div className="mt-4">
                    <DynamicList 
                      label="Contact Numbers"
                      values={formData.q4_contact_numbers}
                      onChange={(v) => handleArrayChange('q4_contact_numbers', v)}
                      type="tel"
                      placeholder="e.g. 9876543210"
                      addText="പുതിയ നമ്പർ ചേർക്കുക (Add Number)"
                      theme="blue"
                    />
                  </div>
                )}
              </div>
            </Section>

            <Section 
              title="സോഷ്യൽ മീഡിയ പേജുകൾ" 
              icon={<Share2 className="w-7 h-7 text-teal-600"/>}
              themeClasses="border-teal-100 bg-white"
              headerClasses="bg-teal-50/80 border-b border-teal-100 text-teal-900"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <TextInput label="Instagram ID/Link" name="q3_instagram" value={formData.q3_instagram} onChange={handleChange} focusClass="focus:ring-teal-500 focus:border-teal-500"/>
                <TextInput label="Facebook ID/Link" name="q3_facebook" value={formData.q3_facebook} onChange={handleChange} focusClass="focus:ring-teal-500 focus:border-teal-500"/>
              </div>

              <div className="mt-6 pt-5 border-t border-teal-50">
                <label className="block text-base font-bold text-slate-700 mb-3">Other IDs (മറ്റ് പ്ലാറ്റ്ഫോമുകൾ ഉപയോഗിക്കുന്നുണ്ടെങ്കിൽ ടിക്ക് ചെയ്യുക)</label>
                <div className="flex flex-wrap gap-4 mb-5">
                   <label className="flex items-center gap-2 cursor-pointer bg-teal-50 px-4 py-2 rounded-lg border border-teal-100 hover:bg-teal-100">
                     <input type="checkbox" name="q3_has_youtube" checked={formData.q3_has_youtube} onChange={handleChange} className="w-4 h-4 text-teal-600 rounded" />
                     <span className="font-semibold text-teal-900">YouTube</span>
                   </label>
                   <label className="flex items-center gap-2 cursor-pointer bg-teal-50 px-4 py-2 rounded-lg border border-teal-100 hover:bg-teal-100">
                     <input type="checkbox" name="q3_has_twitter" checked={formData.q3_has_twitter} onChange={handleChange} className="w-4 h-4 text-teal-600 rounded" />
                     <span className="font-semibold text-teal-900">Twitter (X)</span>
                   </label>
                   <label className="flex items-center gap-2 cursor-pointer bg-teal-50 px-4 py-2 rounded-lg border border-teal-100 hover:bg-teal-100">
                     <input type="checkbox" name="q3_has_linkedin" checked={formData.q3_has_linkedin} onChange={handleChange} className="w-4 h-4 text-teal-600 rounded" />
                     <span className="font-semibold text-teal-900">LinkedIn</span>
                   </label>
                   <label className="flex items-center gap-2 cursor-pointer bg-teal-50 px-4 py-2 rounded-lg border border-teal-100 hover:bg-teal-100">
                     <input type="checkbox" name="q3_has_others" checked={formData.q3_has_others} onChange={handleChange} className="w-4 h-4 text-teal-600 rounded" />
                     <span className="font-semibold text-teal-900">Others</span>
                   </label>
                </div>

                <div className="space-y-4">
                  {formData.q3_has_youtube && (
                    <DynamicList label="YouTube Links" values={formData.q3_youtube_links} onChange={(v) => handleArrayChange('q3_youtube_links', v)} type="url" placeholder="https://youtube.com/..." theme="teal" addText="Add Link"/>
                  )}
                  {formData.q3_has_twitter && (
                    <DynamicList label="Twitter Links" values={formData.q3_twitter_links} onChange={(v) => handleArrayChange('q3_twitter_links', v)} type="url" placeholder="https://twitter.com/..." theme="teal" addText="Add Link"/>
                  )}
                  {formData.q3_has_linkedin && (
                    <DynamicList label="LinkedIn Links" values={formData.q3_linkedin_links} onChange={(v) => handleArrayChange('q3_linkedin_links', v)} type="url" placeholder="https://linkedin.com/..." theme="teal" addText="Add Link"/>
                  )}
                  {formData.q3_has_others && (
                    <DynamicList label="Other Links" values={formData.q3_other_links} onChange={(v) => handleArrayChange('q3_other_links', v)} type="url" placeholder="https://..." theme="teal" addText="Add Link"/>
                  )}
                </div>
              </div>
              
              <div className="mt-8 border-t border-teal-50 pt-5">
                <DynamicList 
                  label="പ്രചരണത്തിൻ്റെ ഭാഗമായി സ്ഥാപനം പുറത്തിറക്കിയ സോഷ്യൽ മീഡിയ പോസ്റ്റുകളുടെ ലിങ്കുകൾ നൽകാം."
                  icon={Megaphone}
                  values={formData.q14_social_media_posts}
                  onChange={(v) => handleArrayChange('q14_social_media_posts', v)}
                  type="url"
                  placeholder="https://..."
                  addText="പുതിയ പോസ്റ്റ് ലിങ്ക് ചേർക്കുക (Add Post Link)"
                  theme="teal"
                />
              </div>
            </Section>

            <Section 
              title="പ്രവർത്തനങ്ങൾ & ക്യാമ്പയിൻ" 
              icon={<Megaphone className="w-7 h-7 text-purple-600"/>}
              themeClasses="border-purple-100 bg-white"
              headerClasses="bg-purple-50/80 border-b border-purple-100 text-purple-900"
            >
              <div className="space-y-8">
                <div className="p-5 rounded-xl border bg-purple-50/50 border-purple-100">
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="w-6 h-6 text-purple-600" />
                    <h4 className="font-bold text-purple-900 text-base leading-relaxed">പ്രചരണ പ്രവർത്തനങ്ങൾ വിലയിരുത്താനായി കൂടിയ മീറ്റിങ്ങുകളുടെ വിവരങ്ങൾ (Max 6 Counted for Rank)</h4>
                  </div>
                  <div className="space-y-4">
                    {formData.q5_meetings.map((meeting, index) => (
                      <div key={index} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                        <div className="flex-1 w-full">
                          <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">തിയ്യതി (Date)</label>
                          <input
                            type="date"
                            value={meeting.date}
                            onChange={(e) => handleMeetingChange(index, 'date', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-base text-slate-800 bg-white shadow-sm"
                          />
                        </div>
                        <div className="flex-1 w-full">
                           <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">പങ്കെടുത്തവർ (No. of Persons)</label>
                          <input
                            type="number"
                            min="0"
                            placeholder="എണ്ണം"
                            value={meeting.participants}
                            onChange={(e) => handleMeetingChange(index, 'participants', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-base text-slate-800 bg-white shadow-sm"
                          />
                        </div>
                        <div className="mt-5 sm:mt-6">
                           <button type="button" onClick={() => removeMeeting(index)} className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors bg-white shadow-sm" title="Remove">
                            <Trash2 className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={addMeeting} className="mt-5 flex items-center gap-2 px-5 py-3 bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold rounded-xl transition-colors border border-purple-200 text-base shadow-sm">
                    <Plus className="w-5 h-5" /> പുതിയ മീറ്റിംഗ് ചേർക്കുക (Add Meeting)
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-purple-50">
                  <TextInput label="എത്ര കുട്ടികളുടെ ഡാറ്റ കളക്ട് ചെയ്തു?" type="number" min="0" name="q6_data_collected" value={formData.q6_data_collected} onChange={handleChange} focusClass="focus:ring-purple-500 focus:border-purple-500"/>
                  <TextInput label="അതിൽ എത്ര പേരെ ഫോളോ ചെയ്തു?" type="number" min="0" name="q6_followed_up" value={formData.q6_followed_up} onChange={handleChange} focusClass="focus:ring-purple-500 focus:border-purple-500"/>
                </div>

                <div className="pt-6 border-t border-purple-50">
                  <RadioGroup 
                    label="ഫീൽഡ് വർക്ക്, ഡോർ റ്റു ഡോർ ക്യാമ്പയിൻ നടന്നോ?"
                    name="q7_door_to_door"
                    value={formData.q7_door_to_door}
                    onChange={handleChange}
                    options={['Yes', 'No']}
                    accentColor="peer-checked:border-purple-600"
                    dotColor="bg-purple-600"
                  />
                  {formData.q7_door_to_door === 'Yes' && (
                    <div className="mt-4 p-5 bg-purple-50/50 rounded-xl border border-purple-100">
                      <TextInput label="എത്ര വീടുകൾ/ ആളുകളെ കണ്ടു?" type="number" min="0" name="q7_houses_covered" value={formData.q7_houses_covered} onChange={handleChange} focusClass="focus:ring-purple-500 focus:border-purple-500"/>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-purple-50">
                  <h4 className="font-bold text-purple-900 text-lg mb-4">പ്രചരണ പ്രവർത്തനങ്ങളുമായി ബന്ധപ്പെട്ട് സംഘടിപ്പിച്ച മറ്റു പരിപാടികളുടെ വിവരങ്ങൾ</h4>
                  <div className="grid grid-cols-1 gap-5">
                    <TextInput label="പരിപാടികളുടെ എണ്ണം (Career Guidance, etc..)" type="number" min="0" name="q12_other_events_count" value={formData.q12_other_events_count} onChange={handleChange} focusClass="focus:ring-purple-500 focus:border-purple-500"/>
                    <DynamicList 
                      label="പ്രസക്തമായ ലിങ്കുകൾ (Links)"
                      values={formData.q12_other_events_links}
                      onChange={(v) => handleArrayChange('q12_other_events_links', v)}
                      type="url"
                      placeholder="https://..."
                      addText="പുതിയ ലിങ്ക് ചേർക്കുക (Add Link)"
                      theme="purple"
                    />
                  </div>
                </div>
                
                <div className="pt-6 border-t border-purple-50">
                  <RadioGroup 
                    label="കാൾ ക്യാമ്പയിന് ഉപയോഗപ്പെടുത്താൻ പറ്റിയ ടീമിനെ തയ്യാറാക്കിയിട്ടുണ്ടോ?"
                    name="q16_call_team_ready"
                    value={formData.q16_call_team_ready}
                    onChange={handleChange}
                    options={['Yes', 'No']}
                    accentColor="peer-checked:border-purple-600"
                    dotColor="bg-purple-600"
                  />
                  {formData.q16_call_team_ready === 'Yes' && (
                    <div className="mt-4 p-5 bg-purple-50/50 rounded-xl border border-purple-100">
                      <TextInput label="എത്രപേരുണ്ട്?" type="number" min="0" name="q16_call_team_count" value={formData.q16_call_team_count} onChange={handleChange} focusClass="focus:ring-purple-500 focus:border-purple-500"/>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-purple-50">
                  <RadioGroup 
                    label="സ്ഥാപനത്തെ പരിചയപ്പെടുത്തുന്ന വീഡിയോ ബ്രോഷർ പുറത്തിറക്കിയോ?"
                    name="q17_video_brochure"
                    value={formData.q17_video_brochure}
                    onChange={handleChange}
                    options={['Yes', 'No']}
                    accentColor="peer-checked:border-purple-600"
                    dotColor="bg-purple-600"
                  />
                  {formData.q17_video_brochure === 'Yes' && (
                    <div className="mt-4">
                      <DynamicList 
                        label="വീഡിയോ ലിങ്കുകൾ (Video Links)"
                        values={formData.q17_video_links}
                        onChange={(v) => handleArrayChange('q17_video_links', v)}
                        type="url"
                        placeholder="https://..."
                        addText="പുതിയ വീഡിയോ ലിങ്ക് ചേർക്കുക (Add Link)"
                        theme="purple"
                      />
                    </div>
                  )}
                </div>
              </div>
            </Section>

            <Section 
              title="ഓർബിറ്റ് & പങ്കാളിത്തം" 
              icon={<Target className="w-7 h-7 text-emerald-600"/>}
              themeClasses="border-emerald-100 bg-white"
              headerClasses="bg-emerald-50/80 border-b border-emerald-100 text-emerald-900"
            >
              <div className="space-y-8">
                <div>
                  <label className="block text-base font-bold text-emerald-900 mb-3">
                    ഓർബിറ്റ് മീറ്റിംഗ് പങ്കാളിത്തം എത്ര? <span className="inline-block bg-emerald-100 text-emerald-800 px-3 py-1 rounded-md text-sm ml-2 font-bold">{formData.q8_orbit_participation}%</span>
                  </label>
                  <div className="relative py-4">
                     <input 
                      type="range" min="0" max="100" 
                      name="q8_orbit_participation"
                      value={formData.q8_orbit_participation}
                      onChange={handleChange}
                      className="custom-slider"
                      style={{ background: `linear-gradient(to right, #7c3aed 0%, #7c3aed ${formData.q8_orbit_participation}%, #d8b4fe ${formData.q8_orbit_participation}%, #d8b4fe 100%)` }}
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-emerald-50">
                  <RadioGroup 
                    label="ഓർബിറ്റ് മീറ്റിങ്ങിൽ പങ്കെടുക്കാത്തവരെ പ്രത്യേക വിളിച്ചു കാരണം അന്വേഷിച്ചോ, നടപടിയെടുത്തോ?"
                    name="q9_orbit_absentees_followed"
                    value={formData.q9_orbit_absentees_followed}
                    onChange={handleChange}
                    options={['Yes', 'No']}
                    accentColor="peer-checked:border-emerald-600"
                    dotColor="bg-emerald-600"
                  />
                  {formData.q9_orbit_absentees_followed === 'Yes' && (
                    <div className="mt-4 p-5 bg-emerald-50/50 rounded-xl border border-emerald-100">
                      <TextArea label="കൂടുതൽ വിവരങ്ങൾ (Details)" name="q9_orbit_absentees_details" value={formData.q9_orbit_absentees_details} onChange={handleChange} focusClass="focus:ring-emerald-500 focus:border-emerald-500"/>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-emerald-50">
                  <label className="block text-base font-bold text-emerald-900 mb-3">
                    പ്രചരണ പ്രവർത്തനങ്ങളിൽ സ്ഥാപനത്തിൻറെ മാനേജ്മെൻറ് പങ്കാളിത്തം എത്ര? <span className="inline-block bg-emerald-100 text-emerald-800 px-3 py-1 rounded-md text-sm ml-2 font-bold">{formData.q10_management_rating}/10</span>
                  </label>
                  <div className="relative py-4">
                    <input 
                      type="range" min="1" max="10" 
                      name="q10_management_rating"
                      value={formData.q10_management_rating}
                      onChange={handleChange}
                      className="custom-slider"
                      style={{ background: `linear-gradient(to right, #7c3aed 0%, #7c3aed ${(formData.q10_management_rating - 1) * 11.11}%, #d8b4fe ${(formData.q10_management_rating - 1) * 11.11}%, #d8b4fe 100%)` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-emerald-600/80 mt-1 font-semibold">
                    <span>1 (Very Low)</span><span>10 (Perfect)</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-emerald-50">
                  <label className="block text-base font-bold text-emerald-900 mb-3">
                    സ്ഥാപനത്തിന്റെ അധ്യാപകരുടെ പങ്കാളിത്തം എത്ര? <span className="inline-block bg-emerald-100 text-emerald-800 px-3 py-1 rounded-md text-sm ml-2 font-bold">{formData.q11_teachers_rating}/10</span>
                  </label>
                  <div className="relative py-4">
                    <input 
                      type="range" min="1" max="10" 
                      name="q11_teachers_rating"
                      value={formData.q11_teachers_rating}
                      onChange={handleChange}
                      className="custom-slider"
                      style={{ background: `linear-gradient(to right, #7c3aed 0%, #7c3aed ${(formData.q11_teachers_rating - 1) * 11.11}%, #d8b4fe ${(formData.q11_teachers_rating - 1) * 11.11}%, #d8b4fe 100%)` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-emerald-600/80 mt-1 font-semibold">
                    <span>1 (Very Low)</span><span>10 (Perfect)</span>
                  </div>
                </div>
              </div>
            </Section>

            <Section 
              title="ഫീഡ്‌ബാക്ക് & പ്രോത്സാഹനം" 
              icon={<Phone className="w-7 h-7 text-amber-600"/>}
              themeClasses="border-amber-100 bg-white"
              headerClasses="bg-amber-50/80 border-b border-amber-100 text-amber-900"
            >
              <div className="space-y-8">
                <TextInput 
                  label="സ്ഥാപനത്തിൻറെ റഫറൽ കോഡിൽ അപേക്ഷിച്ച വിദ്യാർഥികളുടെ എണ്ണം. (Crucial for Rank)" 
                  type="number" 
                  min="0"
                  name="q15_referral_count" 
                  value={formData.q15_referral_count} 
                  onChange={handleChange} 
                  focusClass="focus:ring-amber-500 focus:border-amber-500"
                />
                
                <div className="pt-6 border-t border-amber-50">
                  <RadioGroup 
                    label="നന്നായി പ്രവർത്തിക്കുന്ന വിദ്യാർത്ഥികൾക്ക് സ്ഥാപനം എന്തെങ്കിലും പ്രോത്സാഹന പദ്ധതികൾ ഏർപ്പെടുത്തിയോ?"
                    name="q13_student_motivation_formed"
                    value={formData.q13_student_motivation_formed}
                    onChange={handleChange}
                    options={['Yes', 'No']}
                    accentColor="peer-checked:border-amber-600"
                    dotColor="bg-amber-600"
                  />
                  {formData.q13_student_motivation_formed === 'Yes' && (
                     <div className="mt-4 p-5 bg-amber-50/50 rounded-xl border border-amber-100">
                        <TextArea 
                          label="വിവരങ്ങൾ.." 
                          name="q13_student_motivation" 
                          value={formData.q13_student_motivation} 
                          onChange={handleChange} 
                          focusClass="focus:ring-amber-500 focus:border-amber-500"
                        />
                     </div>
                  )}
                </div>
                
                <div className="pt-6 border-t border-amber-50">
                  <TextArea 
                    label="എൻട്രൻസ് ബോർഡിന്റെ ഭാഗത്ത് നിന്ന് സ്ഥാപനങ്ങൾക്ക് ലഭിക്കണമെന്ന് കരുതുന്ന പിന്തുണ..?" 
                    name="q18_expected_support" 
                    value={formData.q18_expected_support} 
                    onChange={handleChange} 
                    focusClass="focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>

                <div className="pt-6 border-t border-amber-50">
                  <DynamicList 
                      label="പ്രചരണ പ്രവർത്തനങ്ങൾക്കായി തയ്യാറായിക്കൊണ്ടിരിക്കുന്ന മറ്റു പദ്ധതികൾ..?"
                      values={formData.q19_future_plans}
                      onChange={(v) => handleArrayChange('q19_future_plans', v)}
                      type="text"
                      placeholder="പദ്ധതി വിവരങ്ങൾ..."
                      addText="പുതിയ പദ്ധതി ചേർക്കുക (Add Plan)"
                      theme="amber"
                  />
                </div>
              </div>
            </Section>

            {/* Save Button */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky bottom-4 flex flex-col sm:flex-row items-center justify-between gap-5 z-40">
              <div className="text-base text-slate-500 flex-1">
                {autoSaveStatus === 'Saving...' ? (
                  <span className="flex items-center text-slate-600 font-semibold bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 inline-flex">
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Auto Saving...
                  </span>
                ) : autoSaveStatus === 'Auto-saved' || autoSaveStatus === '' ? (
                  <span className="flex items-center text-green-700 font-bold bg-green-50 px-4 py-2 rounded-xl border border-green-200 inline-flex">
                    <CheckCircle2 className="w-6 h-6 mr-2" /> വിവരങ്ങൾ സുരക്ഷിതമാണ് (Saved)
                  </span>
                ) : (
                  <span className="font-semibold text-slate-700">വിവരങ്ങൾ നൽകിയ ശേഷം സേവ് ചെയ്യാൻ മറക്കരുത്.</span>
                )}
              </div>
              <button 
                type="submit" 
                disabled={isSaving}
                className={`w-full sm:w-auto px-10 py-4 rounded-xl font-bold text-white text-lg shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-3 ${
                  isSaving ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 hover:-translate-y-1'
                }`}
              >
                {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                {isSaving ? 'Saving...' : 'Save Updates'}
              </button>
            </div>

          </form>
        )}
      </main>
    </div>
  );
}

// --- Reusable Components ---

function PerformanceGraph({ data }) {
  if(!data || data.length === 0) return null;
  const max = Math.max(...data.map(d => d.score), 10);
  const w = 800; const h = 200;
  
  const points = data.map((d, i) => {
     const x = data.length > 1 ? (i / (data.length - 1)) * w : w/2;
     const y = h - ((d.score / max) * h);
     return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="min-w-[500px]">
        <svg viewBox={`-10 -10 ${w + 20} ${h + 20}`} className="w-full h-48 overflow-visible">
          <polyline points={points} fill="none" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {data.map((d, i) => {
             const x = data.length > 1 ? (i / (data.length - 1)) * w : w/2;
             const y = h - ((d.score / max) * h);
             return (
               <g key={i}>
                 <circle cx={x} cy={y} r="5" fill="#ffffff" stroke="#4f46e5" strokeWidth="2" className="hover:r-6 cursor-pointer transition-all" />
                 <text x={x} y={y - 12} fontSize="10" fill="#64748b" textAnchor="middle" className="font-bold">{d.score}</text>
               </g>
             );
          })}
        </svg>
        <div className="flex justify-between mt-2 px-2">
          <span className="text-xs font-bold text-slate-400">Rank #1</span>
          <span className="text-xs font-bold text-slate-400">Rank #{data.length}</span>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, title, value, subText, color }) {
  return (
    <div className="bg-white p-5 lg:p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center text-white flex-shrink-0 ${color} shadow-lg shadow-slate-200`}>
        <Icon className="w-6 h-6 lg:w-7 lg:h-7" />
      </div>
      <div>
        <p className="text-xs lg:text-sm font-semibold text-slate-500">{title}</p>
        <p className="text-xl lg:text-2xl font-bold text-slate-800 leading-tight">{value}</p>
        {subText && <p className="text-[10px] lg:text-xs text-slate-400 font-medium mt-0.5">{subText}</p>}
      </div>
    </div>
  );
}

function ProgressBar({ label, percentage, color }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-bold text-slate-700">{label}</span>
        <span className="text-sm font-bold text-slate-500">{percentage}%</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2.5">
        <div className={`h-2.5 rounded-full ${color}`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}

function Section({ title, icon, children, themeClasses, headerClasses }) {
  return (
    <div className={`rounded-2xl shadow-sm border overflow-hidden ${themeClasses}`}>
      <div className={`px-7 py-5 flex items-center gap-4 ${headerClasses}`}>
        {icon}
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      <div className="p-7">
        {children}
      </div>
    </div>
  );
}

function TextInput({ label, name, value, onChange, type = "text", min, placeholder, className="", focusClass="focus:ring-indigo-500 focus:border-indigo-500" }) {
  return (
    <div className={className}>
      <label className="block text-base font-bold text-slate-700 mb-2">{label}</label>
      <input
        type={type}
        name={name}
        min={min}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-5 py-3.5 text-base rounded-xl border border-slate-300 outline-none transition-all text-slate-800 bg-slate-50 hover:bg-white focus:bg-white ${focusClass}`}
      />
    </div>
  );
}

function TextArea({ label, name, value, onChange, placeholder, rows = 3, className="", focusClass="focus:ring-indigo-500 focus:border-indigo-500" }) {
  return (
    <div className={className}>
      <label className="block text-base font-bold text-slate-700 mb-2">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-5 py-3.5 text-base rounded-xl border border-slate-300 outline-none transition-all text-slate-800 bg-slate-50 hover:bg-white focus:bg-white resize-y ${focusClass}`}
      />
    </div>
  );
}

function RadioGroup({ label, name, value, onChange, options, accentColor="peer-checked:border-indigo-600", dotColor="bg-indigo-600" }) {
  return (
    <div>
      <label className="block text-base font-bold text-slate-700 mb-3">{label}</label>
      <div className="flex flex-wrap gap-6">
        {options.map(option => (
          <label key={option} className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center">
              <input
                type="radio"
                name={name}
                value={option}
                checked={value === option}
                onChange={onChange}
                className={`peer sr-only`}
              />
              <div className={`w-6 h-6 rounded-full border-2 border-slate-300 group-hover:border-slate-400 ${accentColor} flex items-center justify-center transition-colors bg-white`}>
                <div className={`w-3 h-3 rounded-full ${dotColor} transition-transform ${value === option ? 'scale-100' : 'scale-0'}`}></div>
              </div>
            </div>
            <span className="text-slate-700 font-bold text-lg group-hover:text-slate-900 transition-colors">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function DynamicList({ label, values, onChange, type = "text", placeholder, addText = "Add", icon: Icon, theme = "indigo" }) {
  const handleChange = (index, val) => {
    const newValues = [...values];
    newValues[index] = val;
    onChange(newValues);
  };

  const handleAdd = () => onChange([...values, '']);

  const handleRemove = (index) => {
    const newValues = values.filter((_, i) => i !== index);
    if (newValues.length === 0) newValues.push('');
    onChange(newValues);
  };

  const themeClasses = {
    blue: { bg: 'bg-blue-100 hover:bg-blue-200', text: 'text-blue-800', border: 'border-blue-200', focus: 'focus:ring-blue-500 focus:border-blue-500', headerText: 'text-blue-900', icon: 'text-blue-600', container: 'bg-blue-50/50 border-blue-100' },
    teal: { bg: 'bg-teal-100 hover:bg-teal-200', text: 'text-teal-800', border: 'border-teal-200', focus: 'focus:ring-teal-500 focus:border-teal-500', headerText: 'text-teal-900', icon: 'text-teal-600', container: 'bg-teal-50/50 border-teal-100' },
    purple: { bg: 'bg-purple-100 hover:bg-purple-200', text: 'text-purple-800', border: 'border-purple-200', focus: 'focus:ring-purple-500 focus:border-purple-500', headerText: 'text-purple-900', icon: 'text-purple-600', container: 'bg-purple-50/50 border-purple-100' },
    amber: { bg: 'bg-amber-100 hover:bg-amber-200', text: 'text-amber-800', border: 'border-amber-200', focus: 'focus:ring-amber-500 focus:border-amber-500', headerText: 'text-amber-900', icon: 'text-amber-600', container: 'bg-amber-50/50 border-amber-100' },
    indigo: { bg: 'bg-indigo-100 hover:bg-indigo-200', text: 'text-indigo-800', border: 'border-indigo-200', focus: 'focus:ring-indigo-500 focus:border-indigo-500', headerText: 'text-indigo-900', icon: 'text-indigo-600', container: 'bg-indigo-50/50 border-indigo-100' },
  };
  const t = themeClasses[theme] || themeClasses.indigo;

  return (
    <div className={`p-5 rounded-xl border ${t.container}`}>
      {label && (
        <div className="flex items-center gap-3 mb-4">
          {Icon && <Icon className={`w-6 h-6 ${t.icon}`} />}
          <h4 className={`font-bold ${t.headerText} text-base leading-relaxed`}>{label}</h4>
        </div>
      )}
      
      <div className="space-y-4">
        {values.map((val, index) => (
          <div key={index} className="flex gap-3 items-start">
            <div className="flex-1">
              {type === 'text' && placeholder === 'പദ്ധതി വിവരങ്ങൾ...' ? (
                 <textarea
                   value={val}
                   onChange={(e) => handleChange(index, e.target.value)}
                   placeholder={placeholder}
                   className={`w-full px-5 py-3.5 rounded-xl border border-white focus:ring-2 ${t.focus} outline-none transition-all text-base text-slate-800 bg-white shadow-sm resize-y`}
                   rows={2}
                 />
              ) : (
                <input
                  type={type}
                  value={val}
                  onChange={(e) => handleChange(index, e.target.value)}
                  placeholder={placeholder}
                  className={`w-full px-5 py-3.5 rounded-xl border border-white focus:ring-2 ${t.focus} outline-none transition-all text-base text-slate-800 bg-white shadow-sm`}
                />
              )}
            </div>
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="p-3.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100 bg-white shadow-sm"
              title="Remove"
            >
              <Trash2 className="w-6 h-6" />
            </button>
          </div>
        ))}
      </div>
      
      <button
        type="button"
        onClick={handleAdd}
        className={`mt-5 flex items-center gap-2 px-5 py-3 ${t.bg} ${t.text} font-bold rounded-xl transition-colors border ${t.border} text-base shadow-sm`}
      >
        <Plus className="w-5 h-5" /> {addText}
      </button>
    </div>
  );
}

function SearchableSelect({ options, value, onChange, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);

  useEffect(() => {
    const selectedOption = options.find(opt => opt.id === value);
    if (selectedOption) {
      setSearchTerm(selectedOption.name);
    } else {
      setSearchTerm('');
    }
  }, [value, options]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        const selectedOption = options.find(opt => opt.id === value);
        if (selectedOption) {
          setSearchTerm(selectedOption.name);
        } else {
          setSearchTerm('');
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef, value, options]);

  const filteredOptions = options.filter(opt =>
    opt.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          className="w-full pl-12 pr-10 py-4 text-base rounded-xl border-2 border-slate-200 focus:ring-0 focus:border-teal-500 transition-all outline-none bg-white font-medium text-slate-800 placeholder-slate-400"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
            if (value && e.target.value !== options.find(o => o.id === value)?.name) {
              onChange(''); // Reset selection if typing something new
            }
          }}
          onFocus={() => setIsOpen(true)}
        />
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          <ChevronDown className="h-5 w-5 text-slate-400" />
        </div>
      </div>
      
      {isOpen && (
        <ul className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <li
                key={opt.id}
                className="px-5 py-3.5 hover:bg-teal-50 cursor-pointer text-slate-800 text-sm sm:text-base font-semibold border-b last:border-b-0 border-slate-100 transition-colors"
                onClick={() => {
                  onChange(opt.id);
                  setSearchTerm(opt.name);
                  setIsOpen(false);
                }}
              >
                {opt.name}
              </li>
            ))
          ) : (
            <li className="px-5 py-4 text-slate-500 text-base font-medium text-center">സ്ഥാപനം കണ്ടെത്താനായില്ല (No Match)</li>
          )}
        </ul>
      )}
    </div>
  );
}