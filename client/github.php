<?php 
$result = array();
exec("cd /home/pi/AstroTrader/ && /usr/bin/git pull 2>&1", $result);
foreach($result as $line) {
	print($line . "\n");
}
echo "done";
