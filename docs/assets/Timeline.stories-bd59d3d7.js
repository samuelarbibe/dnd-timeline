import{s as ie,e as me,g as z,a as w,h as o,m as l,T as de,b as le,D as ce,I as pe,c as ge,d as be}from"./utils-8cb0c50b.js";import{a as fe,j as D}from"./jsx-runtime-91a467a5.js";import{r as a}from"./index-8db94870.js";import"./_commonjsHelpers-042e6b4d.js";import"./index-8ce4a492.js";const Ce={start:ie(new Date),end:me(new Date)};function y(r){const[s,X]=a.useState(r.timeframe||Ce),[u]=a.useState(()=>[...z(r.rowCount),...z(r.disabledRowCount||0,{disabled:!0})]),[Y,i]=a.useState(()=>[...w(r.itemCount,s,u),...w(r.disabledItemCount||0,s,u,{disabled:!0}),...w(r.backgroundItemCount||0,s,u,{background:!0})]),[Z,n]=a.useState(null),[R,ee]=a.useState(null),ae=a.useCallback(e=>n(e.active),[n]),te=a.useCallback(()=>n(null),[n]),re=a.useCallback(e=>{var k,S,V,E,M,_,x,h,q,N;const t=(k=e.over)==null?void 0:k.id.toString();if(!t)return;const C=e.active.id,m=(E=(V=(S=e.over)==null?void 0:S.data)==null?void 0:V.current)==null?void 0:E.type,I=(x=(_=(M=e.active)==null?void 0:M.data)==null?void 0:_.current)==null?void 0:x.type,T=((N=(q=(h=e.active)==null?void 0:h.data)==null?void 0:q.current)==null?void 0:N.getRelevanceFromDragEvent)(e);T&&m==="timeline-row"&&I==="timeline-item"&&i(ue=>ue.map(v=>v.id!==C?v:{...v,rowId:t,relevance:T})),n(null)},[i,n]),ne=a.useCallback(e=>{var t;return ee((t=e.active.data.current)==null?void 0:t.getRelevanceFromDragEvent(e))},[]),oe=a.useCallback(e=>{var m;const t=(m=e.active.data.current)==null?void 0:m.relevance;if(!t)return;const C=e.active.id;i(I=>I.map(d=>d.id!==C?d:{...d,relevance:t}))},[i]),se=a.useMemo(()=>[{value:o(1)},{value:l(30),maxTimeframeSize:o(24)},{value:l(15),maxTimeframeSize:o(12)},{value:l(5),maxTimeframeSize:o(6)},{value:l(1),maxTimeframeSize:o(2)}],[]);return fe(de,{onDragEnd:re,onDragMove:ne,onResizeEnd:oe,onDragStart:ae,onDragCancel:te,timeframe:s,onTimeframeChanged:X,timeframeGridSize:se,children:[D(le,{rows:u,items:Y}),D(ce,{children:Z&&R&&D(pe,{relevance:R})})]})}try{y.displayName="TimelineWrapper",y.__docgenInfo={description:"",displayName:"TimelineWrapper",props:{rowCount:{defaultValue:null,description:"",name:"rowCount",required:!0,type:{name:"number"}},itemCount:{defaultValue:null,description:"",name:"itemCount",required:!0,type:{name:"number"}},timeframe:{defaultValue:null,description:"",name:"timeframe",required:!1,type:{name:"Relevance"}},disabledItemCount:{defaultValue:null,description:"",name:"disabledItemCount",required:!1,type:{name:"number"}},disabledRowCount:{defaultValue:null,description:"",name:"disabledRowCount",required:!1,type:{name:"number"}},backgroundItemCount:{defaultValue:null,description:"",name:"backgroundItemCount",required:!1,type:{name:"number"}},generateDroppableMap:{defaultValue:null,description:"",name:"generateDroppableMap",required:!1,type:{name:"boolean"}}}}}catch{}ge({locale:be});const Re={title:"Timeline",argTypes:{itemCount:{description:"Number of items to generate",defaultValue:1},backgroundItemCount:{description:"Number of background items to generate",defaultValue:1,type:"number"},disabledItemCount:{description:"Number of disabled items to generate",defaultValue:1,type:"number"},rowCount:{description:"Number of rows to generate",defaultValue:1},disabledRowCount:{description:"Number of disabled rows to generate",defaultValue:1,type:"number"},generateDroppableMap:{description:"Generate a droppable map?",defaultValue:!1,type:"boolean"}},component:y},c={args:{itemCount:1,rowCount:2}},p={args:{itemCount:4,rowCount:3}},g={args:{rowCount:2,backgroundItemCount:2}},b={args:{rowCount:3,disabledRowCount:2,itemCount:4}},f={args:{rowCount:5,itemCount:4,generateDroppableMap:!0}};var F,O,j;c.parameters={...c.parameters,docs:{...(F=c.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    itemCount: 1,
    rowCount: 2
  }
}`,...(j=(O=c.parameters)==null?void 0:O.docs)==null?void 0:j.source}}};var U,W,A;p.parameters={...p.parameters,docs:{...(U=p.parameters)==null?void 0:U.docs,source:{originalSource:`{
  args: {
    itemCount: 4,
    rowCount: 3
  }
}`,...(A=(W=p.parameters)==null?void 0:W.docs)==null?void 0:A.source}}};var B,G,P;g.parameters={...g.parameters,docs:{...(B=g.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    rowCount: 2,
    backgroundItemCount: 2
  }
}`,...(P=(G=g.parameters)==null?void 0:G.docs)==null?void 0:P.source}}};var L,$,H;b.parameters={...b.parameters,docs:{...(L=b.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    rowCount: 3,
    disabledRowCount: 2,
    itemCount: 4
  }
}`,...(H=($=b.parameters)==null?void 0:$.docs)==null?void 0:H.source}}};var J,K,Q;f.parameters={...f.parameters,docs:{...(J=f.parameters)==null?void 0:J.docs,source:{originalSource:`{
  args: {
    rowCount: 5,
    itemCount: 4,
    generateDroppableMap: true
  }
}`,...(Q=(K=f.parameters)==null?void 0:K.docs)==null?void 0:Q.source}}};const Te=["UnstackedItems","StackedItems","BackgroundItems","DisabledRows","DisabledRowsPerItem"];export{g as BackgroundItems,b as DisabledRows,f as DisabledRowsPerItem,p as StackedItems,c as UnstackedItems,Te as __namedExportsOrder,Re as default};
//# sourceMappingURL=Timeline.stories-bd59d3d7.js.map
