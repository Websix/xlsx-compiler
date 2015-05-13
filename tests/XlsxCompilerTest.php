<?php

namespace Websix\XlsxCompiler;


class XlsxCompilerTest extends \PHPUnit_Framework_TestCase
{
    const EXPECTED_SHA1 = '5e8aedff96c9bc60d5a901fa8fdffd7b09ba9187';

    private $payload;

    private $klass;

    public function setUp()
    {
        $this->payload = [
            'First Sheet' => [
                ['A' => 'First val', 'B' => 'SecVal'],
                ['B' => 'ThirdVal', 'C' => 'FourthVal'],
                ['C' => 'FifthVal', 'D' => 'SixthVal']
            ],
            'Second Sheet' => [
                ['A' => 'First val', 'B' => 'SecVal'],
                ['B' => 'ThirdVal', 'C' => 'FourthVal'],
                ['C' => 'FifthVal', 'D' => 'SixthVal']
            ],
            'maxCols' => 4
        ];

        $this->klass = new XlsxCompiler();
    }

    public function tearDown()
    {
        unset($this->payload, $this->klass);
    }

    public function testCompileJson()
    {
        $this->klass->compileJson(json_encode($this->payload));
        /**
         * @todo Implement more tests disecting the result xlsx
         */
    }
}