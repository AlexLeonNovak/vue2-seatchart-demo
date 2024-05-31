import{d as f,o as b,a as w,n as m,u as C,r as l,w as S,V as k,g as D}from"./index.0f0c5f88.js";const y={cart:{visible:!1},legendVisible:!1,map:{rows:10,columns:10,seatTypes:{default:{label:"Economy",cssClass:"economy",price:15},first:{label:"First Class",cssClass:"first-class",price:25,seatRows:[0,1,2]},reduced:{label:"Reduced",cssClass:"reduced",price:10,seatRows:[7,8,9]}},disabledSeats:[{row:0,col:0},{row:0,col:9}],reservedSeats:[{row:0,col:3},{row:0,col:4}],selectedSeats:[{row:0,col:5},{row:0,col:6}],rowSpacers:[3,7],columnSpacers:[5]}},R=f({__name:"ModalDialog",props:{show:{type:Boolean,default:!1}},emits:["update:show"],setup(n,{emit:t}){const s=a=>{a.key==="Escape"&&e()},e=()=>{t("update:show",!1)};return b(()=>{document.addEventListener("keyup",s)}),w(()=>{document.removeEventListener("keyup",s)}),{__sfc:!0,emits:t,handleClose:s,hideDialog:e}}});var V=function(){var t=this,s=t._self._c,e=t._self._setupProxy;return t.show?s("div",{staticClass:"dialog",on:{click:e.hideDialog}},[s("div",{staticClass:"dialog__content",on:{click:function(a){a.stopPropagation()}}},[s("span",{staticClass:"btn close",on:{click:e.hideDialog}},[t._v("\xD7")]),t._t("default")],2)]):t._e()},M=[],x=m(R,V,M,!1,null,"d6e3e565",null,null);const E=x.exports,z=f({__name:"ModalView",setup(n){const{isTablet:t,isDesktop:s}=C(),e=l(),a=l(null),c=l(!1),h=()=>c.value=!0,i=()=>c.value=!1,v=()=>{var o;a.value=(o=e.value)==null?void 0:o.checkoutCart(),i()},g=o=>{console.log("SubmitEvent",JSON.stringify(o,null,4))},r=l(.3),u=l();return S(()=>{var _;const o=(_=u.value)==null?void 0:_.$el;if(o&&"querySelector"in o){const d=o.querySelector(".sc-map"),p=o.querySelector(".zoom-wrapper .container");r.value=Math.min(p.offsetWidth/d.offsetWidth,p.offsetHeight/d.offsetHeight)}}),{__sfc:!0,isTablet:t,isDesktop:s,seatChartRef:e,checkoutDetailsRef:a,dialogVisible:c,showDialog:h,hideDialog:i,onCheckout:v,onSubmit:g,scale:r,dialog:u,ModalDialog:E,VueZoomable:k,SeatChart:D,simpleOptions:y}}});var $=function(){var t=this,s=t._self._c,e=t._self._setupProxy;return s("div",{staticClass:"content"},[s("div",{staticClass:"preview"},[s("div",{staticClass:"btn-block"},[s("button",{staticClass:"btn",on:{click:e.showDialog}},[t._v("Show dialog")])]),e.checkoutDetailsRef?s("pre",[s("code",[t._v(t._s(JSON.stringify(e.checkoutDetailsRef,null,2)))])]):t._e()]),s(e.ModalDialog,{ref:"dialog",attrs:{show:e.dialogVisible},on:{"update:show":e.hideDialog}},[e.isTablet?s(e.VueZoomable,{staticClass:"zoom-wrapper",attrs:{selector:".sc-map","enable-controll-button":!0,"min-zoom":.1,zoom:e.scale,"initial-zoom":e.scale}},[s(e.SeatChart,{ref:"seatChartRef",attrs:{options:e.simpleOptions},on:{"cart:submit":e.onSubmit}})],1):t._e(),e.isDesktop?s(e.SeatChart,{ref:"seatChartRef",attrs:{options:e.simpleOptions},on:{"cart:submit":e.onSubmit}}):t._e(),s("div",{staticClass:"dialog__footer"},[s("button",{staticClass:"btn",on:{click:e.onCheckout}},[t._v("Checkout")])])],1)],1)},O=[],q=m(z,$,O,!1,null,"a4d53780",null,null);const P=q.exports;export{P as default};