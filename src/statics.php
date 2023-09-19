<?php
$route = $_REQUEST['route'] ?: null;

$continue = false;
if(empty($route)) {
    $continue = true;
}
$path = PUBLIC_DIR.DIRECTORY_SEPARATOR.$route;
$exist_in_public = file_exists($path) && !is_null($route);
if($exist_in_public && !str_contains($route,'.php')) {
    $mimes = new Mimey\MimeTypes;
    $exploded = explode('.',$route);
    $ext = $exploded[count($exploded)-1];
    $mime = $mimes->getMimeType($ext);
    header("Content-type: $mime");
    echo file_get_contents($path);
    die;
}