// HNOSS Compliance-Portal (autark, localhost). Keine externen Abhaengigkeiten.
import http from 'node:http';
import crypto from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.COMPLIANCE_PORT || 8788);
const HOST = process.env.COMPLIANCE_HOST || '127.0.0.1';
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'hnoss-admin-2026';
const SIGN_SECRET = process.env.SIGNATURE_SECRET || 'hnoss-sign-v1';
const TOKEN_SECRET = process.env.TOKENIZATION_SECRET || 'hnoss-tok-v1';
const BASE = process.env.PUBLIC_BASE_URL || ('http://localhost:' + PORT);

const db = new DatabaseSync(path.join(__dirname, 'compliance.db'));
db.exec("CREATE TABLE IF NOT EXISTS access_requests(id TEXT PRIMARY KEY,firstName TEXT,lastName TEXT,businessEmail TEXT UNIQUE NOT NULL,company TEXT,role TEXT,purpose TEXT,initials TEXT,e_sig TEXT,status TEXT DEFAULT 'pending_email',createdAt TEXT,verifiedAt TEXT,adminAt TEXT,notes TEXT);CREATE TABLE IF NOT EXISTS vtokens(token TEXT PRIMARY KEY,request_id TEXT NOT NULL,hash TEXT NOT NULL,expires TEXT NOT NULL,used INTEGER DEFAULT 0);CREATE TABLE IF NOT EXISTS answers(id TEXT PRIMARY KEY,request_id TEXT NOT NULL,data TEXT NOT NULL,createdAt TEXT);CREATE TABLE IF NOT EXISTS audit(id TEXT PRIMARY KEY,seq INTEGER,actor TEXT,action TEXT,subjectType TEXT,subjectId TEXT,payload TEXT,createdAt TEXT,prevHash TEXT,hash TEXT);CREATE TABLE IF NOT EXISTS instances(id TEXT PRIMARY KEY,name TEXT,kind TEXT,url TEXT,status TEXT,connectedAt TEXT,meta TEXT);");
const ex = db.prepare('SELECT id FROM instances WHERE id=?').get('portal-self');
if (!ex) db.prepare('INSERT INTO instances (id,name,kind,url,status,connectedAt,meta) VALUES (?,?,?,?,?,?,?)').run('portal-self','HNOSS Compliance Portal','portal',BASE,'online',new Date().toISOString(),'{"self":true}');

const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const rid = (n=16) => crypto.randomBytes(n).toString('hex');

// ---- Instanz 07: Audit Hash-Chain ----
function canon(v){ if(v===null||typeof v!=='object') return JSON.stringify(v); if(Array.isArray(v)) return '['+v.map(canon).join(',')+']'; const k=Object.keys(v).sort(); return '{'+k.map(x=>JSON.stringify(x)+':'+canon(v[x])).join(',')+'}'; }
function chash(p,e){ return sha(p+'|'+canon(e)); }
function lastAudit(){ return db.prepare('SELECT * FROM audit ORDER BY seq DESC LIMIT 1').get(); }
function appendAudit(actor,action,st,sid,payload){ const prev=lastAudit(); const prevHash=prev?prev.hash:'GENESIS'; const createdAt=new Date().toISOString(); const base={actor,action,subjectType:st,subjectId:sid,payload,createdAt}; const hash=chash(prevHash,base); const seq=(prev?prev.seq:0)+1; const id=rid(8); db.prepare('INSERT INTO audit (id,seq,actor,action,subjectType,subjectId,payload,createdAt,prevHash,hash) VALUES (?,?,?,?,?,?,?,?,?,?)').run(id,seq,actor,action,st,sid,JSON.stringify(payload),createdAt,prevHash,hash); return {id,seq,prevHash,hash,...base}; }
function verifyChain(){ const rows=db.prepare('SELECT * FROM audit ORDER BY seq ASC').all(); let p='GENESIS'; for(let i=0;i<rows.length;i++){ const e=rows[i]; const exp=chash(p,{actor:e.actor,action:e.action,subjectType:e.subjectType,subjectId:e.subjectId,payload:JSON.parse(e.payload),createdAt:e.createdAt}); if(e.prevHash!==p||e.hash!==exp) return {ok:false,brokenAt:i}; p=e.hash; } return {ok:true,entries:rows.length}; }

// ---- Instanz 02/03: Signature + Verify-Token ----
function signInitials(p){ const c=JSON.stringify(p,Object.keys(p).sort()); return crypto.createHmac('sha256',SIGN_SECRET).update(c).digest('hex'); }
function issueToken(rid2){ const raw=crypto.randomBytes(32).toString('base64url'); const h=sha(raw); const exp=new Date(Date.now()+86400000).toISOString(); db.prepare('INSERT INTO vtokens (token,request_id,hash,expires) VALUES (?,?,?,?)').run(raw,rid2,h,exp); return {raw,url:BASE+'/confirm?token='+encodeURIComponent(raw)}; }
function verifyTokenRaw(t){ const row=db.prepare('SELECT * FROM vtokens WHERE token=?').get(t); if(!row||row.used) return {ok:false}; if(new Date(row.expires).getTime()<Date.now()) return {ok:false}; db.prepare('UPDATE vtokens SET used=1 WHERE token=?').run(t); return {ok:true,requestId:row.request_id}; }
