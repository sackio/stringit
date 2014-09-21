/*
 * stringit
 * https://github.com/sackio/stringit
 *
 * Copyright (c) 2014 Ben Sack
 * Licensed under the MIT license.
 */

var FSTK = require('fstk')
  , FS = require('fs')
  , Async = require('async')
  , _ = require('underscore')
  , Belt = require('jsbelt')
  , Path = require('path')
  , Optionall = require('optionall')
;

module.exports = function(path, dest_path, options, callback){
  var a = Belt.argulint(arguments);
  a.o = _.defaults(a.o, {
    'file_name': 'views.js'
  , 'variable': 'var VIEWS'
  });
  a.o.dest_path = Path.join(dest_path, '/', a.o.file_name);
  if (_.isString(a.o.regext)) a.o.regex = new RegExp(a.o.regex);

  var globals = {};
  return Async.waterfall([
    function(cb){
      return FSTK.stat(path, Belt.cs(cb, globals, 'stat', 1, 0));
    }
  , function(cb){
      if (!globals.stat.isDirectory){
        globals.paths = [globals.stat.realpath];
        return cb();
      }

      return FSTK.statDir(globals.stat.realpath, Belt.cs(cb, globals, 'paths', 1, 0));
    }
  , function(cb){
      if (globals.stats.isDirectory) globals.paths = _.chain(globals.path)
                                                      .filter(function(f){ return f.isFile; })
                                                      .pluck('realpath')
                                                      .value();

      if (a.o.regex) globals.path = _.filter(globals.path, function(f){ return f.match(a.o.regex); });

      return cb();
    }
  , function(cb){
      globals.files = {};
      return Async.eachSeries(globals.paths, function(p, _cb){
        var locals = {};
        return Async.waterfall([
          function(__cb){
            return FS.readFile(p, Belt.cs(__cb, locals, 'body', 1, 0));
          }
        , function(__cb){
            locals.body = locals.body.toString();
            globals.files[FSTK.filename] = locals.body;
            return __cb();
          }
        ], Belt.cw(_cb, 0));
      }, Belt.cw(cb, 0));
    }
  , function(cb){
      return FSTK.writeFile(a.o.dest_path, a.o.variable + ' = ' + JSON.stringify(globals.files, null, 2) + ';'
                           , Belt.cw(cb, 0));
    }
  ], function(err){
    if (err) console.error(err);
    return a.cb(err);
  });

};

if (require.main === module){
  var m = new module.exports()
    , O = new Optionall();

  Async.waterfall([
    function(cb){
      if (!O.input) return cb();

      return module.exports(O.input, O.output, O, Belt.cw(cb, 0));
    }
  ], function(err){
    if (err) console.error(err);
    return process.exit(err ? 1 : 0);
  });
}
