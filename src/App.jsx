import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Papa from "papaparse";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, LineChart, Line, CartesianGrid
} from "recharts";

/* ═══════════════════════════════════════════════════════════════════
   NARRA HEALTH — Social Media Command Center
   Brand System: Forest + Sage + Mint palette, Albert Sans + Inter
   ═══════════════════════════════════════════════════════════════════ */

const C = {
  forest: "#283f45", sage: "#5a9a4a", mint: "#c7e995",
  warm: "#f8fdf3", gold: "#e2f5c0", text: "#1a1a1a",
  muted: "#5a6b60", border: "#d4e8c2", green: "#2d6b1a",
  red: "#b83232", paleMint: "#edf8e3", paleGold: "#f4fbee",
  white: "#ffffff",
  facebook: "#1877F2", instagram: "#E1306C", linkedin: "#0A66C2",
  youtube: "#FF0000", tiktok: "#010101", blog: "#8B6914",
};

const FONT = {
  head: "'Albert Sans', sans-serif",
  body: "'Inter', sans-serif",
};

const NARRA_LOGO = "data:image/png;base64,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";

const PLAT = {
  facebook:  { name: "Facebook",  color: C.facebook,  icon: "f",  tier: "api" },
  instagram: { name: "Instagram", color: C.instagram, icon: "◎", tier: "api" },
  linkedin:  { name: "LinkedIn",  color: C.linkedin,  icon: "in", tier: "api" },
  youtube:   { name: "YouTube",   color: C.youtube,   icon: "▷", tier: "api" },
  tiktok:    { name: "TikTok",    color: C.tiktok,    icon: "♪", tier: "csv" },
  blog:      { name: "Blog",      color: C.blog,      icon: "✎", tier: "csv" },
};

const FMT_C = {
  Carousel:"#5a9a4a", Reel:"#E1306C", Image:"#c7a035",
  Video:"#1877F2", Story:"#9B59B6", Post:"#0A66C2",
  Short:"#FF0000", Article:"#283f45",
};

// ── SEED from actual Narra Facebook CSV ──
const SEED = [
  {id:"fb-1",date:"2025-03-19",platform:"facebook",format:"Carousel",reach:4398,engagement:26,engRate:0.59,ctr:0.02,reactions:8,shares:16,comments:1,caption:"Narra Health × MactanMed partnership"},
  {id:"fb-2",date:"2025-04-02",platform:"facebook",format:"Reel",reach:283,engagement:19,engRate:6.71,ctr:0.35,reactions:6,shares:11,comments:0,caption:"Some days feel heavier than others"},
  {id:"fb-3",date:"2025-04-05",platform:"facebook",format:"Image",reach:129,engagement:6,engRate:4.65,ctr:0,reactions:5,shares:1,comments:0,caption:"Resurrection Sunday reflection"},
  {id:"fb-4",date:"2025-04-08",platform:"facebook",format:"Image",reach:362,engagement:14,engRate:3.87,ctr:0,reactions:3,shares:11,comments:0,caption:"Your everyday mental wellness companion"},
  {id:"fb-5",date:"2025-04-09",platform:"facebook",format:"Carousel",reach:69,engagement:7,engRate:10.14,ctr:2.90,reactions:4,shares:1,comments:0,caption:"Araw ng Kagitingan — everyday heroes"},
  {id:"fb-6",date:"2025-04-12",platform:"facebook",format:"Reel",reach:216,engagement:13,engRate:6.02,ctr:0,reactions:2,shares:10,comments:0,caption:"Talking to someone doesn't have to be hard"},
  {id:"fb-7",date:"2025-04-18",platform:"facebook",format:"Image",reach:292,engagement:19,engRate:6.51,ctr:0.34,reactions:3,shares:12,comments:0,caption:"Privacy and peace of mind with Narra"},
  {id:"fb-8",date:"2025-04-19",platform:"facebook",format:"Carousel",reach:525,engagement:22,engRate:4.19,ctr:0.57,reactions:4,shares:14,comments:0,caption:"Stress is normal — breathe and reset"},
  {id:"fb-9",date:"2025-04-22",platform:"facebook",format:"Reel",reach:132,engagement:18,engRate:13.64,ctr:0,reactions:4,shares:12,comments:0,caption:"Testimonial — understand myself better"},
  {id:"fb-10",date:"2025-04-30",platform:"facebook",format:"Carousel",reach:502,engagement:19,engRate:3.78,ctr:0.20,reactions:6,shares:12,comments:0,caption:"Narra Fitness — a gym for your mind"},
  {id:"fb-11",date:"2025-05-01",platform:"facebook",format:"Image",reach:292,engagement:10,engRate:3.42,ctr:0,reactions:2,shares:8,comments:0,caption:"Labor Day — take a moment to rest"},
  {id:"fb-12",date:"2025-05-05",platform:"facebook",format:"Carousel",reach:211,engagement:8,engRate:3.79,ctr:0.47,reactions:5,shares:2,comments:0,caption:"Support looks different for everyone"},
  {id:"fb-13",date:"2025-05-10",platform:"facebook",format:"Carousel",reach:269,engagement:10,engRate:3.72,ctr:0,reactions:0,shares:10,comments:0,caption:"Happy Mother's Day"},
];

// ── Utilities ──
const sum = a=>a.reduce((x,y)=>x+y,0);
const avg = a=>a.length?sum(a)/a.length:0;
const fmt = n=>n>=10000?(n/1000).toFixed(1)+"K":n>=1000?(n/1000).toFixed(1)+"K":String(Math.round(n));
const pct = n=>n.toFixed(2)+"%";
const trunc = (s,l=50)=>!s?"":s.length>l?s.slice(0,l)+"…":s;

function smartParse(text, platform) {
  const res = Papa.parse(text,{header:true,skipEmptyLines:true,transformHeader:h=>h.trim()});
  return res.data.filter(r=>{
    const d=r.DATE||r.date||r.Date||r["Post date"]||r["Published Date"];
    return d;
  }).map((r,i)=>{
    const g=(...k)=>{for(const x of k)if(r[x]!==undefined&&r[x]!=="")return r[x];return""};
    const n=v=>parseInt(String(v).replace(/,/g,""),10)||0;
    const f=v=>parseFloat(String(v).replace(/%/g,"").replace(/,/g,""))||0;
    const date=g("DATE","date","Date","Post date","Published Date","Published");
    const format=g("FORMAT","format","Format","Type","Content type","Post Type")||"Post";
    const reach=n(g("REACH","reach","Reach","Impressions","Views","views","Video views"));
    const eng=n(g("ENGAGEMENT","engagement","Engagement","Interactions","Total engagements"));
    const eR=f(g("ENGAGEMENT RATE","engagement_rate","Eng. Rate","Engagement Rate (%)"));
    const ctr=f(g("CTR","ctr","Click-through rate"));
    const reactions=n(g("REACTIONS","reactions","Likes","likes"));
    const shares=n(g("SHARES","shares","Reposts"));
    const comments=n(g("COMMENTS","comments","Comments","Replies"));
    const caption=g("CAPTION","caption","Caption","Title","title","Post text","Description").substring(0,200);
    return {
      id:`${platform}-csv-${i}`,date:date.trim(),platform,format:format.trim(),
      reach,engagement:eng||(reactions+shares+comments),
      engRate:eR||(reach>0?((eng||(reactions+shares+comments))/reach*100):0),
      ctr,reactions,shares,comments,caption:caption.trim(),
    };
  });
}

// ── STYLES ──
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Albert+Sans:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideIn{from{opacity:0;transform:translateX(-6px)}to{opacity:1;transform:translateX(0)}}
.n-card{background:${C.white};border:1.5px solid ${C.border};border-radius:12px;padding:20px;transition:box-shadow .3s,border-color .3s}
.n-card:hover{box-shadow:0 3px 18px rgba(40,63,69,.06);border-color:${C.sage}}
.upload-zone{border:2px dashed ${C.border};border-radius:12px;padding:28px;text-align:center;cursor:pointer;transition:all .25s;background:${C.paleGold}}
.upload-zone:hover,.upload-zone.drag{border-color:${C.sage};background:${C.paleMint}}
.post-row:hover{background:${C.paleGold}}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${C.border};border-radius:3px}
`;

// ── Custom Tooltip ──
function CTip({active,payload,label}){
  if(!active||!payload?.length)return null;
  return(
    <div style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:10,padding:"10px 14px",boxShadow:"0 6px 24px rgba(0,0,0,.08)"}}>
      <div style={{fontSize:11,color:C.muted,marginBottom:4,fontFamily:FONT.body}}>{label}</div>
      {payload.map((e,i)=>(
        <div key={i} style={{fontSize:12,color:e.color||C.text,fontFamily:FONT.body}}>
          {e.name}: <span style={{fontFamily:FONT.head,fontWeight:700}}>{typeof e.value==="number"&&e.value<100&&e.value%1!==0?e.value.toFixed(2)+"%":fmt(e.value)}</span>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════
export default function NarraSocialHub(){
  const [posts,setPosts]=useState(SEED);
  const [view,setView]=useState("overview");
  const [platFilter,setPlatFilter]=useState("all");
  const [search,setSearch]=useState("");
  const [sortKey,setSortKey]=useState("date");
  const [sortDir,setSortDir]=useState("desc");
  const [uploadOpen,setUploadOpen]=useState(false);
  const [uploadPlat,setUploadPlat]=useState("facebook");
  const [dragging,setDragging]=useState(false);
  const [aiInsights,setAiInsights]=useState(null);
  const [aiLoading,setAiLoading]=useState(false);
  const [dateRange,setDateRange]=useState("all");
  const fileRef=useRef(null);

  // Inject CSS
  useEffect(()=>{
    const id="narra-css";
    if(!document.getElementById(id)){const s=document.createElement("style");s.id=id;s.textContent=CSS;document.head.appendChild(s)}
  },[]);

  // Storage
  useEffect(()=>{(async()=>{try{const s=(() => { try { return { value: localStorage.getItem("narra-posts-v2") }; } catch { return null; } })();if(s?.value){const p=JSON.parse(s.value);if(Array.isArray(p)&&p.length>0)setPosts(p)}}catch{}})()},[]);
  useEffect(()=>{(async()=>{try{localStorage.setItem("narra-posts-v2", JSON.stringify(posts))}catch{}})()},[posts]);

  // CSV upload
  const handleCSV=useCallback((file)=>{
    const reader=new FileReader();
    reader.onload=e=>{
      const np=smartParse(e.target.result,uploadPlat);
      if(np.length===0){alert("No data found. Check the CSV format.");return}
      setPosts(prev=>{const f=prev.filter(p=>p.platform!==uploadPlat||!p.id.includes("-csv-"));return[...f,...np]});
      setUploadOpen(false);
    };
    reader.readAsText(file);
  },[uploadPlat]);

  // Filter by date range
  const dateFiltered=useMemo(()=>{
    if(dateRange==="all")return posts;
    const now=new Date();
    let cutoff=new Date();
    if(dateRange==="7d")cutoff.setDate(now.getDate()-7);
    else if(dateRange==="30d")cutoff.setDate(now.getDate()-30);
    else if(dateRange==="90d")cutoff.setDate(now.getDate()-90);
    return posts.filter(p=>{try{return new Date(p.date)>=cutoff}catch{return true}});
  },[posts,dateRange]);

  // Filter by platform
  const filtered=useMemo(()=>{
    let f=dateFiltered;
    if(platFilter!=="all")f=f.filter(p=>p.platform===platFilter);
    if(search){const s=search.toLowerCase();f=f.filter(p=>p.caption.toLowerCase().includes(s)||p.format.toLowerCase().includes(s)||p.platform.toLowerCase().includes(s))}
    return f;
  },[dateFiltered,platFilter,search]);

  const activePlats=useMemo(()=>[...new Set(posts.map(p=>p.platform))],[posts]);

  // Sorted for table
  const sorted=useMemo(()=>{
    const s=[...filtered];
    s.sort((a,b)=>{
      let av=a[sortKey],bv=b[sortKey];
      if(sortKey==="date"){av=new Date(av||0).getTime();bv=new Date(bv||0).getTime()}
      if(typeof av==="string")return sortDir==="asc"?av.localeCompare(bv):bv.localeCompare(av);
      return sortDir==="asc"?av-bv:bv-av;
    });
    return s;
  },[filtered,sortKey,sortDir]);

  // Metrics
  const metrics=useMemo(()=>{
    const f=filtered;
    return{
      totalPosts:f.length,totalReach:sum(f.map(p=>p.reach)),avgReach:avg(f.map(p=>p.reach)),
      totalEng:sum(f.map(p=>p.engagement)),avgEngRate:avg(f.map(p=>p.engRate)),avgCTR:avg(f.map(p=>p.ctr)),
      topPost:[...f].sort((a,b)=>b.reach-a.reach)[0],
      byFormat:Object.entries(f.reduce((a,p)=>{a[p.format]=a[p.format]||{count:0,reach:0,eng:0,engRate:[]};a[p.format].count++;a[p.format].reach+=p.reach;a[p.format].eng+=p.engagement;a[p.format].engRate.push(p.engRate);return a},{})).map(([n,d])=>({name:n,count:d.count,reach:d.reach,avgEngRate:avg(d.engRate),engagement:d.eng})),
      timeline:f.map(p=>({date:p.date,reach:p.reach,engagement:p.engagement,engRate:p.engRate})),
    };
  },[filtered]);

  // AI
  const genInsights=async()=>{
    setAiLoading(true);
    try{
      const summary=filtered.slice(0,20).map(p=>`${p.date}|${PLAT[p.platform]?.name}|${p.format}|R:${p.reach}|E:${p.engagement}(${p.engRate.toFixed(1)}%)|CTR:${p.ctr}%|"${trunc(p.caption,40)}"`).join("\n");
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:`You are a social media strategist for Narra Health, a Filipino mental health & wellness platform. Analyze performance. Give exactly 5 insights as JSON array. Each: {"title":"4-6 words","body":"2 sentences max, specific","type":"win|opportunity|warning|tip"}. Return ONLY JSON array.\n\n${summary}`}]})});
      const data=await res.json();
      const text=data.content?.map(c=>c.text||"").join("")||"";
      setAiInsights(JSON.parse(text.replace(/```json|```/g,"").trim()));
    }catch{setAiInsights([{title:"Analysis unavailable",body:"Could not generate insights right now.",type:"warning"}])}
    setAiLoading(false);
  };

  const toggleSort=(key)=>{if(sortKey===key)setSortDir(d=>d==="asc"?"desc":"asc");else{setSortKey(key);setSortDir("desc")}};

  const navItems=[
    {key:"overview",label:"Overview",icon:"◉"},
    {key:"posts",label:"All Posts",icon:"▤"},
    {key:"platforms",label:"Platforms",icon:"◫"},
    {key:"calendar",label:"Calendar",icon:"▦"},
    {key:"insights",label:"AI Insights",icon:"✦"},
    {key:"connect",label:"Connect",icon:"⟡"},
  ];

  const typeIcon={win:"✦",opportunity:"◎",warning:"△",tip:"◇"};
  const typeColor={win:C.green,opportunity:C.linkedin,warning:"#c77a00",tip:C.sage};

  // ── RENDER ──
  return(
    <div style={{minHeight:"100vh",background:C.warm,fontFamily:FONT.body,color:C.text}}>

      {/* HEADER */}
      <header style={{background:C.forest,padding:"14px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <img src={NARRA_LOGO} alt="Narra Health" style={{width:38,height:38,borderRadius:8,objectFit:"contain",mixBlendMode:"screen",filter:"brightness(1.5)"}}/>
          <div>
            <div style={{fontFamily:FONT.head,fontSize:16,fontWeight:800,color:"#fff",lineHeight:1.1}}>Narra Health</div>
            <div style={{fontSize:9.5,color:"rgba(199,233,149,0.55)",letterSpacing:"1.5px",textTransform:"uppercase",fontFamily:FONT.head,fontWeight:700}}>Social Media Command Center</div>
          </div>
        </div>
        <div style={{display:"flex",gap:3}}>
          {navItems.map(n=>(
            <button key={n.key} onClick={()=>setView(n.key)} style={{
              padding:"7px 14px",borderRadius:8,border:"none",cursor:"pointer",
              background:view===n.key?"rgba(199,233,149,0.15)":"transparent",
              color:view===n.key?C.mint:"rgba(199,233,149,0.45)",
              fontFamily:FONT.head,fontSize:12,fontWeight:700,transition:"all .2s",
              display:"flex",alignItems:"center",gap:5,
            }}><span style={{fontSize:13}}>{n.icon}</span>{n.label}</button>
          ))}
        </div>
        <button onClick={()=>setUploadOpen(true)} style={{
          padding:"8px 18px",borderRadius:8,border:`1.5px solid ${C.sage}`,cursor:"pointer",
          background:"transparent",color:C.mint,fontFamily:FONT.head,fontSize:12,fontWeight:700,
          transition:"all .2s",
        }}>+ Upload CSV</button>
      </header>

      {/* FILTERS */}
      <div style={{padding:"10px 24px",background:C.white,borderBottom:`1.5px solid ${C.border}`,display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
        <span style={{fontSize:9.5,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"1.5px",fontFamily:FONT.head,marginRight:6}}>Filter</span>
        {["all",...activePlats].map(pk=>{
          const pm=PLAT[pk];
          const active=platFilter===pk;
          return(<button key={pk} onClick={()=>setPlatFilter(pk)} style={{padding:"5px 12px",borderRadius:7,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:FONT.head,
            border:`1.5px solid ${active?(pm?.color||C.sage)+"50":C.border}`,
            background:active?(pm?.color||C.sage)+"12":"transparent",
            color:active?(pm?.color||C.sage):C.muted,transition:"all .2s",
          }}>{pk==="all"?"All":pm?.name}</button>);
        })}
        <div style={{flex:1}}/>
        <span style={{fontSize:9.5,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"1.5px",fontFamily:FONT.head,marginRight:4}}>Range</span>
        {[{k:"all",l:"All"},{k:"7d",l:"7 days"},{k:"30d",l:"30 days"},{k:"90d",l:"90 days"}].map(({k,l})=>(
          <button key={k} onClick={()=>setDateRange(k)} style={{padding:"5px 10px",borderRadius:7,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:FONT.head,
            border:`1.5px solid ${dateRange===k?C.sage+"50":C.border}`,
            background:dateRange===k?C.paleMint:"transparent",
            color:dateRange===k?C.green:C.muted,transition:"all .2s",
          }}>{l}</button>
        ))}
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search posts…"
          style={{padding:"6px 12px",borderRadius:7,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:FONT.body,width:180,background:C.paleGold,color:C.text,outline:"none"}}/>
      </div>

      {/* MAIN */}
      <main style={{padding:24,maxWidth:1260,margin:"0 auto"}}>

        {/* ═══ OVERVIEW ═══ */}
        {view==="overview"&&(
          <div style={{animation:"fadeUp .4s ease"}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(175px,1fr))",gap:12,marginBottom:22}}>
              {[
                {label:"Total Posts",value:metrics.totalPosts,sub:`across ${activePlats.length} platform${activePlats.length>1?"s":""}`,featured:true},
                {label:"Total Reach",value:fmt(metrics.totalReach),sub:`${fmt(Math.round(metrics.avgReach))} avg/post`},
                {label:"Total Engagement",value:fmt(metrics.totalEng),sub:`${pct(metrics.avgEngRate)} avg rate`},
                {label:"Avg Eng. Rate",value:pct(metrics.avgEngRate),sub:metrics.avgEngRate>3?"Above industry avg":"Room to grow",accent:true},
                {label:"Avg CTR",value:pct(metrics.avgCTR),sub:"Click-through rate"},
              ].map((m,i)=>(
                <div key={i} className="n-card" style={{
                  animation:`fadeUp .4s ease ${i*.05}s both`,padding:"16px 14px",position:"relative",overflow:"hidden",
                  background:m.featured?C.forest:m.accent?C.paleMint:C.white,
                  borderColor:m.featured?C.forest:m.accent?C.mint:C.border,
                }}>
                  <div style={{fontSize:9.5,color:m.featured?"rgba(199,233,149,0.55)":m.accent?C.sage:C.muted,textTransform:"uppercase",letterSpacing:"1px",fontFamily:FONT.head,fontWeight:700,marginBottom:6}}>{m.label}</div>
                  <div style={{fontSize:30,fontWeight:800,fontFamily:FONT.head,color:m.featured?C.mint:C.forest,lineHeight:1}}>{m.value}</div>
                  <div style={{fontSize:11,color:m.featured?"rgba(199,233,149,0.4)":C.muted,marginTop:4}}>{m.sub}</div>
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:18}}>
              <div className="n-card">
                <div style={{fontFamily:FONT.head,fontSize:13.5,fontWeight:700,color:C.forest,marginBottom:12}}>Reach Over Time</div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={metrics.timeline}>
                    <defs><linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.sage} stopOpacity={.25}/><stop offset="100%" stopColor={C.sage} stopOpacity={0}/></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
                    <XAxis dataKey="date" tick={{fontSize:9,fill:C.muted,fontFamily:FONT.body}}/>
                    <YAxis tick={{fontSize:9,fill:C.muted,fontFamily:FONT.head}}/>
                    <Tooltip content={<CTip/>}/>
                    <Area type="monotone" dataKey="reach" stroke={C.sage} strokeWidth={2.5} fill="url(#rg)" name="Reach"/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="n-card">
                <div style={{fontFamily:FONT.head,fontSize:13.5,fontWeight:700,color:C.forest,marginBottom:12}}>Engagement Rate Trend</div>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={metrics.timeline}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
                    <XAxis dataKey="date" tick={{fontSize:9,fill:C.muted}}/>
                    <YAxis tick={{fontSize:9,fill:C.muted,fontFamily:FONT.head}} unit="%"/>
                    <Tooltip content={<CTip/>}/>
                    <Line type="monotone" dataKey="engRate" stroke={C.instagram} strokeWidth={2.5} dot={{fill:C.instagram,r:3}} name="Eng. Rate"/>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <div className="n-card">
                <div style={{fontFamily:FONT.head,fontSize:13.5,fontWeight:700,color:C.forest,marginBottom:12}}>Performance by Format</div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={metrics.byFormat} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false}/>
                    <XAxis type="number" tick={{fontSize:9,fill:C.muted,fontFamily:FONT.head}}/>
                    <YAxis dataKey="name" type="category" tick={{fontSize:11,fill:C.forest,fontFamily:FONT.head,fontWeight:600}} width={65}/>
                    <Tooltip content={<CTip/>}/>
                    <Bar dataKey="reach" name="Total Reach" radius={[0,6,6,0]} fill={C.sage}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="n-card">
                <div style={{fontFamily:FONT.head,fontSize:13.5,fontWeight:700,color:C.forest,marginBottom:12}}>Top Posts by Reach</div>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {[...filtered].sort((a,b)=>b.reach-a.reach).slice(0,5).map((p,i)=>(
                    <div key={p.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",borderRadius:8,
                      background:i===0?C.paleGold:"transparent",border:`1px solid ${i===0?C.mint:"transparent"}`,animation:`slideIn .3s ease ${i*.04}s both`,
                    }}>
                      <div style={{width:22,height:22,borderRadius:5,background:(PLAT[p.platform]?.color||C.muted)+"15",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:PLAT[p.platform]?.color,fontWeight:800,fontFamily:FONT.head}}>{i+1}</div>
                      <span style={{fontSize:9.5,padding:"2px 7px",borderRadius:5,background:(FMT_C[p.format]||C.muted)+"12",color:FMT_C[p.format]||C.muted,fontWeight:700,fontFamily:FONT.head}}>{p.format}</span>
                      <div style={{flex:1,fontSize:12,color:C.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{trunc(p.caption,35)}</div>
                      <div style={{fontFamily:FONT.head,fontSize:13,fontWeight:800,color:C.forest}}>{fmt(p.reach)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ ALL POSTS ═══ */}
        {view==="posts"&&(
          <div style={{animation:"fadeUp .4s ease"}}>
            <div className="n-card" style={{padding:0,overflow:"hidden"}}>
              <div style={{padding:"16px 20px",borderBottom:`1.5px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{fontFamily:FONT.head,fontSize:14,fontWeight:700,color:C.forest}}>All Posts <span style={{fontSize:12,color:C.muted,fontWeight:400}}>({sorted.length})</span></div>
                <div style={{fontSize:10,color:C.muted,fontFamily:FONT.head}}>Click column headers to sort</div>
              </div>
              {/* Header */}
              <div style={{display:"grid",gridTemplateColumns:"90px 55px 65px 1fr 75px 75px 75px 65px",gap:8,padding:"8px 16px",fontSize:9.5,color:C.muted,textTransform:"uppercase",letterSpacing:"1px",fontWeight:700,fontFamily:FONT.head,borderBottom:`1px solid ${C.gold}`,background:C.paleGold,cursor:"pointer"}}>
                <span onClick={()=>toggleSort("date")}>Date {sortKey==="date"?(sortDir==="desc"?"↓":"↑"):""}</span>
                <span>Plat</span>
                <span>Format</span>
                <span>Caption</span>
                <span onClick={()=>toggleSort("reach")} style={{textAlign:"right"}}>Reach {sortKey==="reach"?(sortDir==="desc"?"↓":"↑"):""}</span>
                <span onClick={()=>toggleSort("engagement")} style={{textAlign:"right"}}>Eng {sortKey==="engagement"?(sortDir==="desc"?"↓":"↑"):""}</span>
                <span onClick={()=>toggleSort("engRate")} style={{textAlign:"right"}}>Eng % {sortKey==="engRate"?(sortDir==="desc"?"↓":"↑"):""}</span>
                <span onClick={()=>toggleSort("ctr")} style={{textAlign:"right"}}>CTR {sortKey==="ctr"?(sortDir==="desc"?"↓":"↑"):""}</span>
              </div>
              <div style={{maxHeight:480,overflowY:"auto"}}>
                {sorted.map((p,i)=>(
                  <div key={p.id} className="post-row" style={{display:"grid",gridTemplateColumns:"90px 55px 65px 1fr 75px 75px 75px 65px",gap:8,padding:"10px 16px",alignItems:"center",borderBottom:`1px solid ${C.gold}`,animation:`fadeUp .2s ease ${i*.015}s both`,transition:"background .15s"}}>
                    <span style={{fontSize:11,color:C.muted,fontFamily:FONT.head,fontWeight:600}}>{p.date}</span>
                    <span style={{fontSize:9,padding:"2px 5px",borderRadius:4,fontWeight:800,background:(PLAT[p.platform]?.color||C.muted)+"12",color:PLAT[p.platform]?.color||C.muted,textAlign:"center",fontFamily:FONT.head}}>{PLAT[p.platform]?.icon||"?"}</span>
                    <span style={{fontSize:10,padding:"2px 6px",borderRadius:5,background:(FMT_C[p.format]||C.muted)+"12",color:FMT_C[p.format]||C.muted,fontWeight:700,fontFamily:FONT.head}}>{p.format}</span>
                    <span style={{fontSize:12,color:C.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{trunc(p.caption,42)}</span>
                    <span style={{fontFamily:FONT.head,fontSize:12,textAlign:"right",fontWeight:700,color:C.forest}}>{fmt(p.reach)}</span>
                    <span style={{fontFamily:FONT.head,fontSize:12,textAlign:"right",color:C.muted}}>{p.engagement}</span>
                    <span style={{fontFamily:FONT.head,fontSize:12,textAlign:"right",color:p.engRate>5?C.green:C.muted,fontWeight:p.engRate>5?700:400}}>{pct(p.engRate)}</span>
                    <span style={{fontFamily:FONT.head,fontSize:12,textAlign:"right",color:p.ctr>0?C.linkedin:C.border}}>{pct(p.ctr)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ PLATFORMS ═══ */}
        {view==="platforms"&&(
          <div style={{animation:"fadeUp .4s ease"}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))",gap:16}}>
              {activePlats.map(pk=>{
                const pm=PLAT[pk];const pp=posts.filter(p=>p.platform===pk);
                const tR=sum(pp.map(p=>p.reach));const aE=avg(pp.map(p=>p.engRate));
                return(
                  <div key={pk} className="n-card" style={{position:"relative",overflow:"hidden"}}>
                    <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${pm.color},${pm.color}40)`}}/>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                      <div style={{width:36,height:36,borderRadius:8,background:pm.color+"12",border:`1.5px solid ${pm.color}25`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:800,color:pm.color,fontFamily:FONT.head}}>{pm.icon}</div>
                      <div><div style={{fontFamily:FONT.head,fontSize:15,fontWeight:700,color:C.forest}}>{pm.name}</div><div style={{fontSize:10,color:C.muted}}>📎 CSV Data</div></div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
                      {[{l:"Posts",v:pp.length},{l:"Reach",v:fmt(tR)},{l:"Avg Eng",v:pct(aE)}].map((d,i)=>(
                        <div key={i} style={{padding:10,background:C.paleGold,borderRadius:8}}>
                          <div style={{fontSize:9,color:C.muted,textTransform:"uppercase",fontWeight:700,letterSpacing:"1px",fontFamily:FONT.head}}>{d.l}</div>
                          <div style={{fontSize:20,fontFamily:FONT.head,fontWeight:800,color:C.forest}}>{d.v}</div>
                        </div>
                      ))}
                    </div>
                    <ResponsiveContainer width="100%" height={65}>
                      <AreaChart data={pp.map(p=>({d:p.date,r:p.reach}))}>
                        <defs><linearGradient id={`g-${pk}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={pm.color} stopOpacity={.2}/><stop offset="100%" stopColor={pm.color} stopOpacity={0}/></linearGradient></defs>
                        <Area type="monotone" dataKey="r" stroke={pm.color} strokeWidth={2} fill={`url(#g-${pk})`}/>
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                );
              })}
              <div className="n-card" onClick={()=>setUploadOpen(true)} style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",minHeight:200,border:`2px dashed ${C.border}`,background:C.paleGold}}>
                <div style={{fontSize:32,color:C.muted,marginBottom:6}}>+</div>
                <div style={{fontSize:13,fontWeight:700,color:C.forest,fontFamily:FONT.head}}>Add Platform Data</div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ CALENDAR ═══ */}
        {view==="calendar"&&(
          <div style={{animation:"fadeUp .4s ease"}}>
            <div className="n-card">
              <div style={{fontFamily:FONT.head,fontSize:14,fontWeight:700,color:C.forest,marginBottom:14}}>Content Calendar</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:6,marginBottom:8}}>
                {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=>(
                  <div key={d} style={{fontSize:9.5,fontWeight:700,textTransform:"uppercase",letterSpacing:"1px",color:C.muted,fontFamily:FONT.head,textAlign:"center",padding:4}}>{d}</div>
                ))}
              </div>
              {(()=>{
                const postsByDate={};filtered.forEach(p=>{const d=p.date;if(!postsByDate[d])postsByDate[d]=[];postsByDate[d].push(p)});
                const dates=Object.keys(postsByDate).sort();
                if(dates.length===0)return <div style={{textAlign:"center",padding:40,color:C.muted}}>No posts in selected range</div>;
                const first=new Date(dates[0]);const startDay=first.getDay()||7;
                const last=new Date(dates[dates.length-1]);
                const totalDays=Math.ceil((last-first)/(1000*60*60*24))+startDay;
                const cells=[];
                for(let i=1;i<startDay;i++)cells.push(<div key={`e-${i}`}/>);
                const cur=new Date(first);
                for(let i=0;i<totalDays-startDay+1;i++){
                  const ds=cur.toISOString().split("T")[0];
                  const dayPosts=postsByDate[ds]||[];
                  cells.push(
                    <div key={ds} style={{border:`1px solid ${dayPosts.length?C.mint:C.border}`,borderRadius:6,padding:4,minHeight:52,background:dayPosts.length?C.paleMint:"transparent",fontSize:10}}>
                      <div style={{fontFamily:FONT.head,fontWeight:700,fontSize:9,color:C.muted,marginBottom:2}}>{cur.getDate()}</div>
                      {dayPosts.map((p,j)=>(
                        <div key={j} style={{fontSize:8,padding:"1px 4px",borderRadius:3,background:(PLAT[p.platform]?.color||C.muted)+"18",color:PLAT[p.platform]?.color,fontWeight:600,marginBottom:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontFamily:FONT.head}}>
                          {p.format}
                        </div>
                      ))}
                    </div>
                  );
                  cur.setDate(cur.getDate()+1);
                }
                return <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4}}>{cells}</div>;
              })()}
            </div>
          </div>
        )}

        {/* ═══ AI INSIGHTS ═══ */}
        {view==="insights"&&(
          <div style={{animation:"fadeUp .4s ease"}}>
            <div className="n-card" style={{marginBottom:18,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontFamily:FONT.head,fontSize:18,fontWeight:800,color:C.forest}}>AI Strategy Insights</div>
                <div style={{fontSize:12,color:C.muted,marginTop:3}}>Claude analyzes your cross-platform performance</div>
              </div>
              <button onClick={genInsights} disabled={aiLoading} style={{padding:"10px 22px",borderRadius:8,border:`1.5px solid ${C.sage}`,cursor:aiLoading?"default":"pointer",background:aiLoading?C.border:`linear-gradient(135deg,${C.sage},${C.green})`,color:"#fff",fontFamily:FONT.head,fontSize:13,fontWeight:700}}>
                {aiLoading?"Analyzing…":aiInsights?"↻ Refresh":"✦ Generate Insights"}
              </button>
            </div>
            {aiInsights?(
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:14}}>
                {aiInsights.map((ins,i)=>{
                  const tc=typeColor[ins.type]||C.muted;
                  return(
                    <div key={i} className="n-card" style={{animation:`fadeUp .4s ease ${i*.07}s both`,position:"relative",overflow:"hidden"}}>
                      <div style={{position:"absolute",top:0,left:0,width:3,height:"100%",background:tc,borderRadius:"12px 0 0 12px"}}/>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                        <span style={{width:24,height:24,borderRadius:6,background:tc+"15",border:`1px solid ${tc}25`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:tc}}>{typeIcon[ins.type]||"◇"}</span>
                        <span style={{fontSize:9.5,fontWeight:800,color:tc,textTransform:"uppercase",letterSpacing:"1px",fontFamily:FONT.head}}>{ins.type}</span>
                      </div>
                      <div style={{fontFamily:FONT.head,fontSize:14,fontWeight:700,color:C.forest,marginBottom:6}}>{ins.title}</div>
                      <div style={{fontSize:12,color:C.muted,lineHeight:1.55}}>{ins.body}</div>
                    </div>
                  );
                })}
              </div>
            ):(
              <div className="n-card" style={{textAlign:"center",padding:50}}>
                <div style={{fontSize:36,marginBottom:10}}>✦</div>
                <div style={{fontFamily:FONT.head,fontSize:16,fontWeight:800,color:C.forest,marginBottom:6}}>Ready to analyze</div>
                <div style={{fontSize:13,color:C.muted,maxWidth:380,margin:"0 auto"}}>Click "Generate Insights" to have Claude review your performance and suggest strategic improvements.</div>
              </div>
            )}
          </div>
        )}

        {/* ═══ CONNECT ═══ */}
        {view==="connect"&&(
          <div style={{animation:"fadeUp .4s ease"}}>
            <div className="n-card" style={{marginBottom:18}}>
              <div style={{fontFamily:FONT.head,fontSize:18,fontWeight:800,color:C.forest,marginBottom:4}}>Platform Connections</div>
              <div style={{fontSize:12,color:C.muted,marginBottom:16}}>Connect via API for auto-sync, or upload CSV exports.</div>
              <div style={{display:"grid",gap:10}}>
                {Object.entries(PLAT).map(([pk,pm])=>{
                  const has=posts.some(p=>p.platform===pk);
                  return(
                    <div key={pk} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 18px",borderRadius:10,border:`1.5px solid ${C.border}`,background:has?C.paleGold:C.warm,transition:"all .2s"}}>
                      <div style={{width:38,height:38,borderRadius:8,background:pm.color+"12",border:`1.5px solid ${pm.color}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:800,color:pm.color,fontFamily:FONT.head}}>{pm.icon}</div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:14,fontWeight:700,color:C.forest,fontFamily:FONT.head}}>{pm.name}</div>
                        <div style={{fontSize:10,color:C.muted}}>{pm.tier==="api"?"API + CSV supported":"CSV upload only"}</div>
                      </div>
                      {has&&<span style={{padding:"3px 9px",borderRadius:5,fontSize:10,fontWeight:700,background:C.paleMint,color:C.green,fontFamily:FONT.head}}>{posts.filter(p=>p.platform===pk).length} posts</span>}
                      <button onClick={()=>{setUploadPlat(pk);setUploadOpen(true)}} style={{padding:"7px 14px",borderRadius:7,border:`1.5px solid ${C.sage}30`,background:C.paleMint,color:C.green,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:FONT.head}}>📎 Upload CSV</button>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="n-card">
              <div style={{fontFamily:FONT.head,fontSize:14,fontWeight:700,color:C.forest,marginBottom:10}}>How to Export Your Data</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {[
                  {p:"Facebook / Instagram",s:"Meta Business Suite → Insights → Export → CSV"},
                  {p:"LinkedIn",s:"Company Page → Analytics → Export → CSV"},
                  {p:"YouTube",s:"YouTube Studio → Analytics → Advanced → Export"},
                  {p:"TikTok",s:"TikTok Business Center → Analytics → Export"},
                ].map((item,i)=>(
                  <div key={i} style={{padding:14,background:C.paleGold,borderRadius:8}}>
                    <div style={{fontSize:12,fontWeight:700,color:C.forest,fontFamily:FONT.head,marginBottom:4}}>{item.p}</div>
                    <div style={{fontSize:11,color:C.muted,fontFamily:FONT.body,lineHeight:1.5}}>{item.s}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ═══ UPLOAD MODAL ═══ */}
      {uploadOpen&&(
        <div style={{position:"fixed",inset:0,background:"rgba(40,63,69,0.35)",backdropFilter:"blur(3px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100}} onClick={()=>setUploadOpen(false)}>
          <div style={{background:C.white,borderRadius:14,padding:28,width:460,maxWidth:"92vw",boxShadow:"0 16px 48px rgba(0,0,0,.12)",animation:"fadeUp .3s ease",border:`1.5px solid ${C.border}`}} onClick={e=>e.stopPropagation()}>
            <div style={{fontFamily:FONT.head,fontSize:18,fontWeight:800,color:C.forest,marginBottom:4}}>Upload CSV Data</div>
            <div style={{fontSize:12,color:C.muted,marginBottom:16}}>Select the platform and drop your exported CSV.</div>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:9.5,color:C.muted,textTransform:"uppercase",fontWeight:700,letterSpacing:"1px",fontFamily:FONT.head,marginBottom:6}}>Platform</div>
              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                {Object.entries(PLAT).map(([pk,pm])=>(
                  <button key={pk} onClick={()=>setUploadPlat(pk)} style={{padding:"6px 12px",borderRadius:6,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:FONT.head,
                    border:`1.5px solid ${uploadPlat===pk?pm.color+"50":C.border}`,
                    background:uploadPlat===pk?pm.color+"10":"transparent",
                    color:uploadPlat===pk?pm.color:C.muted,transition:"all .2s",
                  }}>{pm.icon} {pm.name}</button>
                ))}
              </div>
            </div>
            <div className={`upload-zone ${dragging?"drag":""}`}
              onDragOver={e=>{e.preventDefault();setDragging(true)}} onDragLeave={()=>setDragging(false)}
              onDrop={e=>{e.preventDefault();setDragging(false);const f=e.dataTransfer?.files?.[0];if(f)handleCSV(f)}}
              onClick={()=>fileRef.current?.click()}>
              <div style={{fontSize:28,marginBottom:6}}>📎</div>
              <div style={{fontSize:13,fontWeight:700,color:C.forest,fontFamily:FONT.head,marginBottom:3}}>Drag & drop your CSV here</div>
              <div style={{fontSize:11,color:C.muted}}>or click to browse</div>
            </div>
            <input ref={fileRef} type="file" accept=".csv" style={{display:"none"}} onChange={e=>{const f=e.target.files?.[0];if(f)handleCSV(f);e.target.value=""}}/>
            <div style={{display:"flex",justifyContent:"flex-end",marginTop:14}}>
              <button onClick={()=>setUploadOpen(false)} style={{padding:"7px 18px",borderRadius:7,border:`1.5px solid ${C.border}`,background:"transparent",color:C.muted,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:FONT.head}}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
