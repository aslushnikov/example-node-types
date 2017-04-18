var path = require('path');
var fs = require('fs');

var sourceFiles = [
    'Sprite.js',
    'SpriteSheet.js',
];

var externsRoot = path.join(__dirname, 'node_modules', 'google-closure-compiler-js', 'contrib', 'nodejs');
var nodeExterns = fs.readdirSync(externsRoot);

var jsCode = sourceFiles.map(filePath => ({
    src: fs.readFileSync(path.join(__dirname, filePath), 'utf8'),
    path: filePath
}));

var externs = nodeExterns.map(filePath => ({
    src: fs.readFileSync(path.join(externsRoot, filePath), 'utf8'),
    path: filePath
}));

var compile = require('google-closure-compiler-js').compile;
var flags = {
    jsCode: jsCode,
    externs: externs,
    env: 'custom',
    languageIn: 'ECMASCRIPT6_STRICT',
    languageOut: 'ECMASCRIPT5',
    warningLevel: 'VERBOSE',
    processCommonJsModules: true,
    checksOnly: true
};
var out = compile(flags);
for (var msg of out.warnings)
    console.log('WARN  ' + msg.file + ':' + msg.lineNo + ':' + msg.charNo + ': ' + msg.description);
for (var msg of out.errors)
    console.log('ERROR ' + msg.file + ':' + msg.lineNo + ':' + msg.charNo + ': ' + msg.description);
if (!out.warnings.length && !out.errors.length)
    console.log('Ok.');
