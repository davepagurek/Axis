# Axis
A stick figure animator for keyframed animation

## Setup

Prerequisites:
- Perl and CPAN
- Node and NPM

Run the following commands:

```
bower install
cpanm Mojolicious::Lite
cpanm File::Slurp
```

## Running the server

### Locally
```
morbo index.pl
```

### Remotely for production
```
ssh -n -f user@domain "sh -c 'cd /var/www/axis/html; nohup morbo -m production -l http://*:3000 index.pl > /dev/null 2>&1 &'"
```
