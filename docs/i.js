pxtex=(t,i,e,s,h=10,n=10,l=10,r=t.getContext`2d`,W,o,a=Math.random)=>{for(t.width=n,t.height=l,W=n;W--;)for(o=l;o--;)r.fillStyle=`hsl(${i+(a()-.5)*h},${e+(a()-.5)*h}%,${s+(a()-.5)*h}%)`,r.fillRect(W,o,1,1)},W={i:{},reset:i=>{W.canvas=i,W.objs=0,W.current={},W.next={},W.l={},W.W=!1,W.gl=i.getContext("webgl2"),W.gl.blendFunc(770,771),W.gl.activeTexture(33984),W.program=W.gl.createProgram(),W.gl.enable(2884),W.gl.shaderSource(t=W.gl.createShader(35633),"#version 300 es\nprecision highp float;in vec4 pos, col, uv;uniform mat4 pv, eye, m, im;uniform vec4 bb;out vec4 v_pos, v_col, v_uv;void main() {gl_Position = pv * (v_pos = bb.z > 0.? m[3] + eye * pos * bb: m * pos);v_col = col;v_uv = uv;}"),W.gl.compileShader(t),W.gl.attachShader(W.program,t),W.gl.shaderSource(t=W.gl.createShader(35632),"#version 300 es\nprecision highp float;in vec4 v_pos, v_col, v_uv;uniform vec3 light;uniform vec4 o;uniform sampler2D sampler;out vec4 c;void main() {float ambient = o[2];vec3 light_dir = normalize(light - v_pos.xyz);vec3 normal = normalize(cross(dFdx(v_pos.xyz), dFdy(v_pos.xyz)));float lambert = max(0., dot(light_dir, normal)) * 0.7;float specular = 0.;if(o[0] > 0.) {vec3 R = reflect(-light_dir, normal);vec3 V = normalize(-v_pos.xyz);float specAngle = max(dot(R, V), 0.);specular = pow(specAngle, o[0]) * 0.3;}c = mix(texture(sampler, v_uv.xy), v_col, o[3]);float f = o[1] > 0. ? ambient + lambert + specular : 1.;c = vec4(c.rgb * f, c.a);}"),W.gl.compileShader(t),W.gl.attachShader(W.program,t),W.gl.linkProgram(W.program),W.gl.useProgram(W.program),W.gl.clearColor(1,1,1,1),W.clearColor=t=>W.gl.clearColor(...W.o(t)),W.clearColor("fff"),W.gl.enable(2929),W.u({y:1}),W.camera({fov:30}),setTimeout(W.draw,16)},_:(t,i,e,s,h=[],n,l,r,o,a,d,u,f)=>{if(t.n||="o"+W.objs++,t.size&&(t.w=t.h=t.d=t.size),t.t?.width&&!W.l[t.t.id]&&(e=W.gl.createTexture(),W.gl.pixelStorei(37441,!0),W.gl.bindTexture(3553,e),W.gl.pixelStorei(37440,1),W.gl.texImage2D(3553,0,6408,6408,5121,t.t),W.gl.generateMipmap(3553),W.l[t.t.id]=e),t.fov){let i=1/Math.tan(t.fov*Math.PI/180),e=.1,s=80,h=s-e;W.projection=new DOMMatrix([i/(W.canvas.width/W.canvas.height),0,0,0,0,i,0,0,0,0,-(s+e)/h,-1,0,0,-2*s*e/h,0])}t={type:i,...W.current[t.n]=W.next[t.n]||{w:1,h:1,d:1,x:0,y:0,z:0,rx:0,ry:0,rz:0,b:"888",mix:0},...t,f:0},W.i[t.type]?.vertices&&!W.i?.[t.type].verticesBuffer&&(W.gl.bindBuffer(34962,W.i[t.type].verticesBuffer=W.gl.createBuffer()),W.gl.bufferData(34962,new Float32Array(W.i[t.type].vertices),35044),W.i[t.type].p||W.smooth(t),W.i[t.type].p&&(W.gl.bindBuffer(34962,W.i[t.type].normalsBuffer=W.gl.createBuffer()),W.gl.bufferData(34962,new Float32Array(W.i[t.type].p.flat()),35044))),W.i[t.type]?.uv&&!W.i[t.type].uvBuffer&&(W.gl.bindBuffer(34962,W.i[t.type].uvBuffer=W.gl.createBuffer()),W.gl.bufferData(34962,new Float32Array(W.i[t.type].uv),35044)),W.i[t.type]?.indices&&!W.i[t.type].indicesBuffer&&(W.gl.bindBuffer(34963,W.i[t.type].indicesBuffer=W.gl.createBuffer()),W.gl.bufferData(34963,new Uint16Array(W.i[t.type].indices),35044)),t.t?t.t&&!t.mix&&(t.mix=0):t.mix=1,W.next[t.n]=t},draw:(t,i,e,s,h=[])=>{if(i=t-W.lastFrame,W.lastFrame=t,requestAnimationFrame(W.draw),W.W)W.onDraw(t);else{for(s in W.next.camera.g&&W.m(W.next[W.next.camera.g],i,1),e=W.animation("camera"),W.next?.camera?.g&&e.preMultiplySelf(W.next[W.next.camera.g].v),W.gl.uniformMatrix4fv(W.gl.getUniformLocation(W.program,"eye"),!1,e.toFloat32Array()),e.invertSelf(),e.preMultiplySelf(W.projection),W.gl.uniformMatrix4fv(W.gl.getUniformLocation(W.program,"pv"),!1,e.toFloat32Array()),W.gl.clear(16640),W.next){let t=W.next[s];t.t||1!=W.o(t.b)[3]?h.push(t):W.m(t,i)}for(s of(h.sort(((t,i)=>W.O(i)-W.O(t))),W.gl.enable(3042),h))["plane","billboard"].includes(s.type)&&W.gl.depthMask(0),W.m(s,i),W.gl.depthMask(1);W.gl.disable(3042),W.gl.uniform3f(W.gl.getUniformLocation(W.program,"light"),W.M("light","x"),W.M("light","y"),W.M("light","z")),W.onDraw(t)}},m:(t,i,e=["camera","light","group"].includes(t.type),s)=>{t.t&&(W.gl.bindTexture(3553,W.l[t.t.id]),W.gl.uniform1i(W.gl.getUniformLocation(W.program,"sampler"),0)),t.f>=t.a?(t.onAnimDone?.(),delete t.a,delete t.onAnimDone):t.f<t.a&&(t.f+=i),t.f>t.a&&(t.f=t.a),W.next[t.n].v=W.animation(t.n),W.next[t.g]&&W.next[t.n].v.preMultiplySelf(W.next[t.g].v),W.gl.uniformMatrix4fv(W.gl.getUniformLocation(W.program,"m"),!1,W.next[t.n].v.toFloat32Array()),W.gl.uniformMatrix4fv(W.gl.getUniformLocation(W.program,"im"),!1,DOMMatrix.fromMatrix(W.next[t.n].v).invertSelf().toFloat32Array()),e||(W.gl.bindBuffer(34962,W.i[t.type].verticesBuffer),W.gl.vertexAttribPointer(s=W.gl.getAttribLocation(W.program,"pos"),3,5126,!1,0,0),W.gl.enableVertexAttribArray(s),W.i[t.type].uvBuffer&&(W.gl.bindBuffer(34962,W.i[t.type].uvBuffer),W.gl.vertexAttribPointer(s=W.gl.getAttribLocation(W.program,"uv"),2,5126,!1,0,0),W.gl.enableVertexAttribArray(s)),W.gl.uniform4f(W.gl.getUniformLocation(W.program,"o"),t.s,t.ns?0:1,W.ambientLight||.2,t.mix),W.gl.uniform4f(W.gl.getUniformLocation(W.program,"bb"),t.w,t.h,"billboard"==t.type,0),W.i[t.type].indicesBuffer&&W.gl.bindBuffer(34963,W.i[t.type].indicesBuffer),W.gl.vertexAttrib4fv(W.gl.getAttribLocation(W.program,"col"),W.o(t.b)),W.i[t.type].indicesBuffer?W.gl.drawElements(4,W.i[t.type].indices.length,5123,0):W.gl.drawArrays(4,0,W.i[t.type].vertices.length/3))},M:(t,i)=>{let e=W.next[t];if(!e?.a)return e[i];let s=W.current[t];return s[i]+(e[i]-s[i])*(e.f/e.a)},animation:(t,i=new DOMMatrix)=>W.next[t]?i.translateSelf(W.M(t,"x"),W.M(t,"y"),W.M(t,"z")).rotateSelf(W.M(t,"rx"),W.M(t,"ry"),W.M(t,"rz")).scaleSelf(W.M(t,"w"),W.M(t,"h"),W.M(t,"d")):i,O:(t,i=W.next.camera)=>t?.v&&i?.v?(i.v.m41-t.v.m41)**2+(i.v.m42-t.v.m42)**2+(i.v.m43-t.v.m43)**2:0,A:t=>W.ambientLight=t,o:t=>[...t.match(t.length<5?/./g:/../g).map((i=>("0x"+i)/(t.length<5?15:255))),1],add:(t,i)=>{W.i[t]=i,i.p&&(W.i[t].customNormals=1),W[t]=i=>W._(i,t)},group:t=>W._(t,"group"),move:t=>setTimeout((()=>{W._(t)}),1),delete:t=>setTimeout((()=>{delete W.next[t]}),1),camera:t=>setTimeout((()=>{W._(t,t.n="camera")}),1),u:t=>W._(t,t.n="light")},W.smooth=(t,i={},e=[],s,h,n,l,r,o,a,d,u,f,y)=>{for(W.i[t.type].p=[],n=0;n<W.i[t.type].vertices.length;n+=3)e.push(W.i[t.type].vertices.slice(n,n+3));for((s=W.i[t.type].indices)?h=1:(s=e,h=0),n=0;n<2*s.length;n+=3){l=n%s.length,r=e[d=h?W.i[t.type].indices[l]:l],o=e[u=h?W.i[t.type].indices[l+1]:l+1],a=e[f=h?W.i[t.type].indices[l+2]:l+2],AB=[o[0]-r[0],o[1]-r[1],o[2]-r[2]],BC=[a[0]-o[0],a[1]-o[1],a[2]-o[2]],y=n>l?[0,0,0]:[AB[1]*BC[2]-AB[2]*BC[1],AB[2]*BC[0]-AB[0]*BC[2],AB[0]*BC[1]-AB[1]*BC[0]];let _=r[0]+"_"+r[1]+"_"+r[2],x=o[0]+"_"+o[1]+"_"+o[2],p=a[0]+"_"+a[1]+"_"+a[2];i[_]||=[0,0,0],i[x]||=[0,0,0],i[p]||=[0,0,0],W.i[t.type].p[d]=i[_]=i[_].map(((t,i)=>t+y[i])),W.i[t.type].p[u]=i[x]=i[x].map(((t,i)=>t+y[i])),W.i[t.type].p[f]=i[p]=i[p].map(((t,i)=>t+y[i]))}},W.add("plane",{vertices:[.5,.5,0,-.5,.5,0,-.5,-.5,0,.5,.5,0,-.5,-.5,0,.5,-.5,0],uv:[1,1,0,1,0,0,1,1,0,0,1,0]}),W.add("billboard",W.i.plane),W.add("cube",{vertices:[.5,.5,.5,-.5,.5,.5,-.5,-.5,.5,.5,.5,.5,-.5,-.5,.5,.5,-.5,.5,.5,.5,-.5,.5,.5,.5,.5,-.5,.5,.5,.5,-.5,.5,-.5,.5,.5,-.5,-.5,.5,.5,-.5,-.5,.5,-.5,-.5,.5,.5,.5,.5,-.5,-.5,.5,.5,.5,.5,.5,-.5,.5,.5,-.5,.5,-.5,-.5,-.5,-.5,-.5,.5,.5,-.5,-.5,-.5,-.5,-.5,.5,-.5,.5,-.5,.5,.5,-.5,.5,-.5,-.5,-.5,.5,-.5,.5,-.5,-.5,-.5,-.5,-.5,.5,-.5,.5,-.5,-.5,.5,-.5,-.5,-.5,.5,-.5,.5,-.5,-.5,-.5,.5,-.5,-.5],uv:[1,1,0,1,0,0,1,1,0,0,1,0,1,1,0,1,0,0,1,1,0,0,1,0,1,1,0,1,0,0,1,1,0,0,1,0,1,1,0,1,0,0,1,1,0,0,1,0,1,1,0,1,0,0,1,1,0,0,1,0,1,1,0,1,0,0,1,1,0,0,1,0]}),W.cube=t=>W._(t,"cube");let i=new AudioContext;"use strict";let e={T:'"Courier New", monospace',k:"Arial, sans-serif",N:'"Times New Roman", serif',S:30,I:60,D:"Triskaidekaphobia",R(t){if(!t.g)return t;let i=W.next[t.g];return{x:i.x+t.x,y:i.y+t.y,z:i.z+t.z,w:t.w,h:t.h}},init(){e.P.C((()=>{e.F.init(),e.L.init()}))},K(){let t=localStorage.getItem("2024_sd_elevator.save");return t?JSON.parse(t):null},B(t){localStorage.setItem("2024_sd_elevator.save",JSON.stringify({level:t}))}};window.addEventListener("load",(()=>e.init())),e.P={U:{s_note1:["I'm leaving this note for whoever gets lost","here as well. You are now stuck in a cursed","elevator. But if I'm not in here (and neither","my dead body), I must've made it out!","","Don't worry, I'm going to leave you some","tips as I figure this situation out!"],s_note2:["Everything went black and now it's 1 again.","My note is also gone.","","There is a fellow on floor 3, seems harmless."],s_note3:["Back again, last note gone again.","Floor 7 is new."],s_note4:["Found a note book with torn pages. I guess","this is from that note writter.","","Lets continue the tradition...","","Here's a survival tip: You can close the doors.",'Hit the "><" button or go to another floor.'],s_note5a:new Array(24).fill("NO MORE REPEATS NO MORE REPEATS"),s_note5b:["SICK OF PAIN SICK OF PAIN SICK OF","PAIN SO SICK OF PAIN! NO MORE BITING!","STAY HERE, KEEP THE DOORS CLOSED","FOREVER? OR CAN I HIDE BETTER IN","THE DARK?"],s_note5c:["WHERE IS THE BUTTON?!"],s_note6:["Lost note book. Is 1 the way out?","Hope"],blue1:["Please go. Leave me alone."],blue2:["Go! Don't let it find me."],blue3:["not...alone"],blue4:["It won't find me here, right? Why come back?","Oh, it smells rotten... Please go. Leave me alone."],pink1:["Join us? Safe together. Step out the elevator.","Let us huddle together."],pink2:["Offer still stands. Always welcome."]},l:{},G(){for(let t=0;t<14;t++){let i="s_lbl_btn"+t,s=0==t?"><":String(t).padStart(2,"0"),[h,n]=e.L.H(100,70,i);n.font="600 32px "+e.k,n.textBaseline="middle",n.fillText(s,50,37),this.l[i]=h}},V(){let t=Math.round(70.7),i=e.L.H(50,t,"paper")[0];pxtex(i,0,0,95,3,50,t),this.l.J=i},$(){let t=e.L.H(200,300,"wall")[0];pxtex(t,0,0,20,3,200,300),this.l.Y=t;let i=e.L.H(100,100,"ceil")[0];pxtex(i,0,0,100,3,100,100),this.l.ceil=i;let s=e.L.H(100,100,"floor")[0];pxtex(s,0,0,10,1,100,100),this.l.floor=s;let h=e.L.H(40,300,"fs")[0];pxtex(h,0,0,20,3,40,300),this.l.j=h;let n=e.L.H(200,75,"ft")[0];pxtex(n,0,0,20,3,200,75),this.l.q=n},X(){let t=Math.round(120),[i,s]=e.L.H(600,t,"title");s.fillStyle="#f00",s.font="600 64px "+e.N,s.fillText(e.D,300,t/2),this.l.title=i},Z(t,i){let s="audio:"+t+i;if(this.l[s])return this.l[s];let h=Math.round(100),[n,l]=e.L.H(200,h,s);return l.fillStyle="#"+i,l.font="36px "+e.k,l.textBaseline="middle",l.fillText(String(t),100,h/2+6),this.l[s]=n,n},tt(t){let i="dis:"+t;if(this.l[i])return this.l[i];let s=200,h=Math.round(100),[n,l]=e.L.H(s,h,i);return l.fillStyle="#f00",l.fillRect(0,0,s,h),l.fillStyle="#fff",l.font="600 64px "+e.T,l.textBaseline="middle",l.fillText(String(t),100,h/2+6),this.l[i]=n,n},it(t,i){let s="eyes:"+t+i;if(this.l[s])return this.l[s];let[h,n]=e.L.H(200,50,s);return n.fillStyle="#"+i,n.font="600 42px "+e.T,n.textBaseline="middle",n.fillText(String(t),100,25),this.l[s]=h,h},C(t){this.X(),this.G(),this.$(),this.V(),t()}},e.Audio={et:[.3,0,626,,.01,.01,,2.2,,,,,,,,.1,.01,.79,.02],st:[1.5,0,783.99,.07,,1.6,1,2,,,,,,,,,,.3,.15],ht:[1,0,164.8138,.2,1.1,.2,3,4,,,,,,,,.1,,,.5,,-562],nt:[.3,0,146.8324,.2,2,.3,1,2,,,,,,3],ERROR:[.3,0,71,,.02,.05,3,.2,,68,,,,,,,.01,.96,.02,,389],lt:[1,0,453,,.07,.008,4,1.6,-6,-2,,,,.4,,.4,.02,.55,.04,,1424],rt:[.5,0,427,.01,.02,.02,1,3.7,,12,138,.03,,.1,180,1,,.97,.01],Wt:[2,0,453,.03,.03,.16,4,3.7,-1,,,,,.2,1.3,.2,.1,.52,.07],play(t,e){e&&((t=t.slice())[5]=e-(t[3]||0)-(t[5]||0)-(t[18]||0)),((t=1,e=.05,s=220,h=0,n=0,l=.1,r=0,W=1,o=0,a=0,d=0,u=0,f=0,y=0,_=0,x=0,p=0,g=1,b=0,c=0,m=0)=>{let w=Math,v=2*w.PI,z=44100,O=o*=500*v/z/z,E=s*=(1-e+2*e*w.random(e=[]))*v/z,M=0,A=0,T=0,k=1,N=0,S=0,I=0,D=m<0?-1:1,R=v*D*m*2/z,C=w.cos(R),P=w.sin,F=P(R)/4,L=1+F,K=-2*C/L,B=(1-F)/L,U=(1+D*C)/2/L,G=-(D+C)/L,H=U,V=0,J=0,$=0,Y=0;for(a*=500*v/z**3,_*=v/z,d*=v/z,u*=z,f=z*f|0,t*=.3,D=(h=z*h+9)+(b*=z)+(n*=z)+(l*=z)+(p*=z)|0;T<D;e[T++]=I*t)++S%(100*x|0)||(I=r?1<r?2<r?3<r?P(M**3):w.max(w.min(w.tan(M),1),-1):1-(2*M/v%2+2)%2:1-4*w.abs(w.round(M/v)-M/v):P(M),I=(f?1-c+c*P(v*T/f):1)*(I<0?-1:1)*w.abs(I)**W*(T<h?T/h:T<h+b?1-(T-h)/b*(1-g):T<h+b+n?g:T<D-p?(D-T-p)/l*g:0),I=p?I/2+(p>T?0:(T<D-p?1:(D-T)/p)*e[T-p|0]/2/t):I,m&&(I=Y=H*V+G*(V=J)+U*(J=I)-B*$-K*($=Y))),R=(s+=o+=a)*w.cos(_*A++),M+=R+R*y*P(T**5),k&&++k>u&&(s+=d,E+=d,k=0),!f||++N%f||(s=E,o=O,k=k||1);(t=i.createBuffer(1,D,z)).getChannelData(0).set(e),(s=i.createBufferSource()).buffer=t,s.connect(i.destination),s.start()})(...t)},text(t,i,s,h){let n=e.P.Z(t,i),l=.01*s;W.plane({n:n.id,g:h.g,x:h.x,y:h.y+.05,z:h.z+.1,w:.5,h:.25,t:n,ns:1}),W.move({n:n.id,y:h.y+.05+l,a:1e3*s,onAnimDone:()=>W.delete(n.id)})}},e.F={ot:{dt:1,ut:2,ft:3,yt:10,_t:11,xt:12,gt:13},bt:{},ct:{},wt:{},vt:{},zt(){this.Ot={[this.ot.dt]:{keyboard:["Escape"]},[this.ot._t]:{keyboard:["ArrowUp","KeyW","KeyZ","KeyY"]},[this.ot.yt]:{keyboard:["ArrowLeft","KeyA","KeyQ"]},[this.ot.gt]:{keyboard:["ArrowDown","KeyS"]},[this.ot.xt]:{keyboard:["ArrowRight","KeyD"]},[this.ot.ut]:{keyboard:["KeyE","Enter"]}}},Et(){let t=0,i=0;return this.Mt(this.ot.yt)?t=-1:this.Mt(this.ot.xt)&&(t=1),this.Mt(this.ot._t)?i=-1:this.Mt(this.ot.gt)&&(i=1),{x:t,y:i}},At(t){return this.Ot[t]},init(){this.zt(),this.Tt()},Mt(t,i){let e=this.At(t);for(let t of e.keyboard)if(this.kt(t,i))return!0;return!1},kt(t,i){let e=this.vt[t];return!(!e||!e.time)&&(i&&(e.time=0,e.Nt=!0),!0)},St(t,i){let e=this.ct[t]||[];e.push(i),this.ct[t]=e},It(t,i){let e=this.wt[t]||[];e.push(i),this.wt[t]=e},Tt(){document.body.onkeydown=t=>{let i=this.vt[t.code];i&&i.Nt||(this.vt[t.code]={time:Date.now()},this.ct[t.code]&&this.ct[t.code].forEach((t=>t())))},document.body.onkeyup=t=>{this.vt[t.code]={time:0},this.wt[t.code]&&this.wt[t.code].forEach((t=>t()))}}},e.L={camera:{rx:0,ry:0},Dt:!1,Rt:null,Ct:null,Pt:null,Ft:null,Lt:new DOMPoint(0,0,-1),Kt:0,Bt(){let t=[],i=this.Ut(),e={min:[],max:[]};for(let s in W.next){if(!s.startsWith("s_"))continue;let h=W.next[s],n=0;if("plane"!=h.type&&"billboard"!=h.type&&(n=h.d),e.min[0]=h.x-h.w/2,e.min[1]=h.y-h.h/2,e.min[2]=h.z-n/2,h.g){let t=W.next[h.g];e.min[0]+=t.x,e.min[1]+=t.y,e.min[2]+=t.z}e.max[0]=e.min[0]+h.w,e.max[1]=e.min[1]+h.h,e.max[2]=e.min[2]+n,90!=h.ry&&-90!=h.ry||(e.min[0]-=h.w/2,e.max[0]+=h.w/2,e.min[2]-=h.w/2,e.max[2]+=h.w/2);let l=this.Gt(i,e);l&&t.push([h,l])}let s=this.Ht(i.origin,t);return!s?.n.startsWith("s__")&&s},Vt(t,i){let s=Math.round(Math.min(735.28,window.innerHeight-40)),h=(this.Ct.width-520)/2,n=(this.Ct.height-s)/2;this.Ft.drawImage(e.P.l.J,h,n,520,s),this.Ft.fillStyle=i||"#000",this.Ft.font="24px "+e.k,this.Ft.textAlign="left",this.Ft.textBaseline="top";for(let i=0;i<t.length;i++)this.Ft.fillText(t[i],h+20,n+20+29*i)},Jt(){this.Ft.fillStyle="#00000070",this.Ft.fillRect(0,0,this.Ct.width,this.Ct.height),this.Ft.fillStyle="#fff",this.Ft.font="96px "+e.N,this.Ft.textAlign="center",this.Ft.fillText("PAUSED",this.Ct.width/2,this.Ct.height/2)},Ht(t,i){if(1==i.length)return i[0][0];let e=null,s=1/0;for(let h=0;h<i.length;h++){let n=i[h][1],l=[n[0]-t[0],n[1]-t[1],n[2]-t[2]],r=Math.sqrt(l[0]*l[0]+l[1]*l[1]+l[2]*l[2]);r<s&&(e=i[h][0],s=r)}return e},H(t,i,e){let s=document.createElement("canvas");s.width=t,s.height=i,e&&(s.id=e);let h=s.getContext("2d",{alpha:!0});return h.imageSmoothingEnabled=!1,h.textAlign="center",[s,h]},Ut(){let t=W.next.camera,i=(new DOMMatrix).rotateSelf(t.rx,t.ry,t.rz),e={origin:[t.x,t.y,t.z],dir:this.Lt.matrixTransform(i)};return e.dir=[e.dir.x,e.dir.y,e.dir.z],e},init(){this.Rt=document.getElementById("c"),this.Ct=document.getElementById("ui"),this.Ft=this.Ct.getContext("2d",{alpha:!0}),this.Ft.imageSmoothingEnabled=!1,this.resize(),W.onDraw=this.update.bind(this),W.reset(this.Rt),W.clearColor("000"),W.A(.2),this.Tt(),this.level=new e.$t},Gt(t,i){let e=!0,s=[],h=[],n=[],l=[];for(let h=0;h<3;h++)t.origin[h]<i.min[h]?(s[h]=1,n[h]=i.min[h],e=!1):t.origin[h]>i.max[h]?(s[h]=0,n[h]=i.max[h],e=!1):s[h]=2;if(e)return t.origin;for(let i=0;i<3;i++)2!=s[i]&&0!=t.dir[i]?h[i]=(n[i]-t.origin[i])/t.dir[i]:h[i]=-1;let r=0;for(let t=1;t<3;t++)h[r]<h[t]&&(r=t);if(h[r]<0)return null;for(let e=0;e<3;e++)if(r!=e){if(l[e]=t.origin[e]+h[r]*t.dir[e],l[e]<i.min[e]||l[e]>i.max[e])return null}else l[e]=n[e];return l},pause(){this.W=!0,document.body.classList.add("p"),W.W=!0},Tt(){let t=null,i=null;window.addEventListener("resize",(t=>this.resize()));let s=e.F.At(e.F.ot.dt),h=()=>{this.Yt(),t=null,i=null};s.keyboard.forEach((t=>e.F.It(t,h))),this.Rt.addEventListener("mousedown",(t=>{0===t.button&&this.level&&this.level.jt()})),this.Rt.addEventListener("mouseenter",(e=>{this.level&&!this.Dt&&(t=e.clientX,i=e.clientY)})),this.Rt.addEventListener("mousemove",(e=>{if(this.level&&!this.W&&!this.Dt){if(null===t)return t=e.clientX,void(i=e.clientY);this.camera.rx-=.4*(e.clientY-i),this.camera.ry-=.4*(e.clientX-t),this.camera.rx=Math.min(80,Math.max(-60,this.camera.rx)),this.camera.ry=this.camera.ry%360,W.camera(this.camera),t=e.clientX,i=e.clientY}})),e.F.It("KeyR",(()=>{this.Dt||(this.camera.rx=0,this.camera.ry=0,W.camera(this.camera))}))},resize(){let t=4/3,i=window.innerWidth,e=window.innerHeight;i>e?(e-=40,i=Math.round(Math.min(i,e*t))):i<e&&(i-=40,e=Math.round(Math.min(e,i*t))),this.Rt.width=i,this.Rt.height=e,this.Ct.width=i,this.Ct.height=e,W.next?.camera&&(W.camera({fov:W.next.camera.fov}),W.gl.viewport(0,0,i,e))},Yt(){this.W?this.unpause():this.pause()},unpause(){this.W=!1,document.body.classList.remove("p"),W.W=!1},update(t=0){if(t&&this.qt){let i=(t-this.qt)/(1e3/e.I);if(this.Ft.clearRect(0,0,this.Ct.width,this.Ct.height),this.Ft.imageSmoothingEnabled=!1,this.Ft.fillStyle="#fff",this.Ft.font="11px monospace",this.Ft.textAlign="left",this.Ft.fillText(~~(e.I/i)+" FPS",10,20),this.W)return void this.Jt();if(this.Kt+=i,this.level.update(i),!this.Dt){let t=.3;e.F.Mt(e.F.ot._t)?this.camera.rx+=t:e.F.Mt(e.F.ot.gt)&&(this.camera.rx-=t),e.F.Mt(e.F.ot.yt)?this.camera.ry+=t:e.F.Mt(e.F.ot.xt)&&(this.camera.ry-=t),this.camera.rx=Math.min(80,Math.max(-60,this.camera.rx)),this.camera.ry=this.camera.ry%360,W.camera(this.camera)}}this.qt=t}},e.Qt={Xt:0,D:1,Zt:2,ti:3,ii:4,ei:5,si:6},e.hi={OPEN:1,OPENING:2,CLOSED:3,CLOSING:4,IDLE:5,ni:6},e.$t=class{constructor(){this.li=0,this.ri=!0,this.Wi=[],this.Kt=0,this.oi=[],this.ai=0,this.di=e.hi.OPEN,this.ui=e.hi.IDLE,this.fi=1,this.yi=this.fi,this._i=[],this.loop=5,this.xi=2.5,this.pi=3,this.gi=2,W.u({y:this.pi/2-.2}),W.plane({n:"title",z:-2,w:1,h:.2,b:"f00",t:e.P.l.title}),W.group({n:"ev"}),this.bi(),this.ci(),this.mi(),this.wi(),this.zi(),this.Oi(),this.Ei(),this.Mi(this.fi),this.Ai(this.loop),this.Ti(this.fi),document.getElementById("b").remove()}mi(){let t="display";W.group({n:t,g:"ev",y:this.pi/2-.25-.15,z:-this.gi/2+.06}),W.plane({g:t,n:"dis",w:.5,h:.25,b:"f00"})}ci(){let t=this.xi/2,i=.05;this.ki=t/2+.0025,this.Ni=this.ki+this.xi/2-this.xi/3.5,W.group({n:"dlg",g:"ev",x:-this.Ni,z:-this.gi/2}),W.cube({g:"dlg",w:t,h:this.pi,d:i,b:"aaa",s:20}),W.plane({n:"dsl",g:"dlg",b:"0008",y:-this.pi/2-.001,z:-.27,h:100,rx:-90,ry:20,ns:1}),W.group({n:"drg",g:"ev",x:this.Ni,z:-this.gi/2}),W.cube({g:"drg",w:t,h:this.pi,d:i,b:"aaa",s:20}),W.plane({n:"dsr",g:"drg",b:"0008",y:-this.pi/2-.001,z:-.27,h:100,rx:-90,ry:-20,ns:1}),this.Si=t/4,W.plane({n:"s_note1",g:"drg",x:(this.Si-t)/2+.1,y:-.1,z:.025+.001,w:this.Si,h:1.414*this.Si,rz:-10,t:e.P.l.J})}wi(){let t="pad";W.group({n:t,g:"ev",x:this.xi/2-.3,y:-.175,z:-this.gi/2+.051}),W.plane({g:t,w:.3,h:.7,b:"bbb",s:20});let i=.02,s=.1,h=.07,n=(s+i)/2;for(let l=0;l<14;l++){let r="btn"+l,o=l%2*(i+s)-n,a=~~(l/2)*(i+h)-.27,d=e.P.l["s_lbl_"+r];W.cube({g:t,n:r,x:o,y:a,w:s,h,d:.02,b:"ddd"}),W.plane({g:t,n:"s_lbl_"+r,x:o,y:a,z:.011,w:s,h,t:d}),13==l&&(this.Ii=JSON.parse(JSON.stringify(W.next[r])),this.Di=JSON.parse(JSON.stringify(W.next["s_lbl_"+r])),this.Di.t=d)}delete this.Ii.v,delete this.Di.v}bi(){let t="ev";W.group({n:t,g:"ev"}),W.plane({g:t,y:-this.pi/2,w:this.xi,h:this.gi,rx:-90,b:"333",t:e.P.l.floor,mix:.5}),W.plane({g:t,y:this.pi/2,w:this.xi,h:this.gi,rx:90,b:"bbb",t:e.P.l.ceil,mix:.5}),W.plane({g:t,x:-this.xi/2,ry:90,w:this.gi,h:this.pi,b:"999",t:e.P.l.Y,s:30,mix:.5}),W.plane({g:t,x:this.xi/2,ry:-90,w:this.gi,h:this.pi,b:"999",t:e.P.l.Y,s:30,mix:.5}),W.plane({g:t,z:this.gi/2,ry:180,w:this.xi,h:this.pi,b:"999",t:e.P.l.Y,s:30,mix:.5}),W.cube({g:t,x:-this.xi/2+.02,y:-this.pi/5,z:.025,w:.04,h:.15,d:this.gi-.15,b:"aaa",s:30}),W.cube({g:t,x:this.xi/2-.02,y:-this.pi/5,z:.025,w:.04,h:.15,d:this.gi-.15,b:"aaa",s:30}),W.cube({g:t,y:-this.pi/5,z:this.gi/2-.02,w:this.xi-.15,h:.15,d:.04,b:"aaa",s:30}),W.cube({g:t,n:"s__fl",x:-(this.xi-this.xi/4.5)/2,z:-this.gi/2,w:this.xi/4.5,h:this.pi,d:.1,b:"999",t:e.P.l.j,s:30,mix:.5}),W.cube({g:t,n:"s__fr",x:(this.xi-this.xi/4.5)/2,z:-this.gi/2,w:this.xi/4.5,h:this.pi,d:.1,b:"999",t:e.P.l.j,s:30,mix:.5}),W.cube({g:t,y:(this.pi-this.pi/4)/2,z:-this.gi/2,w:this.xi,h:this.pi/4,d:.1,b:"999",t:e.P.l.q,s:30,mix:.5})}zi(){W.plane({n:"plane",y:-this.pi/2-.002,z:-this.gi/2-10,w:30,h:20,rx:90,rz:180,b:"111"}),W.plane({n:"e_red",y:.8,z:100,w:.5,h:.125,t:e.P.it("•   •","f00"),ns:1}),W.plane({n:"e_blue",x:.6,y:-.4,z:100,w:.5,h:.125,rx:30,ry:-45,t:e.P.it("•  •","77f"),ns:1}),W.group({n:"e_pink_all",z:100}),W.plane({g:"e_pink_all",n:"e_pink1",x:.4,y:.6,w:.7,h:.175,t:e.P.it("•   •","f2c"),ns:1}),W.plane({g:"e_pink_all",n:"e_pink2",x:.7,y:.2,w:.5,h:.125,ry:20,t:e.P.it("•  •","f2c")}),W.plane({g:"e_pink_all",n:"e_pink3",x:.9,y:-.1,w:.5,h:.125,ry:20,t:e.P.it("•   •","f2c")}),W.plane({g:"e_pink_all",n:"e_pink4",x:1.3,y:.1,w:.4,h:.1,ry:20,rx:-10,t:e.P.it("•  •","f2c")}),W.plane({g:"e_pink_all",n:"e_pink5",x:-.5,y:.3,w:.5,h:.125,ry:-20,t:e.P.it("•  •","f2c")}),W.plane({g:"e_pink_all",n:"e_pink6",x:-.8,w:.4,h:.1,ry:-20,t:e.P.it("•   •","f2c")}),W.plane({g:"e_pink_all",n:"e_pink7",x:-1.2,y:.2,w:.6,h:.15,ry:-20,t:e.P.it("•  •","f2c")}),W.plane({g:"e_pink_all",n:"e_pink8",x:-1.4,y:-.2,w:.5,h:.125,ry:-20,t:e.P.it("•   •","f2c")})}Ei(){let t="fff",i=.005;W.group({n:"hl"}),W.cube({n:"hl_t",g:"hl",size:i,b:t,ns:1}),W.cube({n:"hl_r",g:"hl",size:i,b:t,ns:1}),W.cube({n:"hl_b",g:"hl",size:i,b:t,ns:1}),W.cube({n:"hl_l",g:"hl",size:i,b:t,ns:1})}Oi(){[this.Ri,this.Ci]=e.L.H(120,60,"loops"),this.Ci.font="48px "+e.N,this.Ci.fillStyle="#999",this.Ci.textAlign="left",this.Ci.textBaseline="top",this.Ci.fillText("𝍪",0,0),W.plane({n:"loops",g:"drg",x:-.47,y:.4,z:100,w:.2,h:.1,rz:5,t:this.Ri})}Pi(){if(this.Kt-this.li>.05*e.I){this.li=this.Kt;let t=e.L.Bt();if(t&&t.n!=this.Li?.Fi){let i=t.n;i.startsWith("s_lbl_btn")&&(i=i.substring(6)),W.next[i]&&(this.Li={Fi:t.n,n:i})}else!t&&this.Li&&(this.Li=null)}if(this.Ki(this.Li),this.Li){let t=e.L.Ct,i=e.L.Ft;i.fillStyle="#fff",i.font="20px "+e.T,i.textAlign="center",i.fillText("[E]/LEFT-CLICK TO SELECT",t.width/2,t.height-42),e.F.Mt(e.F.ot.ut,!0)&&this.Bi()}}jt(){this.note?this.note=null:this.Bi()}Ui(t){let i=this.loop,s=this.oi.includes(13),h=e.Qt.Xt;if(1==i)13==t&&(h=e.Qt.ii);else if(2==i)s||this.oi.push(13),3==t?W.move({n:"e_blue",rx:0,ry:0,a:500,onAnimDone:()=>{this.Wi.push({duration:2,Gi:t=>(this.Hi(e.P.U.blue1,W.next.e_blue,"77f",t),t>2||3!=this.fi)}),W.move({n:"e_blue",rx:30,ry:-45,a:2e3})}}):13==t&&(h=e.Qt.ii);else{if(3==i){if(!s&&this.Vi([3,7])&&this.oi.push(13),3==t){let t={x:W.next.e_blue.x,y:W.next.e_blue.y,z:W.next.e_blue.z,h:W.next.e_blue.h};this.Wi.push({duration:2,Gi:i=>(this.Hi(e.P.U.blue2,t,"77f",i),W.move({n:"e_blue",x:t.x+(Math.random()-.5)/60,y:t.y+(Math.random()-.5)/100}),this.ui==e.hi.ni)})}else if(7==t){let t=W.next.e_pink1.y;this.Wi.push({duration:5,Gi:t=>(this.Hi(e.P.U.pink1,W.next.e_pink1,"f2c",t),t>1)},{duration:10,Gi:i=>{let s=(Math.sin(10*Math.PI*i)+1)/2;return W.move({n:"e_pink1",y:t-.025*s,rx:40*s}),i>1||this.ui==e.hi.ni}})}else if(13==t){let{y:t,z:i}=W.next.e_red,s=.3-t,h=-1.5-i;this.Wi.push({duration:2,Gi:n=>(W.move({n:"e_red",y:t+s*n,z:i+h*n}),n>1&&(this.Ji(e.Qt.ii),!0))})}return}if(4==i)!s&&this.Vi([3,4,7])&&this.oi.push(13),3==t?this.Wi.push({duration:2,Gi:t=>(this.Hi(e.P.U.blue3,W.next.e_blue,"77f",t),t>1)}):7==t?this.Wi.push({duration:2,Gi:t=>(this.Hi(e.P.U.pink2,W.next.e_pink1,"f2c",t),t>1)}):13==t&&(h=e.Qt.ii);else if(5==i)if(3==t)this.Wi.push({duration:2,Gi:t=>(this.Hi(e.P.U.blue4,W.next.e_blue,"7ae",t),t>1)});else if(7==t){let t=[5,6,8].map((t=>{let i="e_pink"+t;return{n:i,x:W.next[i].x,y:W.next[i].y}}));this.Wi.push({duration:2,Gi:i=>(t.forEach((t=>{W.move({n:t.n,x:t.x+(Math.random()-.5)/60,y:t.y+(Math.random()-.5)/100})})),this.ui==e.hi.ni)}),W.move({n:"e_red",rx:0,ry:0,rz:0,a:700,onAnimDone:()=>{let{x:t,y:i,z:e}=W.next.e_red;this.Wi.push({duration:5,Gi:s=>!!this.$i(s)||(W.move({n:"e_red",x:(1-s)*t,y:(1-s)*i,z:(1-s)*(e+1)-1}),!1)})}})}else 13==t?h=e.Qt.ii:8!=t&&this._i.includes(7)&&Math.random()<.3&&(W.move({n:"e_red",x:0,y:.5,z:-3}),this.Wi.push({duration:5,Gi:t=>!!this.$i(t)||(W.move({n:"e_red",y:.5*(1-t),z:-2*(1-t)-1}),!1)}));else 6==i&&1==t&&(h=e.Qt.si)}this.Ji(h)}Yi(){return[e.hi.CLOSING,e.hi.OPENING].includes(this.di)}ji(t){this.di==e.hi.CLOSED||this.Yi()?t?.():(this.di=e.hi.CLOSING,e.Audio.play(e.Audio.ht),W.move({n:"dlg",x:-this.ki,a:2e3}),W.move({n:"drg",x:this.ki,a:2e3,onAnimDone:()=>{this.di=e.hi.CLOSED,setTimeout((()=>t?.()),800)}}))}qi(t){this.di==e.hi.OPEN||this.Yi()?t?.():(this.di=e.hi.OPENING,setTimeout((()=>{e.Audio.play(e.Audio.ht),W.move({n:"dlg",x:-this.Ni,a:2e3}),W.move({n:"drg",x:this.Ni,a:2e3,onAnimDone:()=>{this.di=e.hi.OPEN,t?.()}})}),800))}$i(t){if(this.di==e.hi.CLOSED){e.Audio.play(e.Audio.Wt),e.Audio.text("*thud*","f00",3,{x:0,y:.1,z:-1});let t={x:W.next.camera.x,y:W.next.camera.y,z:W.next.camera.z};return this.Wi.push({duration:.7,Gi:i=>(W.camera({x:t.x+(2*Math.random()-1)/300,y:t.y+(2*Math.random()-1)/300,z:t.z+(2*Math.random()-1)/300}),i>1)}),W.move({n:"e_red",z:100}),!0}return t>1&&(this.ai++,this.Ji(e.Qt.ei),!0)}Qi(t){if(t)if(t.n.startsWith("s_note"))this.note=t.n;else if(t.n.startsWith("btn")){if(!this.Xi(t.n)&&5==this.loop&&"btn13"==t.n)return W.move(this.Ii),W.move(this.Di),void this.oi.push(13);if(this.ui==e.hi.IDLE){if(!this.Xi(t.n))return void e.Audio.play(e.Audio.ERROR);e.Audio.play(e.Audio.et),e.Audio.text("*beep*","ff0",1,t);let i=Number(t.n.substring(3));if(0==i)return void this.ji();if(this.fi==i)return void(this.di==e.hi.OPEN?this.ji():this.qi());this.yi=i,this.ui=e.hi.ni,this.ji((()=>this.Ji(e.Qt.ti)))}}}Vi(t){for(let i=0;i<t.length;i++)if(!this._i.includes(t[i]))return!1;return!0}Ki(t){if(!(t&&this.Xi(t.n)||t&&5==this.loop&&"btn13"==t.n))return void W.move({n:"hl",z:100});let i=W.next[t.n],s=e.R(i),h=.005;W.move({n:"hl",x:s.x,y:s.y,z:s.z+(i.ry?0:.01),rx:i.rx,ry:i.ry,rz:i.rz}),W.move({n:"hl_t",y:s.h/2,w:s.w,h}),W.move({n:"hl_r",x:s.w/2,h:s.h,w:h}),W.move({n:"hl_b",y:-s.h/2,w:s.w,h}),W.move({n:"hl_l",x:-s.w/2,h:s.h,w:h})}Xi(t){return!t.startsWith("btn")||this.oi.includes(Number(t.replace("btn","")))}Zi(t){W.camera({x:0,y:0,z:0}),this.loop=t,this._i=[],this.fi=6==this.loop?13:1,this.yi=this.fi,this.Mi(this.fi),this.Ai(t),this.Li=null}Ti(t){let i=this.loop,e={n:"e_red",y:.8,z:100},s={n:"e_blue",y:0,z:100,rx:0},h={n:"e_pink_all",z:100};if(1==i)13==t&&(e.z=-3);else if(2==i)3==t?s.z=-4:13==t&&(e.z=-3);else if(3==i)3==t?s.z=-4:7==t?h.z=-3:13==t&&(e.z=-3);else if(4==i){let i={n:"s_note4",z:100};3==t?(s.y=-1,s.z=-5,s.rx=-90):4==t?i.z=-2:7==t&&(h.z=-3,e.x=W.next.e_pink7.x,e.y=W.next.e_pink7.y,e.z=-3,W.move({n:"e_pink7",z:100})),W.move(i)}else 5==i&&(3==t?s.z=-3:7==t?this._i.includes(7)||(h.z=-3,W.move({n:"e_pink5",x:-.5,y:.2,ry:-30}),W.move({n:"e_pink6",y:-.1,ry:-30}),W.move({n:"e_pink8",x:-1.1,y:.1,ry:-30}),e.x=.75,e.z=-3,e.ry=30):8==t&&(W.move({n:"btn13",x:-.6,y:-1.2,z:-.2,rx:90,ry:10}),W.move({n:"s_lbl_btn13",x:-.6,y:-1.189,z:-.2,rx:-90,ry:10})));W.move(e),W.move(s),W.move(h)}Ai(t){if(this.oi=[[0,13],[0,3],[0,3,7],[0,3,4,7],[0,2,3,4,5,6,7,8,9,10,11,12],[1]][t-1],2==t)W.plane({n:"s_note2",g:"dlg",x:.3,y:-.3,z:.0251,w:this.Si,h:1.414*this.Si,rz:20,t:e.P.l.J});else if(3==t)W.plane({n:"s_note3",x:this.xi/2-.03,y:-.2,z:-.1,w:this.Si,h:1.414*this.Si,ry:-90,t:e.P.l.J}),this.te("𝍫");else if(4==t)W.plane({n:"s_note4",x:-.1,y:-this.pi/2,w:this.Si,h:1.414*this.Si,rx:-90,ry:5,t:e.P.l.J,b:"000",mix:.7}),this.te("𝍬");else if(5==t)W.plane({n:"s_note5c",x:this.xi/2-.03,y:-.2,z:-.1,w:this.Si,h:1.414*this.Si,ry:-90,t:e.P.l.J}),W.plane({n:"s_note5b",x:this.xi/2-.031,y:-.1,z:.18,w:this.Si,h:1.414*this.Si,ry:-90,t:e.P.l.J}),W.plane({n:"s_note5a",x:-this.xi/2+.031,w:this.Si,h:1.414*this.Si,ry:90,t:e.P.l.J}),W.move({n:"btn13",z:100}),W.move({n:"s_lbl_btn13",z:100}),W.move({n:"e_blue",x:-1,y:-.4,ry:-45,t:e.P.it("•  •","7ae")}),this.te("𝍸");else if(6==t){let[t,i]=e.L.H(600,100,"note6");i.font="italic 32px "+e.ie,i.fillStyle="#555",i.textBaseline="top";let s=e.P.U.s_note6;for(let t=0;t<s.length;t++)i.fillText(s[t],300,20+40*t);W.plane({n:"note6",y:-.1,z:.99,w:.6,h:.1,ry:180,t}),W.clearColor("eee"),W.delete("plane"),W.delete("dsl"),W.delete("dsr"),this.te("𝍸𝍩")}t>1&&(W.move({n:"loops",z:.0251}),W.delete("s_note1"),W.delete("title")),t>2&&W.delete("s_note2"),t>3&&W.delete("s_note3"),t>4&&(W.delete("s_note4"),W.delete("e_pink1"),W.delete("e_pink2"),W.delete("e_pink3"),W.delete("e_pink4"),W.delete("e_pink7"))}ee(){let t=[];for(let i=0;i<this.Wi.length;i++){let s=this.Wi[i];s.start??=this.Kt;let h=(this.Kt-s.start)/(s.duration*e.I);s.Gi(h)&&t.push(s)}this.Wi=this.Wi.filter((i=>!t.includes(i)))}Bi(){if(this.Li){let t=W.next[this.Li.n];this.Qi(t)}}Mi(t){W.move({n:"dis",t:e.P.tt(t),mix:.25})}Ji(t){if(this.se==t)return;this.se=t,this.ri=!0;let i=this.loop,s={};if(t==e.Qt.ti){W.next.dialog&&W.move({n:"dialog",z:100});let t={x:W.next.camera.x,y:W.next.camera.y,z:W.next.camera.z},i=this.yi-this.fi;s.duration=Math.min(5,1.2*Math.abs(i)),e.Audio.play(e.Audio.nt,s.duration),s.Gi=s=>(this.Mi(this.fi+Math.round(s*i)),s>1?(this.Ti(this.yi),W.camera(t),e.Audio.play(e.Audio.st),e.Audio.text("*ding*","ff0",3,W.next.display),this.fi=this.yi,this._i.push(this.fi),this.qi((()=>{this.ui=e.hi.IDLE,this.Ji(e.Qt.Xt),setTimeout((()=>this.Ui(this.fi)),1)})),!0):(W.camera({x:t.x+(2*Math.random()-1)/300,y:t.y+(2*Math.random()-1)/300,z:t.z+(2*Math.random()-1)/300}),!1))}else if(t==e.Qt.ii){this.ri=!1;let t=W.next.e_red.z;s.duration=3,s.Gi=s=>{e.L.Dt=!0;let h={z:0,rx:0,ry:0};return s>1?(W.move({n:"e_red",z:100}),e.L.Dt=!1,this.Zi(i+1),setTimeout((()=>this.Ji(e.Qt.Zt)),1),!0):(h.z=-.5*s,W.move({n:"e_red",z:t+h.z}),W.camera(h),!1)}}else if(t==e.Qt.ei)this.ri=!1,s.duration=3,s.Gi=t=>(e.L.Dt=!0,t>1?(e.L.Dt=!1,this.Zi(i),setTimeout((()=>this.Ji(e.Qt.Zt)),1),!0):(e.L.Ft.fillStyle=`rgba(0,0,0,${t})`,e.L.Ft.fillRect(0,0,e.L.Ct.width,e.L.Ct.height),!1));else if(t==e.Qt.Zt)this.ri=!1,this.ji(),s.duration=3,s.Gi=t=>{e.L.Dt=!0;let i={z:0,rx:0,ry:0};return t>1?(W.camera(i),e.L.Dt=!1,document.getElementById("p").hidden=!1,W.delete("title"),setTimeout((()=>this.Ji(e.Qt.Xt)),1),!0):(i.z=-.5*(1-Math.sin(t*Math.PI/2)),W.camera(i),!1)};else if(t==e.Qt.D){document.getElementById("p").hidden=!0,document.body.classList.add("p"),this.ri=!1,e.L.Dt=!0,W.camera({z:-.5,rx:0,ry:0});let t=document.getElementById("b");t.onclick=()=>{t.remove(),document.body.classList.remove("p"),this.Wi.push({duration:1,Gi:t=>(t>1&&setTimeout((()=>this.Ji(e.Qt.Zt)),1),t>1)})}}else t==e.Qt.si&&(document.getElementById("p").hidden=!0,this.ri=!1,e.L.Dt=!0,W.camera({rx:0,ry:0,a:1e3,onAnimDone:()=>{s.duration=5,s.Gi=t=>{if(t<.2)return!1;t-=.2,W.camera({z:-2*t});let i=Math.min(t,1),s=e.L.Ct.width,h=e.L.Ct.height;return e.L.Ft.fillStyle=`rgba(238,238,238,${i})`,e.L.Ft.fillRect(0,0,s,h),e.L.Ft.font="96px "+e.N,e.L.Ft.textAlign="center",e.L.Ft.fillStyle=`rgba(110,110,110,${i})`,e.L.Ft.fillText("ESCAPED",s/2,h/2),!1},this.Wi.push(s)}}));s.Gi&&this.Wi.push(s)}Hi(t,i,s,h){W.next.dialog||([this.he,this.ne]=e.L.H(2,2,"dialog"),W.billboard({n:"dialog",ns:1,t:this.he})),h=Math.min(h,1);let n=0,l=0;for(let i=0;i<t.length;i++){let e=t[i];n+=e.length,l=Math.max(l,e.length)}this.he.width=14*l,this.he.height=30*t.length,this.ne.clearRect(0,0,this.he.width,this.he.height),this.ne.font="600 24px "+e.k,this.ne.textBaseline="top",this.ne.fillStyle="#"+s;let r=Math.round(h*n),o=0,a=t.length,d="";for(let i=0;i<t.length;i++){let e=t[i].substring(0,r-o);if(o+=e.length,a--,d=e[e.length-1],this.ne.fillText(e,this.he.width/2,30*i),o>=r)break}W.gl.deleteTexture(W.l.dialog),delete W.l.dialog;let u=e.R(i),f=.075*a;W.move({n:"dialog",x:u.x,y:u.y+u.h/2+.1-f,z:u.z,w:this.he.width/400,h:this.he.height/400,t:this.he}),(this.le||0)<r&&(this.le=r," "!=d&&e.Audio.play(e.Audio.rt))}update(t){if(this.Kt+=t,this.ee(),this.note){let t=e.P.U[this.note],i=["s_note4","s_note5a","s_note5b","s_note5c"].includes(this.note)&&"#13d";e.L.Vt(t,i),e.F.Mt(e.F.ot.ut,!0)&&(this.note=null)}else this.ri&&this.ui==e.hi.IDLE&&this.Pi()}te(t){this.Ci.clearRect(0,0,this.Ri.width,this.Ri.height),this.Ci.fillText(t,0,0),W.gl.deleteTexture(W.l.loops),delete W.l.loops,W.move({n:"loops",t:this.Ri})}};