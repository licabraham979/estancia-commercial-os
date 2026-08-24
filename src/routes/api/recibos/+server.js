import { json } from '@sveltejs/kit';
import { supabaseServer } from '$lib/server/supabase.js';

export async function POST({ request }) {
	try {
		const body = await request.json();

		const {
			cotizacion_id,
			mercado_id,

			cliente_nombre,
			cliente_empresa,

			concepto,
			monto,
			moneda,
			metodo_pago,
			referencia,
			observaciones,

			empresa_nombre,
			empresa_telefono,
			empresa_email,
			empresa_web,
			empresa_direccion
		} = body;

		if (!cotizacion_id) {
			return json(
				{ error: 'La cotización es obligatoria.' },
				{ status: 400 }
			);
		}

		if (!mercado_id) {
			return json(
				{ error: 'El mercado emisor es obligatorio.' },
				{ status: 400 }
			);
		}

		if (!cliente_nombre?.trim()) {
			return json(
				{ error: 'El cliente es obligatorio.' },
				{ status: 400 }
			);
		}

		if (!concepto?.trim()) {
			return json(
				{ error: 'El concepto es obligatorio.' },
				{ status: 400 }
			);
		}

		const montoNumerico = Number(monto);

		if (!Number.isFinite(montoNumerico) || montoNumerico <= 0) {
			return json(
				{ error: 'El monto debe ser mayor a cero.' },
				{ status: 400 }
			);
		}

		const { data, error } = await supabaseServer
			.from('recibos')
			.insert({
				cotizacion_id,
				mercado_id,

				cliente_nombre: cliente_nombre.trim(),
				cliente_empresa: cliente_empresa?.trim() || null,

				concepto: concepto.trim(),
				monto: montoNumerico,
				moneda: moneda || 'HNL',

				metodo_pago: metodo_pago || null,
				referencia: referencia?.trim() || null,
				observaciones: observaciones?.trim() || null,

				empresa_nombre: empresa_nombre?.trim() || null,
				empresa_telefono: empresa_telefono?.trim() || null,
				empresa_email: empresa_email?.trim() || null,
				empresa_web: empresa_web?.trim() || null,
				empresa_direccion: empresa_direccion?.trim() || null,

				estado: 'emitido'
			})
			.select('id, folio')
			.single();

		if (error) {
			console.error('Error creando recibo:', error);

			return json(
				{ error: error.message },
				{ status: 500 }
			);
		}

		return json({
			success: true,
			id: data.id,
			folio: data.folio
		});

	} catch (err) {
		console.error(
			'Error inesperado creando recibo:',
			err
		);

		return json(
			{ error: 'No se pudo crear el recibo.' },
			{ status: 500 }
		);
	}
}