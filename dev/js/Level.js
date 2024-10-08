'use strict';


js13k.SCENE = {
	NORMAL: 0,
	TITLE: 1,
	INTRO: 2,
	ELEVATOR_MOVING: 3,
	NEXT_LOOP: 4,
	REPEAT_LOOP: 5,
	OUTRO: 6,
};

js13k.STATE = {
	// Doors
	OPEN: 1,
	OPENING: 2,
	CLOSED: 3,
	CLOSING: 4,
	// Elevator
	IDLE: 5,
	MOVING: 6,
};


js13k.Level = class {


	/**
	 *
	 * @constructor
	 */
	constructor() {
		this._lastCheck = 0;
		this.canInteract = true;
		this.runners = [];
		this.timer = 0;

		this.buttonsEnabled = [];
		this.doors = js13k.STATE.OPEN;
		this.elevator = js13k.STATE.IDLE;
		this.floorCurrent = 1;
		this.floorNext = this.floorCurrent;
		this.floorsVisited = [];
		this.lightIntensity = 1;
		this.loop = 1;

		this._evX = 2.5;
		this._evY = 3;
		this._evZ = 2;

		W.light( { 'y': this._evY / 2 - 0.2 } );

		W.plane( {
			'n': 'title',
			'x': 0.02,
			'z': -2,
			'w': 1.5,
			'h': 0.3,
			'b': 'f00',
			't': js13k.Assets.textures.title,
		} );

		W.group( { 'n': 'ev' } );
		this._buildElevatorWalls();
		this._buildElevatorDoors();
		this._buildElevatorDisplay();
		this._buildElevatorNumberPad();
		this._buildFloors();
		this._buildLoopCounter();
		this._buildHighlight();

		this.setDisplay( this.floorCurrent );
		this.prepareLoop( this.loop );
		this.prepareFloor( this.floorCurrent );

		this.setScene( js13k.SCENE.TITLE );
	}


	/**
	 *
	 * @private
	 */
	_buildElevatorDisplay() {
		const w = 0.5;
		const h = 0.25;

		const y = this._evY / 2 - h - 0.15;
		const z = -this._evZ / 2 + 0.06;

		W.plane( {
			'n': 'dis',
			'y': y,
			'z': z,
			'w': w,
			'h': h,
			'b': 'f00',
		} );

		W.cube( {
			'x': -w / 2,
			'y': y,
			'z': z,
			'w': 0.05,
			'h': h,
			'd': 0.01,
			'b': '766',
			's': 30,
		} );

		W.cube( {
			'x': w / 2,
			'y': y,
			'z': z,
			'w': 0.05,
			'h': h,
			'd': 0.01,
			'b': '766',
			's': 30,
		} );
	}


	/**
	 *
	 * @private
	 */
	_buildElevatorDoors() {
		const doorWidth = this._evX / 2;
		const doorDepth = 0.05;

		this._rightDoorClosed = doorWidth / 2 + 0.002; // leave a very small gap open
		this._rightDoorOpen = this._rightDoorClosed + this._evX / 2 - this._evX / 3.5;


		// Left door area

		W.group( {
			'n': 'dlg',
			'g': 'ev',
			'x': -this._rightDoorOpen,
			'z': -this._evZ / 2,
		} );

		W.cube( {
			'g': 'dlg',
			'w': doorWidth,
			'h': this._evY,
			'd': doorDepth,
			'b': 'aaa',
			's': 20,
		} );


		// Right door area

		W.group( {
			'n': 'drg',
			'g': 'ev',
			'x': this._rightDoorOpen,
			'z': -this._evZ / 2,
		} );

		W.cube( {
			'g': 'drg',
			'w': doorWidth,
			'h': this._evY,
			'd': doorDepth,
			'b': 'aaa',
			's': 20,
		} );

		this._noteWidth = doorWidth / 4;

		W.plane( {
			'n': 's_note1',
			'g': 'drg',
			'x': ( this._noteWidth - doorWidth ) / 2 + 0.1,
			'y': -0.1,
			'z': doorDepth / 2 + 0.001,
			'w': this._noteWidth,
			'h': this._noteWidth * 1.414, // 297 / 210 ~= 1.414
			'rz': -10,
			't': js13k.Assets.getNote( 's_note1' ),
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
			'x': this._evX / 2 - w,
			'y': -h / 4,
			'z': -this._evZ / 2 + 0.051,
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
			const t = js13k.Assets.textures['s_lbl_' + n];

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
				't': t,
			} );

			if( i == 13 ) {
				this.oBtn13 = JSON.parse( JSON.stringify( W.next[n] ) );
				this.oBtn13.b = 'aaa';
				this.oLblBtn13 = JSON.parse( JSON.stringify( W.next['s_lbl_' + n] ) );
				this.oLblBtn13.t = t;
			}
		}

		delete this.oBtn13.m;
		delete this.oLblBtn13.m;
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
			'y': -this._evY / 2,
			'w': this._evX,
			'h': this._evZ,
			'rx': -90,
			'b': '555',
			't': js13k.Assets.textures.floor,
			'mix': 0.3,
		} );
		// ceiling
		W.plane( {
			'g': g,
			'y': this._evY / 2,
			'w': this._evX,
			'h': this._evZ,
			'rx': 90,
			'b': '999',
			't': js13k.Assets.textures.ceil,
			's': 30,
			'mix': 0.4,
		} );

		// floor ledges
		W.cube( {
			'g': g,
			'x': -this._evX / 2,
			'y': -this._evY / 2,
			'w': 0.02,
			'h': 0.1,
			'd': this._evZ,
			'b': '777',
		} );
		W.cube( {
			'g': g,
			'x': this._evX / 2,
			'y': -this._evY / 2,
			'w': 0.02,
			'h': 0.1,
			'd': this._evZ,
			'b': '777',
		} );
		W.cube( {
			'g': g,
			'y': -this._evY / 2,
			'z': this._evZ / 2,
			'w': this._evX,
			'h': 0.1,
			'd': 0.02,
			'b': '777',
		} );
		W.cube( {
			'g': g,
			'x': -this._evX / 2,
			'y': -this._evY / 2,
			'z': -this._evZ / 2 + 0.05,
			'w': this._evX / 2.25,
			'h': 0.1,
			'd': 0.02,
			'b': '777',
		} );
		W.cube( {
			'g': g,
			'x': this._evX / 2,
			'y': -this._evY / 2,
			'z': -this._evZ / 2 + 0.05,
			'w': this._evX / 2.25,
			'h': 0.1,
			'd': 0.02,
			'b': '777',
		} );

		// wall: left
		W.plane( {
			'g': g,
			'x': -this._evX / 2,
			'ry': 90,
			'w': this._evZ,
			'h': this._evY,
			'b': '999',
			't': js13k.Assets.textures.wall,
			's': 30,
			'mix': 0.4,
		} );
		// wall: right
		W.plane( {
			'g': g,
			'x': this._evX / 2,
			'ry': -90,
			'w': this._evZ,
			'h': this._evY,
			'b': '999',
			't': js13k.Assets.textures.wall,
			's': 30,
			'mix': 0.4,
		} );
		// wall: back
		W.plane( {
			'g': g,
			'z': this._evZ / 2,
			'ry': 180,
			'w': this._evX,
			'h': this._evY,
			'b': '999',
			't': js13k.Assets.textures.wall,
			's': 30,
			'mix': 0.4,
		} );

		// railing: left
		W.cube( {
			'g': g,
			'x': -this._evX / 2 + 0.02,
			'y': -this._evY / 5,
			'z': 0.025,
			'w': 0.04,
			'h': 0.15,
			'd': this._evZ - 0.15,
			'b': 'aaa',
			's': 30,
		} );
		// railing: right
		W.cube( {
			'g': g,
			'x': this._evX / 2 - 0.02,
			'y': -this._evY / 5,
			'z': 0.025,
			'w': 0.04,
			'h': 0.15,
			'd': this._evZ - 0.15,
			'b': 'aaa',
			's': 30,
		} );
		// railing: back
		W.cube( {
			'g': g,
			'y': -this._evY / 5,
			'z': this._evZ / 2 - 0.02,
			'w': this._evX - 0.15,
			'h': 0.15,
			'd': 0.04,
			'b': 'aaa',
			's': 30,
		} );

		// front, left side
		W.cube( {
			'g': g,
			'n': 's__fl',
			'x': -( this._evX - this._evX / 4.5 ) / 2,
			'z': -this._evZ / 2,
			'w': this._evX / 4.5,
			'h': this._evY,
			'd': 0.1,
			'b': '999',
			't': js13k.Assets.textures.fs,
			's': 30,
			'mix': 0.4,
		} );
		// front, right side
		W.cube( {
			'g': g,
			'n': 's__fr',
			'x': ( this._evX - this._evX / 4.5 ) / 2,
			'z': -this._evZ / 2,
			'w': this._evX / 4.5,
			'h': this._evY,
			'd': 0.1,
			'b': '999',
			't': js13k.Assets.textures.fs,
			's': 30,
			'mix': 0.4,
		} );
		// front, top
		W.cube( {
			'g': g,
			'y': ( this._evY - this._evY / 4 ) / 2,
			'z': -this._evZ / 2,
			'w': this._evX,
			'h': this._evY / 4,
			'd': 0.1,
			'b': '999',
			't': js13k.Assets.textures.ft,
			's': 30,
			'mix': 0.4,
		} );
	}


	/**
	 *
	 * @private
	 */
	_buildFloors() {
		// Dark bottom plane
		W.plane( {
			'n': 'plane',
			'y': -this._evY / 2 - 0.002,
			'z': -this._evZ / 2 - 10,
			'w': 30,
			'h': 20,
			'rx': 90,
			'rz': 180,
			'b': '111',
		} );

		// Eyes
		// (red)
		W.plane( {
			'n': 'e_red',
			'y': 0.8,
			'z': 100,
			'w': 0.5,
			'h': 0.5 / 4,
			't': js13k.Assets.getEyesTexture( '•   •', 'f00' ),
			'ns': 1,
		} );
		// (blue)
		W.plane( {
			'n': 'e_blue',
			'x': 0.6,
			'y': -0.4,
			'z': 100,
			'w': 0.5,
			'h': 0.5 / 4,
			'rx': 30,
			'ry': -45,
			't': js13k.Assets.getEyesTexture( '•  •', '77f' ),
			'ns': 1,
		} );
		// (pink)
		W.group( {
			'n': 'e_pink_all',
			'z': 100,
		} );
		W.plane( {
			'g': 'e_pink_all',
			'n': 'e_pink1',
			'x': 0.4,
			'y': 0.6,
			'w': 0.7,
			'h': 0.7 / 4,
			't': js13k.Assets.getEyesTexture( '•   •', 'f2c' ),
			'ns': 1,
		} );
		W.plane( {
			'g': 'e_pink_all',
			'n': 'e_pink2',
			'x': 0.7,
			'y': 0.2,
			'w': 0.5,
			'h': 0.5 / 4,
			'ry': 20,
			't': js13k.Assets.getEyesTexture( '•  •', 'f2c' ),
		} );
		W.plane( {
			'g': 'e_pink_all',
			'n': 'e_pink3',
			'x': 0.9,
			'y': -0.1,
			'w': 0.5,
			'h': 0.5 / 4,
			'ry': 20,
			't': js13k.Assets.getEyesTexture( '•   •', 'f2c' ),
		} );
		W.plane( {
			'g': 'e_pink_all',
			'n': 'e_pink4',
			'x': 1.3,
			'y': 0.1,
			'w': 0.4,
			'h': 0.4 / 4,
			'ry': 20,
			'rx': -10,
			't': js13k.Assets.getEyesTexture( '•  •', 'f2c' ),
		} );
		W.plane( {
			'g': 'e_pink_all',
			'n': 'e_pink10',
			'x': 1.1,
			'y': 0.4,
			'w': 0.5,
			'h': 0.5 / 4,
			'ry': 20,
			'rx': -10,
			't': js13k.Assets.getEyesTexture( '•  •', 'f2c' ),
		} );
		W.plane( {
			'g': 'e_pink_all',
			'n': 'e_pink11',
			'x': 0.2,
			'y': -0.05,
			'w': 0.4,
			'h': 0.4 / 4,
			'ry': 20,
			't': js13k.Assets.getEyesTexture( '•   •', 'f2c' ),
		} );

		W.plane( {
			'g': 'e_pink_all',
			'n': 'e_pink5',
			'x': -0.5,
			'y': 0.3,
			'w': 0.5,
			'h': 0.5 / 4,
			'ry': -20,
			't': js13k.Assets.getEyesTexture( '•  •', 'f2c' ),
		} );
		W.plane( {
			'g': 'e_pink_all',
			'n': 'e_pink6',
			'x': -0.8,
			'w': 0.4,
			'h': 0.4 / 4,
			'ry': -20,
			't': js13k.Assets.getEyesTexture( '•   •', 'f2c' ),
		} );
		W.plane( {
			'g': 'e_pink_all',
			'n': 'e_pink7',
			'x': -1.2,
			'y': 0.2,
			'w': 0.6,
			'h': 0.6 / 4,
			'ry': -20,
			't': js13k.Assets.getEyesTexture( '•  •', 'f2c' ),
		} );
		W.plane( {
			'g': 'e_pink_all',
			'n': 'e_pink8',
			'x': -1.4,
			'y': -0.2,
			'w': 0.5,
			'h': 0.5 / 4,
			'ry': -20,
			't': js13k.Assets.getEyesTexture( '•   •', 'f2c' ),
		} );
		W.plane( {
			'g': 'e_pink_all',
			'n': 'e_pink9',
			'x': -1.3,
			'y': 0.6,
			'w': 0.5,
			'h': 0.5 / 4,
			'ry': -20,
			't': js13k.Assets.getEyesTexture( '•   •', 'f2c' ),
		} );
	}


	/**
	 *
	 * @private
	 */
	_buildHighlight() {
		const color = 'fff';
		const size = 0.005;

		W.group( { 'n': 'hl' } );

		W.cube( {
			'n': 'hl_t',
			'g': 'hl',
			'size': size,
			'b': color,
			'ns': 1,
		} );

		W.cube( {
			'n': 'hl_r',
			'g': 'hl',
			'size': size,
			'b': color,
			'ns': 1,
		} );

		W.cube( {
			'n': 'hl_b',
			'g': 'hl',
			'size': size,
			'b': color,
			'ns': 1,
		} );

		W.cube( {
			'n': 'hl_l',
			'g': 'hl',
			'size': size,
			'b': color,
			'ns': 1,
		} );
	}


	/**
	 *
	 * @private
	 */
	_buildLoopCounter() {
		// Starts appearing on 2nd loop
		W.plane( {
			'n': 'loops',
			'g': 'drg',
			'x': -0.48,
			'y': 0.4,
			'z': 100,
			'w': 0.18,
			'h': 0.09,
			'rz': 5,
			't': js13k.Assets.textures.counter2,
			'mix': 0,
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
				let key = hit.n;

				// Highlight button
				if( key.startsWith( 's_lbl_btn' ) ) {
					key = key.substring( 6 ); // remove "s_lbl_"
				}

				const target = W.next[key];

				if( target ) {
					this._lastSelectable = {
						hit: hit.n,
						'n': key,
					};
				}
			}
			else if( !hit && this._lastSelectable ) {
				this._lastSelectable = null;
			}
		}

		this.highlight( this._lastSelectable );

		if( this._lastSelectable ) {
			if(
				this.isButtonEnabled( this._lastSelectable.n ) ||
				( this._lastSelectable.n == 'btn13' && !this.btn13PickedUp )
			) {
				const cnvUI = js13k.Renderer.cnvUI;
				const ctxUI = js13k.Renderer.ctxUI;
				ctxUI.fillStyle = '#fff7';
				ctxUI.font = '18px ' + js13k.FONT_SANS;
				ctxUI.textAlign = 'center';
				ctxUI.fillText( '[E] / LEFT-CLICK TO INTERACT', cnvUI.width / 2, cnvUI.height - 42 );
			}

			if( js13k.Input.isPressed( js13k.Input.ACTION.INTERACT, true ) ) {
				this.selectObject();
			}
		}
	}


	/**
	 *
	 */
	clicked() {
		if( this.note ) {
			this.note = null;
		}
		else {
			this.selectObject();
		}
	}


	/**
	 *
	 * @param {number} floor
	 */
	doFloorAction( floor ) {
		const loop = this.loop;
		const hasFloor13 = this.buttonsEnabled.includes( 13 );
		let scene = js13k.SCENE.NORMAL;

		if( loop == 1 ) {
			// (red) stares from a distance, next loop
			if( floor == 13 ) {
				scene = js13k.SCENE.NEXT_LOOP;
			}
		}
		else if( loop == 2 ) {
			if( !hasFloor13 ) {
				this.enableButton( 13 );
			}

			// (blue) first dialog
			if( floor == 3 ) {
				// Look to player
				W.move( {
					'n': 'e_blue',
					'rx': 0,
					'ry': 0,
					'a': 500,
					'onAnimDone': () => {
						this.runners.push( {
							duration: 2,
							do: progress => {
								this.showDialog( js13k.Assets.texts.blue1, W.next.e_blue, '77f', progress );

								return progress > 2 || this.floorCurrent != 3;
							},
						} );

						// Look away again
						W.move( {
							'n': 'e_blue',
							'rx': 30,
							'ry': -45,
							'a': 2000,
						} );
					},
				} );
			}
			// (red) is closer now, next loop
			else if( floor == 13 ) {
				scene = js13k.SCENE.NEXT_LOOP;
			}
		}
		else if( loop == 3 ) {
			if( !hasFloor13 && this.hasVisitedFloors( [3, 9] ) ) {
				this.enableButton( 13 );
			}

			// (blue) second dialog
			if( floor == 3 ) {
				const pos = {
					x: W.next.e_blue.x,
					y: W.next.e_blue.y,
					z: W.next.e_blue.z,
					h: W.next.e_blue.h,
				};

				this.runners.push( {
					duration: 2,
					do: progress => {
						this.showDialog( js13k.Assets.texts.blue2, pos, '77f', progress );

						return this.elevator == js13k.STATE.MOVING;
					},
				} );
			}
			// (pink) first dialog
			else if( floor == 9 ) {
				const y = W.next.e_pink1.y;
				let lastIndex = 0;
				let lastPos = 0;
				let lastAnim = 0;

				this.runners.push(
					// pink1 talking
					{
						duration: 5,
						do: progress => {
							this.showDialog( js13k.Assets.texts.pink1, W.next.e_pink1, 'f2c', progress );

							return progress > 1;
						},
					},
					// pink1 nodding
					{
						duration: 10,
						do: progress => {
							const f = ( Math.sin( Math.PI * 10 * progress ) + 1 ) / 2;

							W.move( {
								'n': 'e_pink1',
								'y': y - f * 0.025,
								'rx': f * 40,
							} );

							return progress > 1 || this.elevator == js13k.STATE.MOVING;
						},
					},
					// various pinks blinking
					{
						duration: 1,
						do: progress => {
							const sec = Math.round( progress * 5 );

							if( lastAnim >= sec ) {
								return;
							}

							lastAnim = sec;

							if( lastIndex ) {
								W.move( {
									'n': 'e_pink' + lastIndex,
									'z': lastPos,
								} );
							}

							if( Math.random() < 0.8 ) {
								lastIndex = 0;
								return;
							}

							const index = sec % 10 + 2;
							lastIndex = index;
							lastPos = W.next['e_pink' + index].z;

							W.move( {
								'n': 'e_pink' + index,
								'z': 100,
							} );

							return this.elevator == js13k.STATE.MOVING;
						},
					},
				);
			}
			// (red) is closer again, next loop
			else if( floor == 13 ) {
				scene = js13k.SCENE.NEXT_LOOP;
			}
		}
		else if( loop == 4 ) {
			if( !hasFloor13 && this.hasVisitedFloors( [3, 6, 9] ) ) {
				this.enableButton( 13 );
			}

			// (blue) dying
			if( floor == 3 ) {
				this.runners.push( {
					duration: 2,
					do: progress => {
						this.showDialog( js13k.Assets.texts.blue3, W.next.e_blue, '77f', progress );

						return progress > 1;
					},
				} );
			}
			// (red) among the (pink)
			else if( floor == 9 ) {
				let lastIndex = 0;
				let lastPos = 0;
				let lastAnim = 0;

				this.runners.push(
					{
						duration: 2,
						do: progress => {
							this.showDialog( js13k.Assets.texts.pink2, W.next.e_pink1, 'f2c', progress );

							return progress > 1;
						},
					},
					// various pinks blinking
					{
						duration: 1,
						do: progress => {
							const sec = Math.round( progress * 5 );

							if( lastAnim >= sec ) {
								return;
							}

							lastAnim = sec;

							if( lastIndex ) {
								W.move( {
									'n': 'e_pink' + lastIndex,
									'z': lastPos,
								} );
							}

							if( Math.random() < 0.8 ) {
								lastIndex = 0;
								return;
							}

							const index = sec % 10 + 2;
							lastIndex = index;
							lastPos = W.next['e_pink' + index].z;

							W.move( {
								'n': 'e_pink' + index,
								'z': 100,
							} );

							return this.elevator == js13k.STATE.MOVING;
						},
					},
				);
			}
			// Empty, next loop
			else if( floor == 13 ) {
				scene = js13k.SCENE.NEXT_LOOP;
			}
		}
		else if( loop == 5 ) {
			if( !hasFloor13 && this.hasVisitedFloors( [3, 9] ) && this.btn13PickedUp ) {
				this.enableButton( 13 );
			}

			// A different (blue)
			if( floor == 3 ) {
				this.runners.push( {
					duration: 7,
					do: progress => {
						if( progress > 0.1 ) {
							this.showDialog( js13k.Assets.texts.blue4, W.next.e_blue, '3b7', progress - 0.1 );
						}

						return progress > 1.1;
					},
				} );
			}
			// (red) kills (pink), attacks player
			else if( floor == 9 ) {
				// Only attack once on this floor
				if( W.next.e_red.z == -3 ) {
					const {
						x: startX,
						y: startY,
						z: startZ
					} = W.next.e_red;

					// (red) looks towards player
					W.move( {
						'n': 'e_red',
						'rx': 0,
						'ry': 0,
						'rz': 0,
						'a': 600,
						'onAnimDone': () => {
							// Wait a moment
							setTimeout( () => this.redAttackScene( startX, startY, startZ ), 1000 );
						},
					} );
				}
			}
			// Empty, next loop
			else if( floor == 13 ) {
				scene = js13k.SCENE.NEXT_LOOP;
			}
			// A chance of (red) attacking if floor 9 has already been visited
			// Except for the floor where the button can be found
			else if( this.floorsVisited.includes( 9 ) && W.next.e_red.z == -3 ) {
				setTimeout( () => this.redAttackScene( 0, 0.5, -3 ), 100 );
			}
		}
		else if( loop == 6 ) {
			// Ending
			if( floor == 1 ) {
				scene = js13k.SCENE.OUTRO;
			}
		}

		this.setScene( scene );
	}


	/**
	 *
	 * @param {number} floor
	 */
	doFloorActionPreDoor( floor ) {
		if( this.loop == 3 ) {
			if( floor == 3 ) {
				const pos = {
					x: W.next.e_blue.x,
					y: W.next.e_blue.y,
					z: W.next.e_blue.z,
					h: W.next.e_blue.h,
				};

				this.runners.push( {
					duration: 2,
					do: _progress => {
						W.move( {
							'n': 'e_blue',
							'x': pos.x + ( Math.random() - 0.5 ) / 60,
							'y': pos.y + ( Math.random() - 0.5 ) / 100,
						} );

						return this.floorCurrent != 3;
					},
				} );
			}
		}
		else if( this.loop == 5 ) {
			if( floor == 9 ) {
				const pos = [5, 6, 8].map( index => {
					const key = 'e_pink' + index;

					return {
						n: key,
						x: W.next[key].x,
						y: W.next[key].y,
					};
				} );

				this.runners.push( {
					duration: 2,
					do: _progress => {
						const move = [];

						pos.forEach( o => {
							move.push( {
								'n': o.n,
								'x': o.x + ( Math.random() - 0.5 ) / 60,
								'y': o.y + ( Math.random() - 0.5 ) / 100,
							} );
						} );

						W.move( move );

						return this.floorCurrent != 9;
					},
				} );
			}
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
		].includes( this.doors );
	}


	/**
	 *
	 * @param {function?} cb
	 */
	doorsClose( cb ) {
		if( this.doors == js13k.STATE.CLOSED || this.doorsInMotion() ) {
			cb?.();
			return;
		}

		this.doors = js13k.STATE.CLOSING;

		js13k.Audio.play( js13k.Audio.DOORS );

		W.move( {
			'n': 'dlg',
			'x': -this._rightDoorClosed,
			'a': 2000,
		} );
		W.move( {
			'n': 'drg',
			'x': this._rightDoorClosed,
			'a': 2000,
			'onAnimDone': () => {
				this.doors = js13k.STATE.CLOSED;
				setTimeout( () => cb?.(), 800 );
			},
		} );
	}


	/**
	 *
	 * @param {function?} cb
	 */
	doorsOpen( cb ) {
		if( this.doors == js13k.STATE.OPEN || this.doorsInMotion() ) {
			cb?.();
			return;
		}

		this.doors = js13k.STATE.OPENING;

		setTimeout( () => {
			js13k.Audio.play( js13k.Audio.DOORS );

			W.move( {
				'n': 'dlg',
				'x': -this._rightDoorOpen,
				'a': 2000,
			} );
			W.move( {
				'n': 'drg',
				'x': this._rightDoorOpen,
				'a': 2000,
				'onAnimDone': () => {
					this.doors = js13k.STATE.OPEN;
					cb?.();
				},
			} );
		}, 800 );
	}


	/**
	 *
	 * @param {number} num
	 */
	enableButton( num ) {
		this.buttonsEnabled.push( num );

		W.move( {
			'n': 'btn' + num,
			'b': 'ddd',
		} );
	}


	/**
	 *
	 * @param {number} progress
	 * @returns {boolean}
	 */
	handleRedAttack( progress ) {
		if( this.doors == js13k.STATE.CLOSED ) {
			js13k.Audio.play( js13k.Audio.THUD );
			js13k.Audio.text(
				'*thud*', 'f00', 3,
				{
					x: 0,
					y: 0.1,
					z: -1,
				}
			);

			const camStart = {
				'x': W.next.camera.x,
				'y': W.next.camera.y,
				'z': W.next.camera.z,
			};

			// Short screen shake
			this.runners.push( {
				duration: 0.7,
				do: progress => {
					W.camera( {
						'x': camStart.x + ( Math.random() * 2 - 1 ) / 300,
						'y': camStart.y + ( Math.random() * 2 - 1 ) / 300,
						'z': camStart.z + ( Math.random() * 2 - 1 ) / 300,
					} );

					return progress > 1;
				},
			} );

			W.move( {
				'n': 'e_red',
				'z': 100,
			} );

			return true;
		}

		// Didn't close doors on time
		if( progress > 1 && this.doors != js13k.STATE.CLOSING ) {
			this.setScene( js13k.SCENE.REPEAT_LOOP );

			return true;
		}

		return false;
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

		if( o.n.startsWith( 's_note' ) ) {
			this.note = o.n;
		}
		else if( o.n.startsWith( 'btn' ) ) {
			if( !this.isButtonEnabled( o.n ) && this.loop == 5 && o.n == 'btn13' && !this.btn13PickedUp ) {
				this.btn13PickedUp = true;

				W.move( {
					'n': 'btn13',
					'x': W.next.btn13.x - 0.2,
					'y': W.next.btn13.y + 0.8,
					'z': W.next.btn13.z + 0.7,
					'rx': 0,
					'ry': 0,
					'rz': 0,
					'a': 500,
					'onAnimDone': () => {
						setTimeout( () => {
							this.oBtn13.a = 1000;
							this.oBtn13.onAnimDone = () => {
								if( this.hasVisitedFloors( [3, 9] ) ) {
									this.enableButton( 13 );
								}
							},
							this.oLblBtn13.a = 1000;

							W.move( [this.oBtn13, this.oLblBtn13] );
						}, 200 );
					},
				} );
				W.move( {
					'n': 's_lbl_btn13',
					'x': W.next.s_lbl_btn13.x - 0.2,
					'y': W.next.s_lbl_btn13.y + 0.8,
					'z': W.next.s_lbl_btn13.z + 0.72,
					'rx': 0,
					'ry': 0,
					'rz': 0,
					'a': 500,
				} );

				return;
			}

			if( this.elevator == js13k.STATE.IDLE ) {
				if( !this.isButtonEnabled( o.n ) ) {
					js13k.Audio.play( js13k.Audio.ERROR );
					return;
				}

				js13k.Audio.play( js13k.Audio.BUTTON );
				js13k.Audio.text( '*beep*', 'ff0', 1, o );

				const floor = Number( o.n.substring( 3 ) );

				// "Close doors" button ("><")
				if( floor == 0 ) {
					this.doorsClose();
					return;
				}

				// Same floor, toggle door state
				if( this.floorCurrent == floor ) {
					if( this.doors == js13k.STATE.OPEN ) {
						this.doorsClose();
					}
					else {
						this.doorsOpen();
					}

					return;
				}

				this.floorNext = floor;
				this.elevator = js13k.STATE.MOVING;

				this.doorsClose( () => this.setScene( js13k.SCENE.ELEVATOR_MOVING ) );
			}
		}
	}


	/**
	 *
	 * @param {number[]} check
	 * @returns {boolean}
	 */
	hasVisitedFloors( check ) {
		for( let i = 0; i < check.length; i++ ) {
			if( !this.floorsVisited.includes( check[i] ) ) {
				return false;
			}
		}

		return true;
	}


	/**
	 *
	 * @param {object?} target
	 * @param {string}  target.n
	 */
	highlight( target ) {
		if( !target || !this.isButtonEnabled( target.n ) ) {
			if( !target || this.loop != 5 || target.n != 'btn13' || this.btn13PickedUp ) {
				W.move( {
					'n': 'hl',
					'z': 100,
				} );

				return;
			}
		}

		const o = W.next[target.n];
		const oGlobal = js13k.getGlobalPos( o );
		const size = 0.005;

		W.move( [
			{
				'n': 'hl',
				'x': oGlobal.x,
				'y': oGlobal.y,
				'z': oGlobal.z + ( o.ry ? 0 : size * 2 ),
				'rx': o.rx,
				'ry': o.ry,
				'rz': o.rz,
			},
			{
				'n': 'hl_t',
				'y': oGlobal.h / 2,
				'w': oGlobal.w,
				'h': size,
			},
			{
				'n': 'hl_r',
				'x': oGlobal.w / 2,
				'h': oGlobal.h,
				'w': size,
			},
			{
				'n': 'hl_b',
				'y': -oGlobal.h / 2,
				'w': oGlobal.w,
				'h': size,
			},
			{
				'n': 'hl_l',
				'x': -oGlobal.w / 2,
				'h': oGlobal.h,
				'w': size,
			}
		] );
	}


	/**
	 *
	 * @param {string} n
	 * @returns {boolean}
	 */
	isButtonEnabled( n ) {
		if( !n.startsWith( 'btn' ) ) {
			return true;
		}

		return this.buttonsEnabled.includes(
			Number( n.replace( 'btn', '' ) )
		);
	}


	/**
	 *
	 * @returns {boolean}
	 */
	isFlickerFloor() {
		if( this.scene == js13k.SCENE.TITLE ) {
			return true;
		}

		if( this.loop == 2 && this.floorCurrent == 13 ) {
			return true;
		}

		if( this.loop == 3 && this.floorCurrent == 13 ) {
			return true;
		}

		if( this.loop == 4 && this.floorCurrent == 9 ) {
			return true;
		}

		if( this.loop == 5 ) {
			return true;
		}

		return false;
	}


	/**
	 *
	 * @param {number} nextLoop
	 */
	loopNext( nextLoop ) {
		W.camera( {
			'x': 0,
			'y': 0,
			'z': 0,
		} );
		W.light( { 'i': 1 } );

		if( this.loop != nextLoop ) {
			this.floorsVisited = [];
		}
		else if( this.loop == 5 ) {
			// In loop 5, on a repeat, only have to revisit floor 9.
			// (And technically floor 8 to pick up btn13 again.)
			this.floorsVisited = this.floorsVisited.filter( f => f != 9 );
		}

		this.loop = nextLoop;
		this.floorCurrent = this.loop == 6 ? 13 : 1;
		this.floorNext = this.floorCurrent;
		this.setDisplay( this.floorCurrent );
		this.prepareLoop( nextLoop );
		this.prepareFloor( this.floorCurrent );
		this._lastSelectable = null;
	}


	/**
	 *
	 * @param {number} floor
	 */
	prepareFloor( floor ) {
		const loop = this.loop;
		const move = [];

		const red = {
			'n': 'e_red',
			'y': 0.8,
			'z': 100, // outside of visible area
		};
		const blue = {
			'n': 'e_blue',
			'y': 0,
			'z': 100,
			'rx': 0,
		};
		const pink = {
			'n': 'e_pink_all',
			'z': 100,
		};

		if( W.next.dialog ) {
			move.push( {
				'n': 'dialog',
				'z': 100,
			} );
		}

		this._lastDialogTextPos = 0;

		if( loop == 1 ) {
			if( floor == 13 ) {
				red.z = -8;
			}
		}
		else if( loop == 2 ) {
			if( floor == 3 ) {
				blue.z = -3.5;
			}
			else if( floor == 13 ) {
				red.z = -4.5;
			}
		}
		else if( loop == 3 ) {
			if( floor == 3 ) {
				blue.z = -3.5;
			}
			else if( floor == 9 ) {
				pink.z = -3;
			}
			else if( floor == 13 ) {
				red.z = -2.5;
			}
		}
		else if( loop == 4 ) {
			const note = {
				'n': 's_note4',
				'z': 100,
			};
			const bloodFloor6 = {
				'n': 'blood6',
				'z': 100,
			};

			if( floor == 3 ) {
				blue.y = -1;
				blue.z = -3.5;
				blue.rx = -90;
			}
			else if( floor == 6 ) {
				note.z = -1.8;
				bloodFloor6.z = -2.5;
			}
			else if( floor == 9 ) {
				pink.z = -3;

				// Replace one of (pink) with (red)
				red.x = W.next.e_pink7.x;
				red.y = W.next.e_pink7.y;
				red.z = -3;
				move.push( {
					'n': 'e_pink7',
					'z': 100,
				} );
			}

			move.push( note, bloodFloor6 );
		}
		else if( loop == 5 ) {
			let btn13Z = 100;

			if( floor == 3 ) {
				blue.z = -3;
			}
			else if( floor == 9 ) {
				pink.z = -3;

				move.push( {
					'n': 'e_pink5',
					'x': -0.5,
					'y': 0.2,
					'z': 0,
					'ry': -30,
				} );
				move.push( {
					'n': 'e_pink6',
					'y': -0.1,
					'z': 0,
					'ry': -30,
				} );
				move.push( {
					'n': 'e_pink8',
					'x': -1.1,
					'y': 0.1,
					'z': 0,
					'ry': -30,
				} );

				if( !this.floorsVisited.includes( 9 ) ) {
					red.x = 0.7;
					red.z = -3;
					red.ry = 30;
				}
			}
			else if( floor == 8 ) {
				btn13Z = -0.22;
			}

			if( ![3, 9, 13].includes( floor ) && this.floorsVisited.includes( 9 ) && Math.random() < 0.4 ) {
				red.x = 0;
				red.y = 0.5;
				red.z = -3;
			}

			if( !this.btn13PickedUp ) {
				move.push( {
					'n': 'btn13',
					'x': -0.7,
					'y': -1.2,
					'z': btn13Z,
					'rx': -90,
					'ry': 10,
				} );
				move.push( {
					'n': 's_lbl_btn13',
					'x': -0.7,
					'y': -1.189,
					'z': btn13Z,
					'rx': -90,
					'ry': 10,
				} );
			}
		}
		else if( loop == 6 ) {
			if( floor == 1 ) {
				W.clearColor( 'eee' );
			}
		}

		move.push( red );
		move.push( blue );
		move.push( pink );

		W.move( move );
	}


	/**
	 *
	 * @param {number} loop
	 */
	prepareLoop( loop ) {
		const move = [];
		const del = [];

		const enabledButtons = [
			[0, 13],
			[0, 3],
			[0, 3, 9],
			[0, 3, 6, 9],
			[0, 3, 4, 7, 8, 9, 10, 12], // Button for 13 has to be collected first
			[1],
		];

		this.buttonsEnabled = enabledButtons[loop - 1];

		for( let i = 0; i < 14; i++ ) {
			move.push( {
				'n': 'btn' + i,
				'b': this.buttonsEnabled.includes( i ) ? 'ddd' : 'aaa',
			} );
		}

		this.updateLoopCounter( loop );

		if( loop == 2 ) {
			W.plane( {
				'n': 's_note2',
				'g': 'dlg',
				'x': 0.3,
				'y': -0.3,
				'z': 0.0251,
				'w': this._noteWidth,
				'h': this._noteWidth * 1.414,
				'rz': 20,
				't': js13k.Assets.getNote( 's_note2' ),
			} );
		}
		else if( loop == 3 ) {
			W.plane( {
				'n': 's_note3',
				'x': this._evX / 2 - 0.03,
				'y': -0.2,
				'z': -0.1,
				'w': this._noteWidth,
				'h': this._noteWidth * 1.414,
				'ry': -90,
				't': js13k.Assets.getNote( 's_note3' ),
			} );
		}
		else if( loop == 4 ) {
			this.lightIntensity = 0.9;

			W.plane( {
				'n': 's_note4',
				'x': -0.1,
				'y': -this._evY / 2,
				'w': this._noteWidth,
				'h': this._noteWidth * 1.414,
				'rx': -90,
				'ry': 5,
				't': js13k.Assets.getNote( 's_note4', '#185' ),
				'b': '000',
				'mix': 0.7,
			} );

			W.group( {
				'n': 'blood6',
				'y': -this._evY / 2,
				'rx': -90,
			} );
			W.plane( {
				'g': 'blood6',
				'w': 0.2,
				'h': 0.2,
				't': js13k.Assets.textures.blood,
			} );
			W.plane( {
				'g': 'blood6',
				'x': -0.1,
				'y': 0.3,
				'w': 0.1,
				'h': 0.1,
				't': js13k.Assets.textures.blood,
			} );
			W.plane( {
				'g': 'blood6',
				'x': 0.01,
				'y': 0.5,
				'w': 0.08,
				'h': 0.08,
				't': js13k.Assets.textures.blood,
			} );
		}
		else if( loop == 5 ) {
			this.btn13PickedUp = false;
			this.lightIntensity = 0.8;

			W.plane( {
				'n': 's_note5c',
				'x': this._evX / 2 - 0.03,
				'y': -0.2,
				'z': -0.1,
				'w': this._noteWidth,
				'h': this._noteWidth * 1.414,
				'ry': -90,
				't': js13k.Assets.getNote( 's_note5c', '#185' ),
			} );
			W.plane( {
				'n': 's_note5b',
				'x': this._evX / 2 - 0.031,
				'y': -0.1,
				'z': 0.18,
				'w': this._noteWidth,
				'h': this._noteWidth * 1.414,
				'ry': -90,
				't': js13k.Assets.getNote( 's_note5b', '#185' ),
			} );
			W.plane( {
				'n': 's_note5a',
				'x': -this._evX / 2 + 0.031,
				'w': this._noteWidth,
				'h': this._noteWidth * 1.414,
				'ry': 90,
				't': js13k.Assets.getNote( 's_note5a', '#185' ),
			} );

			move.push(
				{
					'n': 'btn13',
					'z': 100,
				},
				{
					'n': 's_lbl_btn13',
					'z': 100,
				},
				{
					'n': 'e_blue',
					'x': -1,
					'y': -0.4,
					'ry': -45,
					't': js13k.Assets.getEyesTexture( '•  •', '3b7' ),
				},
			);
		}
		else if( loop == 6 ) {
			this.lightIntensity = 1;

			const [cnvNote, ctxNote] = js13k.Renderer.getOffscreenCanvas( 600, 200, 'note6' );
			ctxNote.font = 'italic 32px ' + js13k.SERIF;
			ctxNote.fillStyle = '#444';
			ctxNote.textBaseline = 'top';

			const lines = js13k.Assets.texts.s_note6;

			for( let i = 0; i < lines.length; i++ ) {
				ctxNote.fillText( lines[i], 300, 20 + i * 40 );
			}

			W.plane( {
				'n': 'note6',
				'y': -0.1,
				'z': 0.99,
				'w': 0.6,
				'h': 0.2,
				'ry': 180,
				't': cnvNote,
			} );

			del.push( 'plane', 'dsl', 'dsr' );
		}

		if( loop > 1 ) {
			move.push( {
				'n': 'loops',
				'z': 0.0251,
			} );

			del.push( 's_note1' );
		}
		if( loop > 2 ) {
			del.push( 's_note2' );
		}
		if( loop > 3 ) {
			del.push( 's_note3' );
		}
		if( loop > 4 ) {
			del.push(
				's_note4',
				'e_pink1',
				'e_pink2',
				'e_pink3',
				'e_pink4',
				'e_pink7',
				'e_pink9',
				'e_pink10',
				'e_pink11',
			);
		}
		if( loop > 5 ) {
			del.push( 's_note5a', 's_note5b', 's_note5c' );
		}

		W.move( move );
		W.delete( del );
	}


	/**
	 *
	 * @param {number} startX
	 * @param {number} startY
	 * @param {number} startZ
	 */
	redAttackScene( startX, startY, startZ ) {
		let lastStep = 0;

		// (red) moves towards player
		this.runners.push( {
			duration: 6,
			do: progress => {
				if( this.handleRedAttack( progress ) ) {
					return 1;
				}

				if( progress * 8 - lastStep < 1 || progress >= 1 ) {
					return;
				}

				lastStep = progress * 8;

				// Get closer to player
				let x = ( 1 - progress ) * startX;
				let y = ( 1 - progress ) * startY;
				let z = ( 1 - progress ) * ( startZ + 0.7 ) - 0.7;

				// Sway left/right because of steps
				x += Math.round( lastStep ) % 2 ? 0.07 : -0.07;

				js13k.Audio.play( js13k.Audio.STEP, 0, 0.1 + lastStep * 0.1 );
				js13k.Audio.text(
					'*thump*', 'f00', 0.5,
					{
						'x': x,
						'y': -0.5,
						'z': z,
					}
				);

				W.move( {
					'n': 'e_red',
					'x': x,
					'y': y,
					'z': z,
				} );
			},
		} );
	}


	/**
	 *
	 */
	runRunners() {
		const remove = [];

		for( let i = 0; i < this.runners.length; i++ ) {
			const runner = this.runners[i];
			runner.start ??= this.timer;

			const progress = ( this.timer - runner.start ) / ( runner.duration * js13k.TARGET_FPS );

			// Return something true-ish to remove a runner.
			if( runner.do( progress ) ) {
				remove.push( runner );
			}
		}

		this.runners = this.runners.filter( runner => !remove.includes( runner ) );
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
			's': 30,
			'mix': 0.25,
		} );
	}


	/**
	 *
	 * @param {js13k.SCENE} scene
	 * @param {number?}     flag  - Some custom flag that can mean whatever depending on the scene.
	 */
	setScene( scene, flag ) {
		if( this.scene == scene ) {
			return;
		}

		this.scene = scene;
		this.canInteract = true;

		const loop = this.loop;
		const runner = {};

		if( scene == js13k.SCENE.ELEVATOR_MOVING ) {
			if( W.next.dialog ) {
				W.move( {
					'n': 'dialog',
					'z': 100,
				} );
			}

			const camStart = {
				'x': W.next.camera.x,
				'y': W.next.camera.y,
				'z': W.next.camera.z,
			};

			// Moving from 1 floor to the next takes 1.1 seconds.
			// Multiple floors take longer. But the greater the
			// floor difference, the faster it is.
			const floorDiff = this.floorNext - this.floorCurrent;
			runner.duration = Math.min( 4.5, 1.1 * Math.abs( floorDiff ) );

			js13k.Audio.play( js13k.Audio.ELEVATOR, runner.duration );

			runner.do = progress => {
				this.setDisplay( this.floorCurrent + Math.round( progress * floorDiff ) );

				if( progress > 1 ) {
					this.prepareFloor( this.floorNext );

					W.camera( camStart );
					js13k.Audio.play( js13k.Audio.DING );
					js13k.Audio.text( '*ding*', 'ff0', 3, W.next.dis );

					this.floorCurrent = this.floorNext;
					this.floorsVisited.push( this.floorCurrent );
					setTimeout( () => this.doFloorActionPreDoor( this.floorCurrent ), 1 );

					this.doorsOpen( () => {
						this.elevator = js13k.STATE.IDLE;
						this.setScene( js13k.SCENE.NORMAL );
						setTimeout( () => this.doFloorAction( this.floorCurrent ), 1 );
					} );

					return 1;
				}

				// Screen shake
				W.camera( {
					'x': camStart.x + ( Math.random() * 2 - 1 ) / 300,
					'y': camStart.y + ( Math.random() * 2 - 1 ) / 300,
					'z': camStart.z + ( Math.random() * 2 - 1 ) / 300,
				} );
			};
		}
		else if( scene == js13k.SCENE.NEXT_LOOP ) {
			this.canInteract = false;

			js13k.Renderer.cameraLocked = true;

			// Center camera
			W.camera( {
				'rx': 0,
				'ry': 0,
				'a': 500,
				'onAnimDone': () => {
					const redStartZ = W.next.e_red.z;

					// Move camera out of elevator, fade to black
					this.runners.push( {
						duration: 3,
						do: progress => {
							js13k.Renderer.ctxUI.fillStyle = `rgba(0,0,0,${Math.min( 1, progress )})`;
							js13k.Renderer.ctxUI.fillRect(
								0, 0,
								js13k.Renderer.cnvUI.width, js13k.Renderer.cnvUI.height
							);

							if( progress > 1 ) {
								W.move( {
									'n': 'e_red',
									'z': 100,
								} );

								this.loopNext( loop + 1 );
								setTimeout( () => this.setScene( js13k.SCENE.INTRO, 1 ), 1 );

								return 1;
							}

							const z = -0.5 * progress;

							W.camera( { 'z': z } );
							W.move( {
								'n': 'e_red',
								'z': redStartZ + z,
							} );
						},
					} );
				},
			} );
		}
		else if( scene == js13k.SCENE.REPEAT_LOOP ) {
			this.canInteract = false;

			runner.duration = 3;
			runner.do = progress => {
				js13k.Renderer.cameraLocked = true;

				const w = js13k.Renderer.cnvUI.width;
				const h = js13k.Renderer.cnvUI.height;
				js13k.Renderer.ctxUI.fillStyle = '#a00';
				js13k.Renderer.ctxUI.fillRect( 0, 0, w, h );
				js13k.Renderer.ctxUI.fillStyle = `rgba(0,0,0,${Math.min( 1, progress )})`;
				js13k.Renderer.ctxUI.fillRect( 0, 0, w, h );

				if( progress > 1 ) {
					this.loopNext( loop );
					setTimeout( () => this.setScene( js13k.SCENE.INTRO, 1 ), 1 );

					return 1;
				}
			};
		}
		else if( scene == js13k.SCENE.INTRO ) {
			this.canInteract = false;
			this.doorsClose();

			runner.duration = 4;
			runner.do = progress => {
				js13k.Renderer.cameraLocked = true;

				const cam = {
					'z': 0,
					'rx': 0,
					'ry': 0,
				};

				if( progress > 1 ) {
					W.camera( cam );
					js13k.Renderer.cameraLocked = false;
					js13k.Renderer.camera.rx = 0;
					js13k.Renderer.camera.ry = 0;
					js13k.Renderer.mouseLastX = null;

					// Show pointer
					document.getElementById( 'p' ).hidden = false;

					W.delete( 'title' );

					setTimeout( () => this.setScene( js13k.SCENE.NORMAL ), 1 );

					return 1;
				}

				// Include a fade-in from black. Used as continuation
				// from NEXT_LOOP and REPEAT_LOOP.
				if( flag == 1 ) {
					js13k.Renderer.ctxUI.fillStyle = `rgba(0,0,0,${1 - progress})`;
					js13k.Renderer.ctxUI.fillRect(
						0, 0,
						js13k.Renderer.cnvUI.width, js13k.Renderer.cnvUI.height
					);
				}

				// End on a smoother stop in the animation
				cam.z = -0.5 * ( 1 - Math.sin( progress * Math.PI / 2 ) );
				W.camera( cam );
			};
		}
		else if( scene == js13k.SCENE.TITLE ) {
			// Hide pointer
			document.getElementById( 'p' ).hidden = true;

			document.body.classList.add( 'p' );
			this.canInteract = false;

			js13k.Renderer.cameraLocked = true;
			W.camera( { 'z': -0.5, 'rx': 0, 'ry': 0 } );

			const btn = document.getElementById( 'b' );
			btn.onclick = () => {
				btn.remove();

				document.body.classList.remove( 'p' );

				this.runners.push( {
					duration: 0.7,
					do: progress => {
						if( progress > 1 ) {
							setTimeout( () => this.setScene( js13k.SCENE.INTRO ), 1 );
						}

						return progress > 1;
					},
				} );
			};
		}
		else if( scene == js13k.SCENE.OUTRO ) {
			// Hide pointer
			document.getElementById( 'p' ).hidden = true;
			this.canInteract = false;
			js13k.Renderer.cameraLocked = true;

			W.camera( {
				'rx': 0,
				'ry': 0,
				'a': 1000,
				'onAnimDone': () => {
					runner.duration = 5;
					runner.do = progress => {
						// Wait a moment before actually doing anything
						if( progress < 0.2 ) {
							return;
						}

						progress -= 0.2;

						W.camera( { 'z': progress * -2 } );

						const alpha = Math.min( progress, 1 );
						const w = js13k.Renderer.cnvUI.width;
						const h = js13k.Renderer.cnvUI.height;

						js13k.Renderer.ctxUI.fillStyle = `rgba(238,238,238,${alpha})`;
						js13k.Renderer.ctxUI.fillRect( 0, 0, w, h );

						js13k.Renderer.ctxUI.font = '96px ' + js13k.FONT_SERIF;
						js13k.Renderer.ctxUI.textAlign = 'center';
						js13k.Renderer.ctxUI.textBaseline = 'middle';
						js13k.Renderer.ctxUI.fillStyle = `rgba(110,110,110,${alpha})`;
						js13k.Renderer.ctxUI.fillText( 'OUT', w / 2, h / 2 );
					};

					this.runners.push( runner );
				},
			} );
		}

		runner.do && this.runners.push( runner );
	}


	/**
	 *
	 * @param {string[]} lines
	 * @param {object}   pos
	 * @param {number}   pos.h
	 * @param {number}   pos.x
	 * @param {number}   pos.y
	 * @param {number}   pos.z
	 * @param {string}   color
	 * @param {number}   progress
	 */
	showDialog( lines, pos, color, progress ) {
		if( !W.next.dialog ) {
			[this.cnvDialog, this.ctxDialog] = js13k.Renderer.getOffscreenCanvas( 2, 2, 'dialog' );

			W.plane( {
				'n': 'dialog',
				'ns': 1,
				't': this.cnvDialog,
			} );
		}

		progress = Math.min( progress, 1 );

		let total = 0;
		let longest = 0;

		for( let i = 0; i < lines.length; i++ ) {
			const text = lines[i];
			total += text.length;
			longest = Math.max( longest, text.length );
		}

		this.cnvDialog.width = longest * 14;
		this.cnvDialog.height = lines.length * 30;

		this.ctxDialog.clearRect( 0, 0, this.cnvDialog.width, this.cnvDialog.height );
		this.ctxDialog.font = '600 24px ' + js13k.FONT_SANS;
		this.ctxDialog.textAlign = 'center';
		this.ctxDialog.textBaseline = 'top';
		this.ctxDialog.fillStyle = '#' + color;

		const textPos = Math.round( progress * total );

		let shown = 0;
		let linesDiff = lines.length;
		let lastChar = '';

		for( let i = 0; i < lines.length; i++ ) {
			const text = lines[i].substring( 0, textPos - shown );
			shown += text.length;
			linesDiff--;
			lastChar = text[text.length - 1];

			this.ctxDialog.fillText( text, this.cnvDialog.width / 2, i * 30 );

			if( shown >= textPos ) {
				break;
			}
		}

		W.gl.deleteTexture( W.textures.dialog );
		delete W.textures.dialog;

		const globalPos = js13k.getGlobalPos( pos );
		const relH = 30 / 400 * linesDiff;

		W.move( {
			'n': 'dialog',
			'x': globalPos.x,
			'y': globalPos.y + globalPos.h / 2 + 0.1 - relH,
			'z': globalPos.z,
			'w': this.cnvDialog.width / 400,
			'h': this.cnvDialog.height / 400,
			't': this.cnvDialog,
		} );

		if( ( this._lastDialogTextPos || 0 ) < textPos ) {
			this._lastDialogTextPos = textPos;

			if( lastChar != ' ' && lastChar != '.' ) {
				js13k.Audio.play( js13k.Audio.TALKING );
			}
		}
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		this.timer += dt;
		this.runRunners();

		// Light flickering
		if( !this.blockFlicker ) {
			if( this.isFlickerFloor() && Math.random() < 0.02 * dt ) {
				this.blockFlicker = true;

				W.light( {
					'i': 0.6,
					'a': 100,
					'onAnimDone': () => this.blockFlicker = false,
				} );
			}
			else if( W.next['light'].i != this.lightIntensity ) {
				W.light( { 'i': this.lightIntensity } );
			}
		}

		if( this.note ) {
			const text = js13k.Assets.texts[this.note];
			const color = ['s_note4', 's_note5a', 's_note5b', 's_note5c'].includes( this.note ) && '#185';
			js13k.Renderer.drawNote( text, color );

			if( js13k.Input.isPressed( js13k.Input.ACTION.INTERACT, true ) ) {
				this.note = null;
			}
		}
		else if( this.canInteract && this.elevator == js13k.STATE.IDLE ) {
			this._checkSelections();
		}
	}


	/**
	 *
	 * @param {number} counter
	 */
	updateLoopCounter( counter ) {
		W.move( {
			'n': 'loops',
			't': js13k.Assets.textures['counter' + counter],
			'mix': 0,
		} );
	}


};
