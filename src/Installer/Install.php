<?php

namespace Websix\XlsxCompiler\Installer;

use Composer\Script\Event;

class Install
{
    const PACKAGE_NAME = 'XlsxCompiler';

    public static function postInstallCommand(Event $event)
    {
        echo '[' . self::PACKAGE_NAME . '] After install command' . PHP_EOL;
        chdir(realpath(__DIR__ . '/../../node/'));
        exec('$(which npm) install');
    }

    public static function postUpdateCommand(Event $event)
    {
        echo '[' . self::PACKAGE_NAME . '] After update command' . PHP_EOL;
        chdir(realpath(__DIR__ . '/../../node/'));
        exec('$(which npm) update');
    }
}