pxtex=(t,s,i,e,h=10,W=10,o=10,r=t.getContext`2d`,n,a,l=Math.random)=>{for(t.width=W,t.height=o,n=W;n--;)for(a=o;a--;)r.fillStyle=`hsl(${s+(l()-.5)*h},${i+(l()-.5)*h}%,${e+(l()-.5)*h}%)`,r.fillRect(n,a,1,1)},debug=1,W={i:{},reset:s=>{W.canvas=s,W.objs=0,W.current={},W.next={},W.W={},W.o=!1,W.gl=s.getContext("webgl2"),W.gl.blendFunc(770,771),W.gl.activeTexture(33984),W.program=W.gl.createProgram(),W.gl.enable(2884),W.gl.shaderSource(t=W.gl.createShader(35633),"#version 300 es\nprecision highp float;in vec4 pos, col, uv;uniform mat4 pv, eye, m, im;uniform vec4 bb;out vec4 v_pos, v_col, v_uv;void main() {gl_Position = pv * (v_pos = bb.z > 0.? m[3] + eye * (pos * bb): m * pos);v_col = col;v_uv = uv;}"),W.gl.compileShader(t),W.gl.attachShader(W.program,t),console.log("vertex shader:",W.gl.getShaderInfoLog(t)||"OK"),W.gl.shaderSource(t=W.gl.createShader(35632),"#version 300 es\nprecision highp float;in vec4 v_pos, v_col, v_uv;uniform vec3 light;uniform vec4 o;uniform sampler2D sampler;out vec4 c;void main() {float ambient = o[2];vec3 light_dir = normalize(light - v_pos.xyz);vec3 normal = normalize(cross(dFdx(v_pos.xyz), dFdy(v_pos.xyz)));float lambert = max(0., dot(light_dir, normal)) * 0.7;float specular = 0.;if(o[0] > 0.) {vec3 R = reflect(-light_dir, normal);vec3 V = normalize(-v_pos.xyz);float specAngle = max(dot(R, V), 0.);specular = pow(specAngle, o[0]) * 0.3;}c = mix(texture(sampler, v_uv.xy), v_col, o[3]);c = vec4(c.rgb * (ambient + lambert + specular), c.a);}"),W.gl.compileShader(t),W.gl.attachShader(W.program,t),console.log("fragment shader:",W.gl.getShaderInfoLog(t)||"OK"),W.gl.linkProgram(W.program),W.gl.useProgram(W.program),console.log("program:",W.gl.getProgramInfoLog(W.program)||"OK"),W.gl.clearColor(1,1,1,1),W.clearColor=t=>W.gl.clearColor(...W.l(t)),W.clearColor("fff"),W.gl.enable(2929),W.u({y:1}),W.camera({fov:30}),setTimeout(W.draw,16)},m:(t,s,i,e,h=[],o,r,n,a,l,c,d,u)=>{if(t.n||="o"+W.objs++,t.size&&(t.w=t.h=t.d=t.size),t.t&&t.t.width&&!W.W[t.t.id]&&(i=W.gl.createTexture(),W.gl.pixelStorei(37441,!0),W.gl.bindTexture(3553,i),W.gl.pixelStorei(37440,1),W.gl.texImage2D(3553,0,6408,6408,5121,t.t),W.gl.generateMipmap(3553),W.W[t.t.id]=i),t.fov){const s=1/Math.tan(t.fov*Math.PI/180),i=.1,e=1e3,h=e-i;W.projection=new DOMMatrix([s/(W.canvas.width/W.canvas.height),0,0,0,0,s,0,0,0,0,-(e+i)/h,-1,0,0,-2*e*i/h,0])}t={type:s,...W.current[t.n]=W.next[t.n]||{w:1,h:1,d:1,x:0,y:0,z:0,rx:0,ry:0,rz:0,b:"888",mode:4,mix:0},...t,f:0},W.i[t.type]?.vertices&&!W.i?.[t.type].verticesBuffer&&(W.gl.bindBuffer(34962,W.i[t.type].verticesBuffer=W.gl.createBuffer()),W.gl.bufferData(34962,new Float32Array(W.i[t.type].vertices),35044),W.i[t.type].p||W.smooth(t),W.i[t.type].p&&(W.gl.bindBuffer(34962,W.i[t.type].normalsBuffer=W.gl.createBuffer()),W.gl.bufferData(34962,new Float32Array(W.i[t.type].p.flat()),35044))),W.i[t.type]?.uv&&!W.i[t.type].uvBuffer&&(W.gl.bindBuffer(34962,W.i[t.type].uvBuffer=W.gl.createBuffer()),W.gl.bufferData(34962,new Float32Array(W.i[t.type].uv),35044)),W.i[t.type]?.indices&&!W.i[t.type].indicesBuffer&&(W.gl.bindBuffer(34963,W.i[t.type].indicesBuffer=W.gl.createBuffer()),W.gl.bufferData(34963,new Uint16Array(W.i[t.type].indices),35044)),t.t?t.t&&!t.mix&&(t.mix=0):t.mix=1,W.next[t.n]=t},draw:(t,s,i,e,h=[])=>{if(s=t-W.lastFrame,W.lastFrame=t,requestAnimationFrame(W.draw),W.o)W.onDraw(t);else{for(e in W.next.camera.g&&W.v(W.next[W.next.camera.g],s,1),i=W.animation("camera"),W.next?.camera?.g&&i.preMultiplySelf(W.next[W.next.camera.g]._),W.gl.uniformMatrix4fv(W.gl.getUniformLocation(W.program,"eye"),!1,i.toFloat32Array()),i.invertSelf(),i.preMultiplySelf(W.projection),W.gl.uniformMatrix4fv(W.gl.getUniformLocation(W.program,"pv"),!1,i.toFloat32Array()),W.gl.clear(16640),W.next){const t=W.next[e];t.t||1!=W.l(t.b)[3]?h.push(t):W.v(t,s)}for(e of(h.sort(((t,s)=>W.M(s)-W.M(t))),W.gl.enable(3042),h))["plane","billboard"].includes(e.type)&&W.gl.depthMask(0),W.v(e,s),W.gl.depthMask(1);W.gl.disable(3042),W.gl.uniform3f(W.gl.getUniformLocation(W.program,"light"),W.A("light","x"),W.A("light","y"),W.A("light","z")),W.onDraw(t)}},v:(t,s,i=["camera","light","group"].includes(t.type),e)=>{t.t&&(W.gl.bindTexture(3553,W.W[t.t.id]),W.gl.uniform1i(W.gl.getUniformLocation(W.program,"sampler"),0)),t.f>=t.a?(t.onAnimDone?.(),delete t.a,delete t.onAnimDone):t.f<t.a&&(t.f+=s),t.f>t.a&&(t.f=t.a),W.next[t.n]._=W.animation(t.n),W.next[t.g]&&W.next[t.n]._.preMultiplySelf(W.next[t.g]._),W.gl.uniformMatrix4fv(W.gl.getUniformLocation(W.program,"m"),!1,W.next[t.n]._.toFloat32Array()),W.gl.uniformMatrix4fv(W.gl.getUniformLocation(W.program,"im"),!1,DOMMatrix.fromMatrix(W.next[t.n]._).invertSelf().toFloat32Array()),i||(W.gl.bindBuffer(34962,W.i[t.type].verticesBuffer),W.gl.vertexAttribPointer(e=W.gl.getAttribLocation(W.program,"pos"),3,5126,!1,0,0),W.gl.enableVertexAttribArray(e),W.i[t.type].uvBuffer&&(W.gl.bindBuffer(34962,W.i[t.type].uvBuffer),W.gl.vertexAttribPointer(e=W.gl.getAttribLocation(W.program,"uv"),2,5126,!1,0,0),W.gl.enableVertexAttribArray(e)),W.gl.uniform4f(W.gl.getUniformLocation(W.program,"o"),t.s,(t.mode>3||W.gl[t.mode]>3)&&!t.O?1:0,W.ambientLight||.2,t.mix),W.gl.uniform4f(W.gl.getUniformLocation(W.program,"bb"),t.w,t.h,"billboard"==t.type,0),W.i[t.type].indicesBuffer&&W.gl.bindBuffer(34963,W.i[t.type].indicesBuffer),W.gl.vertexAttrib4fv(W.gl.getAttribLocation(W.program,"col"),W.l(t.b)),W.i[t.type].indicesBuffer?W.gl.drawElements(+t.mode||W.gl[t.mode],W.i[t.type].indices.length,5123,0):W.gl.drawArrays(+t.mode||W.gl[t.mode],0,W.i[t.type].vertices.length/3))},A:(t,s)=>{const i=W.next[t];if(!i?.a)return i[s];const e=W.current[t];return e[s]+(i[s]-e[s])*(i.f/i.a)},animation:(t,s=new DOMMatrix)=>W.next[t]?s.translateSelf(W.A(t,"x"),W.A(t,"y"),W.A(t,"z")).rotateSelf(W.A(t,"rx"),W.A(t,"ry"),W.A(t,"rz")).scaleSelf(W.A(t,"w"),W.A(t,"h"),W.A(t,"d")):s,M:(t,s=W.next.camera)=>t?._&&s?._?(s._.m41-t._.m41)**2+(s._.m42-t._.m42)**2+(s._.m43-t._.m43)**2:0,T:t=>W.ambientLight=t,l:t=>[...t.match(t.length<5?/./g:/../g).map((s=>("0x"+s)/(t.length<5?15:255))),1],add:(t,s)=>{W.i[t]=s,s.p&&(W.i[t].customNormals=1),W[t]=s=>W.m(s,t)},group:t=>W.m(t,"group"),move:(t,s)=>setTimeout((()=>{W.m(t)}),s||1),delete:(t,s)=>setTimeout((()=>{delete W.next[t]}),s||1),camera:(t,s)=>setTimeout((()=>{W.m(t,t.n="camera")}),s||1),u:(t,s)=>s?setTimeout((()=>{W.m(t,t.n="light")}),s):W.m(t,t.n="light")},W.smooth=(t,s={},i=[],e,h,o,r,n,a,l,c,d,u,m)=>{for(W.i[t.type].p=[],o=0;o<W.i[t.type].vertices.length;o+=3)i.push(W.i[t.type].vertices.slice(o,o+3));for((e=W.i[t.type].indices)?h=1:(e=i,h=0),o=0;o<2*e.length;o+=3){r=o%e.length,n=i[c=h?W.i[t.type].indices[r]:r],a=i[d=h?W.i[t.type].indices[r+1]:r+1],l=i[u=h?W.i[t.type].indices[r+2]:r+2],AB=[a[0]-n[0],a[1]-n[1],a[2]-n[2]],BC=[l[0]-a[0],l[1]-a[1],l[2]-a[2]],m=o>r?[0,0,0]:[AB[1]*BC[2]-AB[2]*BC[1],AB[2]*BC[0]-AB[0]*BC[2],AB[0]*BC[1]-AB[1]*BC[0]];const f=n[0]+"_"+n[1]+"_"+n[2],p=a[0]+"_"+a[1]+"_"+a[2],x=l[0]+"_"+l[1]+"_"+l[2];s[f]||=[0,0,0],s[p]||=[0,0,0],s[x]||=[0,0,0],W.i[t.type].p[c]=s[f]=s[f].map(((t,s)=>t+m[s])),W.i[t.type].p[d]=s[p]=s[p].map(((t,s)=>t+m[s])),W.i[t.type].p[u]=s[x]=s[x].map(((t,s)=>t+m[s]))}},W.add("plane",{vertices:[.5,.5,0,-.5,.5,0,-.5,-.5,0,.5,.5,0,-.5,-.5,0,.5,-.5,0],uv:[1,1,0,1,0,0,1,1,0,0,1,0]}),W.add("billboard",W.i.plane),W.add("cube",{vertices:[.5,.5,.5,-.5,.5,.5,-.5,-.5,.5,.5,.5,.5,-.5,-.5,.5,.5,-.5,.5,.5,.5,-.5,.5,.5,.5,.5,-.5,.5,.5,.5,-.5,.5,-.5,.5,.5,-.5,-.5,.5,.5,-.5,-.5,.5,-.5,-.5,.5,.5,.5,.5,-.5,-.5,.5,.5,.5,.5,.5,-.5,.5,.5,-.5,.5,-.5,-.5,-.5,-.5,-.5,.5,.5,-.5,-.5,-.5,-.5,-.5,.5,-.5,.5,-.5,.5,.5,-.5,.5,-.5,-.5,-.5,.5,-.5,.5,-.5,-.5,-.5,-.5,-.5,.5,-.5,.5,-.5,-.5,.5,-.5,-.5,-.5,.5,-.5,.5,-.5,-.5,-.5,.5,-.5,-.5],uv:[1,1,0,1,0,0,1,1,0,0,1,0,1,1,0,1,0,0,1,1,0,0,1,0,1,1,0,1,0,0,1,1,0,0,1,0,1,1,0,1,0,0,1,1,0,0,1,0,1,1,0,1,0,0,1,1,0,0,1,0,1,1,0,1,0,0,1,1,0,0,1,0]}),W.cube=t=>W.m(t,"cube"),W.add("pyramid",{vertices:[-.5,-.5,.5,.5,-.5,.5,0,.5,0,.5,-.5,.5,.5,-.5,-.5,0,.5,0,.5,-.5,-.5,-.5,-.5,-.5,0,.5,0,-.5,-.5,-.5,-.5,-.5,.5,0,.5,0,.5,-.5,.5,-.5,-.5,.5,-.5,-.5,-.5,.5,-.5,.5,-.5,-.5,-.5,.5,-.5,-.5],uv:[0,0,1,0,.5,1,0,0,1,0,.5,1,0,0,1,0,.5,1,0,0,1,0,.5,1,1,1,0,1,0,0,1,1,0,0,1,0]}),((t,s,i,e,h,o,r=[],n=[],a=[],l=20)=>{for(i=0;i<=l;i++)for(e=i*Math.PI/l,t=0;t<=l;t++)s=2*t*Math.PI/l,r.push(+(Math.sin(s)*Math.sin(e)/2).toFixed(6),+(Math.cos(e)/2).toFixed(6),+(Math.cos(s)*Math.sin(e)/2).toFixed(6)),a.push(3.5*Math.sin(t/l),-Math.sin(i/l)),t<l&&i<l&&n.push(h=i*(l+1)+t,o=h+l+1,h+1,h+1,o,o+1);W.add("sphere",{vertices:r,uv:a,indices:n})})();let s=new AudioContext;"use strict";const i={D:'"Courier New", monospace',S:"Arial, sans-serif",N:'"Times New Roman", serif',C:30,K:60,R:"Triskaidekaphobia",init(){i.F.B((()=>{i.P.init(),i.I.init()}))},k(){const t=localStorage.getItem("2024_sd_elevator.save");return t?JSON.parse(t):null},L(t){localStorage.setItem("2024_sd_elevator.save",JSON.stringify({level:t}))}};window.addEventListener("load",(()=>i.init())),i.F={W:{},U(){for(let t=0;t<14;t++){const s="s_lbl_btn"+t,[e,h]=i.I.G(100,70,s);h.font="600 32px "+i.S,h.textAlign="center",h.textBaseline="middle",h.fillText(String(t+1).padStart(2,"0"),50,37),this.W[s]=e}},V(){const t=Math.round(70.7),s=i.I.G(50,t,"paper")[0];pxtex(s,0,0,95,3,50,t),this.W.$=s},j(){const t=i.I.G(200,300,"wall")[0];pxtex(t,0,0,20,3,200,300),this.W.H=t;const s=i.I.G(100,100,"ceil")[0];pxtex(s,0,0,100,3,100,100),this.W.ceil=s;const e=i.I.G(100,100,"floor")[0];pxtex(e,0,0,10,1,100,100),this.W.floor=e;const h=i.I.G(40,300,"fs")[0];pxtex(h,0,0,20,3,40,300),this.W.J=h;const W=i.I.G(200,75,"ft")[0];pxtex(W,0,0,20,3,200,75),this.W.q=W},Y(){const t=Math.round(120),[s,e]=i.I.G(600,t,"title");e.fillStyle="#f00",e.font="600 64px "+i.S,e.textAlign="center",e.fillText(i.R,300,t/2),this.W.title=s},Z(t){const s=200,e=Math.round(100),[h,W]=i.I.G(s,e,"dis:"+t);return W.fillStyle="#f00",W.fillRect(0,0,s,e),W.fillStyle="#fff",W.font="600 64px "+i.D,W.textAlign="center",W.textBaseline="middle",W.fillText(String(t),100,e/2+6),h},B(t){this.Y(),this.U(),this.j(),this.V(),t()}},i.Audio={X:[.5,0,626,,.01,.01,,2.2,,,,,,,,.1,.01,.79,.02],tt:[2,0,783.99,.07,,1.6,1,2,,,,,,,,,,.3,.15],ERROR:[.7,0,71,,.02,.05,3,.2,,68,,,,,,,.01,.96,.02,,389],st:[1.2,0,242,.01,.08,,1,1.8,,-5,,,,.1,18,.1,.02,.88,.03,,-1452],it:[.5,0,817,.03,,.008,3,2.8,,,,,,,,,,.9,.01,.19,-1491],play(t){((t=1,i=.05,e=220,h=0,W=0,o=.1,r=0,n=1,a=0,l=0,c=0,d=0,u=0,m=0,f=0,p=0,x=0,v=1,y=0,b=0,g=0)=>{let _=Math,w=2*_.PI,M=44100,A=a*=500*w/M/M,z=e*=(1-i+2*i*_.random(i=[]))*w/M,O=0,T=0,E=0,D=1,S=0,N=0,C=0,K=g<0?-1:1,R=w*K*g*2/M,B=_.cos(R),F=_.sin,P=F(R)/4,I=1+P,k=-2*B/I,L=(1-P)/I,U=(1+K*B)/2/I,G=-(K+B)/I,V=U,$=0,j=0,H=0,J=0;for(l*=500*w/M**3,f*=w/M,c*=w/M,d*=M,u=M*u|0,t*=.3,K=(h=M*h+9)+(y*=M)+(W*=M)+(o*=M)+(x*=M)|0;E<K;i[E++]=C*t)++N%(100*p|0)||(C=r?1<r?2<r?3<r?F(O**3):_.max(_.min(_.tan(O),1),-1):1-(2*O/w%2+2)%2:1-4*_.abs(_.round(O/w)-O/w):F(O),C=(u?1-b+b*F(w*E/u):1)*(C<0?-1:1)*_.abs(C)**n*(E<h?E/h:E<h+y?1-(E-h)/y*(1-v):E<h+y+W?v:E<K-x?(K-E-x)/o*v:0),C=x?C/2+(x>E?0:(E<K-x?1:(K-E)/x)*i[E-x|0]/2/t):C,g&&(C=J=V*$+G*($=j)+U*(j=C)-L*H-k*(H=J))),R=(e+=a+=l)*_.cos(f*T++),O+=R+R*m*F(E**5),D&&++D>d&&(e+=c,z+=c,D=0),!u||++S%u||(e=z,a=A,D=D||1);(t=s.createBuffer(1,K,M)).getChannelData(0).set(i),(e=s.createBufferSource()).buffer=t,e.connect(s.destination),e.start()})(...t)}},i.P={et:{ht:1,Wt:2,ot:3,rt:10,nt:11,lt:12,ct:13},dt:{},ut:{},ft:{},xt:{},vt(){this.yt={[this.et.ht]:{keyboard:["Escape"]},[this.et.nt]:{keyboard:["ArrowUp","KeyW","KeyZ","KeyY"]},[this.et.rt]:{keyboard:["ArrowLeft","KeyA","KeyQ"]},[this.et.ct]:{keyboard:["ArrowDown","KeyS"]},[this.et.lt]:{keyboard:["ArrowRight","KeyD"]},[this.et.Wt]:{keyboard:["KeyE","Enter"]}}},bt(){let t=0,s=0;return this.gt(this.et.rt)?t=-1:this.gt(this.et.lt)&&(t=1),this.gt(this.et.nt)?s=-1:this.gt(this.et.ct)&&(s=1),{x:t,y:s}},_t(t){return this.yt[t]},init(){this.vt(),this.wt()},gt(t,s){const i=this._t(t);for(const t of i.keyboard)if(this.Mt(t,s))return!0;return!1},Mt(t,s){const i=this.xt[t];return!(!i||!i.time)&&(s&&(i.time=0,i.At=!0),!0)},zt(t,s){const i=this.ut[t]||[];i.push(s),this.ut[t]=i},Ot(t,s){const i=this.ft[t]||[];i.push(s),this.ft[t]=i},wt(){document.body.onkeydown=t=>{const s=this.xt[t.code];s&&s.At||(this.xt[t.code]={time:Date.now()},this.ut[t.code]&&this.ut[t.code].forEach((t=>t())))},document.body.onkeyup=t=>{this.xt[t.code]={time:0},this.ft[t.code]&&this.ft[t.code].forEach((t=>t()))}}},i.I={camera:{rx:0,ry:0},Tt:!0,Et:new DOMPoint(0,0,-1),Dt:0,St(){let t=[];const s=this.Nt(),i={min:[],max:[]};for(const e in W.next){if(!e.startsWith("s_"))continue;const h=W.next[e];let o=0;if("plane"!=h.type&&"billboard"!=h.type&&(o=h.d),i.min[0]=h.x-h.w/2,i.min[1]=h.y-h.h/2,i.min[2]=h.z-o/2,h.g){const t=W.next[h.g];i.min[0]+=t.x,i.min[1]+=t.y,i.min[2]+=t.z}i.max[0]=i.min[0]+h.w,i.max[1]=i.min[1]+h.h,i.max[2]=i.min[2]+o;const r=this.Ct(s,i);r&&t.push([h,r])}return this.Kt(s.origin,t)},Rt(){this.Bt.fillStyle="#00000070",this.Bt.fillRect(0,0,this.Ft.width,this.Ft.height),this.Bt.fillStyle="#fff",this.Bt.font="96px "+i.N,this.Bt.textAlign="center",this.Bt.fillText("PAUSED",this.Ft.width/2,this.Ft.height/2)},Kt(t,s){if(1==s.length)return s[0][0];let i=null,e=1/0;for(let h=0;h<s.length;h++){const W=s[h][1],o=[W[0]-t[0],W[1]-t[1],W[2]-t[2]],r=Math.sqrt(o[0]*o[0]+o[1]*o[1]+o[2]*o[2]);r<e&&(i=s[h][0],e=r)}return i},G(t,s,i){const e=document.createElement("canvas");e.width=t,e.height=s,i&&(e.id=i);const h=e.getContext("2d",{alpha:!0});return h.imageSmoothingEnabled=!1,[e,h]},Nt(){const t=W.next.camera,s=(new DOMMatrix).rotateSelf(t.rx,t.ry,t.rz),i={origin:[t.x,t.y,t.z],dir:this.Et.matrixTransform(s)};return i.dir=[i.dir.x,i.dir.y,i.dir.z],i},init(){this.Pt=document.getElementById("c"),this.Ft=document.getElementById("ui"),this.Bt=this.Ft.getContext("2d",{alpha:!0}),this.Bt.imageSmoothingEnabled=!1,this.resize(),W.onDraw=this.update.bind(this),W.reset(this.Pt),W.clearColor("000"),W.T(.2),this.wt(),this.level=new i.It},Ct(t,s){let i=!0,e=[],h=[],W=[],o=[];for(let h=0;h<3;h++)t.origin[h]<s.min[h]?(e[h]=1,W[h]=s.min[h],i=!1):t.origin[h]>s.max[h]?(e[h]=0,W[h]=s.max[h],i=!1):e[h]=2;if(i)return t.origin;for(let s=0;s<3;s++)2!=e[s]&&0!=t.dir[s]?h[s]=(W[s]-t.origin[s])/t.dir[s]:h[s]=-1;let r=0;for(let t=1;t<3;t++)h[r]<h[t]&&(r=t);if(h[r]<0)return null;for(let i=0;i<3;i++)if(r!=i){if(o[i]=t.origin[i]+h[r]*t.dir[i],o[i]<s.min[i]||o[i]>s.max[i])return null}else o[i]=W[i];return o},pause(){this.o=!0,document.body.classList.add("p"),W.o=!0},wt(){let t=0,s=0;window.addEventListener("resize",(t=>this.resize()));const e=i.P._t(i.P.et.ht),h=()=>{this.kt(),t=null,s=null};e.keyboard.forEach((t=>i.P.Ot(t,h))),this.Pt.addEventListener("mousedown",(t=>{0===t.button&&this.level&&this.level.Lt()})),this.Pt.addEventListener("mouseenter",(i=>{this.level&&!this.Tt&&(t=i.clientX,s=i.clientY)})),this.Pt.addEventListener("mousemove",(i=>{if(this.level&&!this.o&&!this.Tt){if(null===t)return t=i.clientX,void(s=i.clientY);this.camera.rx-=.5*(i.clientY-s),this.camera.ry-=.5*(i.clientX-t),this.camera.rx=Math.min(80,Math.max(-60,this.camera.rx)),this.camera.ry=this.camera.ry%360,W.camera(this.camera),t=i.clientX,s=i.clientY}})),i.P.Ot("KeyR",(()=>{this.Tt||(this.camera.rx=0,this.camera.ry=0,W.camera(this.camera))}))},resize(){const t=4/3;let s=window.innerWidth,i=window.innerHeight;s>i?(i-=40,s=Math.round(Math.min(s,i*t))):s<i&&(s-=40,i=Math.round(Math.min(i,s*t))),this.Pt.width=s,this.Pt.height=i,this.Ft.width=s,this.Ft.height=i,W.next?.camera&&(W.camera({fov:W.next.camera.fov}),W.gl.viewport(0,0,s,i))},kt(){this.o?this.unpause():this.pause()},unpause(){this.o=!1,document.body.classList.remove("p"),W.o=!1},update(t=0){if(t&&this.Ut){const s=(t-this.Ut)/(1e3/i.K);if(this.Bt.clearRect(0,0,this.Ft.width,this.Ft.height),this.Bt.imageSmoothingEnabled=!1,this.Bt.fillStyle="#fff",this.Bt.font="11px monospace",this.Bt.textAlign="left",this.Bt.fillText(~~(i.K/s)+" FPS",10,20),this.o)return void this.Rt();this.Dt+=s,this.level.update(s)}this.Ut=t}},i.Gt={R:1,Vt:2,$t:3},i.jt={OPEN:1,OPENING:2,CLOSED:3,CLOSING:4},i.It=class{constructor(){this.Dt=0,this.Ht=0,this.Jt=i.Gt.R,this.states={Qt:i.jt.OPEN},this.qt=2,this.Yt=3,this.Zt=2,W.u({y:this.Yt/2-.2}),W.plane({n:"title",x:0,y:0,z:-2,w:1,h:.2,b:"f00",t:i.F.W.title}),W.group({n:"ev"}),this.Xt(),this.ts(),this.ss(),this.es()}ss(){const t="display";W.group({n:t,g:"ev",y:this.Yt/2-.25-.15,z:-this.Zt/2+.06}),W.plane({g:t,n:"dis",w:.5,h:.25,b:"f00"})}ts(){const t=this.qt/2,s=.05;this.hs=t/2+.0025,this.Ws=this.hs+this.qt/2-this.qt/4,W.cube({n:"dl",g:"ev",x:-this.Ws,y:0,z:-this.Zt/2,w:t,h:this.Yt,d:s,b:"aaa",s:20}),W.group({n:"drg",g:"ev",x:this.Ws,y:0,z:-this.Zt/2}),W.cube({n:"dr",g:"drg",w:t,h:this.Yt,d:s,b:"aaa",s:20});const e=t/4;W.plane({n:"s_note1",g:"drg",x:(e-t)/2+.1,y:-.1,z:.025+.001,w:e,h:1.414*e,rz:-10,t:i.F.W.$})}es(){const t="pad";W.group({n:t,g:"ev",x:this.qt/2-.15-.06,y:.075-.35,z:-this.Zt/2+.06}),W.plane({g:t,w:.3,h:.7,b:"bbb",s:20});const s=.02,e=.1,h=.07,o=(e+s)/2;for(let r=0;r<14;r++){const n="btn"+r,a=r%2*(s+e)-o,l=~~(r/2)*(s+h)-.27;W.cube({g:t,n,x:a,y:l,w:e,h,d:.02,b:"ddd"}),W.plane({g:t,n:"s_lbl_"+n,x:a,y:l,z:.011,w:e,h,t:i.F.W["s_lbl_"+n]})}}Xt(){const t="ev";W.group({n:t,g:"ev"}),W.plane({g:t,x:0,y:-this.Yt/2,z:0,w:this.qt,h:this.Zt,rx:-90,b:"333",t:i.F.W.floor,mix:.5}),W.plane({g:t,x:0,y:this.Yt/2,z:0,w:this.qt,h:this.Zt,rx:90,b:"bbb",t:i.F.W.ceil,mix:.5}),W.plane({g:t,x:-this.qt/2,y:0,z:0,ry:90,w:this.Zt,h:this.Yt,b:"999",t:i.F.W.H,s:30,mix:.5}),W.plane({g:t,x:this.qt/2,y:0,z:0,ry:-90,w:this.Zt,h:this.Yt,b:"999",t:i.F.W.H,s:30,mix:.5}),W.plane({g:t,x:0,y:0,z:this.Zt/2,ry:180,w:this.qt,h:this.Yt,b:"999",t:i.F.W.H,s:30,mix:.5}),W.cube({g:t,x:-(this.qt-this.qt/5)/2,y:0,z:-this.Zt/2,w:this.qt/5,h:this.Yt,d:.1,b:"999",t:i.F.W.J,s:30,mix:.5}),W.cube({g:t,x:(this.qt-this.qt/5)/2,y:0,z:-this.Zt/2,w:this.qt/5,h:this.Yt,d:.1,b:"999",t:i.F.W.J,s:30,mix:.5}),W.cube({g:t,x:0,y:(this.Yt-this.Yt/4)/2,z:-this.Zt/2,w:this.qt,h:this.Yt/4,d:.1,b:"999",t:i.F.W.q,s:30,mix:.5})}os(){if(this.Dt-this.Ht>.05*i.K){this.Ht=this.Dt;const t=i.I.St();if(t&&t.n!=this.ns?.rs){let s=t.n;s.startsWith("s_lbl_btn")&&(s=s.substring(6));const i=W.next[s];i&&(this.ns&&W.move({n:this.ns.n,b:this.ns.b}),this.ns={rs:t.n,n:s,b:i.b},W.move({n:s,b:"fff"}))}else!t&&this.ns&&(W.move({n:this.ns.n,b:this.ns.b}),this.ns=null)}this.ns&&i.P.gt(i.P.et.Wt,!0)&&this.Lt()}ls(){return[i.jt.CLOSING,i.jt.OPENING].includes(this.states.Qt)}cs(){this.states.Qt==i.jt.CLOSED||this.ls()||(this.states.Qt=i.jt.CLOSING,W.move({n:"dl",x:-this.hs,a:2e3}),W.move({n:"drg",x:this.hs,a:2e3,onAnimDone:()=>{this.states.Qt=i.jt.CLOSED}}))}ds(){this.states.Qt==i.jt.OPEN||this.ls()||(this.states.Qt=i.jt.OPENING,W.move({n:"dl",x:-this.Ws,a:2e3}),W.move({n:"drg",x:this.Ws,a:2e3,onAnimDone:()=>{this.states.Qt=i.jt.OPEN}}))}us(t){t&&(console.debug(t.n,t),t.n.includes("btn")&&(i.Audio.play(i.Audio.X),this.cs()))}fs(){i.I.Tt=!0,this.ps=this.ps||this.Dt;const t=(this.Dt-this.ps)/(3*i.K);0==t&&this.cs();const s={z:0,rx:0,ry:0};return t>1?(W.camera(s),i.I.Tt=!1,document.getElementById("p").hidden=!1,delete W.next.title,delete W.current.title,!0):(s.z=-.5*(1-Math.sin(t*Math.PI/2)),W.camera(s),!1)}xs(){i.I.Tt=!0,this.ps=this.ps||this.Dt;const t=(this.Dt-this.ps)/(3*i.K);return 0==t&&(document.getElementById("p").hidden=!0),t>=1||(W.camera({z:-.5,rx:0,ry:0}),!1)}Lt(){if(this.ns){const t=W.next[this.ns.n];this.us(t)}}vs(t){W.move({n:"dis",t:i.F.Z(t),mix:.25})}ys(t){this.ps=0,this.Jt=t}update(t){this.Dt+=t;let s=!0;this.Jt==i.Gt.R?(this.xs()&&this.ys(i.Gt.Vt),s=!1):this.Jt==i.Gt.Vt&&(this.fs()&&this.ys(i.Gt.$t),s=!1),s&&this.os()}},i.bs=class{constructor(t,s=0){this.level=t,this.set(s)}gs(){return this.level.Dt>this.timeEnd}_s(){return Math.min(1,1-(this.timeEnd-this.level.Dt)/this.duration)}set(t){this.duration=t*i.K,this.timeEnd=this.level.Dt+this.duration}};