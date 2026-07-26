/**
 * @typedef {Object} Material
 * @property {string} id
 * @property {string} nombre
 * @property {string} categoria
 * @property {string} unidad
 * @property {number} costo
 * @property {number} desperdicio
 * @property {string} proveedor
 * @property {boolean} activo
 */
const STORAGE_KEY = 'catalogo_materiales';

const materialesIniciales = [
	{
		id: crypto.randomUUID(),
		nombre: 'Lona impresa',
		categoria: 'Impresion',
		unidad: 'pie2',
		costo: 50,
		desperdicio: 5,
		proveedor: 'Principal',
		activo: true
	},
	{
		id: crypto.randomUUID(),
		nombre: 'PVC 3 mm',
		categoria: 'PVC',
		unidad: 'placa',
		costo: 280,
		desperdicio: 8,
		proveedor: 'Principal',
		activo: true
	},
	{
		id: crypto.randomUUID(),
		nombre: 'PVC 5 mm',
		categoria: 'PVC',
		unidad: 'placa',
		costo: 320,
		desperdicio: 8,
		proveedor: 'Principal',
		activo: true
	},
	{
		id: crypto.randomUUID(),
		nombre: 'PVC 10 mm',
		categoria: 'PVC',
		unidad: 'placa',
		costo: 780,
		desperdicio: 10,
		proveedor: 'Principal',
		activo: true
	},
	{
		id: crypto.randomUUID(),
		nombre: 'Acrilico 3 mm',
		categoria: 'Acrilico',
		unidad: 'placa',
		costo: 1350,
		desperdicio: 10,
		proveedor: 'Principal',
		activo: true
	},
	{
		id: crypto.randomUUID(),
		nombre: 'Acrilico 5 mm',
		categoria: 'Acrilico',
		unidad: 'placa',
		costo: 2100,
		desperdicio: 10,
		proveedor: 'Principal',
		activo: true
	}
];

class MaterialesStore {
	/** @type {Material[]} */
materiales = $state([]);

	constructor() {
		this.cargar();
	}

	cargar() {
		if (typeof localStorage === 'undefined') return;

		const guardados = localStorage.getItem(STORAGE_KEY);

		if (guardados) {
			this.materiales = JSON.parse(guardados);
		} else {
			this.materiales = materialesIniciales;
			this.guardar();
		}
	}

	guardar() {
		if (typeof localStorage === 'undefined') return;

		localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify(this.materiales)
		);
	}

	/**
 * @param {Omit<Material,'id'>} material
 */
	crear(material) {
		this.materiales.push({
			id: crypto.randomUUID(),
			...material
		});

		this.guardar();
	}

	/**
 * @param {string} id
 * @param {Partial<Material>} datos
 */

	actualizar(id, datos) {
		const index = this.materiales.findIndex(m => m.id === id);

		if (index !== -1) {
			this.materiales[index] = {
				...this.materiales[index],
				...datos
			};

			this.guardar();
		}
	}

	/**
 * @param {string} id
 */

	eliminar(id) {
		this.materiales = this.materiales.filter(
			m => m.id !== id
		);

		this.guardar();
	}
}

export const materialesStore = new MaterialesStore();