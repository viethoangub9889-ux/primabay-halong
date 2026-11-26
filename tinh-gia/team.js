/* Danh sách sale được vào trang tính giá. h = sha256('pb:'+SĐT). Thêm người: thêm 1 dòng. */
window.PB_TEAM={
  hoang:{name:'Việt Hoàng',phone:'0829980198',img:'../img/viet-hoang.webp',h:'84e62655c77172f9c329461cd05210e2db9803f71d26440f9c3f36d4f5109fcd'},
  duc:{name:'Phạm Đức',phone:'0838011995',h:'b2928dbc88f78521fc67375a2172c99a841864e0a6fc319f0216fb6947f2aca1'},
  long:{name:'Việt Long',phone:'0353473733',img:'../img/viet-long.webp',h:'375257e9238dba176bda9a737ea4ef1c19cb614133b3f7735363f8b7eef9ee4d'},
  thaiha:{name:'Thái Hà',phone:'0933161888',img:'../img/thai-ha.webp',h:'7e782caa9275515928e0c72feef31cc2b39d8e8f47cd8136d5964f9a31c7a7ac'},
  trung:{name:'Đào Quang Trung',phone:'0976982240',h:'8f3cd2a1c72be697155f3637f13faeda8f54689c75292689694110379b64e99d'},
  maichi:{name:'Phạm Mai Chi',phone:'0375247858',h:'9a13147eaabcc3d4caf7ff68f2959f3047506fbbcb573f9804d5c7d3dccbcdfc'},
  linh:{name:'Linh Lê',phone:'0936994345',img:'../img/linh-le.webp',h:'3d66ef41690737593f9dd9f55d0901facf9220d1619306fea724d86e77b6c5a9'}
};
window.PB_FMT={
  vnd:n=>Math.round(n).toLocaleString('vi-VN'),
  ty:n=>(n/1e9).toLocaleString('vi-VN',{minimumFractionDigits:2,maximumFractionDigits:2})+' tỷ',
  tr:n=>Math.round(n/1e6).toLocaleString('vi-VN')+' triệu',
  date:d=>d?d.toLocaleDateString('vi-VN',{day:'2-digit',month:'2-digit',year:'numeric'}):'',
  phone:p=>p.replace(/^(\d{4})(\d{3})(\d{3})$/,'$1 $2 $3')
};
