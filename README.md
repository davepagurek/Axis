<h1>Axis</h1>
<img src="https://raw.githubusercontent.com/pahgawk/Axis/master/public/icons/logo-128.png">

Axis is a stick figure animator for keyframed animation. Axis is inspired by <a href="http://pivotanimator.net/" target="_blank">Pivot</a> but instead of forcing you to change every frame like a flipbook, Axis lets you simply add keyframes and the in-betweens are automatically interpolated.

View it online at <a href="http://axis.davepagurek.com/">http://axis.davepagurek.com/</a>

<h2>Demo</h2>
https://www.youtube.com/watch?v=pzOE4WDH-To

<h2>Screenshots</h2>
<img src="https://raw.githubusercontent.com/pahgawk/Axis/master/public/screenshots/highfive.gif" full="https://raw.githubusercontent.com/pahgawk/Axis/master/public/screenshots/highfive.gif" caption="High five!" />

<h2>Usage</h2>
Add blank frames to the timeline by pressing the <strong>Create Frame</strong> button or pressing <strong>N</strong>.

Create keyframes with the <strong>Create Keyframe</strong> button or by pressing <strong>Space</strong>.

On a selected keyframe, you can move around a stick figure by <strong>clicking on its name</strong> in the timeline and then <strong>clicking and dragging its joints.</strong>

Preview your animation by pressing the <strong>Animate</strong> button or pressing <strong>Enter</strong>.


<h2>Setup</h2>

Prerequisites:
<ul>
<li>Perl and CPAN</li>
<li>Node and NPM</li>
</ul>

Run the following commands:
```
bower install
cpanm Mojolicious::Lite
cpanm File::Slurp
cpanm DBI
cpanm DBD::SQLite
```

Create `animations.db` using the commands in `db-setup.sql`.

Additionally, <strong>install jsgif</strong> into `public/jsgif`.

<h2>Running the server</h2>
<h3>Locally</h3>
```
morbo index.pl
```

<h3>Remotely for production</h3>
```
ssh -n -f user@domain "sh -c 'cd /var/www/axis/html; nohup morbo -m production -l http://*:3000 index.pl > /dev/null 2>&1 &'"
```
