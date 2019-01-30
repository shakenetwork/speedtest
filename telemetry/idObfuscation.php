<?php
function getObfuscationSalt(){
	if(file_exists("idObfuscation_salt.php")){
		require "idObfuscation_salt.php";
	}else{
		$bytes=openssl_random_pseudo_bytes(4);
		$sf=fopen("idObfuscation_salt.php","w");
		fwrite($sf,chr(60)."?php\n");
		fwrite($sf,'$OBFUSCATION_SALT=0x'.bin2hex($bytes).";\n");
		fwrite($sf,"?".chr(62));
		fclose($sf);
		require "idObfuscation_salt.php";
	}
	return isset($OBFUSCATION_SALT)?$OBFUSCATION_SALT:0;
}
function obfdeobf($id){
	$salt=getObfuscationSalt()&0xFFFFFFFF;
	$id=$id&0xFFFFFFFF;
	for($i=0;$i<16;$i++){
		$id=$id^$salt;
		$id=(($id>>1)&0xFFFFFFFF)|(($id&0x00000001)<<31);
		$salt=(($salt<<1)&0xFFFFFFFF)|(($salt&0xA0000000)>>31);
	}
	return $id;
}
function obfuscateId($id){
	return base_convert(obfdeobf($id),10,36);
}
function deobfuscateId($id){
	return obfdeobf(base_convert($id,36,10));
}

//IMPORTANT: DO NOT ADD ANYTHING BELOW THE PHP CLOSING TAG, NOT EVEN EMPTY LINES!
?>