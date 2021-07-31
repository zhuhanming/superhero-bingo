#!/usr/bin/env bash
sudo -u postgres psql -c "DROP DATABASE IF EXISTS superhero_bingo"
sudo -u postgres psql -c "DROP DATABASE IF EXISTS superhero_bingo_test"
sudo -u postgres psql -c "DROP ROLE IF EXISTS superhero_bingo"
sudo -u postgres psql -c "CREATE ROLE superhero_bingo WITH CREATEDB LOGIN PASSWORD 'superhero_bingo'"
sudo -u postgres psql -c "CREATE DATABASE superhero_bingo"
sudo -u postgres psql -c "CREATE DATABASE superhero_bingo_test"
