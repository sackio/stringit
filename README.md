# stringit [![Build Status](https://secure.travis-ci.org/sackio/stringit.png?branch=master)](http://travis-ci.org/sackio/stringit)

Turn the contents of files into Javascript strings. Useful for getting the contents of view files into the browser as Javascript strings.

## Getting Started
Install the module with: `npm install stringit`

```bash
node stringit --input=./directory/with/views --output=./assets/js/views.js
```

`input` is a file or directory containing view files. `output` is the the path to a file to contain the stringified views.

## License
Copyright (c) 2014 Ben Sack
Licensed under the MIT license.
