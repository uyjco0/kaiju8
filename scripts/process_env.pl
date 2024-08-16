#!/usr/bin/env perl

use strict;
use warnings;

#############################################################################################################
## It replaces in the file 'backend/sql/init.sql' the tokens by their respective values in the '.env' file ##
#############################################################################################################


# The path (name included) of the files to process:
#   - The first is the '.env' file
#   - The second is the 'sql/init.sql' file
my $f_env = $ARGV[0];
my $f_init = $ARGV[1];

# Load the content of a file:
#   - Here it is efficient because the content is very small, and by doing that I'm saving some loops later
sub get_text {
	my $f_sub = shift;
	open (FH, $f_sub) || die;
	return join '', <FH>;
}

# Extract the matched pattern from a text and return it
sub extract_match {
	my $pattern = shift;
	my $text2match = shift;
	my $res = '';
	if ($text2match =~ /($pattern=.*\n)/) {
		chomp($res = $1);
		my @parts = split(/=/, $res);
		$res = $parts[1];
	}
	# Remove the double quotes
	($res) = $res =~ /"([^"]*)"/;
	return $res;
}

# Get the text from the 'env' file
my $text_env = get_text($f_env);

# Get the name of the database user
my $db_user = extract_match('DB_USER', $text_env);
# Get the password of the database user
my $db_pass = extract_match('DB_PASS', $text_env);
$db_pass = "\'" . $db_pass . "\'";
# Get the database's name
my $db_name = extract_match('POSTGRES_DB', $text_env);

# Get the text from the 'init.sql' file
my $text_init = get_text($f_init);

# Substitute the tokens in the 'init.sql' file for the sensitive values from the '.env' file
$text_init =~ s/__db_user__/$db_user/g;
$text_init =~ s/__db_pass__/$db_pass/g;
$text_init =~ s/__db_name__/$db_name/g;

# Replace the content of the 'init.sql' file by the replaced text
open (FH, ">$f_init") || die;
print FH $text_init;
close FH;
