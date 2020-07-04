
/*
Code generated with Faust version 2.22.5
Compilation options: -lang wasm-ib -scal -ftz 2
*/

function getJSONwind() {
	return '{"name": "wind","filename": "wind.dsp","version": "2.22.5","compile_options": "-lang wasm-ib -scal -ftz 2","library_list": ["/usr/local/share/faust/stdfaust.lib","/usr/local/share/faust/signals.lib","/usr/local/share/faust/noises.lib","/usr/local/share/faust/basics.lib","/usr/local/share/faust/vaeffects.lib","/usr/local/share/faust/maths.lib","/usr/local/share/faust/filters.lib","/usr/local/share/faust/platform.lib"],"include_pathnames": ["/usr/local/share/faust","/usr/local/share/faust","/usr/share/faust",".","/media/XDATA/Moldeo2020/moldeojs/src/assets/data/effects/faust"],"size": 92,"inputs": 0,"outputs": 2,"meta": [ { "basics.lib/name": "Faust Basic Element Library" },{ "basics.lib/version": "0.1" },{ "filename": "wind.dsp" },{ "filters.lib/allpassnnlt:author": "Julius O. Smith III" },{ "filters.lib/allpassnnlt:copyright": "Copyright (C) 2003-2019 by Julius O. Smith III <jos@ccrma.stanford.edu>" },{ "filters.lib/allpassnnlt:license": "MIT-style STK-4.3 license" },{ "filters.lib/lowpass0_highpass1": "Copyright (C) 2003-2019 by Julius O. Smith III <jos@ccrma.stanford.edu>" },{ "filters.lib/name": "Faust Filters Library" },{ "filters.lib/tf2np:author": "Julius O. Smith III" },{ "filters.lib/tf2np:copyright": "Copyright (C) 2003-2019 by Julius O. Smith III <jos@ccrma.stanford.edu>" },{ "filters.lib/tf2np:license": "MIT-style STK-4.3 license" },{ "maths.lib/author": "GRAME" },{ "maths.lib/copyright": "GRAME" },{ "maths.lib/license": "LGPL with exception" },{ "maths.lib/name": "Faust Math Library" },{ "maths.lib/version": "2.2" },{ "name": "wind" },{ "noises.lib/name": "Faust Noise Generator Library" },{ "noises.lib/version": "0.0" },{ "platform.lib/name": "Generic Platform Library" },{ "platform.lib/version": "0.1" },{ "signals.lib/name": "Faust Signal Routing Library" },{ "signals.lib/version": "0.0" },{ "vaeffects.lib/moog_vcf_2bn:author": "Julius O. Smith III" },{ "vaeffects.lib/moog_vcf_2bn:copyright": "Copyright (C) 2003-2019 by Julius O. Smith III <jos@ccrma.stanford.edu>" },{ "vaeffects.lib/moog_vcf_2bn:license": "MIT-style STK-4.3 license" },{ "vaeffects.lib/name": "Faust Virtual Analog Filter Effect Library" },{ "vaeffects.lib/version": "0.0" }],"ui": [ {"type": "vgroup","label": "wind","items": [ {"type": "hslider","label": "force","address": "/wind/force","index": 0,"init": 0.66,"min": 0,"max": 1,"step": 0.01}]}]}';
}
function getBase64Codewind() { return "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c3QiLCIvdXNyL2xvY2FsL3NoYXJlL2ZhdXN0IiwiL3Vzci9zaGFyZS9mYXVzdCIsIi4iLCIvbWVkaWEvWERBVEEvTW9sZGVvMjAyMC9tb2xkZW9qcy9zcmMvYXNzZXRzL2RhdGEvZWZmZWN0cy9mYXVzdCJdLCJzaXplIjogOTIsImlucHV0cyI6IDAsIm91dHB1dHMiOiAyLCJtZXRhIjogWyB7ICJiYXNpY3MubGliL25hbWUiOiAiRmF1c3QgQmFzaWMgRWxlbWVudCBMaWJyYXJ5IiB9LHsgImJhc2ljcy5saWIvdmVyc2lvbiI6ICIwLjEiIH0seyAiZmlsZW5hbWUiOiAid2luZC5kc3AiIH0seyAiZmlsdGVycy5saWIvYWxscGFzc25ubHQ6YXV0aG9yIjogIkp1bGl1cyBPLiBTbWl0aCBJSUkiIH0seyAiZmlsdGVycy5saWIvYWxscGFzc25ubHQ6Y29weXJpZ2h0IjogIkNvcHlyaWdodCAoQykgMjAwMy0yMDE5IGJ5IEp1bGl1cyBPLiBTbWl0aCBJSUkgPGpvc0BjY3JtYS5zdGFuZm9yZC5lZHU+IiB9LHsgImZpbHRlcnMubGliL2FsbHBhc3Nubmx0OmxpY2Vuc2UiOiAiTUlULXN0eWxlIFNUSy00LjMgbGljZW5zZSIgfSx7ICJmaWx0ZXJzLmxpYi9sb3dwYXNzMF9oaWdocGFzczEiOiAiQ29weXJpZ2h0IChDKSAyMDAzLTIwMTkgYnkgSnVsaXVzIE8uIFNtaXRoIElJSSA8am9zQGNjcm1hLnN0YW5mb3JkLmVkdT4iIH0seyAiZmlsdGVycy5saWIvbmFtZSI6ICJGYXVzdCBGaWx0ZXJzIExpYnJhcnkiIH0seyAiZmlsdGVycy5saWIvdGYybnA6YXV0aG9yIjogIkp1bGl1cyBPLiBTbWl0aCBJSUkiIH0seyAiZmlsdGVycy5saWIvdGYybnA6Y29weXJpZ2h0IjogIkNvcHlyaWdodCAoQykgMjAwMy0yMDE5IGJ5IEp1bGl1cyBPLiBTbWl0aCBJSUkgPGpvc0BjY3JtYS5zdGFuZm9yZC5lZHU+IiB9LHsgImZpbHRlcnMubGliL3RmMm5wOmxpY2Vuc2UiOiAiTUlULXN0eWxlIFNUSy00LjMgbGljZW5zZSIgfSx7ICJtYXRocy5saWIvYXV0aG9yIjogIkdSQU1FIiB9LHsgIm1hdGhzLmxpYi9jb3B5cmlnaHQiOiAiR1JBTUUiIH0seyAibWF0aHMubGliL2xpY2Vuc2UiOiAiTEdQTCB3aXRoIGV4Y2VwdGlvbiIgfSx7ICJtYXRocy5saWIvbmFtZSI6ICJGYXVzdCBNYXRoIExpYnJhcnkiIH0seyAibWF0aHMubGliL3ZlcnNpb24iOiAiMi4yIiB9LHsgIm5hbWUiOiAid2luZCIgfSx7ICJub2lzZXMubGliL25hbWUiOiAiRmF1c3QgTm9pc2UgR2VuZXJhdG9yIExpYnJhcnkiIH0seyAibm9pc2VzLmxpYi92ZXJzaW9uIjogIjAuMCIgfSx7ICJwbGF0Zm9ybS5saWIvbmFtZSI6ICJHZW5lcmljIFBsYXRmb3JtIExpYnJhcnkiIH0seyAicGxhdGZvcm0ubGliL3ZlcnNpb24iOiAiMC4xIiB9LHsgInNpZ25hbHMubGliL25hbWUiOiAiRmF1c3QgU2lnbmFsIFJvdXRpbmcgTGlicmFyeSIgfSx7ICJzaWduYWxzLmxpYi92ZXJzaW9uIjogIjAuMCIgfSx7ICJ2YWVmZmVjdHMubGliL21vb2dfdmNmXzJibjphdXRob3IiOiAiSnVsaXVzIE8uIFNtaXRoIElJSSIgfSx7ICJ2YWVmZmVjdHMubGliL21vb2dfdmNmXzJibjpjb3B5cmlnaHQiOiAiQ29weXJpZ2h0IChDKSAyMDAzLTIwMTkgYnkgSnVsaXVzIE8uIFNtaXRoIElJSSA8am9zQGNjcm1hLnN0YW5mb3JkLmVkdT4iIH0seyAidmFlZmZlY3RzLmxpYi9tb29nX3ZjZl8yYm46bGljZW5zZSI6ICJNSVQtc3R5bGUgU1RLLTQuMyBsaWNlbnNlIiB9LHsgInZhZWZmZWN0cy5saWIvbmFtZSI6ICJGYXVzdCBWaXJ0dWFsIEFuYWxvZyBGaWx0ZXIgRWZmZWN0IExpYnJhcnkiIH0seyAidmFlZmZlY3RzLmxpYi92ZXJzaW9uIjogIjAuMCIgfV0sInVpIjogWyB7InR5cGUiOiAidmdyb3VwIiwibGFiZWwiOiAid2luZCIsIml0ZW1zIjogWyB7InR5cGUiOiAiaHNsaWRlciIsImxhYmVsIjogImZvcmNlIiwiYWRkcmVzcyI6ICIvd2luZC9mb3JjZSIsImluZGV4IjogMCwiaW5pdCI6IDAuNjYsIm1pbiI6IDAsIm1heCI6IDEsInN0ZXAiOiAwLjAxfV19XX0="; }

/*
 faust2wasm: GRAME 2017-2019
*/
 
'use strict';

// Monophonic Faust DSP
class windProcessor extends AudioWorkletProcessor {
    
    // JSON parsing functions
    static parse_ui(ui, obj, callback)
    {
        for (var i = 0; i < ui.length; i++) {
            windProcessor.parse_group(ui[i], obj, callback);
        }
    }
    
    static parse_group(group, obj, callback)
    {
        if (group.items) {
            windProcessor.parse_items(group.items, obj, callback);
        }
    }
    
    static parse_items(items, obj, callback)
    {
        for (var i = 0; i < items.length; i++) {
            callback(items[i], obj, callback);
        }
    }
    
    static parse_item1(item, obj, callback)
    {
        if (item.type === "vgroup"
            || item.type === "hgroup"
            || item.type === "tgroup") {
            windProcessor.parse_items(item.items, obj, callback);
        } else if (item.type === "hbargraph"
                   || item.type === "vbargraph") {
            // Nothing
        } else if (item.type === "vslider"
                   || item.type === "hslider"
                   || item.type === "button"
                   || item.type === "checkbox"
                   || item.type === "nentry") {
            obj.push({ name: item.address,
                     defaultValue: item.init,
                     minValue: item.min,
                     maxValue: item.max });
        }
    }
    
    static parse_item2(item, obj, callback)
    {
        if (item.type === "vgroup"
            || item.type === "hgroup"
            || item.type === "tgroup") {
            windProcessor.parse_items(item.items, obj, callback);
        } else if (item.type === "hbargraph"
                   || item.type === "vbargraph") {
            // Keep bargraph adresses
            obj.outputs_items.push(item.address);
            obj.pathTable[item.address] = parseInt(item.index);
        } else if (item.type === "soundfile") {
            // Keep soundfile adresses
            obj.soundfile_items.push(item.address);
            obj.pathTable[item.address] = parseInt(item.index);
        } else if (item.type === "vslider"
                   || item.type === "hslider"
                   || item.type === "button"
                   || item.type === "checkbox"
                   || item.type === "nentry") {
            // Keep inputs adresses
            obj.inputs_items.push(item.address);
            obj.pathTable[item.address] = parseInt(item.index);
        }
    }
 
    static get parameterDescriptors() 
    {
        // Analyse JSON to generate AudioParam parameters
        var params = [];
        windProcessor.parse_ui(JSON.parse(getJSONwind()).ui, params, windProcessor.parse_item1);
 	    return params;
    }
   
    constructor(options)
    {
        super(options);
        this.running = true;
        
       	const importObject = {
                env: {
                    memoryBase: 0,
                    tableBase: 0,

                    // Integer version
                    _abs: Math.abs,

                    // Float version
                    _acosf: Math.acos,
                    _asinf: Math.asin,
                    _atanf: Math.atan,
                    _atan2f: Math.atan2,
                    _ceilf: Math.ceil,
                    _cosf: Math.cos,
                    _expf: Math.exp,
                    _floorf: Math.floor,
                    _fmodf: function(x, y) { return x % y; },
                    _logf: Math.log,
                    _log10f: Math.log10,
                    _max_f: Math.max,
                    _min_f: Math.min,
                    _remainderf: function(x, y) { return x - Math.round(x/y) * y; },
                    _powf: Math.pow,
                    _roundf: Math.fround,
                    _sinf: Math.sin,
                    _sqrtf: Math.sqrt,
                    _tanf: Math.tan,
                    _acoshf: Math.acosh,
                    _asinhf: Math.asinh,
                    _atanhf: Math.atanh,
                    _coshf: Math.cosh,
                    _sinhf: Math.sinh,
                    _tanhf: Math.tanh,

                    // Double version
                    _acos: Math.acos,
                    _asin: Math.asin,
                    _atan: Math.atan,
                    _atan2: Math.atan2,
                    _ceil: Math.ceil,
                    _cos: Math.cos,
                    _exp: Math.exp,
                    _floor: Math.floor,
                    _fmod: function(x, y) { return x % y; },
                    _log: Math.log,
                    _log10: Math.log10,
                    _max_: Math.max,
                    _min_: Math.min,
                    _remainder:function(x, y) { return x - Math.round(x/y) * y; },
                    _pow: Math.pow,
                    _round: Math.fround,
                    _sin: Math.sin,
                    _sqrt: Math.sqrt,
                    _tan: Math.tan,
                    _acosh: Math.acosh,
                    _asinh: Math.asinh,
                    _atanh: Math.atanh,
                    _cosh: Math.cosh,
                    _sinh: Math.sinh,
                    _tanh: Math.tanh,

                    table: new WebAssembly.Table({ initial: 0, element: 'anyfunc' })
                }
        };
        
        this.wind_instance = new WebAssembly.Instance(options.processorOptions.wasm_module, importObject);
        this.json_object = JSON.parse(options.processorOptions.json);
     
        this.output_handler = function(path, value) { this.port.postMessage({ path: path, value: value }); };
        
        this.ins = null;
        this.outs = null;

        this.dspInChannnels = [];
        this.dspOutChannnels = [];

        this.numIn = parseInt(this.json_object.inputs);
        this.numOut = parseInt(this.json_object.outputs);

        // Memory allocator
        this.ptr_size = 4;
        this.sample_size = 4;
        this.integer_size = 4;
        
        this.factory = this.wind_instance.exports;
        this.HEAP = this.wind_instance.exports.memory.buffer;
        this.HEAP32 = new Int32Array(this.HEAP);
        this.HEAPF32 = new Float32Array(this.HEAP);

        //console.log(this.HEAP);
        //console.log(this.HEAP32);
        //console.log(this.HEAPF32);

        // bargraph
        this.outputs_timer = 5;
        this.outputs_items = [];

        // input items
        this.inputs_items = [];
        
        // soundfile items
        this.soundfile_items = [];

        // Start of HEAP index

        // DSP is placed first with index 0. Audio buffer start at the end of DSP.
        this.audio_heap_ptr = parseInt(this.json_object.size);

        // Setup pointers offset
        this.audio_heap_ptr_inputs = this.audio_heap_ptr;
        this.audio_heap_ptr_outputs = this.audio_heap_ptr_inputs + (this.numIn * this.ptr_size);

        // Setup buffer offset
        this.audio_heap_inputs = this.audio_heap_ptr_outputs + (this.numOut * this.ptr_size);
        this.audio_heap_outputs = this.audio_heap_inputs + (this.numIn * NUM_FRAMES * this.sample_size);
        
        // Start of DSP memory : DSP is placed first with index 0
        this.dsp = 0;

        this.pathTable = [];
     
        // Send output values to the AudioNode
        this.update_outputs = function ()
        {
            if (this.outputs_items.length > 0 && this.output_handler && this.outputs_timer-- === 0) {
                this.outputs_timer = 5;
                for (var i = 0; i < this.outputs_items.length; i++) {
                    this.output_handler(this.outputs_items[i], this.HEAPF32[this.pathTable[this.outputs_items[i]] >> 2]);
                }
            }
        }
        
        this.initAux = function ()
        {
            var i;
            
            if (this.numIn > 0) {
                this.ins = this.audio_heap_ptr_inputs;
                for (i = 0; i < this.numIn; i++) {
                    this.HEAP32[(this.ins >> 2) + i] = this.audio_heap_inputs + ((NUM_FRAMES * this.sample_size) * i);
                }
                
                // Prepare Ins buffer tables
                var dspInChans = this.HEAP32.subarray(this.ins >> 2, (this.ins + this.numIn * this.ptr_size) >> 2);
                for (i = 0; i < this.numIn; i++) {
                    this.dspInChannnels[i] = this.HEAPF32.subarray(dspInChans[i] >> 2, (dspInChans[i] + NUM_FRAMES * this.sample_size) >> 2);
                }
            }
            
            if (this.numOut > 0) {
                this.outs = this.audio_heap_ptr_outputs;
                for (i = 0; i < this.numOut; i++) {
                    this.HEAP32[(this.outs >> 2) + i] = this.audio_heap_outputs + ((NUM_FRAMES * this.sample_size) * i);
                }
                
                // Prepare Out buffer tables
                var dspOutChans = this.HEAP32.subarray(this.outs >> 2, (this.outs + this.numOut * this.ptr_size) >> 2);
                for (i = 0; i < this.numOut; i++) {
                    this.dspOutChannnels[i] = this.HEAPF32.subarray(dspOutChans[i] >> 2, (dspOutChans[i] + NUM_FRAMES * this.sample_size) >> 2);
                }
            }
            
            // Parse UI
            windProcessor.parse_ui(this.json_object.ui, this, windProcessor.parse_item2);
                 
            // Init DSP
            this.factory.init(this.dsp, sampleRate); // 'sampleRate' is defined in AudioWorkletGlobalScope  
        }

        this.setParamValue = function (path, val)
        {
            this.HEAPF32[this.pathTable[path] >> 2] = val;
        }

        this.getParamValue = function (path)
        {
            return this.HEAPF32[this.pathTable[path] >> 2];
        }

        // Init resulting DSP
        this.initAux();
        
        console.log(this);
    }
    
    handleMessage(event)
    {
        var msg = event.data;
        switch (msg.type) {
            case "destroy": this.running = false; break;
        }
    }
    
    process(inputs, outputs, parameters) 
    {
        var input = inputs[0];
        var output = outputs[0];
        
        // Check inputs
        if (this.numIn > 0 && (!input || !input[0] || input[0].length === 0)) {
            //console.log("Process input error");
            return true;
        }
        // Check outputs
        if (this.numOut > 0 && (!output || !output[0] || output[0].length === 0)) {
            //console.log("Process output error");
            return true;
        }
        
        // Copy inputs
        if (input !== undefined) {
            for (var chan = 0; chan < Math.min(this.numIn, input.length); ++chan) {
                var dspInput = this.dspInChannnels[chan];
                dspInput.set(input[chan]);
            }
        }
        
        /*
        TODO: sample accurate control change is not yet handled
        When no automation occurs, params[i][1] has a length of 1,
        otherwise params[i][1] has a length of NUM_FRAMES with possible control change each sample
    	*/
        
        // Update controls
        for (const path in parameters) {
            const paramArray = parameters[path];
            this.setParamValue(path, paramArray[0]);
        }
        
        // Compute
        try {
            this.factory.compute(this.dsp, NUM_FRAMES, this.ins, this.outs);
        } catch(e) {
            console.log("ERROR in compute (" + e + ")");
        }
        
        // Update bargraph
        this.update_outputs();
        
        // Copy outputs
        if (output !== undefined) {
            for (var chan = 0; chan < Math.min(this.numOut, output.length); ++chan) {
                var dspOutput = this.dspOutChannnels[chan];
                output[chan].set(dspOutput);
            }
        }
        
        return this.running;
    }
}

// Globals
const NUM_FRAMES = 128;
try {
    registerProcessor('wind', windProcessor);
} catch (error) {
    console.warn(error);
}
