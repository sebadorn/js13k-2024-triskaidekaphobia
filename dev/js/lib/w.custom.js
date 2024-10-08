// WebGL framework
// ===============

W = {

	// List of 3D models that can be rendered by the framework
	// (See the end of the file for built-in models: plane, billboard, cube, pyramid...)
	models: {},

	// Reset the framework
	// param: a <canvas> element
	reset: canvas => {
		// Globals
		W.canvas = canvas;    // canvas element
		W.objs = 0;           // Object counter
		W.current = {};       // Objects current states
		W.next = {};          // Objects next states
		W.textures = {};      // Textures list
		W.isPaused = false;

		// WebGL context
		W.gl = canvas.getContext( 'webgl2' );

		// Default blending method for transparent objects
		W.gl.blendFunc(
			770, // SRC_ALPHA
			771 // ONE_MINUS_SRC_ALPHA
		);

		// Enable texture 0
		W.gl.activeTexture( 33984 /* TEXTURE0 */ );

		// Create a WebGL program
		W.program = W.gl.createProgram();

		// Hide polygons back-faces (optional)
		W.gl.enable( 2884 /* CULL_FACE */ );

		// Create a Vertex shader
		// (this GLSL program is called for every vertex of the scene)
		W.gl.shaderSource(
			t = W.gl.createShader( 35633 /* VERTEX_SHADER */ ),

			'#version 300 es\n' +
			'precision highp float;' +
			// Vertex attributes: position, color, texture coordinates, normal (if any)
			'in vec4 pos, col, uv;' +
			// Uniform transformation matrices: projection * view, eye, model, inverse model
			'uniform mat4 pv, eye, m, im;' +
			// If the current shape is a billboard: bb = [w, h, 1.0, 0.0]
			'uniform vec4 bb;' +
			// Varyings sent to the fragment shader: position, color, texture coordinates, normal (if any)
			'out vec4 v_pos, v_col, v_uv;' +

			'void main() {' +
				'v_pos = m * pos;' +
				'gl_Position = pv * v_pos;' +
				'v_col = col;' +
				'v_uv = uv;' +
			'}'
		);

		// Compile the Vertex shader and attach it to the program
		W.gl.compileShader( t );
		W.gl.attachShader( W.program, t );

		// console.log( 'vertex shader:', W.gl.getShaderInfoLog( t ) || 'OK' );

		// Create a Fragment shader
		// (This GLSL program is called for every fragment (pixel) of the scene)
		W.gl.shaderSource(
			t = W.gl.createShader( 35632 /* FRAGMENT_SHADER */ ),

			'#version 300 es\n' +
			'precision highp float;' +
			'const lowp float floatMax = float(uint(-1));' +
			// Received from the vertex shader: position, color, texture coordinates, normal (if any)
			'in vec4 v_pos, v_col, v_uv;' +
			// light position
			'uniform vec4 light;' +
			// options [0: shininess, 1: shading enabled, 2: ambient, 3: mix]
			'uniform vec4 o;' +
			'uniform sampler2D sampler;' +
			// Window size
			'uniform uvec2 s;' +
			// Output: final fragment color
			'out vec4 c;' +

			// xorshift64
			'highp uint rand(highp uint seed) {' +
				'seed = seed ^ (seed << 13u);' +
				'seed = seed ^ (seed >> 7u);' +
				'seed = seed ^ (seed << 17u);' +
				'return seed;' +
			'}' +

			'void main() {' +
				// Ambient color
				'float ambient = o.z;' +

				// Lambert lighting
				'vec3 light_dir = normalize(light.xyz - v_pos.xyz);' +
				'vec3 normal = normalize(cross(dFdx(v_pos.xyz), dFdy(v_pos.xyz)));' +
				'float lambert = light.w * max(0., dot(light_dir, normal)) * 0.7;' +

				// Specular lighting
				'float specular = 0.;' +

				'if(o.x > 0.) {' +
					'vec3 R = reflect(-light_dir, normal);' +
					'vec3 V = normalize(-v_pos.xyz);' +
					'float specAngle = max(dot(R, V), 0.);' +
					'specular = light.w * pow(specAngle, o.x) * 0.3;' +
				'}' +

				// Texture and final color
				'c = mix(texture(sampler, v_uv.xy), v_col, o.w);' +
				'float f = o.y > 0. ? ambient + lambert + specular : 1.;' +
				'c = vec4(c.rgb * f, c.a);' +

				// Apply dithering to reduce color banding
				'lowp float relX = (v_pos.x + 1.0) * 0.5;' +
				'lowp float relY = (v_pos.y + 1.0) * 0.5;' +
				'uint pxRows = uint(ceil(relY * float(s.y)));' +
				'highp uint index = pxRows * s.x + uint(relX * float(s.x));' +
				'highp uint seed1 = rand(index);' +
				'highp uint seed2 = rand(seed1);' +
				'highp uint seed3 = rand(seed2);' +
				'lowp vec3 rnd = vec3(0.0);' +
				'rnd.x += float(seed1) / floatMax;' +
				'rnd.y += float(seed2) / floatMax;' +
				'rnd.z += float(seed3) / floatMax;' +
				'rnd /= 255.0;' +
				'c.xyz += rnd;' +
			'}'
		);

		// Compile the Fragment shader and attach it to the program
		W.gl.compileShader( t );
		W.gl.attachShader( W.program, t );

		// console.log( 'fragment shader:', W.gl.getShaderInfoLog( t ) || 'OK' );

		// Compile the program
		W.gl.linkProgram( W.program );
		W.gl.useProgram( W.program );

		// console.log( 'program:', W.gl.getProgramInfoLog( W.program ) || 'OK' );

		// Set the scene's background color (RGBA)
		W.gl.clearColor( 1, 1, 1, 1 );

		// Shortcut to set the clear color
		W.clearColor = c => W.gl.clearColor( ...W.col( c ) );
		W.clearColor( 'fff' );

		// Enable fragments depth sorting
		// (the fragments of close objects will automatically overlap the fragments of further objects)
		W.gl.enable( 2929 /* DEPTH_TEST */ );

		// When everything is loaded: set default light / camera
		W.light( { 'y': 1, 'i': 1, } );
		W.camera( { 'fov': 30 } );

		// Draw the scene. Ignore the first frame because the default camera will probably be overwritten by the program
		setTimeout( W.draw, 16 );
	},

	// Set a state to an object
	setState: ( state, type, texture, i, normal = [], A, B, C, Ai, Bi, Ci, AB, BC ) => {
		// Custom name or default name ('o' + auto-increment)
		state.n ||= 'o' + W.objs++;

		// Size sets w, h and d at once (optional)
		if( state.size ) {
			state.w = state.h = state.d = state.size;
		}

		// If a new texture is provided, build it and save it in W.textures
		if( state.t?.width && !W.textures[state.t.id] ) {
			texture = W.gl.createTexture();
			W.gl.pixelStorei( 37441 /* UNPACK_PREMULTIPLY_ALPHA_WEBGL */, true );
			W.gl.bindTexture( 3553 /* TEXTURE_2D */, texture );
			W.gl.pixelStorei( 37440 /* UNPACK_FLIP_Y_WEBGL */, 1 );
			W.gl.texImage2D(
				3553, // TEXTURE_2D
				0,
				6408, // RGBA
				6408, // RGBA
				5121, // UNSIGNED_BYTE
				state.t
			);
			W.gl.generateMipmap( 3553 /* TEXTURE_2D */ );
			W.textures[state.t.id] = texture;
		}

		// Recompute the projection matrix if fov is set (ratio: canvas ratio)
		if( state.fov ) {
			const a = 1 / Math.tan( state.fov * Math.PI / 180 );
			const znear = 0.1;
			const zfar = 80;
			const farNearDiff = zfar - znear;

			W.projection = new DOMMatrix( [
				a / ( W.canvas.width / W.canvas.height ), 0, 0, 0,
				0, a, 0, 0,
				0, 0, -( zfar + znear ) / farNearDiff, -1,
				0, 0, -( 2 * zfar * znear ) / farNearDiff, 0
			] );
		}

		// Save object's type,
		// merge previous state (or default state) with the new state passed in parameter,
		// and reset f (the animation timer)
		state = {
			'type': type,
			...(
				W.current[state.n] = W.next[state.n] ||
				{
					'w': 1, 'h': 1, 'd': 1,
					'x': 0, 'y': 0, 'z': 0,
					'rx': 0, 'ry': 0, 'rz': 0,
					'b': '888', 'mix': 0,
				}
			),
			...state,
			'f': 0,
		};

		// Build the model's vertices buffer if it doesn't exist yet
		if( W.models[state.type]?.vertices && !W.models?.[state.type].verticesBuffer ) {
			W.gl.bindBuffer(
				34962, // ARRAY_BUFFER
				W.models[state.type].verticesBuffer = W.gl.createBuffer()
			);
			W.gl.bufferData(
				34962, // ARRAY_BUFFER
				new Float32Array( W.models[state.type].vertices ),
				35044 // STATIC_DRAW
			);

			// Compute smooth normals if they don't exist yet (optional)
			if( !W.models[state.type].normals ) {
				W.smooth( state );
			}

			// Make a buffer from the smooth/custom normals (if any)
			if( W.models[state.type].normals ) {
				W.gl.bindBuffer(
					34962, // ARRAY_BUFFER
					W.models[state.type].normalsBuffer = W.gl.createBuffer()
				);
				W.gl.bufferData(
					34962, // ARRAY_BUFFER
					new Float32Array( W.models[state.type].normals.flat() ),
					35044 // STATIC_DRAW
				);
			}
		}

		// Build the model's uv buffer (if any) if it doesn't exist yet
		if( W.models[state.type]?.uv && !W.models[state.type].uvBuffer ) {
			W.gl.bindBuffer(
				34962, // ARRAY_BUFFER
				W.models[state.type].uvBuffer = W.gl.createBuffer()
			);
			W.gl.bufferData(
				34962, // ARRAY_BUFFER
				new Float32Array( W.models[state.type].uv ),
				35044 // STATIC_DRAW
			);
		}

		// Build the model's index buffer (if any) and smooth normals if they don't exist yet
		if( W.models[state.type]?.indices && !W.models[state.type].indicesBuffer ) {
			W.gl.bindBuffer(
				34963, // ELEMENT_ARRAY_BUFFER
				W.models[state.type].indicesBuffer = W.gl.createBuffer()
			);
			W.gl.bufferData(
				34963, // ELEMENT_ARRAY_BUFFER
				new Uint16Array( W.models[state.type].indices ),
				35044 // STATIC_DRAW
			);
		}

		// Set mix to 1 if no texture is set
		if( !state.t ) {
			state.mix = 1;
		}
		// set mix to 0 by default if a texture is set
		else if( state.t && !state.mix ) {
			state.mix = 0;
		}

		// Save new state
		W.next[state.n] = state;
	},

	// Draw the scene
	draw: ( now, dt, v, i, transparent = [] ) => {
		// Loop and measure time delta between frames
		dt = now - W.lastFrame;
		W.lastFrame = now;
		requestAnimationFrame( W.draw );

		if( W.isPaused ) {
			W.onDraw( now );
			return;
		}

		if( W.next.camera.g ) {
			W.render( W.next[W.next.camera.g], dt, 1 );
		}

		// Create a matrix called v containing the current camera transformation
		v = W.animation( 'camera' );

		// If the camera is in a group
		if( W.next?.camera?.g ) {
			// premultiply the camera matrix by the group's model matrix.
			v.preMultiplySelf( W.next[W.next.camera.g].m );
		}

		// Send it to the shaders as the Eye matrix
		W.gl.uniformMatrix4fv(
			W.gl.getUniformLocation( W.program, 'eye' ),
			false,
			v.toFloat32Array()
		);

		// Invert it to obtain the View matrix
		v.invertSelf();

		// Premultiply it with the Perspective matrix to obtain a Projection-View matrix
		v.preMultiplySelf( W.projection );

		// send it to the shaders as the pv matrix
		W.gl.uniformMatrix4fv(
			W.gl.getUniformLocation( W.program, 'pv' ),
			false,
			v.toFloat32Array()
		);

		W.gl.uniform2ui(
			W.gl.getUniformLocation( W.program, 's' ),
			W.canvas.width, W.canvas.height
		);

		// Clear canvas
		W.gl.clear( 16640 /* W.gl.COLOR_BUFFER_BIT | W.gl.DEPTH_BUFFER_BIT */ );

		// Render all the objects in the scene
		for( i in W.next ) {
			const next = W.next[i];

			// Render the shapes with no texture and no transparency (RGB1 color)
			if( !next.t && W.col( next.b )[3] == 1 ) {
				W.render( next, dt );
			}
			// Add the objects with transparency (RGBA or texture) in an array
			else {
				transparent.push( next );
			}
		}

		// Order transparent objects from back to front
		transparent.sort( ( a, b ) => {
			// Return a value > 0 if b is closer to the camera than a
			// Return a value < 0 if a is closer to the camera than b
			return W.dist( b ) - W.dist( a );
		} );

		// Enable alpha blending
		W.gl.enable( 3042 /* BLEND */ );

		// Render all transparent objects
		for( i of transparent ) {
			// Disable depth buffer write if it's a plane or a billboard to allow transparent objects to intersect planes more easily
			if( i.type == 'plane' ) {
				W.gl.depthMask( 0 );
			}

			W.render( i, dt );
			W.gl.depthMask( 1 );
		}

		// Disable alpha blending for the next frame
		W.gl.disable( 3042 /* BLEND */ );

		// Transition the light's position and send it to the shaders
		W.gl.uniform4f(
			W.gl.getUniformLocation( W.program, 'light' ),
			W.lerp( 'light', 'x' ), W.lerp( 'light', 'y' ), W.lerp( 'light', 'z' ),
			W.lerp( 'light', 'i' )
		);

		// Set outside framework to re-use `requestAnimationFrame` callback
		W.onDraw( now );
	},

	// Render an object
	render: ( object, dt, just_compute = ['camera', 'light', 'group'].includes( object.type ), buffer ) => {
		// If the object has a texture
		if( object.t ) {
			// Set the texture's target (2D or cubemap)
			W.gl.bindTexture( 3553 /* TEXTURE_2D */, W.textures[object.t.id] );

			// Pass texture 0 to the sampler
			W.gl.uniform1i( W.gl.getUniformLocation( W.program, 'sampler' ), 0 );
		}

		// Remove finished animation
		if( object.f >= object.a ) {
			object.onAnimDone?.();
			delete object.a;
			delete object.onAnimDone;
		}
		// If the object has an animation, increment its timer...
		else if( object.f < object.a ) { object.f += dt; }

		// ...but don't let it go over the animation duration.
		if( object.f > object.a ) { object.f = object.a; }

		// Compose the model matrix from lerped transformations
		W.next[object.n].m = W.animation( object.n );

		// If the object is in a group:
		if( W.next[object.g] ) {
			// premultiply the model matrix by the group's model matrix.
			W.next[object.n].m.preMultiplySelf( W.next[object.g].m );
		}

		// send the model matrix to the vertex shader
		W.gl.uniformMatrix4fv(
			W.gl.getUniformLocation( W.program, 'm' ),
			false,
			W.next[object.n].m.toFloat32Array()
		);

		// send the inverse of the model matrix to the vertex shader
		W.gl.uniformMatrix4fv(
			W.gl.getUniformLocation( W.program, 'im' ),
			false,
			DOMMatrix.fromMatrix( W.next[object.n].m ).invertSelf().toFloat32Array()
		);

		// Don't render invisible items (camera, light, groups, camera's parent)
		if( !just_compute ) {
			// Set up the position buffer
			W.gl.bindBuffer(
				34962, // ARRAY_BUFFER
				W.models[object.type].verticesBuffer
			);
			W.gl.vertexAttribPointer(
				buffer = W.gl.getAttribLocation( W.program, 'pos' ),
				3, 5126 /* FLOAT */, false, 0, 0
			)
			W.gl.enableVertexAttribArray( buffer );

			// Set up the texture coordinatess buffer (if any)
			if( W.models[object.type].uvBuffer ) {
				W.gl.bindBuffer(
					34962, // ARRAY_BUFFER
					W.models[object.type].uvBuffer
				);
				W.gl.vertexAttribPointer(
					buffer = W.gl.getAttribLocation( W.program, 'uv' ),
					2, 5126 /* FLOAT */, false, 0, 0
				);
				W.gl.enableVertexAttribArray( buffer );
			}

			// Other options: [smooth, shading enabled, ambient light, texture/color mix]
			W.gl.uniform4f(
				W.gl.getUniformLocation( W.program, 'o' ),

				// Specular shininess, 0 to disable
				object.s,

				// Enable shading if object.ns disabled
				object.ns ? 0 : 1,

				// Ambient light
				W.ambientLight || 0.2,

				// Texture/color mix (if a texture is present. 0: fully textured, 1: fully colored)
				object.mix
			);

			// If the object is a billboard: send a specific uniform to the shaders:
			// [width, height, isBillboard = 1, 0]
			W.gl.uniform4f(
				W.gl.getUniformLocation( W.program, 'bb' ),

				// Size
				object.w,
				object.h,

				// is a billboard
				0,

				// Reserved
				0
			);

			// Set up the indices (if any)
			if( W.models[object.type].indicesBuffer ) {
				W.gl.bindBuffer( 34963 /* ELEMENT_ARRAY_BUFFER */, W.models[object.type].indicesBuffer );
			}

			// Set the object's color
			W.gl.vertexAttrib4fv(
				W.gl.getAttribLocation( W.program, 'col' ),
				W.col( object.b )
			);

			// Draw
			// Both indexed and unindexed models are supported.
			// You can keep the "drawElements" only if all your models are indexed.
			if( W.models[object.type].indicesBuffer ) {
				W.gl.drawElements(
					4, // mode: gl.TRIANGLES
					W.models[object.type].indices.length,
					5123 /* UNSIGNED_SHORT */, 0
				);
			}
			else {
				W.gl.drawArrays(
					4, // mode: gl.TRIANGLES
					0,
					W.models[object.type].vertices.length / 3
				);
			}
		}
	},

	// Helpers
	// -------

	// Interpolate a property between two values
	lerp: ( item, property ) => {
		const next = W.next[item];

		if( !next?.a ) {
			return next[property];
		}

		const current = W.current[item];

		return current[property] + ( next[property] - current[property] ) * ( next.f / next.a );
	},

	// Transition an item
	animation: ( item, m = new DOMMatrix ) => {
		if( !W.next[item] ) {
			return m;
		}

		return m.translateSelf( W.lerp( item, 'x' ), W.lerp( item, 'y' ), W.lerp( item, 'z' ) )
			.rotateSelf( W.lerp( item, 'rx' ), W.lerp( item, 'ry' ), W.lerp( item, 'rz' ) )
			.scaleSelf( W.lerp( item, 'w' ), W.lerp( item, 'h' ), W.lerp( item, 'd' ) );
	},

	// Compute the distance squared between two objects (useful for sorting transparent items)
	dist: ( a, b = W.next.camera ) => {
		return a?.m && b?.m ? ( b.m.m41 - a.m.m41 ) ** 2 + ( b.m.m42 - a.m.m42 ) ** 2 + ( b.m.m43 - a.m.m43 ) ** 2 : 0;
	},

	// Set the ambient light level (0 to 1)
	ambient: a => W.ambientLight = a,

	// Convert an rgb/rgba hex string into a vec4
	col: c => [
		...c.match( c.length < 5 ? /./g : /../g )
			.map( a => ( '0x' + a ) / ( c.length < 5 ? 15 : 255 ) ),
		1
	], // rgb / rgba / rrggbb / rrggbbaa

	// Add a new 3D model
	add: ( name, objects ) => {
		W.models[name] = objects;

		if( objects.normals ) {
			W.models[name].customNormals = 1;
		}

		W[name] = settings => W.setState( settings, name );
	},

	// Built-in objects
	// ----------------

	group: t => W.setState( t, 'group' ),

	move: t => {
		t = Array.isArray( t ) ? t : [t];
		setTimeout( () => t.forEach( n => W.setState( n ) ), 1 );
	},

	delete: t => {
		t = Array.isArray( t ) ? t : [t];
		setTimeout( () => t.forEach( n => delete W.next[n] ), 1 );
	},

	camera: t => setTimeout( () => W.setState( t, t.n = 'camera' ), 1 ),

	light: t => W.setState( t, t.n = 'light' ),
};

// Smooth normals computation plug-in (optional)
// =============================================

W.smooth = ( state, dict = {}, vertices = [], iterate, iterateSwitch, i, j, A, B, C, Ai, Bi, Ci, normal ) => {
	// Prepare smooth normals array
	W.models[state.type].normals = [];

	// Fill vertices array: [[x,y,z],[x,y,z]...]
	for( i = 0; i < W.models[state.type].vertices.length; i += 3 ) {
		vertices.push( W.models[state.type].vertices.slice( i, i + 3 ) );
	}

	// Iterator
	if( iterate = W.models[state.type].indices ) {
		iterateSwitch = 1;
	}
	else {
		iterate = vertices;
		iterateSwitch = 0;
	}

	// Iterate twice on the vertices
	// - 1st pass: compute normals of each triangle and accumulate them for each vertex
	// - 2nd pass: save the final smooth normals values
	for( i = 0; i < iterate.length * 2; i += 3 ) {
		j = i % iterate.length;

		A = vertices[Ai = iterateSwitch ? W.models[state.type].indices[j] : j];
		B = vertices[Bi = iterateSwitch ? W.models[state.type].indices[j + 1] : j + 1];
		C = vertices[Ci = iterateSwitch ? W.models[state.type].indices[j + 2] : j + 2];

		AB = [B[0] - A[0], B[1] - A[1], B[2] - A[2]];
		BC = [C[0] - B[0], C[1] - B[1], C[2] - B[2]];

		normal = i > j
			? [0, 0, 0]
			: [
				AB[1] * BC[2] - AB[2] * BC[1],
				AB[2] * BC[0] - AB[0] * BC[2],
				AB[0] * BC[1] - AB[1] * BC[0]
			];

		const indexA = A[0] + '_' + A[1] + '_' + A[2];
		const indexB = B[0] + '_' + B[1] + '_' + B[2];
		const indexC = C[0] + '_' + C[1] + '_' + C[2];

		dict[indexA] ||= [0, 0, 0];
		dict[indexB] ||= [0, 0, 0];
		dict[indexC] ||= [0, 0, 0];

		W.models[state.type].normals[Ai] = dict[indexA] = dict[indexA].map( ( a, i ) => a + normal[i] );
		W.models[state.type].normals[Bi] = dict[indexB] = dict[indexB].map( ( a, i ) => a + normal[i] );
		W.models[state.type].normals[Ci] = dict[indexC] = dict[indexC].map( ( a, i ) => a + normal[i] );
	}
}


// 3D models
// =========

// Each model has:
// - A vertices array [x, y, z, x, y, z...]
// - A uv array [u, v, u, v...] (optional. Allows texturing... if absent: RGBA coloring only)
// - An indices array (optional, enables drawElements rendering... if absent: drawArrays is ised)
// - A normals array [nx, ny, nz, nx, ny, nz...] (optional... if absent: hard/smooth normals are computed by the framework when they're needed)
// The buffers (vertices, uv, indices) are built automatically when they're needed
// All models are optional, you can remove the ones you don't need to save space
// Custom models can be added from the same model, an OBJ importer is available on https://xem.github.io/WebGLFramework/obj2js/

// Plane
//
//  v1------v0
//  |       |
//  |   x   |
//  |       |
//  v2------v3

W.add( 'plane', {
	'vertices': [
		.5, .5, 0,    -.5, .5, 0,   -.5,-.5, 0,
		.5, .5, 0,    -.5,-.5, 0,    .5,-.5, 0
	],
	'uv': [
		1, 1,     0, 1,    0, 0,
		1, 1,     0, 0,    1, 0
	],
} );

// Cube
//
//    v6----- v5
//   /|      /|
//  v1------v0|
//  | |  x  | |
//  | |v7---|-|v4
//  |/      |/
//  v2------v3

W.add( 'cube', {
	'vertices': [
		 .5, .5, .5,  -.5, .5, .5,  -.5,-.5, .5, // front
		 .5, .5, .5,  -.5,-.5, .5,   .5,-.5, .5,
		 .5, .5,-.5,   .5, .5, .5,   .5,-.5, .5, // right
		 .5, .5,-.5,   .5,-.5, .5,   .5,-.5,-.5,
		 .5, .5,-.5,  -.5, .5,-.5,  -.5, .5, .5, // up
		 .5, .5,-.5,  -.5, .5, .5,   .5, .5, .5,
		-.5, .5, .5,  -.5, .5,-.5,  -.5,-.5,-.5, // left
		-.5, .5, .5,  -.5,-.5,-.5,  -.5,-.5, .5,
		-.5, .5,-.5,   .5, .5,-.5,   .5,-.5,-.5, // back
		-.5, .5,-.5,   .5,-.5,-.5,  -.5,-.5,-.5,
		 .5,-.5, .5,  -.5,-.5, .5,  -.5,-.5,-.5, // down
		 .5,-.5, .5,  -.5,-.5,-.5,   .5,-.5,-.5
	],
	'uv': [
		1, 1,   0, 1,   0, 0, // front
		1, 1,   0, 0,   1, 0,
		1, 1,   0, 1,   0, 0, // right
		1, 1,   0, 0,   1, 0,
		1, 1,   0, 1,   0, 0, // up
		1, 1,   0, 0,   1, 0,
		1, 1,   0, 1,   0, 0, // left
		1, 1,   0, 0,   1, 0,
		1, 1,   0, 1,   0, 0, // back
		1, 1,   0, 0,   1, 0,
		1, 1,   0, 1,   0, 0, // down
		1, 1,   0, 0,   1, 0
	]
} );
W.cube = settings => W.setState( settings, 'cube' );
