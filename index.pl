#!/usr/bin/perl
use Mojolicious::Lite;

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
    $self->stash(
        content => $self->param("id")
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
