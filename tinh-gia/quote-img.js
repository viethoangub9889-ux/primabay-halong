/* Vẽ phiếu báo giá thành ảnh PNG (1080px ngang) để gửi khách qua Zalo. */
(function(){
const F=window.PB_FMT;
const C={teal:'#1d5352',deep:'#123b3b',gold:'#c8a66a',goldl:'#e9d3a6',bg:'#f6f4ef',ink:'#16302f',mute:'#617370',line:'#e4ded2',ok:'#2f7d5f',red:'#e0261b'};
const FONT='"Be Vietnam Pro", Arial, sans-serif', SERIF='"Playfair Display", Georgia, serif';
const load=src=>new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.onerror=()=>r(null);i.src=src});
function wrap(ctx,text,maxW){const w=text.split(' ');const out=[];let line='';for(const x of w){const t=line?line+' '+x:x;if(ctx.measureText(t).width>maxW&&line){out.push(line);line=x}else line=t}if(line)out.push(line);return out}
async function render(u,p,rows,adv){
  await (document.fonts&&document.fonts.ready);
  const W=1080,P=56,IW=W-P*2;
  const shown=rows;
  const H=360+350+(u.loc?440:0)+150+ (p.ck?1:0)*52+(p.rf?1:0)*52+7*52+40 + 90+shown.length*84+70 +230;
  const cv=document.createElement('canvas');cv.width=W;cv.height=H;const x=cv.getContext('2d');
  x.fillStyle=C.bg;x.fillRect(0,0,W,H);
  // header
  x.fillStyle=C.deep;x.fillRect(0,0,W,330);
  x.fillStyle=C.goldl;x.font=`600 26px ${FONT}`;x.fillText('PRIMA BAY · HALONG MARINA, BÃI CHÁY',P,74);
  x.fillStyle='#fff';x.font=`500 64px ${SERIF}`;x.fillText('Báo giá căn '+u.c,P,152);
  x.fillStyle='#cfe0dc';x.font=`400 28px ${FONT}`;x.fillText(`${u.k} · Tòa ${u.t} · Tầng ${u.f} · ${u.a} m² thông thủy${u.v?' · View '+u.v:''}`,P,202);
  x.fillStyle=C.goldl;x.font=`600 26px ${FONT}`;x.fillText(p.m.name.toUpperCase()+(p.rf?' + GIỚI THIỆU 2%':''),P,262);
  x.fillStyle='#fff';x.font=`700 46px ${FONT}`;x.fillText(F.vnd(p.total)+' đ',P,312);
  const save=u.p+u.p/1.1*0.02-p.total;
  if(save>0){x.textAlign='right';x.fillStyle='#9fe3c4';x.font=`600 26px ${FONT}`;x.fillText('Tiết kiệm ≈ '+F.tr(save),W-P,312);x.textAlign='left'}
  let y=360;
  {const im=await load('/img/tongquan/01-hai-toa-chinh-dien.webp');if(im){const bh=300,s=Math.max(IW/im.width,bh/im.height),dw=im.width*s,dh=im.height*s;x.save();x.beginPath();x.roundRect(P,y,IW,bh,22);x.clip();x.drawImage(im,P+(IW-dw)/2,y+(bh-dh)*0.55,dw,dh);x.restore();
   x.fillStyle=C.mute;x.font=`400 22px ${FONT}`;x.fillText('Phối cảnh dự án Prima Bay, Halong Marina, Bãi Cháy, Hạ Long.',P,y+bh+30);y+=bh+50;}}
  // location image
  if(u.loc){const im=await load('/img/chican/'+u.loc[2]+'.webp');if(im){
    const bh=400,iw=im.width,ih=im.height;const s=Math.max(IW/iw,bh/ih);const dw=iw*s,dh=ih*s;
    let ox=P+IW/2-u.loc[0]*dw, oy=y+bh/2-u.loc[1]*dh; ox=Math.min(P,Math.max(P+IW-dw,ox)); oy=Math.min(y,Math.max(y+bh-dh,oy));
    x.save();x.beginPath();x.roundRect(P,y,IW,bh,22);x.clip();x.drawImage(im,ox,oy,dw,dh);x.restore();
    const dx=ox+u.loc[0]*dw,dy=oy+u.loc[1]*dh;
    x.beginPath();x.arc(dx,dy,22,0,7);x.strokeStyle='rgba(224,38,27,.45)';x.lineWidth=6;x.stroke();
    x.beginPath();x.arc(dx,dy,12,0,7);x.fillStyle=C.red;x.fill();x.lineWidth=4;x.strokeStyle='#fff';x.stroke();
    x.fillStyle=C.mute;x.font=`400 22px ${FONT}`;x.fillText('Chấm đỏ: vị trí tương đối của căn trên phối cảnh (minh họa).',P,y+bh+30);
    y+=bh+40;}}
  // price table
  const row=(l,v,col,b)=>{x.font=`${b?700:400} 28px ${FONT}`;x.fillStyle=b?C.teal:C.ink;x.fillText(l,P+24,y);x.textAlign='right';x.fillStyle=col||(b?C.teal:C.ink);x.fillText(v,W-P-24,y);x.textAlign='left';y+=52};
  const card=(h)=>{x.fillStyle='#fff';x.strokeStyle=C.line;x.lineWidth=2;x.beginPath();x.roundRect(P,y,IW,h,22);x.fill();x.stroke()};
  const n1=6+(p.ck?1:0)+(p.rf?1:0);card(90+n1*52);
  y+=58;x.fillStyle=C.ink;x.font=`700 32px ${FONT}`;x.fillText('Chi tiết giá',P+24,y);y+=56;
  row('Giá niêm yết (gồm VAT)',F.vnd(p.list));
  row('Ưu đãi Early Bird 1%','− '+F.vnd(p.eb),'#9a7a3f');
  if(p.ck)row(`Chiết khấu ${p.m.short.toLowerCase()} ${p.m.ck*100}%`,'− '+F.vnd(p.ck),'#9a7a3f');
  if(p.rf)row('Ưu đãi khách được giới thiệu 2%','− '+F.vnd(p.rf),'#9a7a3f');
  row('Giá sau chiết khấu (chưa VAT)',F.vnd(p.net));
  row('Thuế VAT 10%',F.vnd(p.vat));
  row('Kinh phí bảo trì 2%',F.vnd(p.kpbt));
  row('Tổng giá trị hợp đồng',F.vnd(p.total)+' đ',null,true);
  y+=40;
  // schedule
  card(90+shown.length*84+40);
  y+=58;x.fillStyle=C.ink;x.font=`700 32px ${FONT}`;x.fillText('Lịch thanh toán',P+24,y);y+=30;
  for(const r of shown){
    x.strokeStyle=C.line;x.lineWidth=1.5;x.beginPath();x.moveTo(P+24,y+8);x.lineTo(W-P-24,y+8);x.stroke();
    y+=44;x.fillStyle=r.ded?'#9aa7a4':C.ink;x.font=`700 28px ${FONT}`;x.fillText(r.n,P+24,y);
    x.font=`400 26px ${FONT}`;x.fillStyle=r.ded?'#9aa7a4':C.mute;x.fillText(r.date?F.date(r.date):'Theo thông báo',P+300,y);
    x.textAlign='right';x.font=`600 28px ${FONT}`;x.fillStyle=r.ded?'#9aa7a4':C.ink;x.fillText(r.ded?'Khấu trừ':F.vnd(r.amt),W-P-24,y);x.textAlign='left';
    x.font=`400 21px ${FONT}`;x.fillStyle=C.mute;const note=(r.pct?r.pct+' · ':'')+r.note;x.fillText(wrap(x,note,IW-48)[0],P+24,y+30);y+=40;
  }
  y+=60;
  // advisor
  x.fillStyle=C.deep;x.fillRect(0,y,W,H-y);
  let ax=P;if(adv.img){const im=await load(adv.img);if(im){x.save();x.beginPath();x.roundRect(P,y+36,120,150,16);x.clip();const s=Math.max(120/im.width,150/im.height);x.drawImage(im,P+60-im.width*s/2,y+36,im.width*s,im.height*s);x.restore();ax=P+150}}
  x.fillStyle=C.goldl;x.font=`600 24px ${FONT}`;x.fillText('CHUYÊN VIÊN TƯ VẤN',ax,y+66);
  x.fillStyle='#fff';x.font=`500 44px ${SERIF}`;x.fillText(adv.name,ax,y+120);
  x.fillStyle='#fff';x.font=`700 34px ${FONT}`;x.fillText('☎ '+F.phone(adv.phone)+'  ·  Zalo',ax,y+170);
  x.fillStyle='#9fb7b3';x.font=`400 19px ${FONT}`;x.fillText('Phiếu tạm tính theo chính sách bán hàng hiện hành của CĐT, mang tính tham khảo; giá trị chính thức theo HĐMB.',P,H-28);
  return cv;
}
async function save(u,p,rows,adv,toast){
  const cv=await render(u,p,rows,adv);
  const blob=await new Promise(r=>cv.toBlob(r,'image/png'));
  const name=`bao-gia-${u.c}-${p.m.id}.png`;
  const file=new File([blob],name,{type:'image/png'});
  if(navigator.canShare&&navigator.canShare({files:[file]})&&/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)){
    try{await navigator.share({files:[file],title:'Báo giá căn '+u.c});return}catch(e){if(e.name==='AbortError')return}
  }
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(a.href),4000);toast&&toast('Đã lưu ảnh '+name+', gửi qua Zalo cho khách');
}
window.PB_IMG={render,save};
})();
