import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig={apiKey:"AIzaSyBbRoIhI0iAaDdgKbA6LsA-YXfFtXcuJPc",authDomain:"bagdadbreadfactorybd.firebaseapp.com",projectId:"bagdadbreadfactorybd",storageBucket:"bagdadbreadfactorybd.firebasestorage.app",messagingSenderId:"13667225455",appId:"1:13667225455:web:d769af316cd8e28adc229a"};
const app=initializeApp(firebaseConfig),db=getFirestore(app);
const money=n=>`৳${Number(n||0).toLocaleString("en-BD")}`;
const escapeHtml=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

// Pickup and delivery orders finish differently, so each gets its own
// tracking ladder instead of forcing every order through "out for delivery".
const DELIVERY_STEPS=["pending","confirmed","preparing","out_for_delivery","delivered"];
const PICKUP_STEPS=["pending","confirmed","preparing","ready_for_pickup","delivered"];
const STEP_LABELS={out_for_delivery:"out for delivery",ready_for_pickup:"ready for pickup",delivered:"completed"};

function fulfillmentDetails(o){
  const c=o.customer||{};
  if(o.fulfillment==="pickup"){
    return `<div class="tracking-total"><span>🏪 Pickup at</span><b>${escapeHtml(c.pickupBranch||"—")}</b></div>${c.preferredTime?`<div class="tracking-total"><span>Preferred time</span><b>${escapeHtml(c.preferredTime)}</b></div>`:""}`;
  }
  return `<div class="tracking-total"><span>🚚 Delivering to</span><b>${escapeHtml(c.area||"—")}</b></div>${c.preferredTime?`<div class="tracking-total"><span>Preferred time</span><b>${escapeHtml(c.preferredTime)}</b></div>`:""}`;
}

async function trackOrder(id){
  const out=document.getElementById("statusResult");
  if(!id){out.innerHTML="<div class='notice'>Please enter an order ID.</div>";return;}
  try{
    const snap=await getDoc(doc(db,"orders",id));
    if(!snap.exists()){out.innerHTML="<div class='notice'>Order not found. Please check the ID.</div>";return;}
    const o=snap.data();
    const steps=o.fulfillment==="pickup"?PICKUP_STEPS:DELIVERY_STEPS;
    const status=o.orderStatus||"pending";
    // A cancelled order isn't a step on the ladder — show it as its own state.
    if(status==="cancelled"){
      out.innerHTML=`<div class="tracking-card"><span class="eyebrow">ORDER ${id.slice(0,10).toUpperCase()}</span><h2>Cancelled</h2><div class="notice">This order was cancelled. Please contact the bakery if you have questions.</div><div class="tracking-total"><span>Total</span><b>${money(o.total)}</b></div></div>`;
      return;
    }
    const active=Math.max(0,steps.indexOf(status));
    out.innerHTML=`<div class="tracking-card"><span class="eyebrow">ORDER ${id.slice(0,10).toUpperCase()} • ${o.fulfillment==="pickup"?"🏪 PICKUP":"🚚 DELIVERY"}</span><h2>${(STEP_LABELS[status]||status).replaceAll("_"," ")}</h2><div class="tracking-steps">${steps.map((s,i)=>`<div class="${i<=active?"done":""}"><i>${i<=active?"✓":i+1}</i><span>${(STEP_LABELS[s]||s).replaceAll("_"," ")}</span></div>`).join("")}</div>${fulfillmentDetails(o)}<div class="tracking-total"><span>Total</span><b>${money(o.total)}</b></div></div>`;
  }catch(e){console.error(e);out.innerHTML="<div class='notice'>Unable to check this order right now.</div>";}
}

document.getElementById("trackOrder").addEventListener("click",()=>{
  trackOrder(document.getElementById("orderId").value.trim());
});

document.getElementById("orderId").addEventListener("keydown",e=>{
  if(e.key==="Enter") trackOrder(document.getElementById("orderId").value.trim());
});

// Coming straight from checkout (menu.html sets ?order=ID), so look the
// order up automatically instead of making the customer retype the ID.
const prefillId=new URLSearchParams(location.search).get("order");
if(prefillId){
  document.getElementById("orderId").value=prefillId;
  trackOrder(prefillId);
}

document.getElementById("year")?.append(new Date().getFullYear());
// Note: the mobile hamburger menu is handled by mobile-nav.js (shared across
// all pages). A second click handler used to live here and toggle the same
// "open" class — on a real tap both handlers fired, one opened the drawer
// and the other immediately closed it again, so the menu button silently
// did nothing on phones. Removed; mobile-nav.js already covers this page.
