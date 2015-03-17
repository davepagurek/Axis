#!/usr/bin/perl
use Mojolicious::Lite;
use File::Slurp;
use DBI;

use strict;


sub db_connect {
    my %credentials = do "credentials.pl";
    my $driver   = "SQLite";
    my $database = "animations.db";
    my $dsn = "DBI:$driver:dbname=$database";
    my $dbh = DBI->connect($dsn, $credentials{username}, $credentials{password}, { RaiseError => 1 })
        or die $DBI::errstr;

    return $dbh;
}

my $dbh = db_connect();

get '/' => sub {
    my $self = shift;

    my $sth = $dbh->prepare('SELECT id FROM animations ORDER BY id DESC LIMIT 5') or die "Couldn't prepare statement: " . $dbh->errstr;
    $sth->execute() or die "Couldn't execute statement: " . $sth->errstr;
    #my @rows = $sth->fetchrow_array();
    #use Data::Dumper;
    #print Dumper @rows;

    my @files = ();

    while (my $row = $sth->fetchrow_array()) {
        push(@files, $row);
    }

    #my @files =
        #sort { -M $a <=> -M $b }
        #grep { -f }
        #glob("public/gifs/*.gif");

    #@files = map {
        #/public\/gifs\/(.+).gif/;
        #$1;
    #} @files;

    #@files = @files[0 .. 4] unless (scalar @files <= 4);

    $self->stash(
        recent => \@files
    );
    $self->render(template => 'index');
};

get '/archives/:page' => [page => qr/\d+/] => sub {
    my $self = shift;
    my $page = $self->param("page");

    my $sth = $dbh->prepare('SELECT id FROM animations ORDER BY id DESC OFFSET ? LIMIT 5') or die "Couldn't prepare statement: " . $dbh->errstr;
    $sth->execute(($page-1)*5) or die "Couldn't execute statement: " . $sth->errstr;
    #my @rows = $sth->fetchrow_array();
    #use Data::Dumper;
    #print Dumper @rows;

    my @files = ();

    while (my $row = $sth->fetchrow_array()) {
        push(@files, $row);
    }

    #my @files =
        #sort { -M $a <=> -M $b }
        #grep { -f }
        #glob("public/gifs/*.gif");

    #@files = map {
        #/public\/gifs\/(.+).gif/;
        #$1;
    #} @files;

    #my $length = scalar @files;
    #$page--;
    #if (scalar @files < $page*5) {
        #$page = 0;
        #@files = @files[0 .. 4] unless (scalar @files <= 4);
    #} elsif ($page*5+4 < scalar @files) {
        #@files = @files[$page*5 .. $page*5+4];
    #} else {
        #@files = @files[$page*5 .. scalar @files - 1];
    #}

    $self->stash(
        recent => \@files,
        page => $page,
        length => $length
    );
    $self->render(template => 'archives');
};

get '/about' => sub {
    my $self = shift;
    $self->render(template => 'about');
};

get '/editor/:id' => [id => qr/[\w\d]+/] => sub {
    my $self = shift;
    my $source = "animations/" . $self->param("id") . ".json";

    my $content = "";

    #If the file exists, load it.
    $content = read_file($source) if (-e $source);


    $self->stash(
        content => $content
    );
    $self->render(template => 'editor');
};

get '/editor' => sub {
    my $self = shift;
    $self->stash(
        content => ""
    );
    $self->render(template => 'editor');
};

get '/view/:id' => [id => qr/\d+/] => sub {
    my $self = shift;
    my $name = $self->param("id");

    if (-e "public/gifs/$name.gif") {
        $self->stash(
            name => $name
        );
        $self->render(template => 'view');
    } else {
        $self->render(template => 'error', status => 404);
    }
};

post '/save' => sub {
    my $self = shift;

    #Generate random name for file
    #my @chars = ("A".."Z", "a".."z");
    #my $name = "";
    #$name .= $chars[rand @chars] for 1..20;

    my $sth = $dbh->prepare('INSERT INTO animations (views, user) VALUES (0, 0)');
    $sth->execute() or die "Couldn't execute statement: " . $sth->errstr;
    my $name = $dbh->sqlite_last_insert_rowid();



    my $json = $self->param("json");
    open my $fh, '>', "animations/$name.json" or die $!;
    print $fh $json;
    close $fh;



    my $data = $self->param("data");
    $data = MIME::Base64::decode_base64($data);

    open $fh, '>', "public/gifs/$name.gif" or die $!;
    binmode $fh;
    print $fh $data;
    close $fh;

    #my $index = read_file("animations/index.dat");
    #$index = $name . "\n" . $index;
    #my @files = split(/[\r\n ]+/, $index);
    #@files = @files[0 .. 4] unless (scalar @files <= 4);
    #open $fh, '>', "animations/index.dat" or die $!;
    #print $fh join("\n", @files);

    $self->redirect_to("/view/$name");
};

app->start;
