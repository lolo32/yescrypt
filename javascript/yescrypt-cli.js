#!/usr/bin/env node

// npm install sjcl
sjcl = require('sjcl');

// Include yescrypt.js without having to add node-js-stuff into that file.
var fs = require('fs');
eval(fs.readFileSync(__dirname + '/yescrypt.js')+'');

var argv;
if (process.argv[2] === "SIMD") {
    argv = process.argv.slice(3);
    eval(fs.readFileSync(__dirname + '/ecmascript_simd.js')+'');
    eval(fs.readFileSync(__dirname + '/yescrypt-simd.js')+'');
} else {
    argv = process.argv.slice(2);
}

if (argv.length < 1) {
    console.log('Not enough arguments.');
    process.exit(1);
}

// TODO: add the other argument length checking

switch (argv[0]) {
    case 'yescrypt':
        if (argv.length != 10) {
            console.log('Wrong number of arguments for yescrypt.');
            process.exit(1);
        }

        result = yescrypt.calculate(
            hexToUint8Array(argv[1]),   // password
            hexToUint8Array(argv[2]),   // salt
            parseInt(argv[3]),          // N
            parseInt(argv[4]),          // r
            parseInt(argv[5]),          // p
            parseInt(argv[6]),          // t
            parseInt(argv[7]),          // g
            parseInt(argv[8]),          // flags
            parseInt(argv[9])           // dkLen
        );

        process.stdout.write(
            toNodeBuffer(result)
        );
        break;
    case 'pwxform':

        var pwxblock = hexToUint8Array(argv[1]);
        var pwxblock32 = new Uint32Array(pwxblock.buffer);

        var sbox = hexToUint8Array(argv[2]);
        // TODO: deduplicate this, so that we're testing the code yescrypt.js
        // actually uses to create the object.
        var sbox32 = new Uint32Array(sbox.buffer);
        sbox_obj = {
            S: sbox32,
            S2: 0,
            S1: sbox32.length / 3,
            S0: (sbox32.length / 3) * 2,
            w: 0
        }

        yescrypt.pwxform(pwxblock32, sbox_obj);

        process.stdout.write(
            toNodeBuffer(pwxblock)
        );
        break;

    case 'salsa20_8':
        var cell = hexToUint8Array(argv[1]);
        var cell32 = new Uint32Array(cell.buffer);
        yescrypt.salsa20_8(cell32);
        process.stdout.write(
            toNodeBuffer(cell)
        );
        break;
    case 'benchmark':
        if (argv.length < 3) {
            console.log('Bad arguments to benchmark.');
            process.exit(1);
        }
        var iteration_count = parseInt(argv[1]);
        switch (argv[2]) {
            case 'yescrypt':
                benchmarkYescrypt(
                    iteration_count,
                    parseInt(argv[3]),          // N
                    parseInt(argv[4]),          // r
                    parseInt(argv[5]),          // p
                    parseInt(argv[6]),          // t
                    parseInt(argv[7]),          // g
                    parseInt(argv[8]),          // flags
                    parseInt(argv[9])           // dkLen
                );
                break;

            case 'pwxform':
                benchmarkPwxform(iteration_count);
                break;

            case 'salsa20_8':
                benchmarkSalsa20_8(iteration_count);
                break;
        }
        break;
    default:
        console.log('Bad function.');
        process.exit(1);
}

process.exit(0);

function benchmarkYescrypt(iteration_count, N, r, p, t, g, flags, dkLen) {
    var start = new Date;
    for (var i = 0; i < iteration_count; i++) {
        // XXX: at least the password should change in each iteration
        yescrypt.calculate("password", "salt", N, r, p, t, g, flags, dkLen);
    }
    var totalTime = (new Date) - start;
    if (totalTime < 1000) {
        console.log("Iteration count is too small to be accurate.");
    } else {
        console.log((iteration_count/totalTime*1000) + " c/s");
    }
}

function benchmarkPwxform(iteration_count) {
    var pwxblock = new Uint32Array(yescrypt.PWXWORDS);
    var sbox = new Uint32Array(yescrypt.SWORDS);

    // XXX: make these better
    for (var i = 0; i < yescrypt.PWXWORDS; i++) {
        pwxblock[i] = i;
    }
    for (var i = 0; i < yescrypt.SWORDS; i++) {
        sbox[i] = i;
    }

    sbox_obj = {
        S: sbox,
        S2: 0,
        S1: sbox.length / 3,
        S0: (sbox.length / 3) * 2,
        w: 0
    }

    var start = new Date;
    for (var i = 0; i < iteration_count; i++) {
        yescrypt.pwxform(pwxblock, sbox_obj);
    }
    var totalTime = (new Date) - start;
    if (totalTime < 1000) {
        console.log("Iteration count is too small to be accurate.");
    } else {
        console.log((iteration_count/totalTime*1000) + " c/s");
    }
}

function benchmarkSalsa20_8(iteration_count) {
    var cell = new Uint32Array(16);
    // XXX: make this better
    for (var i = 0; i < 16; i++) {
        cell[i] = i;
    }

    var start = new Date;
    for (var i = 0; i < iteration_count; i++) {
        yescrypt.salsa20_8(cell);
    }

    var totalTime = (new Date) - start;
    if (totalTime < 1000) {
        console.log("Iteration count is too small to be accurate.");
    } else {
        console.log((iteration_count/totalTime*1000) + " c/s");
    }
}

function hexToUint8Array(hex_string) {

    if (hex_string.length % 2 !== 0) {
        throw 'Bad hex string length.';
    }

    var bytes = new Uint8Array(hex_string.length / 2);
    for (var i = 0; i < hex_string.length; i += 2) {
        bytes[i/2] = parseInt(hex_string.substr(i, 2), 16);
    }

    return bytes;
}

function toNodeBuffer(uint8Array) {
    var buffer = new Buffer(uint8Array.byteLength);
    for (var i = 0; i < uint8Array.length; i++) {
        buffer[i] = uint8Array[i];
    }
    return buffer;
}
