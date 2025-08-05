const express = require('express');
const router = express.Router();
const { News, sequelize } = require('../models');

// GET /api/news - Obtener noticias con filtros
router.get('/', async (req, res) => {
  try {
    const { limit = 50, offset = 0, tema, medio, valoracion } = req.query;
    
    const whereClause = {};
    if (tema) whereClause.tema = tema;
    if (medio) whereClause.medio = medio;
    if (valoracion) whereClause.valoracion = valoracion;

    const noticias = await News.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      noticias: noticias,
      total: noticias.length
    });
  } catch (error) {
    console.error('Error obteniendo noticias:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/news/stats - Obtener estadísticas de noticias
router.get('/stats', async (req, res) => {
  try {
    // Total de noticias
    const totalNoticias = await News.count();

    // Últimas noticias procesadas (por fecha de creación)
    const ultimasNoticias = await News.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5,
      attributes: ['id', 'titulo', 'medio', 'fecha', 'createdAt']
    });

    // Noticias por tema
    const noticiasPorTema = await News.findAll({
      attributes: [
        'tema',
        [sequelize.fn('COUNT', sequelize.col('id')), 'cantidad']
      ],
      group: ['tema'],
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
      limit: 10
    });

    // Noticias por medio
    const noticiasPorMedio = await News.findAll({
      attributes: [
        'medio',
        [sequelize.fn('COUNT', sequelize.col('id')), 'cantidad']
      ],
      group: ['medio'],
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
      limit: 10
    });

    res.json({
      totalNoticias,
      ultimasNoticias,
      noticiasPorTema: noticiasPorTema.map(item => ({
        tema: item.tema,
        cantidad: parseInt(item.dataValues.cantidad)
      })),
      noticiasPorMedio: noticiasPorMedio.map(item => ({
        medio: item.medio,
        cantidad: parseInt(item.dataValues.cantidad)
      }))
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/news/:id - Obtener noticia por ID
router.get('/:id', async (req, res) => {
  try {
    const noticia = await News.findByPk(req.params.id);
    if (!noticia) {
      return res.status(404).json({ error: 'Noticia no encontrada' });
    }
    res.json({ noticia });
  } catch (error) {
    console.error('Error obteniendo noticia:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/news/import - Importar noticias desde Excel
router.post('/import', async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó archivo Excel' });
    }

    const XLSX = require('xlsx');
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    console.log('Datos del Excel:', data.length, 'filas');
    console.log('Columnas disponibles:', Object.keys(data[0] || {}));

    const noticiasImportadas = [];
    const errores = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      try {
        const noticia = await News.create({
          titulo: row['TITULO'] || '',
          tipoPublicacion: row['TIPO PUBLICACION'] || '',
          fecha: row['FECHA'] || '',
          soporte: row['SOPORTE'] || '',
          medio: row['MEDIO'] || '',
          seccion: row['SECCION'] || '',
          autor: row['AUTOR'] || '',
          conductor: row['CONDUCTOR'] || '',
          entrevistado: row['ENTREVISTADO'] || '',
          tema: row['TEMA'] || '',
          etiqueta1: row['ETIQUETA_1'] || '',
          etiqueta2: row['ETIQUETA_2'] || '',
          link: row['LINK'] || '',
          alcance: row['ALCANCE'] || '',
          cotizacion: row['COTIZACION'] || '',
          tapa: row['TAPA'] || '',
          valoracion: row['VALORACION'] || '',
          ejeComunicacional: row['EJE COMUNICACIONAL'] || '',
          factorPolitico: row['FACTOR POLITICO'] || '',
          crisis: row['CRISIS'] || '',
          gestion: row['GESTION'] || '',
          area: row['AREA'] || '',
          mencion1: row['MENCION_1'] || '',
          mencion2: row['MENCION_2'] || '',
          mencion3: row['MENCION_3'] || '',
          mencion4: row['MENCION_4'] || '',
          mencion5: row['MENCION_5'] || ''
        });
        noticiasImportadas.push(noticia);
      } catch (error) {
        errores.push({
          fila: i + 1,
          error: error.message,
          datos: row
        });
      }
    }

    res.json({
      message: 'Importación completada',
      noticiasImportadas: noticiasImportadas.length,
      errores: errores.length,
      detallesErrores: errores
    });

  } catch (error) {
    console.error('Error importando noticias:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/news/metrics - Calcular métricas de noticias seleccionadas
router.post('/metrics', async (req, res) => {
  try {
    const { newsIds } = req.body;
    
    if (!newsIds || !Array.isArray(newsIds) || newsIds.length === 0) {
      return res.status(400).json({ error: 'Se requieren IDs de noticias válidos' });
    }

    // Obtener las noticias seleccionadas
    const selectedNews = await News.findAll({
      where: {
        id: newsIds
      }
    });

    if (selectedNews.length === 0) {
      return res.status(404).json({ error: 'No se encontraron noticias con los IDs proporcionados' });
    }

    // Calcular métricas por soporte
    const soporteCounts = {};
    let totalNoticias = selectedNews.length;

    selectedNews.forEach(noticia => {
      const soporte = noticia.soporte || 'Sin especificar';
      soporteCounts[soporte] = (soporteCounts[soporte] || 0) + 1;
    });

    // Calcular porcentajes
    const soporteMetrics = Object.entries(soporteCounts).map(([soporte, count]) => ({
      soporte,
      cantidad: count,
      porcentaje: Math.round((count / totalNoticias) * 100)
    }));

    // Ordenar por cantidad descendente
    soporteMetrics.sort((a, b) => b.cantidad - a.cantidad);

    // Calcular métricas adicionales básicas
    const metricas = {
      totalNoticias,
      soporte: soporteMetrics,
      resumen: {
        soportesUnicos: Object.keys(soporteCounts).length,
        soporteMasFrecuente: soporteMetrics[0]?.soporte || 'N/A',
        porcentajeSoporteMasFrecuente: soporteMetrics[0]?.porcentaje || 0
      }
    };

    res.json({
      message: 'Métricas calculadas correctamente',
      metricas
    });

  } catch (error) {
    console.error('Error calculando métricas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router; 