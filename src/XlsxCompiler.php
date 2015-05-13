<?php

namespace Websix\XlsxCompiler;

/**
 * Class for creating xls in nodejs
 */
class XlsxCompiler {

    /**
     * Subprocess resource object
     * @var resource
     */
    protected $process = null;

    /**
     * Array com as streams para o subprocesso
     */
    protected $subPipes = array();

    /**
     * Spawns the subprocess and waits for UNIX Domain socket to appear
     * @return resource subprocess resource
     */
    private function open()
    {
        // Subprocess streams
        $std = array(
            0 => array('pipe', 'r'),
            1 => array('pipe', 'w'),
            2 => array('pipe', 'w')
        );

        // Diretório de trabalho para o subprocesso
        $cwd = realpath(__DIR__ . '/../node');

        // Comando do subprocesso
        $cmd = sprintf('$(which node) %s/compiler.js', $cwd);

        // Path do socket para envio do JSON

        // Spawnando o subprocesso
        $this->process = proc_open($cmd, $std, $this->subPipes, $cwd);

        if(!is_resource($this->process)) {
            throw new RuntimeException('Não foi possível iniciar o processo');
        }

        return $this;
    }

    /**
     * Close the process
     */
    private function close()
    {
        if(is_resource($this->process)) {
           return proc_close($this->process);
        }
    }

    /**
     * Sends the JSON in format {"Name of the sheet": [{"A": "Value"}]} to the
     * subprocess throught the opened socket
     * @param  string $json JSON string in the upper format
     * @return string       if the file was created with success, returns it
     *                      path
     */
    public function compileJson($json) {
        if(empty($json))
            throw new InvalidArgumentException('$json não pode ser vazia');

        $this->open();

        // Escreve o json
        fwrite($this->subPipes[0], $json);
        fclose($this->subPipes[0]);

        $result = stream_get_contents($this->subPipes[1]);
        fclose($this->subPipes[1]);
        $error  = stream_get_contents($this->subPipes[2]);
        fclose($this->subPipes[2]);

        $res = $this->close();

        if($res != 0)
            throw new RuntimeException($error);

        return $result;
    }

}