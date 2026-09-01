const STORAGE_KEY = 'crm_proveedores_materiales';

/**
 * @typedef {Object} ProveedorMaterial
 * @property {string} proveedorId
 * @property {string} materialId
 * @property {number} precio
 * @property {string} actualizado
 */

/** @type {ProveedorMaterial[]} */
let relaciones = $state([]);

/**
 * Cargar relaciones guardadas.
 */
function cargar() {
	if (typeof localStorage === 'undefined') return;

	try {
		const datos = localStorage.getItem(STORAGE_KEY);

		if (!datos) return;

		const parsed = JSON.parse(datos);

		if (Array.isArray(parsed)) {
			relaciones = parsed;
		}
	} catch (error) {
		console.error('Error cargando relaciones proveedor-material:', error);
		relaciones = [];
	}
}

/**
 * Guardar relaciones.
 */
function guardar() {
	if (typeof localStorage === 'undefined') return;

	localStorage.setItem(
		STORAGE_KEY,
		JSON.stringify(relaciones)
	);
}

cargar();

/**
 * Obtener materiales asignados a un proveedor.
 *
 * @param {string} proveedorId
 * @returns {ProveedorMaterial[]}
 */
export function obtenerMaterialesProveedor(proveedorId) {
	return relaciones.filter(
		relacion => relacion.proveedorId === String(proveedorId)
	);
}

/**
 * Obtener precio específico de un proveedor para un material.
 *
 * @param {string} proveedorId
 * @param {string} materialId
 * @returns {ProveedorMaterial|undefined}
 */
export function obtenerPrecioProveedor(proveedorId, materialId) {
	return relaciones.find(
		relacion =>
			relacion.proveedorId === String(proveedorId) &&
			relacion.materialId === String(materialId)
	);
}

/**
 * Asignar o actualizar material para proveedor.
 *
 * @param {string} proveedorId
 * @param {string} materialId
 * @param {number} precio
 */
export function asignarMaterialProveedor(
	proveedorId,
	materialId,
	precio
) {
	const proveedor = String(proveedorId);
	const material = String(materialId);

	const existente = relaciones.find(
		relacion =>
			relacion.proveedorId === proveedor &&
			relacion.materialId === material
	);

	if (existente) {
		existente.precio = Number(precio);
		existente.actualizado = new Date().toISOString();
	} else {
		relaciones.push({
			proveedorId: proveedor,
			materialId: material,
			precio: Number(precio),
			actualizado: new Date().toISOString()
		});
	}

	guardar();
}

/**
 * Quitar material de un proveedor.
 *
 * @param {string} proveedorId
 * @param {string} materialId
 */
export function quitarMaterialProveedor(proveedorId, materialId) {
	const proveedor = String(proveedorId);
	const material = String(materialId);

	relaciones = relaciones.filter(
		relacion =>
			!(
				relacion.proveedorId === proveedor &&
				relacion.materialId === material
			)
	);

	guardar();
}
