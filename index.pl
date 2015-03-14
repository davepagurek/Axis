#!/usr/bin/perl
use Mojolicious::Lite;
use File::Slurp;

use strict;


get '/' => sub {
    my $self = shift;

    my @files =
        sort { -M $a <=> -M $b }
        grep { -f }
        glob("public/gifs/*.gif");

    @files = map {
        /public\/gifs\/(.+).gif/;
        $1;
    } @files;

    @files = @files[0 .. 4] unless (scalar @files <= 4);

    $self->stash(
        recent => \@files
    );
    $self->render(template => 'index');
};

get '/editor/:id' => [id => qr/\w+/] => sub {
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

get '/view/:id' => [id => qr/\w+/] => sub {
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
    my @chars = ("A".."Z", "a".."z");
    my $name = "";
    $name .= $chars[rand @chars] for 1..20;



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

    $self->redirect_to("/view/$name");
};

app->start;
