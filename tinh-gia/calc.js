/* Công thức theo phiếu tính giá (PTG) chính thức của CĐT Prima Bay. */
(function(g){
const R=Math.round;
const METHODS=[
 {id:'95',name:'Thanh toán sớm 95%',ck:0.16,short:'Sớm 95%'},
 {id:'50',name:'Thanh toán sớm 50%',ck:0.12,short:'Sớm 50%'},
 {id:'30',name:'Thanh toán sớm 30%',ck:0.08,short:'Sớm 30%'},
 {id:'td',name:'Thanh toán theo tiến độ',ck:0.05,short:'Tiến độ'},
 {id:'nh',name:'Vay ngân hàng',ck:0,short:'Vay NH'}
];
function workday(d,n){const x=new Date(d);while(n>0){x.setDate(x.getDate()+1);const w=x.getDay();if(w!==0&&w!==6)n--;}return x}
function addDays(d,n){const x=new Date(d);x.setDate(x.getDate()+n);return x}
function price(list,mid,ref){
  const m=METHODS.find(x=>x.id===mid);
  const pre=list/1.1;
  const eb=R(pre*0.01);
  const ck=m.ck?R((pre-eb)*m.ck):0;
  const rf=ref?R((pre-eb-ck)*0.02):0;
  const net=mid==='nh'?pre-(eb+rf):R(pre-(eb+ck+rf));
  const vat=net*0.1, withVat=net+vat;
  const early=mid==='95'||mid==='50'||mid==='30';
  const kpbt=early?R(net*0.02):net*0.02;
  const total=early?R(withVat+kpbt):withVat+kpbt;
  return {m,list,pre,eb,ck,rf,net,vat,withVat,kpbt,total,unit:null};
}
function schedule(p,d0,ttdc){
  const G=p.withVat, id=p.m.id, rows=[];
  const add=(n,pct,amt,date,note,extra)=>rows.push(Object.assign({n,pct,amt,date,note},extra||{}));
  add('Tiền thiện chí','',ttdc,d0,'Ký thỏa thuận đặt cọc, khấu trừ vào Đợt 1');
  const d1=workday(d0,7);
  const tail=(k,date)=>{ // 25% + KPBT + VAT 5% ; rest ; khấu trừ
    const big=R(0.25*G)+p.kpbt+p.vat*0.05;
    add('Đợt '+k,'25% + KPBT + VAT của 5%',big,null,'Thông báo bàn giao nhà');
    const paid=rows.reduce((s,r)=>s+(r.amt||0),0);
    add('Đợt '+(k+1),'5% chưa VAT',p.total-paid,null,'Theo thông báo bàn giao, CĐT trả lãi 9%/năm đến khi có thông báo cấp GCN');
    add('Đợt '+(k+2),'5% chưa VAT',0,null,'Thông báo cấp GCN, khấu trừ từ đợt trước',{ded:true});
  };
  if(id==='95'){
    add('Đợt 1','10%',R(0.1*G)-ttdc,d1,'7 ngày làm việc sau TTĐC, ký HĐMB');
    add('Đợt 2','85%',R(0.85*G),addDays(d1,20),'Đợt 1 + 20 ngày');
    add('Đợt 3','KPBT + VAT của 5%',R(p.kpbt+p.vat*0.05),null,'Thông báo bàn giao');
    const paid=rows.reduce((s,r)=>s+(r.amt||0),0);
    add('Đợt 4','5% chưa VAT',p.total-paid,null,'Theo thông báo bàn giao, CĐT trả lãi 9%/năm đến khi có thông báo cấp GCN');
    add('Đợt 5','5% chưa VAT',0,null,'Thông báo cấp GCN, khấu trừ từ Đợt 4',{ded:true});
  }else if(id==='50'){
    add('Đợt 1','10%',R(0.1*G)-ttdc,d1,'7 ngày làm việc sau TTĐC, ký HĐMB');
    let d=addDays(d1,20);add('Đợt 2','40%',R(0.4*G),d,'Đợt 1 + 20 ngày');
    d=addDays(d,60);add('Đợt 3','10%',R(0.1*G),d,'Đợt 2 + 60 ngày');
    d=addDays(d,60);add('Đợt 4','10%',R(0.1*G),d,'Đợt 3 + 60 ngày');
    tail(5);
  }else if(id==='30'){
    add('Đợt 1','30%',R(0.3*G)-ttdc,d1,'7 ngày làm việc sau TTĐC, ký HĐMB');
    let d=d1;[60,60,60,90,90,90,90,90].forEach((g,i)=>{d=addDays(d,g);add('Đợt '+(i+2),'5%',R(0.05*G),d,'Đợt '+(i+1)+' + '+g+' ngày')});
    tail(10);
  }else if(id==='td'){
    add('Đợt 1','10%',R(0.1*G)-ttdc,d1,'7 ngày làm việc sau TTĐC, ký HĐMB');
    let d=d1;const st=[[45,.1],[60,.1],[60,.05],[60,.05],[60,.05],[90,.05],[90,.05],[90,.05],[90,.05],[120,.05]];
    st.forEach((s,i)=>{d=addDays(d,s[0]);add('Đợt '+(i+2),R(s[1]*100)+'%',R(s[1]*G),d,'Đợt '+(i+1)+' + '+s[0]+' ngày')});
    tail(12);
  }else{ // vay NH
    add('Đợt 1','10%',R(0.1*G)-ttdc,d1,'7 ngày làm việc sau TTĐC, ký HĐMB');
    let d=addDays(d1,45);add('Đợt 2','10%',R(0.1*G),d,'Đợt 1 + 45 ngày');
    d=addDays(d,60);add('Đợt 3','10%',R(0.1*G),d,'Đợt 2 + 60 ngày');
    d=addDays(d,45);add('Đợt 4','65%',R(0.65*G),d,'Ngân hàng giải ngân, hỗ trợ lãi suất tối đa 30 tháng',{bank:true});
    add('Đợt 5','KPBT + VAT của 5%',p.kpbt+p.vat*0.05,null,'Thông báo bàn giao nhà');
    add('Đợt 6','5% chưa VAT',p.net*0.05,null,'Thông báo cấp GCN, ngân hàng giải ngân',{bank:true});
  }
  return rows;
}
g.PB={METHODS,price,schedule,workday,addDays};
})(typeof window!=='undefined'?window:globalThis);
