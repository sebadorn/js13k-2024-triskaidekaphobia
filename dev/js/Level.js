'use strict';


js13k.SCENE = {
	TITLE: 1,
	INTRO: 2,
	NORMAL: 3,
};

js13k.STATE = {
	OPEN: 1,
	OPENING: 2,
	CLOSED: 3,
	CLOSING: 4,
};


js13k.Level = class {


	/**
	 *
	 * @constructor
	 */
	constructor() {
		this.timer = 0;
		this._lastCheck = 0;

		this.scene = js13k.SCENE.TITLE;
		this.states = {
			doors: js13k.STATE.OPEN,
		};

		this._evX = 2;
		this._evY = 3;
		this._evZ = 2;

		W.light( { 'y': this._evY / 2 - 0.2 } );

		W.plane( {
			'n': 'title',
			'x': 0,
			'y': 0,
			'z': -2,
			'w': 1,
			'h': 0.2,
			'b': 'f00',
			't': js13k.Assets.textures.title,
		} );

		W.group( { 'n': 'ev' } );
		this._buildElevatorWalls();
		this._buildElevatorDoors();
		this._buildElevatorDisplay();
		this._buildElevatorNumberPad();
	}


	/**
	 *
	 * @private
	 */
	_buildElevatorDisplay() {
		const g = 'display';
		const w = 0.5;
		const h = 0.25;

		W.group( {
			'n': g,
			'g': 'ev',
			'y': this._evY / 2 - h - 0.15,
			'z': -this._evZ / 2 + 0.06,
		} );

		// base plate
		W.plane( {
			'g': g,
			'n': 'dis',
			'w': w,
			'h': h,
			'b': 'f00',
		} );
	}


	/**
	 *
	 * @private
	 */
	_buildElevatorDoors() {
		const doorWidth = this._evX / 2;

		this._rightDoorClosed = doorWidth / 2 + 0.0025; // leave a very small gap open
		this._rightDoorOpen = this._rightDoorClosed + this._evX / 2 - this._evX / 4;

		// Left door
		W.cube( {
			'n': 'dl',
			'g': 'ev',
			'x': -this._rightDoorOpen,
			'y': 0,
			'z': -this._evZ / 2,
			'w': doorWidth,
			'h': this._evY,
			'd': 0.05,
			'b': 'aaa',
			's': 20,
		} );

		// Right door
		W.cube( {
			'n': 'dr',
			'g': 'ev',
			'x': this._rightDoorOpen,
			'y': 0,
			'z': -this._evZ / 2,
			'w': doorWidth,
			'h': this._evY,
			'd': 0.05,
			'b': 'aaa',
			's': 20,
		} );
	}


	/**
	 *
	 * @private
	 */
	_buildElevatorNumberPad() {
		const g = 'pad';
		const w = 0.3;
		const h = 0.7;

		// Group: number pad
		W.group( {
			'n': g,
			'g': 'ev',
			'x': this._evX / 2 - w / 2 - 0.06,
			'y': -h / 2 + 0.075,
			'z': -this._evZ / 2 + 0.06,
		} );

		// base plate
		W.plane( {
			'g': g,
			'w': w,
			'h': h,
			'b': 'bbb',
			's': 20,
		} );

		const padding = 0.02;
		const btnW = 0.1;
		const btnH = 0.07;
		const offsetX = ( btnW + padding ) / 2;
		const offsetY = 6 * ( btnH + padding ) / 2;

		for( let i = 0; i < 14; i++ ) {
			const n = 'btn' + i;
			const x = ( i % 2 ) * ( padding + btnW ) - offsetX;
			const y = ~~( i / 2 ) * ( padding + btnH ) - offsetY;

			W.cube( {
				'g': g,
				'n': n,
				'x': x,
				'y': y,
				'w': btnW,
				'h': btnH,
				'd': 0.02,
				'b': 'ddd',
			} );
			W.plane( {
				'g': g,
				'n': 's_lbl_' + n,
				'x': x,
				'y': y,
				'z': 0.011,
				'w': btnW,
				'h': btnH,
				't': js13k.Assets.textures['s_lbl_' + n],
			} );
		}
	}


	/**
	 *
	 * @private
	 */
	_buildElevatorWalls() {
		const g = 'ev';

		// Group: elevator base
		W.group( { 'n': g, 'g': 'ev' } );
		// floor
		W.plane( {
			'g': g,
			'x': 0,
			'y': -this._evY / 2,
			'z': 0,
			'w': this._evX,
			'h': this._evZ,
			'rx': -90,
			'b': '333',
			't': js13k.Assets.textures.floor,
			'mix': 0.5,
		} );
		// ceiling
		W.plane( {
			'g': g,
			'x': 0,
			'y': this._evY / 2,
			'z': 0,
			'w': this._evX,
			'h': this._evZ,
			'rx': 90,
			'b': 'bbb',
			't': js13k.Assets.textures.ceil,
			'mix': 0.5,
		} );
		// wall: left
		W.plane( {
			'g': g,
			'x': -this._evX / 2,
			'y': 0,
			'z': 0,
			'ry': 90,
			'w': this._evZ,
			'h': this._evY,
			'b': '999',
			't': js13k.Assets.textures.wall,
			's': 30,
			'mix': 0.5,
		} );
		// wall: right
		W.plane( {
			'g': g,
			'x': this._evX / 2,
			'y': 0,
			'z': 0,
			'ry': -90,
			'w': this._evZ,
			'h': this._evY,
			'b': '999',
			't': js13k.Assets.textures.wall,
			's': 30,
			'mix': 0.5,
		} );
		// wall: back
		W.plane( {
			'g': g,
			'x': 0,
			'y': 0,
			'z': this._evZ / 2,
			'ry': 180,
			'w': this._evX,
			'h': this._evY,
			'b': '999',
			't': js13k.Assets.textures.wall,
			's': 30,
			'mix': 0.5,
		} );
		// front, left side
		W.cube( {
			'g': g,
			'x': -( this._evX - this._evX / 5 ) / 2,
			'y': 0,
			'z': -this._evZ / 2,
			'w': this._evX / 5,
			'h': this._evY,
			'd': 0.1,
			'b': '999',
			't': js13k.Assets.textures.fs,
			's': 30,
			'mix': 0.5,
		} );
		// front, right side
		W.cube( {
			'g': g,
			'x': ( this._evX - this._evX / 5 ) / 2,
			'y': 0,
			'z': -this._evZ / 2,
			'w': this._evX / 5,
			'h': this._evY,
			'd': 0.1,
			'b': '999',
			't': js13k.Assets.textures.fs,
			's': 30,
			'mix': 0.5,
		} );
		// front, top
		W.cube( {
			'g': g,
			'x': 0,
			'y': ( this._evY - this._evY / 4 ) / 2,
			'z': -this._evZ / 2,
			'w': this._evX,
			'h': this._evY / 4,
			'd': 0.1,
			'b': '999',
			't': js13k.Assets.textures.ft,
			's': 30,
			'mix': 0.5,
		} );
	}


	/**
	 *
	 * @private
	 */
	_checkSelections() {
		// Only check objects every 50 ms
		if( this.timer - this._lastCheck > 0.05 * js13k.TARGET_FPS ) {
			this._lastCheck = this.timer;

			const hit = js13k.Renderer.checkSelectables();

			if( hit && hit.n != this._lastSelectable?.hit ) {
				// Highlight button
				if( hit.n.startsWith( 's_lbl_btn' ) ) {
					const btnN = hit.n.substring( 6 );
					const btn = W.next[btnN];

					if( btn ) {
						if( this._lastSelectable ) {
							W.move( {
								'n': this._lastSelectable.n,
								'b': this._lastSelectable.b,
							} );
						}

						this._lastSelectable = {
							hit: hit.n,
							'n': btnN,
							'b': btn.b,
						};

						W.move( { 'n': btnN, 'b': 'fff' } );
					}
				}
			}
			else if( !hit && this._lastSelectable ) {
				W.move( {
					'n': this._lastSelectable.n,
					'b': this._lastSelectable.b,
				} );
				this._lastSelectable = null;
			}
		}

		if(
			this._lastSelectable &&
			js13k.Input.isPressed( js13k.Input.ACTION.INTERACT, true )
		) {
			this.selectObject();
		}
	}


	/**
	 *
	 * @returns {boolean}
	 */
	doorsInMotion() {
		return [
			js13k.STATE.CLOSING,
			js13k.STATE.OPENING,
		].includes( this.states.doors );
	}


	/**
	 *
	 */
	doorsClose() {
		if( this.states.doors == js13k.STATE.CLOSED || this.doorsInMotion() ) {
			return;
		}

		this.states.doors = js13k.STATE.CLOSING;

		W.move( { 'n': 'dl', 'x': -this._rightDoorClosed, 'a': 2000 } );
		W.move( {
			'n': 'dr',
			'x': this._rightDoorClosed,
			'a': 2000,
			'onAnimDone': () => {
				this.states.doors = js13k.STATE.CLOSED;
			},
		} );
	}


	/**
	 *
	 */
	doorsOpen() {
		if( this.states.doors == js13k.STATE.OPEN || this.doorsInMotion() ) {
			return;
		}

		this.states.doors = js13k.STATE.OPENING;

		W.move( { 'n': 'dl', 'x': -this._rightDoorOpen, 'a': 2000 } );
		W.move( {
			'n': 'dr',
			'x': this._rightDoorOpen,
			'a': 2000,
			'onAnimDone': () => {
				this.states.doors = js13k.STATE.OPEN;
			},
		} );
	}


	/**
	 *
	 * @param {object} o
	 * @param {string} o.n
	 */
	handleSelected( o ) {
		if( !o ) {
			return;
		}

		console.debug( o.n, o ); // TODO: remove

		if( o.n.includes( 'btn' ) ) {
			js13k.Audio.play( js13k.Audio.BUTTON );
			this.doorsClose();
		}
	}


	/**
	 *
	 * @returns {boolean} True when finished.
	 */
	playIntro() {
		js13k.Renderer.cameraLocked = true;
		this._sceneStart = this._sceneStart || this.timer;

		const progress = ( this.timer - this._sceneStart ) / ( 3 * js13k.TARGET_FPS );

		if( progress == 0 ) {
			this.doorsClose();
		}

		const cam = {
			'z': 0,
			'rx': 0,
			'ry': 0,
		};

		if( progress > 1 ) {
			W.camera( cam );
			js13k.Renderer.cameraLocked = false;

			// Show pointer
			document.getElementById( 'p' ).hidden = false;

			delete W.next.title;
			delete W.current.title;

			return true;
		}

		// End on a smoother stop in the animation
		cam.z = -0.5 * ( 1 - Math.sin( progress * Math.PI / 2 ) );
		W.camera( cam );

		return false;
	}


	/**
	 *
	 */
	playTitle() {
		js13k.Renderer.cameraLocked = true;
		this._sceneStart = this._sceneStart || this.timer;

		const progress = ( this.timer - this._sceneStart ) / ( 3 * js13k.TARGET_FPS );

		if( progress == 0 ) {
			// Hide pointer
			document.getElementById( 'p' ).hidden = true;
		}

		if( progress >= 1 ) {
			return true;
		}

		W.camera( { 'z': -0.5, 'rx': 0, 'ry': 0 } );

		return false;
	}


	/**
	 *
	 */
	selectObject() {
		if( this._lastSelectable ) {
			const o = W.next[this._lastSelectable.n];
			this.handleSelected( o );
		}
	}


	/**
	 *
	 * @param {number|string} text
	 */
	setDisplay( text ) {
		W.move( {
			'n': 'dis',
			't': js13k.Assets.getDisplayTexture( text ),
			'mix': 0.25,
		} );
	}


	/**
	 *
	 * @param {js13k.SCENE} scene 
	 */
	setScene( scene ) {
		this._sceneStart = 0;
		this.scene = scene;
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		this.timer += dt;

		let canInteract = true;

		if( this.scene == js13k.SCENE.TITLE ) {
			if( this.playTitle() ) {
				this.setScene( js13k.SCENE.INTRO );
			}

			canInteract = false;
		}
		else if( this.scene == js13k.SCENE.INTRO ) {
			if( this.playIntro() ) {
				this.setScene( js13k.SCENE.NORMAL );
			}

			canInteract = false;
		}

		if( canInteract ) {
			this._checkSelections();
		}
	}


};
