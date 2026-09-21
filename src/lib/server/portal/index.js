import { supabaseServer } from '$lib/server/supabase';

/**
 * Normaliza teléfonos para Supabase Auth.
 *
 * Ejemplos:
 * 50432646081      → +50432646081
 * +504 3264-6081  → +50432646081
 * 32646081        → +50432646081
 */
function normalizarTelefono(/** @type {string} */ telefono) {
	const limpio = String(telefono ?? '').replace(/\D/g, '');

	if (!limpio) {
		throw new Error('Falta el teléfono del cliente.');
	}

	if (limpio.startsWith('504') && limpio.length === 11) {
		return `+${limpio}`;
	}

	if (limpio.length === 8) {
		return `+504${limpio}`;
	}

	throw new Error(
		'El teléfono del cliente no tiene un formato válido.'
	);
}

/**
 * Email interno usado únicamente por Supabase Auth.
 * El cliente seguirá viendo y usando su teléfono.
 */
function generarEmailPortal(/** @type {string} */ telefono) {
	const numero = telefono.replace(/\D/g, '');
	return `portal-${numero}@portal.estancia.local`;
}

/**
 * Genera una contraseña temporal para el primer acceso.
 */
function generarPasswordTemporal() {
	return '1234';
}
/**
 * Crea o recupera el acceso de portal de un cliente
 * y lo vincula con una cotización.
 *
 * @param {{
 *   nombre: string,
 *   telefono: string,
 *   cotizacion_id: string
 * }} datos
 */
export async function crearAccesoPortal(datos) {
	const nombre = datos.nombre?.trim();
	const telefono = normalizarTelefono(datos.telefono);
	const cotizacionId = datos.cotizacion_id;

	if (!nombre) {
		throw new Error('Falta el nombre del cliente.');
	}

	if (!cotizacionId) {
		throw new Error('Falta la cotización.');
	}

	// =========================================================
	// VERIFICAR COTIZACIÓN
	// =========================================================

	const { data: cotizacion, error: cotizacionError } =
		await supabaseServer
			.from('cotizaciones')
			.select(
				'id, cliente_nombre, cliente_whatsapp, cliente_email'
			)
			.eq('id', cotizacionId)
			.single();

	if (cotizacionError) throw cotizacionError;

	let usuario = null;
	let portalCliente = null;
	let esNuevoAcceso = false;
	let passwordTemporal = null;

	// Email interno determinista para Supabase Auth.
	const emailPortal = generarEmailPortal(telefono);

	// =========================================================
	// BUSCAR PERFIL DE PORTAL EXISTENTE
	// =========================================================

	const {
		data: portalExistente,
		error: portalError
	} = await supabaseServer
		.from('portal_clientes')
		.select('*')
		.eq('telefono', telefono)
		.maybeSingle();

	if (portalError) throw portalError;

	// =========================================================
	// CLIENTE YA TIENE PORTAL
	// =========================================================

	if (portalExistente) {
		portalCliente = portalExistente;

		const {
			data: usuarioExistente,
			error: usuarioError
		} = await supabaseServer.auth.admin.getUserById(
			portalCliente.auth_user_id
		);

		if (usuarioError) throw usuarioError;

		usuario = usuarioExistente.user;

		// Asegurar email interno.
		if (!usuario.email) {
			const {
				data: usuarioActualizado,
				error: actualizarError
			} = await supabaseServer.auth.admin.updateUserById(
				usuario.id,
				{
					email: emailPortal,
					email_confirm: true
				}
			);

			if (actualizarError) throw actualizarError;

			usuario = usuarioActualizado.user;
		}

		// =====================================================
		// GENERAR NUEVA CONTRASEÑA TEMPORAL
		// =====================================================

		// El cliente ya tiene acceso.
// No regeneramos ni cambiamos su contraseña.
passwordTemporal = null;
esNuevoAcceso = false;

		// Actualizar datos del cliente.
		const { data, error } = await supabaseServer
			.from('portal_clientes')
			.update({
				nombre,
				telefono,
				activo: true
			})
			.eq('id', portalCliente.id)
			.select()
			.single();

		if (error) throw error;

		portalCliente = data;
	} else {
		// =========================================================
		// CLIENTE NUEVO
		// =========================================================

		const {
			data: { users },
			error: usersError
		} = await supabaseServer.auth.admin.listUsers({
			page: 1,
			perPage: 1000
		});

		if (usersError) throw usersError;

		usuario = users.find(
			user => user.email === emailPortal
		);

		// =====================================================
		// YA EXISTE AUTH PERO NO PERFIL PORTAL
		// =====================================================

		if (usuario) {
			passwordTemporal = generarPasswordTemporal();

			const {
				data,
				error
			} = await supabaseServer.auth.admin.updateUserById(
				usuario.id,
				{
					password: passwordTemporal,
					email: emailPortal,
					email_confirm: true,
					user_metadata: {
						...(usuario.user_metadata ?? {}),
						tipo: 'portal_cliente',
						telefono_login: telefono,
						debe_cambiar_password: true
					}
				}
			);

			if (error) throw error;

			usuario = data.user;
			esNuevoAcceso = true;
		} else {
			// =================================================
			// CREAR USUARIO AUTH NUEVO
			// =================================================

			passwordTemporal = generarPasswordTemporal();

			const {
				data,
				error
			} = await supabaseServer.auth.admin.createUser({
				email: emailPortal,
				password: passwordTemporal,
				email_confirm: true,
				user_metadata: {
					tipo: 'portal_cliente',
					debe_cambiar_password: true,
					telefono_login: telefono
				}
			});

			if (error) throw error;

			usuario = data.user;
			esNuevoAcceso = true;
		}

		// =========================================================
		// CREAR PERFIL DE PORTAL
		// =========================================================

		const { data, error } = await supabaseServer
			.from('portal_clientes')
			.insert({
				auth_user_id: usuario.id,
				nombre,
				telefono,
				activo: true
			})
			.select()
			.single();

		if (error) throw error;

		portalCliente = data;
	}

	// =========================================================
	// AUTORIZAR ESTA COTIZACIÓN PARA EL CLIENTE
	// =========================================================

	const { error: vinculacionError } =
		await supabaseServer
			.from('portal_cliente_cotizaciones')
			.upsert(
				{
					portal_cliente_id: portalCliente.id,
					cotizacion_id: cotizacion.id
				},
				{
					onConflict:
						'portal_cliente_id,cotizacion_id'
				}
			);

	if (vinculacionError) throw vinculacionError;

	// =========================================================
	// RESULTADO
	// =========================================================

	return {
		usuario,
		portalCliente,
		cotizacion,
		esNuevoAcceso,
		passwordTemporal
	};
}