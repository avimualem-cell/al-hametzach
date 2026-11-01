// Purchase module: Google Play Billing via Digital Goods API + Payment Request (works inside the TWA from Google Play).
const PAY={SKU:'unlock_all',BILLING:'https://play.google.com/billing',svc:null,owned:false,price:'12.90 ₪',
 set(v){this.owned=v;localStorage.huUnlock=v?'1':'0';window.onPayChange&&window.onPayChange()},
 async init(){this.owned=localStorage.huUnlock==='1';
  const q=new URLSearchParams(location.search);if(q.get('devunlock')==='1')this.set(true);if(q.get('devunlock')==='0')this.set(false);
  if('getDigitalGoodsService' in window){try{this.svc=await window.getDigitalGoodsService(this.BILLING);
    const d=await this.svc.getDetails([this.SKU]);if(d&&d[0]&&d[0].price){const p=d[0].price;
     try{this.price=new Intl.NumberFormat(document.documentElement.lang,{style:'currency',currency:p.currency}).format(p.value)}catch(e){}}
    await this.restore(true)}catch(e){this.svc=null}}
  window.onPayChange&&window.onPayChange()},
 available(){return !!this.svc&&'PaymentRequest' in window},
 async restore(silent){if(!this.svc)return false;try{const p=await this.svc.listPurchases();const has=p.some(x=>x.itemId===this.SKU);if(has||!silent)this.set(has||this.owned);return has}catch(e){return false}},
 async buy(){if(!this.available())return 'unavailable';
  try{const req=new PaymentRequest([{supportedMethods:this.BILLING,data:{sku:this.SKU}}],{total:{label:'Total',amount:{currency:'ILS',value:'0'}}});
   const r=await req.show();await r.complete('success');this.set(true);return 'ok'}catch(e){return e&&e.name==='AbortError'?'cancel':'error'}}
};
