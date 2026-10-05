import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const users = new Map();

const templates = {
  "100": [
    ["Lunes","Aceleración","Calentamiento dinámico, técnica y 6×20 m + 4×30 m desde salida. Recuperación completa."],
    ["Martes","Fuerza y técnica","Fuerza general supervisada, core y movilidad. Sin llegar al fallo."],
    ["Miércoles","Velocidad máxima","Drills + 4×20 m flying + 3×60 m. Recuperación completa entre repeticiones."],
    ["Jueves","Recuperación","Movilidad, caminata suave y descanso."],
    ["Viernes","Resistencia de velocidad","3×120 m a intensidad controlada, con recuperación amplia."],
    ["Sábado","Opcional","Técnica de carrera, movilidad y recuperación."],
    ["Domingo","Descanso","Descanso completo."]
  ],
  "200": [
    ["Lunes","Aceleración y curva","4×30 m + 4×60 m, cuidando la técnica en la curva."],
    ["Martes","Fuerza y técnica","Fuerza general, core, movilidad y técnica de carrera."],
    ["Miércoles","Velocidad máxima","4×20 m flying + 3×80 m con recuperación completa."],
    ["Jueves","Recuperación","Movilidad y descanso."],
    ["Viernes","Resistencia específica","3×150 m a intensidad controlada, recuperación amplia."],
    ["Sábado","Opcional","Trabajo técnico de curva + movilidad."],
    ["Domingo","Descanso","Descanso completo."]
  ],
  "400": [
    ["Lunes","Velocidad","5×30 m + 3×80 m con recuperación completa."],
    ["Martes","Fuerza","Fuerza general, core y movilidad."],
    ["Miércoles","Ritmo específico","3×150 m a ritmo controlado, recuperación amplia."],
    ["Jueves","Recuperación","Movilidad y descanso."],
    ["Viernes","Resistencia específica","2×250 m a intensidad controlada, recuperación larga."],
    ["Sábado","Técnica","Drills + movilidad + recuperación aeróbica suave."],
    ["Domingo","Descanso","Descanso completo."]
  ]
};

function makePlan(profile) {
  return {
    athlete: profile.name,
    event: profile.event,
    personalBest: profile.personalBest,
    goal: profile.goal,
    week: templates[profile.event] || templates["100"],
    note: "Plan inicial orientativo. La carga debe ajustarse a edad, experiencia, recuperación, historial de lesiones y supervisión de un entrenador cualificado."
  };
}

app.post("/api/register", (req,res)=>{
  const {email,password,name} = req.body || {};
  if(!email || !password || !name) return res.status(400).json({error:"Completa nombre, correo y contraseña."});
  if(users.has(email)) return res.status(409).json({error:"Ese correo ya está registrado."});
  users.set(email,{email,password,name,profile:null,plan:null,logs:[],payment:{status:"pending",operation:""}});
  res.json({ok:true});
});

app.post("/api/login",(req,res)=>{
  const {email,password} = req.body || {};
  const u=users.get(email);
  if(!u || u.password!==password) return res.status(401).json({error:"Correo o contraseña incorrectos."});
  res.json({ok:true,user:{email:u.email,name:u.name,payment:u.payment,profile:u.profile,plan:u.plan,logs:u.logs}});
});

app.post("/api/profile",(req,res)=>{
  const {email,profile}=req.body || {};
  const u=users.get(email);
  if(!u) return res.status(404).json({error:"Usuario no encontrado."});
  u.profile=profile;
  u.plan=makePlan(profile);
  res.json({ok:true,plan:u.plan});
});

app.post("/api/progress",(req,res)=>{
  const {email,entry}=req.body || {};
  const u=users.get(email);
  if(!u) return res.status(404).json({error:"Usuario no encontrado."});
  u.logs.unshift({...entry,date:new Date().toISOString()});
  res.json({ok:true,logs:u.logs});
});

app.post("/api/payment",(req,res)=>{
  const {email,operation}=req.body || {};
  const u=users.get(email);
  if(!u) return res.status(404).json({error:"Usuario no encontrado."});
  if(!operation) return res.status(400).json({error:"Introduce el código de operación."});
  u.payment={status:"review",operation:String(operation).slice(0,80)};
  res.json({ok:true,status:u.payment.status,message:"Pago enviado para revisión manual."});
});

app.get("*",(req,res)=>res.sendFile(path.join(__dirname,"public","index.html")));
app.listen(PORT,()=>console.log(`VELYX running at http://localhost:${PORT}`));
