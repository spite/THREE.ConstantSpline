THREE.ConstantSpline.js
=========================

This object creates a B-Spline using 4 points, and a number steps or a fixed step distance can be specified to create a set of points that cover the curve at constant rate.

![Image](https://raw.githubusercontent.com/spite/THREE.ConstantSpline/master/snapshot.png)

Demos are here: 
* [Lines](http://www.clicktorelease.com/tmp/threejs/constant-spline/)
* [Surfaces](http://www.clicktorelease.com/tmp/threejs/constant-spline/surface.html)


How to use
----------

Include the library:
<pre><code>&lt;script src="THREE.ConstantSpline.js" &gt;&lt;/script&gt;</code></pre>

Instantiate a THREE.ConstantSpline object:
<pre><code>var s = new THREE.ConstantSpline();</code></pre>

assign the 4 control points:

<pre><code>s.p0 = new THREE.Vector3( .5 - Math.random(), .5 - Math.random(), .5 - Math.random() );
s.p1 = new THREE.Vector3( .5 - Math.random(), .5 - Math.random(), .5 - Math.random() );
s.p2 = new THREE.Vector3( .5 - Math.random(), .5 - Math.random(), .5 - Math.random() );
s.p3 = new THREE.Vector3( .5 - Math.random(), .5 - Math.random(), .5 - Math.random() );</pre></code>

make the calculations of the standard b-spline:

<pre><code>s.calculate();</pre></code>

specify if you need a constant number of steps or a constant step size:

<pre><code>s.calculateDistances();
s.reticulate( { distancePerStep: .1 });</pre></code>

<pre><code>s.calculateDistances();
s.reticulate( { steps: 500 } );</pre></code>

<code>s.lPoints</code> contains the evenly separated points. Use them to create a line, a mesh or a camera path:

<pre><code>var geometry = new THREE.Geometry();
   
for( var j = 0; j &lt; s.lPoints.length - 1; j++ ) {

	var from = s.lPoints[ j ],
		to = s.lPoints[ j + 1 ];
	geometry.vertices.push( from.clone() );
    geometry.vertices.push( to.clone() );

}

material = new THREE.LineBasicMaterial( { 
	color: 0x404040 + Math.random() * 0xbfbfbf, 
	linewidth: 4
} );

var line = new THREE.Line( geometry, material );
scene.add( line );</code></pre>
    
License
-------

MIT licensed

Copyright (C) 2014 Jaume Sanchez Elias http://twitter.com/thespite

http://www.clicktorelease.com