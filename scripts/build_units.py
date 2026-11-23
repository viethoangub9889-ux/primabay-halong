"""Cập nhật data/units.json từ file PRIMA BAY_GHC.xlsx của CĐT.
Quy tắc (Hoàng): giỏ hàng trong file chỉ là MỘT PHẦN quỹ căn -> giữ căn cũ, thêm căn mới,
bỏ căn có tên Đại lý (đã bán). Giá đổi mà không rõ lý do -> KHÔNG tự đổi, ghi vào báo cáo để hỏi.
Dùng: python3 scripts/build_units.py ghc.xlsx [ngay_file]  -> in báo cáo thay đổi."""
import json,sys,os,openpyxl,re
sys.path.insert(0,os.path.dirname(__file__))
from parse_ghc import num
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA=os.path.join(ROOT,'data','units.json')
def kind(k,a):
    k=k.strip()
    return 'Studio+' if k=='Studio' and a and a>=38 else k
def main(path,stamp=None):
    db=json.load(open(DATA,encoding='utf8'))
    units={u['c']:u for u in db['units']}
    wb=openpyxl.load_workbook(path)
    seen=set();sold=[];added=[];pchg=[]
    for ws in wb.worksheets:
        for r in ws.iter_rows(min_row=2,values_only=True):
            if not r or not r[4]: continue
            c=str(r[4]).strip()
            if not re.match(r'^[PM]\d-',c): continue
            seen.add(c)
            if r[9] not in (None,'') and str(r[9]).strip():
                if c in units: sold.append(c); del units[c]
                continue
            p=r[8]
            if not p: continue
            p=int(str(p).replace(',','').replace('.','').strip())
            a=num(r[6])
            if c in units:
                if units[c]['p']!=p: pchg.append((c,units[c]['p'],p))
            elif c not in db.get('soldLog',[]):
                units[c]={'c':c,'t':c[0],'f':str(r[2]).replace('.0',''),'k':kind(str(r[5]),a),'a':a,'p':p,'v':''}
                added.append(c)
    db['soldLog']=sorted(set(db.get('soldLog',[])+sold))
    db['units']=sorted(units.values(),key=lambda u:u['c'])
    if stamp: db['updated']=stamp
    db['pending']=[{'c':c,'old':o,'new':n} for c,o,n in pchg]
    json.dump(db,open(DATA,'w',encoding='utf8'),ensure_ascii=False,separators=(',',':'))
    print(f'Còn {len(units)} căn. Bán mới: {len(sold)} {sold}. Thêm mới: {len(added)} {added}. Giá thay đổi (chưa áp dụng, cần anh Hoàng duyệt): {len(pchg)} {pchg}')
    return sold,added,pchg
if __name__=='__main__': main(sys.argv[1],sys.argv[2] if len(sys.argv)>2 else None)
