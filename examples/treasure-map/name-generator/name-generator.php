<?php
$COMMUNES = file('communes-fr-low.txt');
$SLANG = file_get_contents('slang-fr.txt');

/**
 * Renvoie une liste de lettre avec leur probabilité de pouvoir se mettre à la suite
 * des lettres spécifiés
 */
function getProbOf($s) {
	global $COMMUNES;
	$probs = array();
	$n = 0;
	foreach ($COMMUNES as $d) {
		if (preg_match("/$s([a-z])/", $d, $r)) {
			$probs[] = $r[1];
		}
	}
	return $probs;
}

function getProbOfFinal($s) {
	global $COMMUNES;
	$probs = array();
	$n = 0;
	foreach ($COMMUNES as $d) {
		if (preg_match("/$s([a-z])$/", $d, $r)) {
			$probs[] = $r[1];
		}
	}
	return $probs;
}

function chooseInitial($n) {
	global $COMMUNES;
	$g = array();
	foreach ($COMMUNES as $c) {
		$s = substr($c, 0, $n);
		if (strlen($s) === $n) {
			$g[$s] = true;
		}
	}
	$x = pick(array_keys($g));
	if (strlen($x) < $n) {
		throw new Exception('error : chose only one initial letter, need ' . "$n");
	}
}


function pick($a) {
	if (count($a)) {
		return $a[mt_rand(0, count($a) - 1)];
	} else {
		return '';
	}
}


function generate($start, $length, $nchunk) {
	global $PREPA, $PREPAFINAL;
	$s = $start;
	$s2 = $start;
	$watchdog = 10;
	while (strlen($s) < ($length - 1)) {
		$p = getProbOf($s2);
		$l = pick($p);
		if ($l === '') {
			return '';
		}
		$s .= $l;
		$s2 = substr($s, -$nchunk);
	}
	$p = getProbOfFinal($s2);
	$l = pick($p);
	$s .= $l;
	if (forbiddenName($s)) {
		return '';
	} else {
		return $s;
	}
}

function forbiddenName($s) {
	global $COMMUNES, $SLANG;
	if (substr($s, 0, 5) === 'saint') {
		return true;
	}
	if (substr($s, 0, 1) === substr($s, 1, 1)) {
		return true;
	}
	if (count(array_filter($COMMUNES, function($x) use ($s) {
		return substr($s, 0, 2) === substr($x, 0, 2);
	})) === 0) {
		return true;
	}
	if (in_array($s, $COMMUNES)) {
		return true;
	}
	if (strpos($SLANG, $s) !== false) {
		return true;
	}
	return false;
}


for ($i = 0; $i < 200; ++$i) {
	$x = generate(chooseInitial(3), mt_rand(5, 10), 3);
	if ($x) {
		print "$x\n";
	}
}
