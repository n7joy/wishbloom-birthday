const express=require("express"),multer=require("multer"),fs=require("fs"),path=require("path"),crypto=require("crypto"),{spawnSync,spawn}=require("child_process");
const app=express(),PORT=process.env.PORT||3000,ROOT=__dirname,DATA=path.join(ROOT,"data"),UPLOAD=path.join(DATA,"uploads"),VIDEO=path.join(DATA,"videos");
[DATA,UPLOAD,VIDEO].forEach(x=>fs.mkdirSync(x,{recursive:true}));
app.use(express.json({limit:"2mb"}));app.use(express.static(path.join(ROOT,"public")));app.use("/uploads",express.static(UPLOAD));app.use("/videos",express.static(VIDEO));
const storage=multer.diskStorage({destination:UPLOAD,filename:(r,f,cb)=>cb(null,crypto.randomBytes(9).toString("hex")+path.extname(f.originalname).toLowerCase())});
const upload=multer({storage,limits:{files:8,fileSize:8*1024*1024}});
const makeId=()=>crypto.randomBytes(7).toString("base64url"),db=id=>path.join(DATA,id+".json");
const clean=s=>String(s||"").replace(/[<>]/g,"").trim();
app.post("/api/cards",upload.array("photos",8),(req,res)=>{
 const card={id:makeId(),name:clean(req.body.name).slice(0,60)||"Birthday Star",date:clean(req.body.date).slice(0,30),relationship:clean(req.body.relationship).slice(0,30)||"Friend",vibe:clean(req.body.vibe).slice(0,30)||"Sweet",companion:clean(req.body.companion).slice(0,30)||"✨",message:clean(req.body.message).slice(0,1600)||"Happy Birthday! Wishing you love, laughter and beautiful memories.",from:clean(req.body.from).slice(0,60)||"With love",theme:req.body.theme||"rose",photos:(req.files||[]).map(f=>"/uploads/"+f.filename),createdAt:new Date().toISOString()};
 fs.writeFileSync(db(card.id),JSON.stringify(card,null,2));res.json({id:card.id,url:"/b/"+card.id});
});
app.get("/api/cards/:id",(req,res)=>{let f=db(req.params.id);if(!fs.existsSync(f))return res.status(404).json({error:"Card not found"});res.json(JSON.parse(fs.readFileSync(f)))});
app.get("/b/:id",(req,res)=>res.sendFile(path.join(ROOT,"public","card.html")));
function ffmpeg(){try{spawnSync(process.platform==="win32"?"where":"which",["ffmpeg"],{stdio:"ignore"});return true}catch{return false}}
app.post("/api/cards/:id/video",(req,res)=>{
 const f=db(req.params.id);if(!fs.existsSync(f))return res.status(404).json({error:"Card not found"});
 if(!ffmpeg())return res.status(501).json({error:"FFmpeg is not installed on this hosting server."});
 const b=JSON.parse(fs.readFileSync(f)),out=path.join(VIDEO,b.id+".mp4"),esc=x=>String(x).replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/:/g,"\\:").replace(/\n/g," ");
 const vf=`drawbox=x=0:y=0:w=iw:h=ih:color=0x140817:t=fill,drawtext=text='A LITTLE SURPRISE':fontcolor=0xff8bb8:fontsize=34:x=(w-text_w)/2:y=280,drawtext=text='Happy Birthday, ${esc(b.name)}!':fontcolor=white:fontsize=68:x=(w-text_w)/2:y=720,drawtext=text='${esc(b.message.slice(0,180))}':fontcolor=white:fontsize=34:x=80:y=1050,drawtext=text='Made with love':fontcolor=0xffb7d8:fontsize=30:x=(w-text_w)/2:y=1580`;
 const p=spawn("ffmpeg",["-y","-f","lavfi","-i","color=c=0x140817:s=1080x1920:r=30:d=18","-vf",vf,"-c:v","libx264","-preset","veryfast","-crf","23","-pix_fmt","yuv420p","-movflags","+faststart",out]);let err="";p.stderr.on("data",d=>err+=d);p.on("close",c=>c?res.status(500).json({error:"Video render failed",details:err.slice(-800)}):res.json({video:"/videos/"+b.id+".mp4"}));
});
app.get("/health",(req,res)=>res.json({ok:true,ffmpeg:ffmpeg()}));app.listen(PORT,()=>console.log("WishBloom Final on "+PORT));