<?php
function logger(...$msg): void{
    $log_path = LOG_DIR.DIRECTORY_SEPARATOR.'log.log';
    foreach($msg as $value) {
        if(is_array($value))
            $value = json_encode($value);
        if(!is_writable($log_path)){
            dd("no se puede escribir en el fichero log");//tovla
        }
        file_put_contents($log_path, $value, FILE_APPEND);
    }
}