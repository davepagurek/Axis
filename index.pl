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

    # Get the 5 most recent animations
    my $sth = $dbh->prepare('SELECT id FROM animations ORDER BY id DESC LIMIT 5') or die "Couldn't prepare statement: " . $dbh->errstr;
    $sth->execute() or die "Couldn't execute statement: " . $sth->errstr;

    # Put their ids into an array
    my @files = ();
    while (my $row = $sth->fetchrow_array()) {
        push(@files, $row);
    }


    $self->stash(
        recent => \@files
    );
    $self->render(template => 'index');
};

get '/archives/:page' => [page => qr/\d+/] => sub {
    my $self = shift;
    my $page = $self->param("page");

    # Get the total number of rows
    my $sth = $dbh->prepare('SELECT COUNT(id) FROM animations') or die "Couldn't prepare statement: " . $dbh->errstr;
    $sth->execute() or die "Couldn't execute statement: " . $sth->errstr;
    my $length = $sth->fetchrow_array();

    # Show up to five posts on the page if there are posts to view
    if (($page-1)*5 < $length) {

        # Get five posts offset by the given page
        $sth = $dbh->prepare('SELECT id FROM animations ORDER BY id DESC LIMIT 5 OFFSET ?') or die "Couldn't prepare statement: " . $dbh->errstr;
        $sth->execute(($page-1)*5) or die "Couldn't execute statement: " . $sth->errstr;

        # Put the ids into an array
        my @files = ();
        while (my $row = $sth->fetchrow_array()) {
            push(@files, $row);
        }


        $self->stash(
            recent => \@files,
            page => $page,
            length => $length
        );
        $self->render(template => 'archives');

    # Otherwise, show an error
    } else {
        $self->render(template => 'error', status => 404);
    }
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

    # If it's a valid file, load it
    if (-e "public/gifs/$name.gif") {

        # Get the number of views the animation has
        my $sth = $dbh->prepare('SELECT views FROM animations WHERE id = ?') or die "Couldn't prepare statement: " . $dbh->errstr;
        $sth->execute($name) or die "Couldn't execute statement: " . $sth->errstr;
        my $views = $sth->fetchrow_array();

        # Add a view
        $views++;
        $sth = $dbh->prepare('UPDATE animations SET views = views + 1 WHERE id = ?') or die "Couldn't prepare statement: " . $dbh->errstr;
        $sth->execute($name) or die "Couldn't execute statement: " . $sth->errstr;

        $self->stash(
            name => $name,
            views => $views
        );
        $self->render(template => 'view');

    # Otherwise, show a 404 page
    } else {
        $self->render(template => 'error', status => 404);
    }
};

post '/save' => sub {
    my $self = shift;

    # Add a new entry to the db
    my $sth = $dbh->prepare('INSERT INTO animations (views, user) VALUES (0, 0)');
    $sth->execute() or die "Couldn't execute statement: " . $sth->errstr;

    # Get the id we just added
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
