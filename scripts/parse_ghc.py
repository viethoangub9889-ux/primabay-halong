import openpyxl,json,datetime,sys,re
def num(v):
    if v is None: return None
    if isinstance(v,datetime.datetime): return float(f"{v.day}.{v.month}")
    if isinstance(v,(int,float)): return float(v)
    s=str(v).strip().replace(' ','')
    if not s: return None
    return float(s.replace(',','.')) if s.count(',')==1 and '.' not in s else float(s.replace(',',''))
def run(path):
    wb=openpyxl.load_workbook(path)
    out=[];sold=0
    for ws in wb.worksheets:
        for r in ws.iter_rows(min_row=2,values_only=True):
            if not r or not r[4]: continue
            code=str(r[4]).strip()
            if not re.match(r'^[PM]\d-',code): continue
            agent=r[9]
            if agent not in (None,'') and str(agent).strip(): sold+=1;continue
            price=r[8]
            price=int(str(price).replace(',','').replace('.','').strip()) if price else None
            if not price: continue
            out.append({'c':code,'t':str(r[1]).strip()[0],'f':str(r[2]).replace('.0',''),'k':str(r[5]).strip(),'a':num(r[6]),'g':num(r[7]),'p':price})
    return out,sold
if __name__=='__main__':
    u,s=run(sys.argv[1]);print(len(u),'available',s,'sold')
    json.dump(u,open(sys.argv[2],'w'),ensure_ascii=False)
