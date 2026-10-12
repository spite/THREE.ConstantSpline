THREE.ConstantSpline.js
=========================

Evenly spaced points along a cubic Bézier curve, for [three.js](https://threejs.org). Give it 4 control points and either a number of steps or a fixed step distance, and it returns a set of points that cover the curve at a constant rate.

![Image](https://raw.githubusercontent.com/spite/THREE.ConstantSpline/master/snapshot.png)

Demos are here:
* [Lines](https://spite.github.io/THREE.ConstantSpline/demos/lines.html)
* [Surfaces](https://spite.github.io/THREE.ConstantSpline/demos/surface.html)

> **Before you use this:** three.js can already do it. [`CubicBezierCurve3`](https://threejs.org/docs/pages/CubicBezierCurve3.html) has been part of three.js since r45 (2011), and [`getSpacedPoints()`](https://threejs.org/docs/pages/Curve.html#getSpacedPoints) gives evenly spaced points on it, or on any other curve:
>
> ```js
> const curve = new THREE.CubicBezierCurve3( p0, p1, p2, p3 );
> const points = curve.getSpacedPoints( 500 );
> ```
>
> Use that for anything new. This library is from 2014 and was written against three.js r58: it expects a global `THREE`, which current three.js no longer provides. The one thing it does that the built-in doesn't is `distancePerStep`, which places points an exact straight-line distance apart.

How to use
----------

Include the library after three.js:

```html
<script src="three.js"></script>
<script src="THREE.ConstantSpline.js"></script>
```

Create a `THREE.ConstantSpline` and assign its 4 control points:

```js
var s = new THREE.ConstantSpline();

s.p0 = new THREE.Vector3( .5 - Math.random(), .5 - Math.random(), .5 - Math.random() );
s.p1 = new THREE.Vector3( .5 - Math.random(), .5 - Math.random(), .5 - Math.random() );
s.p2 = new THREE.Vector3( .5 - Math.random(), .5 - Math.random(), .5 - Math.random() );
s.p3 = new THREE.Vector3( .5 - Math.random(), .5 - Math.random(), .5 - Math.random() );
```

Sample the curve. Do this again whenever the control points change:

```js
s.calculate();
```

Then ask for the evenly spaced points, either by count or by distance:

```js
// 501 points, evenly spaced along the curve
s.reticulate( { steps: 500 } );

// or points exactly .1 apart, with a shorter last segment to reach the end
s.reticulate( { distancePerStep: .1 } );
```

`s.lPoints` contains the evenly separated points. Use them to create a line, a mesh or a camera path:

```js
var geometry = new THREE.Geometry();
geometry.vertices = s.lPoints;

var material = new THREE.LineBasicMaterial( { color: 0xffffff } );

var line = new THREE.Line( geometry, material );
scene.add( line );
```

Reference
---------

* `p0`, `p1`, `p2`, `p3`: the control points, as `THREE.Vector3`. The curve starts at `p0` and ends at `p3`.
* `inc`: how finely `calculate()` samples the curve. Defaults to `.01`, which splits the curve into 100 pieces; use a smaller value for long or tightly bent curves.
* `calculate()`: samples the curve from the control points.
* `reticulate( settings )`: fills `lPoints`. Pass `steps` for a fixed number of segments, or `distancePerStep` for a fixed distance between points.
* `lPoints`: the resulting points, as an array of `THREE.Vector3`.
* `d`: the length of the curve, available after `reticulate()`.

License
-------

MIT licensed

Copyright (C) 2014 Jaume Sanchez Elias http://twitter.com/thespite

http://www.clicktorelease.com