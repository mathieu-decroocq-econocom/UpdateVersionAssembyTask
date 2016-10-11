// include plug-ins
var gulp = require('gulp');
var gutil = require('gulp-util');
var assemblyInfo = require('gulp-dotnet-assembly-info');
var fs = require('fs'); //file system not in package.json

//methods
var updateAssembly = function (revision, build, secondaire, primaire) {

    primaire = primaire ? primaire : '1';
}

var getPackageJson = function (path, cb) {
    path = path ? path : "./appVersion.json";
    cb = cb ? cb : function (el) { return el; };
    return cb(fs.readFileSync(path, 'utf8'));
};

function bumpVersion(version) {
    version = version ? version : "1.0.0.0";
    var versionArray = version.split('.');
    return function (param) {
        var addToVersion = function (number) { return parseInt(number) + 1; }
        var parent = this;

        this.getVersion = function () {
            return versionArray.join('.');
        }

        this.major = function () {
            versionArray[0] = addToVersion(versionArray[0]);
            return this.getVersion();
        },
        this.minor = function () {
            versionArray[1] = addToVersion(versionArray[1]);
            return this.getVersion();
        },
        this.patch = function () {
            versionArray[2] = addToVersion(versionArray[2]);
            return this.getVersion();
        },
        this.build = function () {
            versionArray[3] = addToVersion(versionArray[3]);
            return this.getVersion();
        }

        return this;

    };
}

function string_src(filename, string) {
    var src = require('stream').Readable({ objectMode: true });
    src._read = function () {
        this.push(new gutil.File({
            cwd: "",
            base: "",
            path: filename,
            contents: new Buffer(string)
        }));
        this.push(null);
    }
    return src;
}

//tasks
gulp.task('UpdateAssembly',
    [],
    function () {
        var pkg = getPackageJson('./appVersion.json');
        pkg = JSON.parse(pkg.replace(/\s+/g, " "));
        return gulp.src('../**/AssemblyInfo.cs', { base: './' })
            .pipe(assemblyInfo({
                version: function (value) {
                    return pkg.version;
                },
                fileVersion: function (value) {
                    return pkg.version;
                }
            }))
            .pipe(gulp.dest('.'));
    });


gulp.task('BumpAssemblyVersion:major',
    function () {
        var pkg = getPackageJson('./appVersion.json');
        pkg = JSON.parse(pkg.replace(/\s+/g, " "));
        var bv = bumpVersion(pkg['version']);
        pkg['version'] = bv().major();
        return string_src('appVersion.json', JSON.stringify(pkg))
            .pipe(gulp.dest('.'));
    });


gulp.task('BumpAssemblyVersion:minor',
    function () {
        var pkg = getPackageJson('./appVersion.json');
        pkg = JSON.parse(pkg.replace(/\s+/g, " "));
        var bv = bumpVersion(pkg['version']);
        pkg['version'] = bv().minor();
        return string_src('appVersion.json', JSON.stringify(pkg))
            .pipe(gulp.dest('.'));
    });

gulp.task('BumpAssemblyVersion:patch',
    function () {
        var pkg = getPackageJson('./appVersion.json');
        pkg = JSON.parse(pkg.replace(/\s+/g, " "));
        var bv = bumpVersion(pkg['version']);
        pkg['version'] = bv().patch();
        return string_src('appVersion.json', JSON.stringify(pkg))
            .pipe(gulp.dest('.'));
    });
gulp.task('BumpAssemblyVersion:build',
    function () {
        var pkg = getPackageJson('./appVersion.json');
        pkg = JSON.parse(pkg.replace(/\s+/g, " "));
        var bv = bumpVersion(pkg['version']);
        pkg['version'] = bv().build();
        return string_src('appVersion.json', JSON.stringify(pkg))
            .pipe(gulp.dest('.'));
    });