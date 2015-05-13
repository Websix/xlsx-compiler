XlsxCompiler
============

[![Build Status](https://travis-ci.org/Websix/xlsx-compiler.svg?branch=1.1.1)](https://travis-ci.org/Websix/xlsx-compiler)

Takes a JSON in format:

``` JavaScript
{
    "Sheet name": [
        {"A": "A1 Value", "B": "B1 Value"}, // Row
        ...
    ],
    ...
    "Last sheet name": [
        {"A": "A1 Value", "B": "B1 Value"} // Row
    ],
    "maxCols": 2 // Max number of columns to be presented in the sheet
}
```

And transforms into a .xlsx file.

Usage
-----

Install the package:

```composer install --save websix/xlsx-compiler```


``` PHP
<?php

...
uses Websix\XlsxCompiler\XlsxCompiler;

...
$compiler = new XlsxCompiler();

// Generate $json in the shown format before

$xlsx = $compiler->compileJson($json);

// In $xlsx you have the fileblob tha you can save into a .xlsx file or echo in
// the output for browser download

```

API
---

Package namespace: Websix\XlsxCompiler;

Class name: XlsxCompiler