import { Vector3 } from 'three';

const _delta = new Vector3();
const _offset = new Vector3();

class ConstantSpline {

	constructor( p0 = new Vector3(), p1 = new Vector3(), p2 = new Vector3(), p3 = new Vector3() ) {

		this.p0 = p0;
		this.p1 = p1;
		this.p2 = p2;
		this.p3 = p3;

		// how finely the curve is sampled
		this.inc = .01;

		this.points = [];
		this.lPoints = [];

		// the length of the curve, and the length up to each sample
		this.d = 0;
		this.lengths = [];

		this.distancesNeedUpdate = false;

	}

	// samples the curve from the control points
	calculate() {

		const n = Math.max( 1, Math.round( 1 / this.inc ) );

		this.points = [];

		for ( let k = 0; k <= n; k ++ ) {

			const j = k / n;
			const i = 1 - j;

			this.points.push( new Vector3()
				.addScaledVector( this.p0, i * i * i )
				.addScaledVector( this.p1, 3 * j * i * i )
				.addScaledVector( this.p2, 3 * j * j * i )
				.addScaledVector( this.p3, j * j * j ) );

		}

		this.distancesNeedUpdate = true;

		return this;

	}

	calculateDistances() {

		this.d = 0;
		this.lengths = [ 0 ];

		for ( let j = 1; j < this.points.length; j ++ ) {

			this.d += this.points[ j ].distanceTo( this.points[ j - 1 ] );
			this.lengths.push( this.d );

		}

		this.distancesNeedUpdate = false;

		return this;

	}

	// fills lPoints: with steps, that many segments of the same length along the curve.
	// With distancePerStep, points that are that far from each other in a straight line, and a shorter last segment
	reticulate( settings = {} ) {

		const { steps, distancePerStep } = settings;

		if ( ! ( distancePerStep > 0 ) && ! ( steps >= 1 ) ) throw new TypeError( 'THREE.ConstantSpline: reticulate() needs steps or distancePerStep' );

		if ( this.points.length === 0 ) this.calculate();
		if ( this.distancesNeedUpdate ) this.calculateDistances();

		const points = this.points;
		const end = points[ points.length - 1 ];

		this.lPoints = [ points[ 0 ].clone() ];

		if ( distancePerStep > 0 ) {

			const current = points[ 0 ].clone();

			for ( let j = 1; j < points.length; j ++ ) {

				const from = points[ j - 1 ];
				_delta.subVectors( points[ j ], from );

				// where this piece of the curve leaves the sphere around the last point, as many times as it does
				let t = solve( from, _delta, current, distancePerStep, 0 );

				while ( t !== null ) {

					current.copy( from ).addScaledVector( _delta, t );
					this.lPoints.push( current.clone() );
					t = solve( from, _delta, current, distancePerStep, t );

				}

			}

			// a last step that landed on the end is the end
			if ( this.lPoints.length > 1 && current.distanceTo( end ) < distancePerStep * 1e-6 ) this.lPoints.pop();

		} else {

			const count = Math.floor( steps );
			let j = 1;

			for ( let k = 1; k < count; k ++ ) {

				const at = k * this.d / count;

				while ( j < points.length - 1 && this.lengths[ j ] < at ) j ++;

				const length = this.lengths[ j ] - this.lengths[ j - 1 ];

				this.lPoints.push( points[ j - 1 ].clone().lerp( points[ j ], length > 0 ? ( at - this.lengths[ j - 1 ] ) / length : 0 ) );

			}

		}

		this.lPoints.push( end.clone() );

		return this.lPoints;

	}

}

// the t in ( after, 1 ] where from + t * delta leaves the sphere of that radius around the centre
function solve( from, delta, centre, radius, after ) {

	_offset.subVectors( from, centre );

	const a = delta.lengthSq();
	const b = 2 * _offset.dot( delta );
	const c = _offset.lengthSq() - radius * radius;
	const discriminant = b * b - 4 * a * c;

	if ( a === 0 || discriminant < 0 ) return null;

	const t = ( - b + Math.sqrt( discriminant ) ) / ( 2 * a );

	return t > after + 1e-9 && t <= 1 ? t : null;

}

export { ConstantSpline };
