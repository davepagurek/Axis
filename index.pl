#!/usr/bin/perl
use Mojolicious::Lite;
use File::Slurp;

use strict;


get '/' => sub {
    my $self = shift;
    $self->stash(
        recent => ["test", "test2", "test3"]
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

app->start;
