// Ported verbatim from design v2 HTML lines 1503–1628.
// The only adaptation: the source used a custom vec2 attribute `a`; here we use
// the built-in `position` attribute that three.js ShaderMaterial injects
// automatically. Functionally identical (a plane drawn in NDC clip space).
export const vertexShader = /* glsl */ `
  varying vec2 v;
  void main(){
    v = position.xy * 0.5 + 0.5;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 v;
  uniform vec2  u_res;
  uniform float u_t;
  uniform float u_intensity;   // 0..1
  uniform float u_speed;       // 0..1
  uniform int   u_palette;     // 0 viridis, 1 lava, 2 bone
  uniform vec3  u_bg;
  uniform float u_density;     // dots per shorter-side (approx)
  uniform vec2  u_mouse;       // normalized mouse position in pixels
  uniform float u_mouseActive; // 0 or 1

  float hash(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
  float noise(vec2 p){
    vec2 i = floor(p); vec2 f = fract(p);
    float a = hash(i), b = hash(i+vec2(1,0)), c = hash(i+vec2(0,1)), d = hash(i+vec2(1,1));
    vec2 u = f*f*(3.0-2.0*f);
    return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
  }
  float fbm(vec2 p){
    float s = 0.0, a = 0.5;
    for(int i=0;i<5;i++){ s += a*noise(p); p = p*2.03 + 17.0; a *= 0.5; }
    return s;
  }

  vec3 viridis(float t){
    t = clamp(t, 0.0, 1.0);
    return vec3(
      0.267 - 0.105*t + 1.39*t*t - 1.21*t*t*t,
      0.004 + 1.39*t - 0.78*t*t + 0.26*t*t*t,
      0.329 + 1.38*t - 3.69*t*t + 2.35*t*t*t
    );
  }
  vec3 lava(float t){
    t = clamp(t, 0.0, 1.0);
    vec3 c0 = vec3(0.02,0.01,0.05);
    vec3 c1 = vec3(0.28,0.05,0.36);
    vec3 c2 = vec3(0.75,0.20,0.28);
    vec3 c3 = vec3(0.98,0.55,0.15);
    vec3 c4 = vec3(1.00,0.90,0.55);
    vec3 a = mix(c0,c1,smoothstep(0.0,0.25,t));
    vec3 b = mix(a ,c2,smoothstep(0.25,0.55,t));
    vec3 c = mix(b ,c3,smoothstep(0.55,0.82,t));
    return mix(c, c4, smoothstep(0.82,1.0,t));
  }
  vec3 boneMap(float t){
    t = clamp(t, 0.0, 1.0);
    return mix(vec3(0.94,0.93,0.89), vec3(0.08,0.07,0.08), t*t*0.9);
  }

  void main(){
    vec2 frag = gl_FragCoord.xy;
    // grid size in pixels, based on density
    float shorter = min(u_res.x, u_res.y);
    float cell = shorter / max(8.0, u_density);

    vec2 gpos = frag / cell;
    vec2 cellId = floor(gpos);
    vec2 cellUv = fract(gpos) - 0.5; // -0.5..0.5 within cell

    // flow field sampled at cell center
    vec2 cc = (cellId + 0.5) * cell / u_res - 0.5;
    cc.x *= u_res.x / u_res.y;
    float t = u_t * (0.05 + u_speed*0.35);

    // domain-warped field
    vec2 p = cc * 1.4;
    vec2 q = vec2(fbm(p + t*0.3), fbm(p + vec2(5.2,1.3) - t*0.2));
    vec2 r = vec2(fbm(p + 2.2*q + t*0.1), fbm(p + 2.2*q + vec2(8.3,2.8)));
    float field = fbm(p + 1.8*r);

    // flow direction for displacement
    float e = 0.08;
    float fx = fbm(p + vec2(e,0.0) + 1.8*r) - fbm(p - vec2(e,0.0) + 1.8*r);
    float fy = fbm(p + vec2(0.0,e) + 1.8*r) - fbm(p - vec2(0.0,e) + 1.8*r);
    vec2 flow = vec2(fy, -fx); // perpendicular = swirl

    // mouse-driven warp — gentle, gradual, wide falloff
    vec2 mouseOffset = vec2(0.0);
    if (u_mouseActive > 0.5) {
      vec2 mpx = u_mouse; // pixels
      vec2 delta = (frag - mpx);
      float dist = length(delta);
      // wide gaussian falloff — much softer than smoothstep circle
      float sigma = shorter * 0.45;
      float falloff = exp(- (dist*dist) / (2.0 * sigma * sigma));
      vec2 dir = dist > 0.001 ? delta / dist : vec2(0.0);
      vec2 swirl = vec2(-dir.y, dir.x);
      // small push + bit of swirl, proportional to cell so density-agnostic
      mouseOffset = (dir * 0.6 + swirl * 0.35) * falloff * cell * 0.9;
    }

    // displacement amount (in cell units)
    float disp = 0.28;
    vec2 offset = flow * disp + (mouseOffset / cell);
    vec2 local = cellUv - offset;

    float d = length(local);
    // radius varies with field — finer, more subtle
    float rDot = 0.045 + 0.10 * smoothstep(0.2, 0.9, field);
    // soft dot
    float dot = smoothstep(rDot, rDot - 0.02, d);

    // brightness shaped by field
    float bright = mix(0.2, 0.9, smoothstep(0.15, 0.85, field));

    vec3 col;
    if (u_palette == 0) col = viridis(field);
    else if (u_palette == 1) col = lava(field);
    else                     col = boneMap(field);

    // dampen for subtlety
    float amt = dot * bright * u_intensity;
    vec3 outc = mix(u_bg, col, amt * 0.55);

    gl_FragColor = vec4(outc, 1.0);
  }
`;
