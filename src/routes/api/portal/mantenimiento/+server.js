import { json } from '@sveltejs/kit';
import { supabaseServer } from '$lib/server/supabase';

export async function GET({ request }) {
	try {
		const authHeader = request.headers.get('authorization');

		if (!authHeader?.startsWith('Bearer ')) {
			return json({ error: 'No autorizado.' }, { status: 401 });
		}

		const accessToken = authHeader.slice(7);

		const {
			data: { user },
			error: authError
		} = await supabaseServer.auth.getUser(accessToken);

		if (authError || !user) {
			return json({ error: 'Sesión no válida.' }, { status: 401 });
		}

		// Cliente del portal
		const { data: portalCliente, error: clienteError } =
			await supabaseServer
				.from('portal_clientes')
				.select('id, nombre, telefono')
				.eq('auth_user_id', user.id)
				.eq('activo', true)
				.single();

		if (clienteError || !portalCliente) {
			return json(
				{ error: 'Cliente de portal no encontrado.' },
				{ status: 404 }
			);
		}

		// Cotizaciones autorizadas
		const { data: vinculaciones, error: vinculacionesError } =
			await supabaseServer
				.from('portal_cliente_cotizaciones')
				.select('cotizacion_id')
				.eq('portal_cliente_id', portalCliente.id);

		if (vinculacionesError) throw vinculacionesError;

		const cotizacionIds =
			vinculaciones?.map(item => item.cotizacion_id) ?? [];

		if (!cotizacionIds.length) {
			return json({
				ok: true,
				reporte: null,
				recibos: [],
				resumen: null
			});
		}

		// Buscar el reporte más reciente de sus trabajos.
		const { data: reportes, error: reportesError } =
			await supabaseServer
				.from('reportes')
				.select('*')
				.in('cotizacion_id', cotizacionIds)
				.order('fecha', { ascending: false })
				.limit(1);

		if (reportesError) throw reportesError;

		const reporte = reportes?.[0] ?? null;

		if (!reporte) {
			return json({
				ok: true,
				reporte: null,
				recibos: [],
				resumen: null
			});
		}

		// Cotización del reporte
		const { data: cotizacion, error: cotizacionError } =
			await supabaseServer
				.from('cotizaciones')
				.select(`
					id,
					cliente_nombre,
					cliente_empresa,
					cliente_whatsapp,
					cliente_email,
					titulo,
					descripcion,
					total,
					moneda
				`)
				.eq('id', reporte.cotizacion_id)
				.single();

		if (cotizacionError) throw cotizacionError;

		// Recibos de ese trabajo
		const { data: recibos, error: recibosError } =
			await supabaseServer
				.from('recibos')
				.select('*')
				.eq('cotizacion_id', reporte.cotizacion_id)
				.order('fecha_pago', { ascending: false });

		if (recibosError) throw recibosError;

		const totalProyecto = Number(cotizacion?.total ?? 0);

		const totalPagado = (recibos ?? []).reduce(
			(total, recibo) => total + Number(recibo.monto ?? 0),
			0
		);

		return json({
			ok: true,
			reporte: {
				...reporte,
				cotizacion
			},
			recibos: recibos ?? [],
			resumen: {
				totalProyecto,
				totalPagado,
				saldoPendiente: Math.max(
					0,
					totalProyecto - totalPagado
				),
				moneda: cotizacion?.moneda ?? 'HNL'
			}
		});
	} catch (error) {
		console.error(
			'Error cargando mantenimiento del portal:',
			error
		);

		return json(
			{
				error:
					error instanceof Error
						? error.message
						: 'No se pudo cargar el mantenimiento.'
			},
			{ status: 500 }
		);
	}
}
