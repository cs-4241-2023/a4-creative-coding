// Web assembly configuration.
export let wasm_exports = null;
let wasm_memory = new WebAssembly.Memory({'initial': 256, 'maximum': 256});
let wasm_table = new WebAssembly.Table({
	'initial': 1,
	'maximum': 1,
	'element': 'anyfunc'
});
let asm_library_arg = {
	"__handle_stack_overflow": () => {},
    "emscripten_resize_heap": () => {},
    "__lock": () => {}, 
    "__unlock": () => {},
    "memory": wasm_memory, 
    "table": wasm_table
};
let info = {
	'env': asm_library_arg,
	'wasi_snapshot_preview1': asm_library_arg
}

// Load .wasm file(s).
export async function loadWasm() {
	let response = await fetch('../wasm/fractal-set.wasm');
	let bytes = await response.arrayBuffer();
	let wasm_object = await WebAssembly.instantiate(bytes, info);
	wasm_exports = wasm_object.instance.exports;
}