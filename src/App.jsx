import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Search, Plus, Phone, Mail, Calendar, Image as ImageIcon,
  X, Edit2, Trash2, ChevronLeft, Stethoscope, Camera, Users,
  ClipboardList, CheckCircle2, Clock, AlertCircle, FileText,
  CalendarCheck, CalendarPlus, BellRing, IndianRupee, History as HistoryIcon,
  MessageCircle, XCircle, UserX, RotateCcw, CheckCircle, Download
} from "lucide-react";
import * as XLSX from "xlsx";

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
`;

const CSS = `
:root{
  --bg:#F6F4EF;
  --surface:#FFFFFF;
  --ink:#22302E;
  --ink-soft:#5B6B67;
  --line:#E4E0D6;
  --teal:#1F6F72;
  --teal-dark:#144D50;
  --teal-tint:#E7F1F0;
  --coral:#DD7A56;
  --coral-tint:#FBEAE1;
  --ok:#2E8F63;
  --ok-tint:#E6F4EC;
  --warn:#C88A2E;
  --warn-tint:#FBF0DD;
  --bad:#C85A4E;
  --bad-tint:#FBEAE7;
  --grey:#8A9490;
  --grey-tint:#EEF0EC;
  --radius:14px;
}
*{box-sizing:border-box;}
.derp{
  font-family:'Inter',system-ui,sans-serif;
  background:var(--bg);
  color:var(--ink);
  height:100%;
  min-height:640px;
  width:100%;
  display:flex;
  flex-direction:column;
  overflow:hidden;
  border-radius:18px;
  border:1px solid var(--line);
}
.derp h1,.derp h2,.derp h3,.derp .display{
  font-family:'Fraunces',serif;
  letter-spacing:-0.01em;
}
.derp-header{
  display:flex;align-items:center;justify-content:space-between;
  padding:12px 20px;
  background:var(--teal-dark);
  color:#fff;
  flex-shrink:0;
  gap:12px;
  flex-wrap:wrap;
}
.derp-brand{display:flex;align-items:center;gap:10px;}
.derp-brand-text h1{font-size:18px;font-weight:600;margin:0;line-height:1.1;color:#fff;}
.derp-brand-text span{font-size:11px;color:#B9D4D2;letter-spacing:.04em;text-transform:uppercase;}
.header-right{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
.staff-name-input{
  background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);border-radius:999px;
  padding:7px 12px;font-size:12.5px;color:#fff;outline:none;width:130px;font-family:'Inter';
}
.staff-name-input::placeholder{color:#B9D4D2;}
.role-toggle{
  display:flex;background:rgba(255,255,255,.12);border-radius:999px;padding:3px;gap:2px;
}
.role-toggle button{
  border:none;background:transparent;color:#CFE3E1;font-family:'Inter';font-size:12.5px;font-weight:600;
  padding:7px 14px;border-radius:999px;cursor:pointer;transition:all .15s ease;letter-spacing:.02em;
}
.role-toggle button.active{background:#fff;color:var(--teal-dark);}
.role-badge{
  background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);border-radius:999px;
  padding:7px 14px;font-size:12.5px;font-weight:600;color:#fff;letter-spacing:.02em;
}
.tab-bar{
  display:flex;gap:2px;background:var(--surface);border-bottom:1px solid var(--line);padding:0 14px;
  overflow-x:auto;flex-shrink:0;
}
.tab-bar button{
  display:flex;align-items:center;gap:6px;border:none;background:transparent;cursor:pointer;
  padding:11px 12px;font-family:'Inter';font-size:12.5px;font-weight:600;color:var(--ink-soft);
  border-bottom:2px solid transparent;white-space:nowrap;
}
.tab-bar button.active{color:var(--teal-dark);border-bottom-color:var(--teal);}
.tab-badge{
  background:var(--coral);color:#fff;font-size:10px;font-weight:700;border-radius:999px;
  min-width:16px;height:16px;display:flex;align-items:center;justify-content:center;padding:0 4px;
  font-family:'IBM Plex Mono';
}
.derp-body{flex:1;display:flex;min-height:0;}
.derp-sidebar{
  width:320px;flex-shrink:0;background:var(--surface);border-right:1px solid var(--line);
  display:flex;flex-direction:column;min-height:0;
}
.derp-sidebar.mobile-hidden{display:none;}
.sidebar-top{padding:16px;border-bottom:1px solid var(--line);}
.search-box{
  display:flex;align-items:center;gap:8px;background:var(--bg);border:1px solid var(--line);
  border-radius:10px;padding:9px 12px;margin-bottom:10px;
}
.search-box input{border:none;background:transparent;outline:none;font-size:13.5px;width:100%;color:var(--ink);font-family:'Inter';}
.search-box svg{flex-shrink:0;color:var(--ink-soft);}
.btn{
  font-family:'Inter';font-weight:600;font-size:13.5px;border-radius:10px;border:none;cursor:pointer;
  display:inline-flex;align-items:center;justify-content:center;gap:6px;transition:all .15s ease;
}
.btn-primary{background:var(--teal);color:#fff;padding:10px 14px;}
.btn-primary:hover{background:var(--teal-dark);}
.btn-coral{background:var(--coral);color:#fff;padding:10px 14px;}
.btn-coral:hover{background:#C6693F;}
.btn-ghost{background:transparent;color:var(--ink-soft);padding:8px 10px;border:1px solid var(--line);}
.btn-ghost:hover{background:var(--bg);}
.btn-block{width:100%;}
.btn-sm{padding:6px 10px;font-size:12px;}
.btn-danger-ghost{background:transparent;color:var(--bad);padding:8px 10px;border:1px solid var(--bad-tint);}
.btn-danger-ghost:hover{background:var(--bad-tint);}
.patient-list{flex:1;overflow-y:auto;padding:8px;}
.patient-item{
  display:flex;align-items:center;gap:10px;padding:10px 10px;border-radius:10px;cursor:pointer;
  margin-bottom:2px;border:1px solid transparent;
}
.patient-item:hover{background:var(--bg);}
.patient-item.active{background:var(--teal-tint);border-color:var(--teal);}
.avatar{
  width:38px;height:38px;border-radius:999px;background:var(--teal);color:#fff;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;font-family:'Fraunces';font-weight:600;font-size:14px;
}
.patient-item.active .avatar{background:var(--teal-dark);}
.patient-item-info{min-width:0;flex:1;}
.patient-item-info .name{font-size:13.5px;font-weight:600;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.patient-item-info .meta{font-size:11.5px;color:var(--ink-soft);font-family:'IBM Plex Mono';}
.empty-list{padding:30px 16px;text-align:center;color:var(--ink-soft);font-size:13px;}
.derp-main{flex:1;min-width:0;overflow-y:auto;background:var(--bg);}
.derp-main.mobile-hidden{display:none;}
.empty-state{
  height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;
  color:var(--ink-soft);text-align:center;padding:40px;
}
.empty-state svg{color:var(--line);}
.empty-state h2{color:var(--ink-soft);font-size:17px;margin:0;}
.empty-state p{font-size:13px;margin:0;max-width:280px;}
.profile-wrap{padding:20px 24px 40px;max-width:760px;margin:0 auto;}
.tab-panel{flex:1;overflow-y:auto;padding:22px 24px 44px;max-width:760px;margin:0 auto;width:100%;}
.mobile-back{display:none;align-items:center;gap:4px;color:var(--teal-dark);font-weight:600;font-size:13px;
  background:none;border:none;cursor:pointer;padding:4px 0 14px;font-family:'Inter';}
.profile-card{
  background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:20px;margin-bottom:16px;
}
.profile-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap;}
.profile-head-left{display:flex;gap:14px;align-items:center;}
.avatar-lg{
  width:56px;height:56px;border-radius:999px;background:var(--teal);color:#fff;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;font-family:'Fraunces';font-weight:600;font-size:22px;
}
.profile-head h2{margin:0 0 3px;font-size:20px;}
.profile-tags{display:flex;flex-wrap:wrap;gap:12px;margin-top:6px;}
.profile-tag{display:flex;align-items:center;gap:5px;font-size:12.5px;color:var(--ink-soft);}
.profile-tag svg{width:14px;height:14px;flex-shrink:0;}
.head-actions{display:flex;gap:8px;flex-shrink:0;flex-wrap:wrap;}
.stat-row{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:18px;}
.stat-box{background:var(--bg);border-radius:10px;padding:12px 10px;text-align:center;}
.stat-box .num{font-family:'IBM Plex Mono';font-weight:600;font-size:16px;color:var(--ink);}
.stat-box .lbl{font-size:10.5px;color:var(--ink-soft);text-transform:uppercase;letter-spacing:.04em;margin-top:2px;}
.upcoming-box{margin-top:16px;padding-top:14px;border-top:1px solid var(--line);}
.upcoming-box .ut{font-size:11.5px;font-weight:700;color:var(--ink-soft);text-transform:uppercase;letter-spacing:.04em;margin-bottom:8px;}
.upcoming-row{display:flex;align-items:center;justify-content:space-between;font-size:13px;padding:6px 0;}
.upcoming-row .who{color:var(--ink);font-weight:500;}
.upcoming-row .when{font-family:'IBM Plex Mono';font-size:11.5px;color:var(--teal-dark);display:flex;align-items:center;}
.upcoming-row-editable{cursor:pointer;border-radius:8px;padding-left:6px;padding-right:6px;margin:0 -6px;}
.upcoming-row-editable:hover{background:var(--bg);}
.section-title{display:flex;align-items:center;justify-content:space-between;margin:26px 0 12px;flex-wrap:wrap;gap:10px;}
.section-title h3{font-size:15px;margin:0;display:flex;align-items:center;gap:7px;}
.timeline{position:relative;padding-left:2px;}
.visit-card{
  background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:16px;margin-bottom:12px;
  position:relative;padding-left:22px;
}
.visit-card::before{
  content:'';position:absolute;left:8px;top:22px;bottom:-12px;width:1px;background:var(--line);
}
.visit-card:last-child::before{display:none;}
.visit-dot{position:absolute;left:2px;top:19px;width:11px;height:11px;border-radius:999px;background:var(--teal);border:2px solid var(--surface);}
.visit-top{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;}
.visit-date{font-family:'IBM Plex Mono';font-size:11px;color:var(--ink-soft);}
.visit-treatment{font-size:14.5px;font-weight:600;margin:2px 0 4px;font-family:'Fraunces';}
.visit-notes{font-size:12.5px;color:var(--ink-soft);line-height:1.5;margin:0 0 10px;}
.visit-foot{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;}
.rx-thumb{width:44px;height:44px;border-radius:8px;object-fit:cover;border:1px solid var(--line);cursor:pointer;}
.rx-empty{
  display:flex;align-items:center;gap:6px;font-size:11.5px;color:var(--ink-soft);
  border:1px dashed var(--line);border-radius:8px;padding:6px 10px;
}
.pay-badge{
  display:flex;align-items:center;gap:6px;font-size:11.5px;font-weight:600;padding:5px 10px;border-radius:999px;
  font-family:'IBM Plex Mono';
}
.pay-paid{background:var(--ok-tint);color:var(--ok);}
.pay-partial{background:var(--warn-tint);color:var(--warn);}
.pay-pending{background:var(--bad-tint);color:var(--bad);}
.visit-actions{display:flex;gap:6px;}
.icon-btn{background:none;border:none;cursor:pointer;color:var(--ink-soft);padding:4px;border-radius:6px;display:flex;}
.icon-btn:hover{background:var(--bg);color:var(--ink);}
/* tabs content */
.panel-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;flex-wrap:wrap;gap:10px;}
.panel-header h2{font-size:19px;margin:0;}
.panel-header p{font-size:12.5px;color:var(--ink-soft);margin:2px 0 0;}
.day-label{font-size:11.5px;font-weight:700;color:var(--ink-soft);text-transform:uppercase;letter-spacing:.05em;margin:20px 0 8px;}
.day-label:first-child{margin-top:0;}
.appt-row{
  background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:14px;margin-bottom:10px;
  display:flex;align-items:center;gap:14px;flex-wrap:wrap;
}
.appt-time{font-family:'IBM Plex Mono';font-weight:600;font-size:13.5px;color:var(--teal-dark);min-width:76px;}
.appt-info{flex:1;min-width:160px;}
.appt-info .who{font-size:14px;font-weight:600;font-family:'Fraunces';}
.appt-info .sub{font-size:12px;color:var(--ink-soft);margin-top:2px;}
.appt-status{
  font-size:11px;font-weight:700;padding:4px 10px;border-radius:999px;text-transform:capitalize;
}
.appt-scheduled{background:var(--teal-tint);color:var(--teal-dark);}
.appt-completed{background:var(--ok-tint);color:var(--ok);}
.appt-cancelled{background:var(--grey-tint);color:var(--grey);}
.appt-noshow{background:var(--bad-tint);color:var(--bad);}
.appt-actions{display:flex;gap:5px;}
.reminder-row{
  background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:14px;margin-bottom:10px;
  display:flex;align-items:center;gap:14px;flex-wrap:wrap;
}
.reminded-tag{display:flex;align-items:center;gap:5px;font-size:11.5px;color:var(--ok);font-weight:600;}
.wa-btn{
  background:#25D366;color:#fff;text-decoration:none;padding:8px 13px;border-radius:9px;font-size:12.5px;
  font-weight:600;display:inline-flex;align-items:center;gap:6px;
}
.wa-btn:hover{background:#1EBE59;}
.collections-summary{
  background:var(--teal-dark);color:#fff;border-radius:var(--radius);padding:20px;margin-bottom:20px;
  display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;
}
.collections-summary .amt{font-family:'Fraunces';font-size:30px;font-weight:600;}
.collections-summary .lbl{font-size:11.5px;color:#B9D4D2;text-transform:uppercase;letter-spacing:.05em;}
.date-input{
  border:1px solid var(--line);border-radius:9px;padding:8px 11px;font-size:13px;font-family:'Inter';
  background:var(--surface);color:var(--ink);outline:none;
}
.date-input:focus{border-color:var(--teal);}
.collect-row{
  background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:13px 15px;margin-bottom:8px;
  display:flex;align-items:center;justify-content:space-between;gap:10px;
}
.collect-row .who{font-size:13.5px;font-weight:600;}
.collect-row .what{font-size:11.5px;color:var(--ink-soft);}
.collect-row .amt{font-family:'IBM Plex Mono';font-weight:600;font-size:14px;color:var(--ok);}
.history-row{
  border-bottom:1px solid var(--line);padding:12px 2px;display:flex;gap:12px;align-items:flex-start;
}
.history-row:last-child{border-bottom:none;}
.history-dot{width:7px;height:7px;border-radius:999px;background:var(--teal);margin-top:6px;flex-shrink:0;}
.history-text{font-size:13px;line-height:1.5;}
.history-text b{font-weight:600;}
.history-meta{font-size:11px;color:var(--ink-soft);font-family:'IBM Plex Mono';margin-top:2px;}
.history-role-tag{
  font-size:9.5px;font-weight:700;text-transform:uppercase;background:var(--teal-tint);color:var(--teal-dark);
  padding:1px 6px;border-radius:5px;margin-left:6px;letter-spacing:.03em;
}
/* modal */
.modal-overlay{
  position:fixed;inset:0;background:rgba(20,30,29,.45);display:flex;align-items:center;justify-content:center;
  z-index:50;padding:16px;
}
.modal{
  background:var(--surface);border-radius:16px;width:100%;max-width:440px;max-height:88vh;overflow-y:auto;
  padding:22px;
}
.modal h3{margin:0 0 4px;font-size:17px;}
.modal .sub{font-size:12.5px;color:var(--ink-soft);margin:0 0 18px;}
.field{margin-bottom:13px;position:relative;}
.field label{display:block;font-size:12px;font-weight:600;color:var(--ink-soft);margin-bottom:5px;text-transform:uppercase;letter-spacing:.03em;}
.field input,.field textarea,.field select{
  width:100%;border:1px solid var(--line);border-radius:9px;padding:9px 11px;font-size:13.5px;font-family:'Inter';
  outline:none;color:var(--ink);background:var(--bg);
}
.field input:focus,.field textarea:focus,.field select:focus{border-color:var(--teal);background:#fff;}
.field textarea{resize:vertical;min-height:60px;}
.field-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.upload-box{
  border:1.5px dashed var(--line);border-radius:10px;padding:14px;text-align:center;cursor:pointer;
  color:var(--ink-soft);font-size:12.5px;background:var(--bg);
}
.upload-box:hover{border-color:var(--teal);}
.upload-preview{width:100%;max-height:160px;object-fit:contain;border-radius:8px;margin-bottom:8px;}
.modal-actions{display:flex;gap:8px;margin-top:18px;}
.modal-actions .btn{flex:1;}
.patient-chip{
  display:flex;align-items:center;justify-content:space-between;background:var(--teal-tint);border:1px solid var(--teal);
  border-radius:9px;padding:9px 11px;font-size:13px;font-weight:600;color:var(--teal-dark);
}
.patient-chip button{background:none;border:none;cursor:pointer;color:var(--teal-dark);display:flex;}
.search-results{
  position:absolute;top:100%;left:0;right:0;background:var(--surface);border:1px solid var(--line);border-radius:9px;
  margin-top:4px;max-height:180px;overflow-y:auto;z-index:5;box-shadow:0 6px 18px rgba(0,0,0,.08);
}
.search-results .sr-item{padding:9px 11px;font-size:13px;cursor:pointer;border-bottom:1px solid var(--line);}
.search-results .sr-item:last-child{border-bottom:none;}
.search-results .sr-item:hover{background:var(--bg);}
.search-results .sr-item .sn{font-weight:600;}
.search-results .sr-item .sp{font-size:11px;color:var(--ink-soft);font-family:'IBM Plex Mono';}
.lightbox-overlay{
  position:fixed;inset:0;background:rgba(10,15,15,.85);display:flex;align-items:center;justify-content:center;
  z-index:60;padding:24px;
}
.lightbox-overlay img{max-width:100%;max-height:100%;border-radius:8px;}
.lightbox-close{position:absolute;top:18px;right:18px;background:rgba(255,255,255,.15);border:none;color:#fff;
  border-radius:999px;width:36px;height:36px;display:flex;align-items:center;justify-content:center;cursor:pointer;}
.toast{
  position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:var(--teal-dark);color:#fff;
  padding:10px 18px;border-radius:999px;font-size:13px;font-weight:500;z-index:70;box-shadow:0 6px 20px rgba(0,0,0,.2);
}
@media (max-width:760px){
  .derp-sidebar{width:100%;}
  .mobile-back{display:flex;}
  .stat-row{grid-template-columns:repeat(2,1fr);}
  .field-row{grid-template-columns:1fr;}
  .staff-name-input{width:110px;}
}
`;

/* ---------- helpers ---------- */

function useIsMobile() {
  const [m, setM] = useState(() => typeof window !== "undefined" && window.innerWidth <= 760);
  useEffect(() => {
    const fn = () => setM(window.innerWidth <= 760);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return m;
}

function uid(prefix) {
  return prefix + "_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxW = 900;
        const scale = Math.min(1, maxW / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.72));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function initials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase();
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function addDaysStr(dateStr, n) {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function fmtDate(d) {
  if (!d) return "";
  try {
    return new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return d;
  }
}

function dayLabel(d) {
  const t = todayStr();
  if (d === t) return "Today";
  if (d === addDaysStr(t, 1)) return "Tomorrow";
  return fmtDate(d);
}

function formatTime(t) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

function fmtINR(n) {
  const num = Number(n) || 0;
  return "₹" + num.toLocaleString("en-IN");
}

function fmtDateTime(iso) {
  try {
    return new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
  } catch {
    return "";
  }
}

function waLink(phone, message) {
  const digits = (phone || "").replace(/\D/g, "");
  const withCode = digits.length === 10 ? "91" + digits : digits;
  return `https://wa.me/${withCode}?text=${encodeURIComponent(message)}`;
}

function reminderMessage(appt) {
  return `Hi ${appt.patientName}, this is a reminder from Perfect Smiles Dental Clinic for your appointment on ${fmtDate(appt.date)} at ${formatTime(appt.time)}${appt.reason ? " for " + appt.reason : ""}. Please reach out if you'd like to reschedule. See you soon!`;
}

async function safeGetJSON(key, shared, fallback) {
  try {
    const res = await window.storage.get(key, shared);
    return res ? JSON.parse(res.value) : fallback;
  } catch {
    return fallback;
  }
}

/* ---------- root ---------- */

export default function App({ role = "reception", userEmail = "" }) {
  const isDoctor = role === "doctor";
  const [staffName, setStaffName] = useState("");
  const [activeTab, setActiveTab] = useState("patients");

  const [patients, setPatients] = useState([]);
  const [cache, setCache] = useState({});
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [appointments, setAppointments] = useState([]);
  const [collectionsLog, setCollectionsLog] = useState([]);
  const [historyLog, setHistoryLog] = useState([]);

  const appointmentsRef = useRef([]);
  const collectionsRef = useRef([]);
  const historyRef = useRef([]);

  const [showAddPatient, setShowAddPatient] = useState(false);
  const [editPatient, setEditPatient] = useState(null);
  const [showAddVisit, setShowAddVisit] = useState(false);
  const [editVisit, setEditVisit] = useState(null);
  const [showAppointment, setShowAppointment] = useState(null); // {prefillPatient, defaultDate} | null
  const [editAppointment, setEditAppointment] = useState(null); // existing appointment object | null
  const [lightbox, setLightbox] = useState(null);
  const [mobileProfile, setMobileProfile] = useState(false);
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);
  const isMobile = useIsMobile();

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  useEffect(() => {
    (async () => {
      const [p, a, c, h, sn] = await Promise.all([
        safeGetJSON("patients-index", true, []),
        safeGetJSON("appointments-index", true, []),
        safeGetJSON("collections-log", true, []),
        safeGetJSON("activity-log", true, []),
        (async () => {
          try {
            const res = await window.storage.get("staff-name", false);
            return res ? res.value : "";
          } catch {
            return "";
          }
        })(),
      ]);
      setPatients(p);
      setAppointments(a);
      appointmentsRef.current = a;
      setCollectionsLog(c);
      collectionsRef.current = c;
      setHistoryLog(h);
      historyRef.current = h;
      setStaffName(sn || "");
      setLoading(false);
    })();
  }, []);

  const actorLabel = () => staffName.trim() || (role === "reception" ? "Reception" : "Doctor");

  const logActivity = async (action, target = "") => {
    const entry = { id: uid("h"), ts: new Date().toISOString(), actor: actorLabel(), role, action, target };
    const newLog = [entry, ...historyRef.current].slice(0, 500);
    historyRef.current = newLog;
    setHistoryLog(newLog);
    try {
      await window.storage.set("activity-log", JSON.stringify(newLog), true);
    } catch {}
  };

  const saveStaffName = async (name) => {
    try {
      await window.storage.set("staff-name", name, false);
    } catch {}
  };

  /* ---- patients ---- */

  const saveIndex = async (list) => {
    setPatients(list);
    try {
      await window.storage.set("patients-index", JSON.stringify(list), true);
    } catch {
      showToast("Could not save — try again");
    }
  };

  const loadPatient = useCallback(
    async (id) => {
      if (cache[id]) return cache[id];
      try {
        const res = await window.storage.get(`patient:${id}`, true);
        const data = res ? JSON.parse(res.value) : null;
        setCache((prev) => ({ ...prev, [id]: data }));
        return data;
      } catch {
        return null;
      }
    },
    [cache]
  );

  useEffect(() => {
    if (selectedId) loadPatient(selectedId);
  }, [selectedId, loadPatient]);

  useEffect(() => {
    if (!isDoctor && (activeTab === "collections" || activeTab === "history")) {
      setActiveTab("patients");
    }
  }, [isDoctor, activeTab]);

  const savePatient = async (patient) => {
    setCache((prev) => ({ ...prev, [patient.id]: patient }));
    try {
      await window.storage.set(`patient:${patient.id}`, JSON.stringify(patient), true);
    } catch {
      showToast("Could not save — try again");
    }
  };

  const handleAddPatient = async (form) => {
    setSaving(true);
    const id = uid("p");
    const patient = {
      id,
      name: form.name.trim(),
      age: form.age,
      phone: form.phone.trim(),
      email: form.email.trim(),
      createdAt: new Date().toISOString(),
      visits: [],
    };
    await savePatient(patient);
    await saveIndex([{ id, name: patient.name, age: patient.age, phone: patient.phone }, ...patients]);
    setSaving(false);
    setShowAddPatient(false);
    setSelectedId(id);
    setMobileProfile(true);
    showToast("Patient added");
    logActivity("Added new patient", patient.name);
  };

  const handleEditPatient = async (form) => {
    setSaving(true);
    const existing = cache[editPatient.id];
    const updated = { ...existing, name: form.name.trim(), age: form.age, phone: form.phone.trim(), email: form.email.trim() };
    await savePatient(updated);
    await saveIndex(patients.map((p) => (p.id === updated.id ? { id: p.id, name: updated.name, age: updated.age, phone: updated.phone } : p)));
    setSaving(false);
    setEditPatient(null);
    showToast("Details updated");
    logActivity("Edited patient details", updated.name);
  };

  const handleDeletePatient = async (id) => {
    const name = cache[id]?.name || patients.find((p) => p.id === id)?.name || "patient";
    if (!window.confirm("Remove this patient and all their records? This cannot be undone.")) return;
    try {
      await window.storage.delete(`patient:${id}`, true);
    } catch {}
    await saveIndex(patients.filter((p) => p.id !== id));
    setCache((prev) => {
      const c = { ...prev };
      delete c[id];
      return c;
    });
    setSelectedId(null);
    setMobileProfile(false);
    showToast("Patient removed");
    logActivity("Deleted patient", name);
  };

  /* ---- collections log ---- */

  const addCollectionEntry = async (visit, patientName) => {
    if (!(visit.paid > 0)) return;
    const entry = {
      id: uid("c"),
      date: visit.date,
      patientId: selectedId,
      patientName,
      treatment: visit.treatment,
      amount: visit.paid,
      billed: visit.billed || 0,
      pending: Math.max((visit.billed || 0) - (visit.paid || 0), 0),
      visitId: visit.id,
      recordedAt: new Date().toISOString(),
    };
    const newLog = [entry, ...collectionsRef.current].slice(0, 3000);
    collectionsRef.current = newLog;
    setCollectionsLog(newLog);
    try {
      await window.storage.set("collections-log", JSON.stringify(newLog), true);
    } catch {}
  };

  const removeCollectionEntries = async (visitId) => {
    const newLog = collectionsRef.current.filter((c) => c.visitId !== visitId);
    collectionsRef.current = newLog;
    setCollectionsLog(newLog);
    try {
      await window.storage.set("collections-log", JSON.stringify(newLog), true);
    } catch {}
  };

  /* ---- visits ---- */

  const handleAddVisit = async (form) => {
    setSaving(true);
    const patient = cache[selectedId];
    const visit = {
      id: uid("v"),
      date: form.date,
      treatment: form.treatment.trim(),
      notes: form.notes.trim(),
      prescriptionImage: form.image || null,
      billed: parseFloat(form.billed) || 0,
      paid: parseFloat(form.paid) || 0,
    };
    const updated = { ...patient, visits: [visit, ...(patient.visits || [])] };
    await savePatient(updated);
    await addCollectionEntry(visit, patient.name);
    setSaving(false);
    setShowAddVisit(false);
    showToast("Visit recorded");
    logActivity("Added visit", `${patient.name} — ${visit.treatment}`);
  };

  const handleEditVisit = async (form) => {
    setSaving(true);
    const patient = cache[selectedId];
    const updatedVisit = {
      ...editVisit,
      date: form.date,
      treatment: form.treatment.trim(),
      notes: form.notes.trim(),
      prescriptionImage: form.image || null,
      billed: parseFloat(form.billed) || 0,
      paid: parseFloat(form.paid) || 0,
    };
    const updated = { ...patient, visits: patient.visits.map((v) => (v.id === editVisit.id ? updatedVisit : v)) };
    await savePatient(updated);
    await removeCollectionEntries(editVisit.id);
    await addCollectionEntry(updatedVisit, patient.name);
    setSaving(false);
    setEditVisit(null);
    showToast("Visit updated");
    logActivity("Edited visit", `${patient.name} — ${updatedVisit.treatment}`);
  };

  const handleDeleteVisit = async (visitId) => {
    if (!window.confirm("Delete this visit record?")) return;
    const patient = cache[selectedId];
    const visit = patient.visits.find((v) => v.id === visitId);
    const updated = { ...patient, visits: patient.visits.filter((v) => v.id !== visitId) };
    await savePatient(updated);
    await removeCollectionEntries(visitId);
    showToast("Visit deleted");
    logActivity("Deleted visit", `${patient.name} — ${visit?.treatment || ""}`);
  };

  /* ---- appointments ---- */

  const saveAppointments = async (newList) => {
    appointmentsRef.current = newList;
    setAppointments(newList);
    try {
      await window.storage.set("appointments-index", JSON.stringify(newList), true);
    } catch {
      showToast("Could not save — try again");
    }
  };

  const handleAddAppointment = async (form) => {
    setSaving(true);
    const appt = {
      id: uid("a"),
      patientId: form.patientId,
      patientName: form.patientName,
      phone: form.phone,
      date: form.date,
      time: form.time,
      reason: form.reason.trim(),
      notes: form.notes.trim(),
      status: "scheduled",
      reminded: null,
      createdAt: new Date().toISOString(),
    };
    await saveAppointments([appt, ...appointmentsRef.current]);
    setSaving(false);
    setShowAppointment(null);
    showToast("Appointment scheduled");
    logActivity("Scheduled appointment", `${form.patientName} — ${fmtDate(form.date)} ${formatTime(form.time)}`);
  };

  const updateAppointment = async (id, patch, actionLabel) => {
    const newList = appointmentsRef.current.map((a) => (a.id === id ? { ...a, ...patch } : a));
    await saveAppointments(newList);
    if (actionLabel) {
      const appt = newList.find((a) => a.id === id);
      logActivity(actionLabel, `${appt.patientName} — ${fmtDate(appt.date)} ${formatTime(appt.time)}`);
    }
  };

  const handleEditAppointment = async (form) => {
    setSaving(true);
    await updateAppointment(
      editAppointment.id,
      {
        date: form.date,
        time: form.time,
        reason: form.reason.trim(),
        notes: form.notes.trim(),
        reminded: null, // date/time may have changed, so any prior reminder no longer applies
      },
      "Rescheduled appointment"
    );
    setSaving(false);
    setEditAppointment(null);
    showToast("Appointment updated");
  };

  const markReminded = (appt) => {
    updateAppointment(appt.id, { reminded: new Date().toISOString() }, "Sent appointment reminder");
  };

  const setApptStatus = (appt, status) => {
    updateAppointment(appt.id, { status }, `Marked appointment as ${status}`);
  };

  /* ---- derived ---- */

  const filtered = patients.filter((p) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return p.name.toLowerCase().includes(q) || (p.phone || "").includes(q);
  });

  const selected = selectedId ? cache[selectedId] : null;
  const visits = selected?.visits || [];
  const totalBilled = visits.reduce((s, v) => s + (v.billed || 0), 0);
  const totalPaid = visits.reduce((s, v) => s + (v.paid || 0), 0);
  const outstanding = totalBilled - totalPaid;

  const today = todayStr();
  const todaysAppts = appointments.filter((a) => a.date === today).sort((x, y) => (x.time || "").localeCompare(y.time || ""));
  const todayScheduledCount = todaysAppts.filter((a) => a.status === "scheduled").length;

  const in3Days = addDaysStr(today, 3);
  const upcomingReminders = appointments
    .filter((a) => a.status === "scheduled" && a.date >= today && a.date <= in3Days)
    .sort((x, y) => (x.date + x.time).localeCompare(y.date + y.time));
  const unremindedCount = upcomingReminders.filter((a) => !a.reminded).length;

  const patientUpcoming = selected
    ? appointments
        .filter((a) => a.patientId === selected.id && a.status === "scheduled" && a.date >= today)
        .sort((x, y) => (x.date + x.time).localeCompare(y.date + y.time))
        .slice(0, 3)
    : [];

  const selectPatient = (id) => {
    setSelectedId(id);
    setMobileProfile(true);
    setActiveTab("patients");
  };

  return (
    <div className="derp">
      <style>{FONTS + CSS}</style>

      <div className="derp-header">
        <div className="derp-brand">
          <ToothIcon />
          <div className="derp-brand-text">
            <h1>Perfect Smiles</h1>
            <span>Dental Clinic · Patient Records</span>
          </div>
        </div>
        <div className="header-right">
          <input
            className="staff-name-input"
            placeholder="Your name"
            value={staffName}
            onChange={(e) => setStaffName(e.target.value)}
            onBlur={(e) => saveStaffName(e.target.value)}
          />
          <div className="role-badge" title={userEmail}>
            {isDoctor ? "Doctor" : "Reception"}
          </div>
        </div>
      </div>

      <div className="tab-bar">
        <button className={activeTab === "patients" ? "active" : ""} onClick={() => setActiveTab("patients")}>
          <Users size={15} /> Patients
        </button>
        <button className={activeTab === "today" ? "active" : ""} onClick={() => setActiveTab("today")}>
          <CalendarCheck size={15} /> Today
          {todayScheduledCount > 0 && <span className="tab-badge">{todayScheduledCount}</span>}
        </button>
        <button className={activeTab === "reminders" ? "active" : ""} onClick={() => setActiveTab("reminders")}>
          <BellRing size={15} /> Reminders
          {unremindedCount > 0 && <span className="tab-badge">{unremindedCount}</span>}
        </button>
        {isDoctor && (
          <button className={activeTab === "collections" ? "active" : ""} onClick={() => setActiveTab("collections")}>
            <IndianRupee size={15} /> Collections
          </button>
        )}
        {isDoctor && (
          <button className={activeTab === "history" ? "active" : ""} onClick={() => setActiveTab("history")}>
            <HistoryIcon size={15} /> History
          </button>
        )}
      </div>

      {activeTab === "patients" && (
        <div className="derp-body">
          <div className={`derp-sidebar ${isMobile && mobileProfile ? "mobile-hidden" : ""}`}>
            <div className="sidebar-top">
              <div className="search-box">
                <Search size={15} />
                <input placeholder="Search name or phone" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <button className="btn btn-primary btn-block" onClick={() => setShowAddPatient(true)}>
                <Plus size={15} /> Add Patient
              </button>
            </div>
            <div className="patient-list">
              {loading ? (
                <div className="empty-list">Loading patients…</div>
              ) : filtered.length === 0 ? (
                <div className="empty-list">
                  {patients.length === 0 ? (
                    <>
                      <Users size={26} style={{ marginBottom: 6, color: "var(--line)" }} />
                      <div>No patients yet.</div>
                    </>
                  ) : (
                    "No matches found."
                  )}
                </div>
              ) : (
                filtered.map((p) => (
                  <div key={p.id} className={`patient-item ${p.id === selectedId ? "active" : ""}`} onClick={() => selectPatient(p.id)}>
                    <div className="avatar">{initials(p.name)}</div>
                    <div className="patient-item-info">
                      <div className="name">{p.name}</div>
                      <div className="meta">
                        {p.age ? `${p.age} yrs · ` : ""}
                        {p.phone}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className={`derp-main ${isMobile && !mobileProfile ? "mobile-hidden" : ""}`}>
            {!selected ? (
              <div className="empty-state">
                <Stethoscope size={40} />
                <h2>{patients.length === 0 ? "Add your first patient" : "Select a patient"}</h2>
                <p>Choose a patient from the list, or add a new one to start recording visits, appointments and payments.</p>
              </div>
            ) : (
              <div className="profile-wrap">
                <button className="mobile-back" onClick={() => setMobileProfile(false)}>
                  <ChevronLeft size={16} /> All patients
                </button>

                <div className="profile-card">
                  <div className="profile-head">
                    <div className="profile-head-left">
                      <div className="avatar-lg">{initials(selected.name)}</div>
                      <div>
                        <h2>{selected.name}</h2>
                        <div className="profile-tags">
                          {selected.age && <span className="profile-tag">{selected.age} years</span>}
                          {selected.phone && (
                            <span className="profile-tag">
                              <Phone size={13} /> {selected.phone}
                            </span>
                          )}
                          {selected.email && (
                            <span className="profile-tag">
                              <Mail size={13} /> {selected.email}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="head-actions">
                      <button
                        className="btn btn-ghost"
                        onClick={() => setShowAppointment({ prefillPatient: { id: selected.id, name: selected.name, phone: selected.phone }, defaultDate: today })}
                      >
                        <CalendarPlus size={14} /> Schedule
                      </button>
                      <button className="btn btn-ghost" onClick={() => setEditPatient(selected)}>
                        <Edit2 size={14} /> Edit
                      </button>
                      <button className="btn btn-danger-ghost" onClick={() => handleDeletePatient(selected.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="stat-row">
                    <div className="stat-box">
                      <div className="num">{visits.length}</div>
                      <div className="lbl">Visits</div>
                    </div>
                    <div className="stat-box">
                      <div className="num">{fmtINR(totalBilled)}</div>
                      <div className="lbl">Billed</div>
                    </div>
                    <div className="stat-box">
                      <div className="num">{fmtINR(totalPaid)}</div>
                      <div className="lbl">Paid</div>
                    </div>
                    <div className="stat-box">
                      <div className="num" style={{ color: outstanding > 0 ? "var(--bad)" : "var(--ok)" }}>
                        {fmtINR(outstanding)}
                      </div>
                      <div className="lbl">Due</div>
                    </div>
                  </div>

                  {patientUpcoming.length > 0 && (
                    <div className="upcoming-box">
                      <div className="ut">Upcoming Appointments</div>
                      {patientUpcoming.map((a) => (
                        <div
                          key={a.id}
                          className="upcoming-row upcoming-row-editable"
                          onClick={() => setEditAppointment(a)}
                          title="Click to reschedule or edit"
                        >
                          <span className="who">{a.reason || "Appointment"}</span>
                          <span className="when">
                            {dayLabel(a.date)} · {formatTime(a.time)}
                            <Edit2 size={12} style={{ marginLeft: 7, verticalAlign: -1 }} />
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="section-title">
                  <h3>
                    <ClipboardList size={16} /> Treatment History
                  </h3>
                  <button className="btn btn-coral" onClick={() => setShowAddVisit(true)}>
                    <Plus size={15} /> Add Visit
                  </button>
                </div>

                <div className="timeline">
                  {visits.length === 0 ? (
                    <div className="empty-list" style={{ background: "var(--surface)", borderRadius: "var(--radius)", border: "1px solid var(--line)" }}>
                      No visits recorded yet.
                    </div>
                  ) : (
                    visits.map((v) => {
                      const status = v.paid >= v.billed && v.billed > 0 ? "paid" : v.paid > 0 ? "partial" : "pending";
                      return (
                        <div key={v.id} className="visit-card">
                          <div className="visit-dot" />
                          <div className="visit-top">
                            <div>
                              <div className="visit-date">
                                <Calendar size={11} style={{ display: "inline", marginRight: 4, verticalAlign: -1 }} />
                                {fmtDate(v.date)}
                              </div>
                              <div className="visit-treatment">{v.treatment || "Visit"}</div>
                            </div>
                            <div className="visit-actions">
                              <button className="icon-btn" onClick={() => setEditVisit(v)}>
                                <Edit2 size={14} />
                              </button>
                              <button className="icon-btn" onClick={() => handleDeleteVisit(v.id)}>
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                          {v.notes && <p className="visit-notes">{v.notes}</p>}
                          <div className="visit-foot">
                            {v.prescriptionImage ? (
                              <img src={v.prescriptionImage} alt="Prescription" className="rx-thumb" onClick={() => setLightbox(v.prescriptionImage)} />
                            ) : (
                              <div className="rx-empty">
                                <FileText size={13} /> No prescription
                              </div>
                            )}
                            {v.billed > 0 && (
                              <span className={`pay-badge pay-${status}`}>
                                {status === "paid" ? <CheckCircle2 size={13} /> : status === "partial" ? <Clock size={13} /> : <AlertCircle size={13} />}
                                {fmtINR(v.paid)} / {fmtINR(v.billed)}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "today" && (
        <TodayTab
          appts={todaysAppts}
          onNew={() => setShowAppointment({ prefillPatient: null, defaultDate: today })}
          onStatus={setApptStatus}
          onView={selectPatient}
        />
      )}

      {activeTab === "reminders" && <RemindersTab appts={upcomingReminders} onSend={markReminded} />}

      {activeTab === "collections" && isDoctor && <CollectionsTab log={collectionsLog} />}

      {activeTab === "history" && isDoctor && <HistoryTab log={historyLog} />}

      {showAddPatient && <PatientModal title="Add Patient" onClose={() => setShowAddPatient(false)} onSubmit={handleAddPatient} saving={saving} />}
      {editPatient && <PatientModal title="Edit Patient" initial={editPatient} onClose={() => setEditPatient(null)} onSubmit={handleEditPatient} saving={saving} />}
      {showAddVisit && <VisitModal title="Add Visit" onClose={() => setShowAddVisit(false)} onSubmit={handleAddVisit} saving={saving} />}
      {editVisit && <VisitModal title="Edit Visit" initial={editVisit} onClose={() => setEditVisit(null)} onSubmit={handleEditVisit} saving={saving} />}
      {showAppointment && (
        <AppointmentModal
          patients={patients}
          prefillPatient={showAppointment.prefillPatient}
          defaultDate={showAppointment.defaultDate}
          onClose={() => setShowAppointment(null)}
          onSubmit={handleAddAppointment}
          saving={saving}
        />
      )}
      {editAppointment && (
        <AppointmentModal
          patients={patients}
          prefillPatient={{ id: editAppointment.patientId, name: editAppointment.patientName, phone: editAppointment.phone }}
          initial={editAppointment}
          onClose={() => setEditAppointment(null)}
          onSubmit={handleEditAppointment}
          saving={saving}
        />
      )}
      {lightbox && (
        <div className="lightbox-overlay" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)}>
            <X size={18} />
          </button>
          <img src={lightbox} alt="Prescription full size" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

/* ---------- icon ---------- */

function ToothIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 3c-1.7 0-2.6.9-3.8.9-1.9 0-3.2-1.4-4.7-.6C1.9 4.1 1.5 6.6 2 9c.4 2 1.4 3.2 1.8 5.4.4 2.1.3 5.6 1.9 5.6 1.7 0 1.6-3.9 2.3-5.8.4-1.1.9-1.6 1.6-1.6s1.2.5 1.6 1.6c.7 1.9.6 5.8 2.3 5.8 1.6 0 1.5-3.5 1.9-5.6.4-2.2 1.4-3.4 1.8-5.4.5-2.4.1-4.9-1.5-5.7-1.5-.8-2.8.6-4.7.6C14.6 3.9 13.7 3 12 3z"
        fill="#fff"
      />
    </svg>
  );
}

/* ---------- tabs ---------- */

function TodayTab({ appts, onNew, onStatus, onView }) {
  return (
    <div className="tab-panel">
      <div className="panel-header">
        <div>
          <h2>Today's Appointments</h2>
          <p>{fmtDate(todayStr())}</p>
        </div>
        <button className="btn btn-coral" onClick={onNew}>
          <Plus size={15} /> New Appointment
        </button>
      </div>
      {appts.length === 0 ? (
        <div className="empty-list" style={{ background: "var(--surface)", borderRadius: "var(--radius)", border: "1px solid var(--line)" }}>
          Nothing scheduled for today.
        </div>
      ) : (
        appts.map((a) => (
          <div key={a.id} className="appt-row">
            <div className="appt-time">{formatTime(a.time)}</div>
            <div className="appt-info">
              <div className="who">{a.patientName}</div>
              <div className="sub">
                {a.reason || "General visit"} · {a.phone}
              </div>
            </div>
            <span className={`appt-status appt-${a.status === "no-show" ? "noshow" : a.status}`}>{a.status.replace("-", " ")}</span>
            <div className="appt-actions">
              {a.status === "scheduled" ? (
                <>
                  <button className="icon-btn" title="Mark completed" onClick={() => onStatus(a, "completed")}>
                    <CheckCircle size={16} />
                  </button>
                  <button className="icon-btn" title="No-show" onClick={() => onStatus(a, "no-show")}>
                    <UserX size={16} />
                  </button>
                  <button className="icon-btn" title="Cancel" onClick={() => onStatus(a, "cancelled")}>
                    <XCircle size={16} />
                  </button>
                </>
              ) : (
                <button className="icon-btn" title="Reopen" onClick={() => onStatus(a, "scheduled")}>
                  <RotateCcw size={16} />
                </button>
              )}
              <button className="btn btn-ghost btn-sm" onClick={() => onView(a.patientId)}>
                View
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function RemindersTab({ appts, onSend }) {
  let lastDate = null;
  return (
    <div className="tab-panel">
      <div className="panel-header">
        <div>
          <h2>Upcoming Reminders</h2>
          <p>Scheduled appointments in the next 3 days</p>
        </div>
      </div>
      {appts.length === 0 ? (
        <div className="empty-list" style={{ background: "var(--surface)", borderRadius: "var(--radius)", border: "1px solid var(--line)" }}>
          No upcoming appointments in the next 3 days.
        </div>
      ) : (
        appts.map((a) => {
          const showLabel = a.date !== lastDate;
          lastDate = a.date;
          return (
            <div key={a.id}>
              {showLabel && <div className="day-label">{dayLabel(a.date)}</div>}
              <div className="reminder-row">
                <div className="appt-time">{formatTime(a.time)}</div>
                <div className="appt-info">
                  <div className="who">{a.patientName}</div>
                  <div className="sub">
                    {a.reason || "General visit"} · {a.phone}
                  </div>
                </div>
                {a.reminded ? (
                  <>
                    <span className="reminded-tag">
                      <CheckCircle2 size={14} /> Reminded {fmtDateTime(a.reminded)}
                    </span>
                    <a className="wa-btn" href={waLink(a.phone, reminderMessage(a))} target="_blank" rel="noreferrer" onClick={() => onSend(a)}>
                      <MessageCircle size={14} /> Resend
                    </a>
                  </>
                ) : (
                  <a className="wa-btn" href={waLink(a.phone, reminderMessage(a))} target="_blank" rel="noreferrer" onClick={() => onSend(a)}>
                    <MessageCircle size={14} /> Send Reminder
                  </a>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

function CollectionsTab({ log }) {
  const [date, setDate] = useState(todayStr());
  const [fromDate, setFromDate] = useState(todayStr());
  const [toDate, setToDate] = useState(todayStr());

  const entries = log.filter((c) => c.date === date).sort((x, y) => (y.recordedAt || "").localeCompare(x.recordedAt || ""));
  const total = entries.reduce((s, c) => s + (c.amount || 0), 0);
  const totalPending = entries.reduce((s, c) => s + (c.pending ?? Math.max((c.billed || 0) - (c.amount || 0), 0)), 0);

  const downloadExcel = () => {
    const rangeEntries = log
      .filter((c) => c.date >= fromDate && c.date <= toDate)
      .sort((a, b) => (a.date + (a.recordedAt || "")).localeCompare(b.date + (b.recordedAt || "")));

    const rows = rangeEntries.map((c) => {
      const billed = c.billed || 0;
      const collected = c.amount || 0;
      const pending = c.pending ?? Math.max(billed - collected, 0);
      return {
        Date: fmtDate(c.date),
        Patient: c.patientName,
        Treatment: c.treatment || "",
        "Billed (₹)": billed,
        "Collected (₹)": collected,
        "Pending (₹)": pending,
      };
    });

    rows.push({});
    rows.push({
      Date: "TOTAL",
      "Billed (₹)": rangeEntries.reduce((s, c) => s + (c.billed || 0), 0),
      "Collected (₹)": rangeEntries.reduce((s, c) => s + (c.amount || 0), 0),
      "Pending (₹)": rangeEntries.reduce((s, c) => s + (c.pending ?? Math.max((c.billed || 0) - (c.amount || 0), 0)), 0),
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [{ wch: 14 }, { wch: 22 }, { wch: 20 }, { wch: 12 }, { wch: 14 }, { wch: 12 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Collections");
    XLSX.writeFile(wb, `perfect-smiles-collections_${fromDate}_to_${toDate}.xlsx`);
  };

  return (
    <div className="tab-panel">
      <div className="panel-header">
        <div>
          <h2>Daily Collections</h2>
          <p>Payments recorded on the selected date</p>
        </div>
        <input className="date-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div className="collections-summary">
        <div>
          <div className="lbl">Total Collected · {dayLabel(date)}</div>
          <div className="amt">{fmtINR(total)}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="lbl">Balance Pending</div>
          <div className="amt" style={{ fontSize: 22, color: totalPending > 0 ? "#F2B8A3" : undefined }}>
            {fmtINR(totalPending)}
          </div>
        </div>
      </div>
      {entries.length === 0 ? (
        <div className="empty-list" style={{ background: "var(--surface)", borderRadius: "var(--radius)", border: "1px solid var(--line)" }}>
          No payments recorded on this date.
        </div>
      ) : (
        entries.map((c) => {
          const pending = c.pending ?? Math.max((c.billed || 0) - (c.amount || 0), 0);
          return (
            <div key={c.id} className="collect-row">
              <div>
                <div className="who">{c.patientName}</div>
                <div className="what">{c.treatment || "Payment"}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="amt">{fmtINR(c.amount)}</div>
                {pending > 0 && (
                  <div style={{ fontSize: 11, color: "var(--bad)", marginTop: 2 }}>{fmtINR(pending)} pending</div>
                )}
              </div>
            </div>
          );
        })
      )}

      <div className="section-title">
        <h3>
          <Download size={16} /> Export Report
        </h3>
      </div>
      <div className="profile-card">
        <p style={{ fontSize: 12.5, color: "var(--ink-soft)", margin: "0 0 14px" }}>
          Download an Excel file of collections and pending balances for a date range.
        </p>
        <div className="field-row" style={{ marginBottom: 14 }}>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>From</label>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>To</label>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>
        </div>
        <button className="btn btn-primary" onClick={downloadExcel} disabled={fromDate > toDate}>
          <Download size={15} /> Download Excel
        </button>
        {fromDate > toDate && (
          <div style={{ fontSize: 11.5, color: "var(--bad)", marginTop: 8 }}>"From" date must be before "To" date.</div>
        )}
      </div>
    </div>
  );
}

function HistoryTab({ log }) {
  const [q, setQ] = useState("");
  const filtered = log.filter((h) => {
    const query = q.trim().toLowerCase();
    if (!query) return true;
    return `${h.actor} ${h.action} ${h.target}`.toLowerCase().includes(query);
  });

  return (
    <div className="tab-panel">
      <div className="panel-header">
        <div>
          <h2>Activity History</h2>
          <p>Every change made in the system, and by whom</p>
        </div>
      </div>
      <div className="search-box" style={{ marginBottom: 16 }}>
        <Search size={15} />
        <input placeholder="Search by name, action or patient" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {filtered.length === 0 ? (
        <div className="empty-list" style={{ background: "var(--surface)", borderRadius: "var(--radius)", border: "1px solid var(--line)" }}>
          No activity recorded yet.
        </div>
      ) : (
        <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius)", padding: "4px 16px" }}>
          {filtered.map((h) => (
            <div key={h.id} className="history-row">
              <div className="history-dot" />
              <div style={{ flex: 1 }}>
                <div className="history-text">
                  <b>{h.actor}</b>
                  <span className="history-role-tag">{h.role}</span> — {h.action}
                  {h.target ? `: ${h.target}` : ""}
                </div>
                <div className="history-meta">{fmtDateTime(h.ts)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- modals ---------- */

function PatientModal({ title, initial, onClose, onSubmit, saving }) {
  const [name, setName] = useState(initial?.name || "");
  const [age, setAge] = useState(initial?.age || "");
  const [phone, setPhone] = useState((initial?.phone || "").replace(/\D/g, "").slice(0, 10));
  const [email, setEmail] = useState(initial?.email || "");
  const nameRef = useRef(null);
  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const phoneTouched = phone.length > 0;
  const phoneValid = phone.length === 10;
  const valid = name.trim().length > 0 && phoneValid;

  const handlePhoneChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(digitsOnly);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p className="sub">Basic details for the patient record.</p>
        <div className="field">
          <label>Full Name</label>
          <input ref={nameRef} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Meera Kulkarni" />
        </div>
        <div className="field-row">
          <div className="field">
            <label>Age</label>
            <input type="number" min="0" value={age} onChange={(e) => setAge(e.target.value)} placeholder="34" />
          </div>
          <div className="field">
            <label>Phone</label>
            <input
              value={phone}
              onChange={handlePhoneChange}
              inputMode="numeric"
              placeholder="98XXXXXXXX"
              style={phoneTouched && !phoneValid ? { borderColor: "var(--bad)" } : undefined}
            />
            {phoneTouched && !phoneValid && (
              <div style={{ fontSize: 11.5, color: "var(--bad)", marginTop: 4 }}>
                Enter a valid 10-digit phone number ({phone.length}/10)
              </div>
            )}
          </div>
        </div>
        <div className="field">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@email.com" />
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            disabled={!valid || saving}
            style={{ opacity: !valid || saving ? 0.6 : 1 }}
            onClick={() => valid && onSubmit({ name, age, phone, email })}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function VisitModal({ title, initial, onClose, onSubmit, saving }) {
  const [date, setDate] = useState(initial?.date || todayStr());
  const [treatment, setTreatment] = useState(initial?.treatment || "");
  const [notes, setNotes] = useState(initial?.notes || "");
  const [billed, setBilled] = useState(initial?.billed ?? "");
  const [paid, setPaid] = useState(initial?.paid ?? "");
  const [image, setImage] = useState(initial?.prescriptionImage || null);
  const [compressing, setCompressing] = useState(false);
  const fileRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCompressing(true);
    try {
      const dataUrl = await compressImage(file);
      setImage(dataUrl);
    } catch {
      alert("Could not read that image, please try another.");
    }
    setCompressing(false);
  };

  const valid = treatment.trim().length > 0 && date;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p className="sub">Record the treatment, prescription and payment.</p>
        <div className="field-row">
          <div className="field">
            <label>Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="field">
            <label>Treatment</label>
            <input value={treatment} onChange={(e) => setTreatment(e.target.value)} placeholder="e.g. Root Canal" />
          </div>
        </div>
        <div className="field">
          <label>Notes</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Doctor's remarks, follow-up plan…" />
        </div>
        <div className="field">
          <label>Prescription Photo</label>
          {image ? (
            <>
              <img src={image} className="upload-preview" alt="Prescription preview" />
              <button className="btn btn-ghost btn-block" onClick={() => setImage(null)}>
                Remove photo
              </button>
            </>
          ) : (
            <div className="upload-box" onClick={() => fileRef.current?.click()}>
              <Camera size={18} style={{ marginBottom: 4 }} />
              <div>{compressing ? "Processing…" : "Tap to upload or take a photo"}</div>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={handleFile} />
        </div>
        <div className="field-row">
          <div className="field">
            <label>Amount Billed (₹)</label>
            <input type="number" min="0" value={billed} onChange={(e) => setBilled(e.target.value)} placeholder="0" />
          </div>
          <div className="field">
            <label>Amount Paid (₹)</label>
            <input type="number" min="0" value={paid} onChange={(e) => setPaid(e.target.value)} placeholder="0" />
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-coral"
            disabled={!valid || saving || compressing}
            style={{ opacity: !valid || saving || compressing ? 0.6 : 1 }}
            onClick={() => valid && onSubmit({ date, treatment, notes, billed, paid, image })}
          >
            {saving ? "Saving…" : "Save Visit"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AppointmentModal({ patients, prefillPatient, defaultDate, initial, onClose, onSubmit, saving }) {
  const isEdit = !!initial;
  const [selectedPatient, setSelectedPatient] = useState(prefillPatient || null);
  const [query, setQuery] = useState("");
  const [date, setDate] = useState(initial?.date || defaultDate || todayStr());
  const [time, setTime] = useState(initial?.time || "10:00");
  const [reason, setReason] = useState(initial?.reason || "");
  const [notes, setNotes] = useState(initial?.notes || "");

  const results =
    !selectedPatient && query.trim()
      ? patients
          .filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()) || (p.phone || "").includes(query.trim()))
          .slice(0, 6)
      : [];

  const valid = selectedPatient && date && time && reason.trim().length > 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{isEdit ? "Edit Appointment" : "Schedule Appointment"}</h3>
        <p className="sub">{isEdit ? "Update the date, time or details for this appointment." : "Book a visit for a patient."}</p>

        <div className="field">
          <label>Patient</label>
          {selectedPatient ? (
            <div className="patient-chip">
              <span>
                {selectedPatient.name} · {selectedPatient.phone}
              </span>
              {!prefillPatient && (
                <button onClick={() => setSelectedPatient(null)}>
                  <X size={15} />
                </button>
              )}
            </div>
          ) : (
            <>
              <input placeholder="Search patient by name or phone" value={query} onChange={(e) => setQuery(e.target.value)} />
              {results.length > 0 && (
                <div className="search-results">
                  {results.map((p) => (
                    <div key={p.id} className="sr-item" onClick={() => { setSelectedPatient(p); setQuery(""); }}>
                      <div className="sn">{p.name}</div>
                      <div className="sp">{p.phone}</div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className="field-row">
          <div className="field">
            <label>Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="field">
            <label>Time</label>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label>Reason / Treatment</label>
          <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Cleaning, Follow-up" />
        </div>
        <div className="field">
          <label>Notes</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes" />
        </div>

        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            disabled={!valid || saving}
            style={{ opacity: !valid || saving ? 0.6 : 1 }}
            onClick={() =>
              valid &&
              onSubmit({
                patientId: selectedPatient.id,
                patientName: selectedPatient.name,
                phone: selectedPatient.phone,
                date,
                time,
                reason,
                notes,
              })
            }
          >
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Schedule"}
          </button>
        </div>
      </div>
    </div>
  );
}
